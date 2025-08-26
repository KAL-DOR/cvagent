import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, analyzeLimiter, BATCH_LIMITS } from '@/app/lib/rate-limiter'
import { analyzeCV, isWithinTokenLimit } from '@/app/lib/openai'
import { AnalysisRequest, AnalysisResult, CandidateScore } from '@/app/lib/types'

export async function POST(request: NextRequest) {
  try {
    // Check rate limit
    const rateLimitResult = await checkRateLimit(analyzeLimiter, request.ip || 'anonymous')
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Analysis rate limit exceeded. Please try again later.' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
          }
        }
      )
    }

    const body: AnalysisRequest = await request.json()

    // Validate request
    if (!body.jobProfile || !body.cvIds || body.cvIds.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request: job profile and CV IDs are required' },
        { status: 400 }
      )
    }

    if (body.cvIds.length > BATCH_LIMITS.MAX_CVS_PER_ANALYSIS) {
      return NextResponse.json(
        { error: `Maximum ${BATCH_LIMITS.MAX_CVS_PER_ANALYSIS} CVs allowed per analysis` },
        { status: 400 }
      )
    }

    // In a real application, you would fetch the CV data from your storage
    // For now, we'll simulate the analysis with mock data
    const candidates: CandidateScore[] = []
    const jobProfileText = formatJobProfile(body.jobProfile)

    // Analyze each CV
    for (const cvId of body.cvIds) {
      try {
        // Simulate CV content - in real app, fetch from storage
        const cvContent = `Sample CV content for ${cvId}...`
        
        // Check token limits
        if (!isWithinTokenLimit(jobProfileText + cvContent)) {
          candidates.push({
            id: cvId,
            filename: `cv_${cvId}.pdf`,
            overallScore: 0,
            skillMatches: [],
            experienceScore: 0,
            educationScore: 0,
            reasoning: 'CV content too large for analysis',
            strengths: [],
            weaknesses: ['Content exceeds token limits'],
            recommendations: ['Please provide a shorter CV'],
          })
          continue
        }

        // Analyze CV using OpenAI
        const analysis = await analyzeCV({
          jobProfile: jobProfileText,
          cvContent,
          candidateName: `Candidate ${cvId}`,
        })

        candidates.push({
          id: cvId,
          filename: `cv_${cvId}.pdf`,
          overallScore: analysis.overallScore || 0,
          skillMatches: analysis.skillMatches || [],
          experienceScore: analysis.experienceScore || 0,
          educationScore: analysis.educationScore || 0,
          reasoning: analysis.reasoning || 'No reasoning provided',
          strengths: analysis.strengths || [],
          weaknesses: analysis.weaknesses || [],
          recommendations: analysis.recommendations || [],
        })

      } catch (error) {
        console.error(`Error analyzing CV ${cvId}:`, error)
        candidates.push({
          id: cvId,
          filename: `cv_${cvId}.pdf`,
          overallScore: 0,
          skillMatches: [],
          experienceScore: 0,
          educationScore: 0,
          reasoning: 'Analysis failed',
          strengths: [],
          weaknesses: ['Analysis error occurred'],
          recommendations: ['Please try again'],
        })
      }
    }

    // Calculate average score
    const validScores = candidates.filter(c => c.overallScore > 0)
    const averageScore = validScores.length > 0 
      ? validScores.reduce((sum, c) => sum + c.overallScore, 0) / validScores.length
      : 0

    const result: AnalysisResult = {
      jobProfile: body.jobProfile,
      candidates,
      analysisDate: new Date(),
      totalCandidates: candidates.length,
      averageScore: Math.round(averageScore),
    }

    return NextResponse.json(result, {
      headers: {
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        'X-RateLimit-Reset': rateLimitResult.reset.toString(),
      }
    })

  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function formatJobProfile(jobProfile: any): string {
  return `
Job Title: ${jobProfile.title}
Description: ${jobProfile.description}
Required Skills: ${jobProfile.requiredSkills?.join(', ') || 'None specified'}
Preferred Skills: ${jobProfile.preferredSkills?.join(', ') || 'None specified'}
Education: ${jobProfile.education?.join(', ') || 'None specified'}
Experience Level: ${jobProfile.experienceLevel || 'Not specified'}
Industry: ${jobProfile.industry || 'Not specified'}
Location: ${jobProfile.location || 'Not specified'}
  `.trim()
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
