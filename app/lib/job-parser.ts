import { JobProfile } from './types'

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

export function saveJobDescription(jobText: string): ParsedJobData {
  // Simple function to save job description without AI parsing
  // Extract basic information from the text
  const lines = jobText.split('\n').map(line => line.trim()).filter(line => line.length > 0)
  
  // Try to extract title from first few lines
  let title = 'Sin título'
  for (let i = 0; i < Math.min(3, lines.length); i++) {
    if (lines[i].length > 5 && lines[i].length < 100) {
      title = lines[i]
      break
    }
  }
  
  // Extract skills and requirements using simple text analysis
  const skillKeywords = ['habilidades', 'skills', 'competencias', 'requisitos', 'requirements', 'conocimientos', 'knowledge']
  const educationKeywords = ['educación', 'education', 'estudios', 'degree', 'licenciatura', 'bachillerato']
  const experienceKeywords = ['experiencia', 'experience', 'años', 'years']
  
  const requiredSkills: string[] = []
  const education: string[] = []
  const requirements: string[] = []
  
  lines.forEach(line => {
    const lowerLine = line.toLowerCase()
    
    // Extract skills
    if (skillKeywords.some(keyword => lowerLine.includes(keyword))) {
      const skills = line.split(/[•,;]/).map(s => s.trim()).filter(s => s.length > 2)
      requiredSkills.push(...skills)
    }
    
    // Extract education
    if (educationKeywords.some(keyword => lowerLine.includes(keyword))) {
      education.push(line)
    }
    
    // Extract experience
    if (experienceKeywords.some(keyword => lowerLine.includes(keyword))) {
      requirements.push(line)
    }
  })
  
  return {
    title,
    description: jobText,
    requiredSkills: requiredSkills.length > 0 ? requiredSkills : ['Habilidades generales'],
    preferredSkills: [],
    education: education.length > 0 ? education : ['Educación requerida'],
    experienceLevel: 'mid', // Default to mid level
    industry: '',
    location: '',
    responsibilities: [],
    requirements: requirements.length > 0 ? requirements : ['Experiencia requerida'],
    benefits: [],
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
