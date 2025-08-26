import { NextResponse } from 'next/server'

export async function GET() {
  const hasOpenAIKey = !!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'dummy-key-for-build'
  const hasPerplexityKey = !!process.env.PERPLEXITY_API_KEY && process.env.PERPLEXITY_API_KEY !== 'your_perplexity_api_key_here'
  
  return NextResponse.json({
    hasOpenAIKey,
    hasPerplexityKey,
    openAIKeyLength: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0,
    perplexityKeyLength: process.env.PERPLEXITY_API_KEY ? process.env.PERPLEXITY_API_KEY.length : 0,
    isOpenAIDummyKey: process.env.OPENAI_API_KEY === 'dummy-key-for-build',
    isPerplexityDummyKey: process.env.PERPLEXITY_API_KEY === 'your_perplexity_api_key_here'
  })
}
