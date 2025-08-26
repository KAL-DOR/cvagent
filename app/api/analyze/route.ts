import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, analyzeLimiter, BATCH_LIMITS } from '@/app/lib/rate-limiter'
import { isWithinTokenLimit } from '@/app/lib/perplexity-analyzer'
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

        // Generate mock analysis for now (bulletproof fallback)
        const mockAnalysis = {
          overallScore: Math.floor(Math.random() * 40) + 60, // 60-100
          skillMatches: [
            {
              skill: 'Communication',
              confidence: Math.floor(Math.random() * 30) + 70,
              found: true,
              context: 'Demonstrated in previous roles'
            },
            {
              skill: 'Sales',
              confidence: Math.floor(Math.random() * 40) + 60,
              found: true,
              context: 'Relevant experience shown'
            }
          ],
          experienceScore: Math.floor(Math.random() * 30) + 70,
          educationScore: Math.floor(Math.random() * 20) + 80,
          reasoning: `Candidate ${cvId} shows relevant experience in the field. Skills match approximately ${Math.floor(Math.random() * 30) + 70}% of requirements.`,
          strengths: ['Good communication skills', 'Relevant industry experience', 'Strong work ethic'],
          weaknesses: ['Could use more specific technical skills', 'Limited leadership experience'],
          recommendations: ['Consider for interview', 'Request additional references', 'Assess technical skills in detail']
        }

        candidates.push({
          id: cvId,
          filename: `cv_${cvId}.pdf`,
          overallScore: mockAnalysis.overallScore,
          skillMatches: mockAnalysis.skillMatches,
          experienceScore: mockAnalysis.experienceScore,
          educationScore: mockAnalysis.educationScore,
          reasoning: mockAnalysis.reasoning,
          strengths: mockAnalysis.strengths,
          weaknesses: mockAnalysis.weaknesses,
          recommendations: mockAnalysis.recommendations,
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
