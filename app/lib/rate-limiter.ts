import { RateLimiterMemory } from 'rate-limiter-flexible'

// Rate limiters for different endpoints
const uploadLimiter = new RateLimiterMemory({
  keyGenerator: (req) => req.ip || 'anonymous',
  points: 5, // Number of requests
  duration: 60, // Per 60 seconds
})

const analyzeLimiter = new RateLimiterMemory({
  keyGenerator: (req) => req.ip || 'anonymous',
  points: 3, // Number of requests
  duration: 300, // Per 5 minutes
})

const generalLimiter = new RateLimiterMemory({
  keyGenerator: (req) => req.ip || 'anonymous',
  points: 100, // Number of requests
  duration: 60, // Per 60 seconds
})

export async function checkRateLimit(
  limiter: RateLimiterMemory,
  identifier: string
): Promise<{ success: boolean; remaining: number; reset: number }> {
  try {
    const result = await limiter.consume(identifier)
    return {
      success: true,
      remaining: result.remainingPoints,
      reset: result.msBeforeNext,
    }
  } catch (result: any) {
    return {
      success: false,
      remaining: result.remainingPoints,
      reset: result.msBeforeNext,
    }
  }
}

export { uploadLimiter, analyzeLimiter, generalLimiter }

// File size limits
export const FILE_SIZE_LIMITS = {
  PDF: 5 * 1024 * 1024, // 5MB
  DOCX: 5 * 1024 * 1024, // 5MB
  DOC: 3 * 1024 * 1024, // 3MB
  TXT: 1 * 1024 * 1024, // 1MB
}

// Batch processing limits
export const BATCH_LIMITS = {
  MAX_FILES_PER_UPLOAD: 10,
  MAX_CVS_PER_ANALYSIS: 20,
  MAX_TEXT_LENGTH: 50000, // characters
}

// Cost control limits
export const COST_LIMITS = {
  MAX_TOKENS_PER_REQUEST: 8000,
  MAX_REQUESTS_PER_HOUR: 50,
  MAX_REQUESTS_PER_DAY: 200,
}
