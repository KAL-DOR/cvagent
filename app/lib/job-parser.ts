import { generateText } from 'ai'
import { perplexity } from '@ai-sdk/perplexity'
import { JobProfile } from './types'

const perplexityModel = perplexity('sonar-medium-online')

export interface ParsedJobData {
  title: string
  description: string
  requiredSkills: string[]
  preferredSkills: string[]
  education: string[]
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead'
  industry: string
  location: string
  responsibilities: string[]
  requirements: string[]
  benefits: string[]
}

export async function parseJobDescription(jobText: string, language: 'en' | 'es' = 'es'): Promise<ParsedJobData> {
  try {
    // Check if API key is properly configured
    if (!process.env.PERPLEXITY_API_KEY || process.env.PERPLEXITY_API_KEY === 'dummy-key-for-build') {
      throw new Error(language === 'es' ? 'Clave de API de Perplexity no configurada' : 'Perplexity API key not configured')
    }

    console.log('Parsing job description with language:', language)
    console.log('Job text length:', jobText.length)

    const systemPrompt = language === 'es' ? 
      `Eres un experto en recursos humanos y análisis de descripciones de trabajo. Tu tarea es extraer información estructurada de una descripción de trabajo y organizarla en campos específicos.

Analiza la descripción y extrae:
1. Título del puesto
2. Descripción general del trabajo
3. Habilidades requeridas (hard skills y soft skills)
4. Habilidades preferidas
5. Requisitos educativos
6. Nivel de experiencia (entry/mid/senior/lead)
7. Industria
8. Ubicación
9. Responsabilidades específicas
10. Requisitos adicionales
11. Beneficios ofrecidos

Responde en formato JSON con la siguiente estructura:
{
  "title": "string",
  "description": "string",
  "requiredSkills": ["string"],
  "preferredSkills": ["string"],
  "education": ["string"],
  "experienceLevel": "entry|mid|senior|lead",
  "industry": "string",
  "location": "string",
  "responsibilities": ["string"],
  "requirements": ["string"],
  "benefits": ["string"]
}` :
      `You are an expert HR professional and job description analyst. Your task is to extract structured information from a job description and organize it into specific fields.

Analyze the description and extract:
1. Job title
2. General job description
3. Required skills (hard skills and soft skills)
4. Preferred skills
5. Educational requirements
6. Experience level (entry/mid/senior/lead)
7. Industry
8. Location
9. Specific responsibilities
10. Additional requirements
11. Benefits offered

Respond in JSON format with the following structure:
{
  "title": "string",
  "description": "string",
  "requiredSkills": ["string"],
  "preferredSkills": ["string"],
  "education": ["string"],
  "experienceLevel": "entry|mid|senior|lead",
  "industry": "string",
  "location": "string",
  "responsibilities": ["string"],
  "requirements": ["string"],
  "benefits": ["string"]
}`

    const userPrompt = `Job Description:
${jobText}

Please analyze this job description and extract the structured information in the specified JSON format.`

    console.log('Making Perplexity API call...')
    const { text: content } = await generateText({
      model: perplexityModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
    })

    console.log('Perplexity response received')
    if (!content) {
      throw new Error('No response content from Perplexity')
    }

    console.log('Parsing JSON response...')
    let parsedData: ParsedJobData
    try {
      parsedData = JSON.parse(content) as ParsedJobData
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      console.error('Raw content:', content)
      throw new Error('Invalid JSON response from OpenAI')
    }
    
    // Validate and clean the data
    return {
      title: parsedData.title || 'Sin título',
      description: parsedData.description || jobText,
      requiredSkills: Array.isArray(parsedData.requiredSkills) ? parsedData.requiredSkills : [],
      preferredSkills: Array.isArray(parsedData.preferredSkills) ? parsedData.preferredSkills : [],
      education: Array.isArray(parsedData.education) ? parsedData.education : [],
      experienceLevel: ['entry', 'mid', 'senior', 'lead'].includes(parsedData.experienceLevel) ? parsedData.experienceLevel : 'mid',
      industry: parsedData.industry || '',
      location: parsedData.location || '',
      responsibilities: Array.isArray(parsedData.responsibilities) ? parsedData.responsibilities : [],
      requirements: Array.isArray(parsedData.requirements) ? parsedData.requirements : [],
      benefits: Array.isArray(parsedData.benefits) ? parsedData.benefits : [],
    }

  } catch (error) {
    console.error('Job parsing error:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      language,
      jobTextLength: jobText.length
    })
    throw new Error(language === 'es' ? 'Error al analizar la descripción del trabajo' : 'Error analyzing job description')
  }
}

export function convertToJobProfile(parsedData: ParsedJobData): JobProfile {
  return {
    title: parsedData.title,
    description: parsedData.description,
    requiredSkills: parsedData.requiredSkills,
    preferredSkills: parsedData.preferredSkills,
    education: parsedData.education,
    experienceLevel: parsedData.experienceLevel,
    industry: parsedData.industry,
    location: parsedData.location,
  }
}
