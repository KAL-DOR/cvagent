import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, analyzeLimiter } from '@/app/lib/rate-limiter'
import { parseJobDescription } from '@/app/lib/job-parser'

export async function POST(request: NextRequest) {
  try {
    // Check rate limit
    const rateLimitResult = await checkRateLimit(analyzeLimiter, request.ip || 'anonymous')
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
          }
        }
      )
    }

    const body = await request.json()
    const { jobText, language = 'es' } = body

    if (!jobText || typeof jobText !== 'string') {
      return NextResponse.json(
        { error: 'Job description text is required' },
        { status: 400 }
      )
    }

    if (jobText.length > 10000) {
      return NextResponse.json(
        { error: 'Job description is too long (max 10,000 characters)' },
        { status: 400 }
      )
    }

    // Parse the job description
    const parsedData = await parseJobDescription(jobText, language)

    return NextResponse.json({
      success: true,
      data: parsedData
    }, {
      headers: {
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        'X-RateLimit-Reset': rateLimitResult.reset.toString(),
      }
    })

  } catch (error) {
    console.error('Job parsing error:', error)
    
    // Provide more specific error messages
    let errorMessage = 'Failed to parse job description. Please try again.'
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        errorMessage = 'OpenAI API key not configured. Please check your environment variables.'
      } else if (error.message.includes('rate limit')) {
        errorMessage = 'Rate limit exceeded. Please try again later.'
      } else {
        errorMessage = error.message
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
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
