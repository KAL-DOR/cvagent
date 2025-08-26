import OpenAI from 'openai'
import { COST_LIMITS } from './rate-limiter'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface AnalysisPrompt {
  jobProfile: string
  cvContent: string
  candidateName: string
}

export async function analyzeCV(prompt: AnalysisPrompt): Promise<any> {
  try {
    const systemPrompt = `You are an expert HR recruiter and CV analyst. Your task is to evaluate a candidate's CV against a specific job profile and provide a detailed analysis with confidence scores.

Analysis Guidelines:
1. Evaluate skills match (0-100% confidence)
2. Assess experience relevance (0-100% confidence)
3. Check education requirements (0-100% confidence)
4. Provide overall fit score (0-100%)
5. List strengths and weaknesses
6. Give specific recommendations

Respond in JSON format with the following structure:
{
  "overallScore": number,
  "skillMatches": [
    {
      "skill": string,
      "confidence": number,
      "found": boolean,
      "context": string
    }
  ],
  "experienceScore": number,
  "educationScore": number,
  "reasoning": string,
  "strengths": [string],
  "weaknesses": [string],
  "recommendations": [string]
}`

    const userPrompt = `Job Profile:
${prompt.jobProfile}

Candidate CV (${prompt.candidateName}):
${prompt.cvContent}

Please analyze this candidate's fit for the position and provide your assessment in the specified JSON format.`

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: COST_LIMITS.MAX_TOKENS_PER_REQUEST,
      temperature: 0.3,
      response_format: { type: 'json_object' },
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response content from OpenAI')
    }

    return JSON.parse(content)
  } catch (error) {
    console.error('OpenAI API error:', error)
    throw new Error('Failed to analyze CV. Please try again.')
  }
}

export async function extractTextFromCV(content: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Extract and clean the text content from this CV, removing formatting artifacts and organizing it in a readable format. Focus on skills, experience, education, and relevant information.'
        },
        {
          role: 'user',
          content: content
        }
      ],
      max_tokens: 2000,
      temperature: 0.1,
    })

    return response.choices[0]?.message?.content || content
  } catch (error) {
    console.error('Text extraction error:', error)
    return content // Fallback to original content
  }
}

export function estimateTokenCount(text: string): number {
  // Rough estimation: 1 token ≈ 4 characters
  return Math.ceil(text.length / 4)
}

export function isWithinTokenLimit(text: string): boolean {
  return estimateTokenCount(text) <= COST_LIMITS.MAX_TOKENS_PER_REQUEST
}
