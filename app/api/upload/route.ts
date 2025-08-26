import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, uploadLimiter } from '@/app/lib/rate-limiter'
import { processFile, validateFiles } from '@/app/lib/file-processor'
import { UploadResponse } from '@/app/lib/types'

export async function POST(request: NextRequest) {
  try {
    // Check rate limit
    const rateLimitResult = await checkRateLimit(uploadLimiter, request.ip || 'anonymous')
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Upload rate limit exceeded. Please try again later.' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
          }
        }
      )
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      )
    }

    // Validate files
    const { valid, errors } = validateFiles(files)
    
    if (valid.length === 0) {
      return NextResponse.json(
        { error: 'No valid files found', details: errors },
        { status: 400 }
      )
    }

    const processedFiles = []
    const processingErrors = []

    // Process each file
    for (const file of valid) {
      try {
        const content = await file.arrayBuffer()
        const base64Content = Buffer.from(content).toString('base64')
        
        const processedFile = await processFile(file, base64Content)
        processedFiles.push(processedFile)
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error)
        processingErrors.push(`Failed to process ${file.name}: ${error}`)
      }
    }

    const response: UploadResponse = {
      success: processedFiles.length > 0,
      files: processedFiles,
      errors: processingErrors.length > 0 ? processingErrors : undefined,
    }

    return NextResponse.json(response, {
      headers: {
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        'X-RateLimit-Reset': rateLimitResult.reset.toString(),
      }
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
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
