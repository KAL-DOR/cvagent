import { generateText } from 'ai'
import { perplexity } from '@ai-sdk/perplexity'

const perplexityModel = perplexity('sonar-medium')

export interface AnalysisPrompt {
  jobProfile: string
  cvContent: string
  candidateName: string
}

export async function analyzeCVWithPerplexity(prompt: AnalysisPrompt): Promise<any> {
  try {
    // Check if API key is properly configured
    if (!process.env.PERPLEXITY_API_KEY || process.env.PERPLEXITY_API_KEY === 'your_perplexity_api_key_here') {
      throw new Error('Perplexity API key not configured')
    }

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

    const { text: content } = await generateText({
      model: perplexityModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
    })

    if (!content) {
      throw new Error('No response content from Perplexity')
    }

    return JSON.parse(content)
  } catch (error) {
    console.error('Perplexity API error:', error)
    throw new Error('Failed to analyze CV. Please try again.')
  }
}

export function isWithinTokenLimit(text: string): boolean {
  // Simple token estimation (roughly 4 characters per token)
  const estimatedTokens = text.length / 4
  return estimatedTokens <= 8000 // Conservative limit
}
