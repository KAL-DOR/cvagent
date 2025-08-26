import { NextResponse } from 'next/server'

export async function GET() {
  const hasOpenAIKey = !!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'dummy-key-for-build'
  
  return NextResponse.json({
    hasOpenAIKey,
    keyLength: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0,
    isDummyKey: process.env.OPENAI_API_KEY === 'dummy-key-for-build'
  })
}
