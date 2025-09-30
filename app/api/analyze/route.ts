import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, analyzeLimiter, BATCH_LIMITS } from '@/app/lib/rate-limiter'
import { isWithinTokenLimit } from '@/app/lib/perplexity-analyzer'
import { AnalysisRequest, AnalysisResult, CandidateScore, JobProfile } from '@/app/lib/types'

export async function POST(request: NextRequest) {
  console.log(`🚀 ANALYZE API CALLED`)
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

    // Get the actual CV data from the request body
    const candidates: CandidateScore[] = []
    const jobProfileText = formatJobProfile(body.jobProfile)

    // Analyze each CV
    for (const cvId of body.cvIds) {
      try {
        // Get the actual CV content from the uploaded files
        // We need to find the CV data that matches this ID
        const cvData = body.cvData?.find(cv => cv.id === cvId)
        if (!cvData) {
          console.error(`❌ CV data not found for ID: ${cvId}`)
          candidates.push({
            id: cvId,
            filename: `cv_${cvId}.pdf`,
            overallScore: 0,
            skillMatches: [],
            experienceScore: 0,
            educationScore: 0,
            reasoning: 'CV data not found',
            strengths: [],
            weaknesses: ['CV data not available'],
            recommendations: ['Please re-upload the CV'],
          })
          continue
        }

        const cvContent = cvData.extractedText
        console.log(`📄 Found CV data for ${cvId}: ${cvData.filename}`)
        console.log(`📄 CV Content preview: ${cvContent.substring(0, 200)}...`)
        
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

        console.log(`🔍 Starting analysis for CV ${cvId}`)
        console.log(`📄 CV Content length: ${cvContent.length} characters`)
        console.log(`💼 Job Profile length: ${jobProfileText.length} characters`)
        
        // REAL Anthropic API call with verbose logging
        console.log(`🚀 Making Anthropic API call...`)
        console.log(`🔑 API Key present: ${!!process.env.ANTHROPIC_API_KEY}`)
        
        const apiKey = process.env.ANTHROPIC_API_KEY
        if (!apiKey) {
          throw new Error('Anthropic API key not configured')
        }

        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-3-5-haiku-20241022',
            max_tokens: 1000,
            messages: [{
              role: 'user',
              content: `You are an expert HR recruiter and CV analyst. Analyze this CV against the job profile and return ONLY a valid JSON response.

Job Profile:
${jobProfileText}

CV Content:
${cvContent}

Return JSON with these exact keys:
{
  "overallScore": number (0-100),
  "skillMatches": [
    {
      "skill": string,
      "confidence": number (0-100),
      "found": boolean,
      "context": string
    }
  ],
  "experienceScore": number (0-100),
  "educationScore": number (0-100),
  "reasoning": string,
  "strengths": [string],
  "weaknesses": [string],
  "recommendations": [string]
}`
            }]
          }),
        })

        console.log(`📡 Anthropic response status: ${response.status}`)
        console.log(`📡 Anthropic response ok: ${response.ok}`)

        if (!response.ok) {
          const errorText = await response.text()
          console.error(`❌ Anthropic API error: ${response.status} - ${errorText}`)
          throw new Error(`Anthropic API error: ${response.status} - ${errorText}`)
        }

        const data = await response.json()
        console.log(`✅ Anthropic response received:`, JSON.stringify(data, null, 2))
        
        const analysisText = data.content[0].text
        console.log(`📝 Raw analysis text: ${analysisText}`)
        
        let analysis
        try {
          // Extract JSON from the response (in case there's extra text)
          const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
          const jsonString = jsonMatch ? jsonMatch[0] : analysisText;
          analysis = JSON.parse(jsonString)
          console.log(`✅ Parsed analysis:`, JSON.stringify(analysis, null, 2))
        } catch (parseError) {
          console.error(`❌ JSON parse error: ${parseError}`)
          console.error(`❌ Raw text that failed to parse: ${analysisText}`)
          const errorMessage = parseError instanceof Error ? parseError.message : 'Unknown parse error'
          throw new Error(`Failed to parse Anthropic response as JSON: ${errorMessage}`)
        }

        candidates.push({
          id: cvId,
          filename: cvData.filename,
          overallScore: analysis.overallScore || 0,
          skillMatches: analysis.skillMatches || [],
          experienceScore: analysis.experienceScore || 0,
          educationScore: analysis.educationScore || 0,
          reasoning: analysis.reasoning || 'No reasoning provided',
          strengths: analysis.strengths || [],
          weaknesses: analysis.weaknesses || [],
          recommendations: analysis.recommendations || [],
        })
        
        console.log(`✅ Analysis completed for CV ${cvId}`)

      } catch (error) {
        console.error(`Error analyzing CV ${cvId}:`, error)
        const cvData = body.cvData?.find(cv => cv.id === cvId)
        candidates.push({
          id: cvId,
          filename: cvData?.filename || `cv_${cvId}.pdf`,
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

    console.log(`📊 Analysis Summary:`)
    console.log(`   - Total candidates: ${candidates.length}`)
    console.log(`   - Average score: ${Math.round(averageScore)}`)
    console.log(`   - Valid scores: ${validScores.length}`)

    const result: AnalysisResult = {
      jobProfile: body.jobProfile,
      candidates,
      analysisDate: new Date(),
      totalCandidates: candidates.length,
      averageScore: Math.round(averageScore),
    }

    console.log(`✅ Returning analysis result with ${candidates.length} candidates`)
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

function formatJobProfile(jobProfile: JobProfile): string {
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
