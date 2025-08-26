export interface JobProfile {
  title: string
  description: string
  requiredSkills: string[]
  preferredSkills: string[]
  education: string[]
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead'
  industry: string
  location: string
}

export interface CVData {
  id: string
  filename: string
  content: string
  extractedText: string
  fileSize: number
  uploadDate: Date | string
}

export interface SkillMatch {
  skill: string
  confidence: number
  found: boolean
  context?: string
}

export interface CandidateScore {
  id: string
  filename: string
  overallScore: number
  skillMatches: SkillMatch[]
  experienceScore: number
  educationScore: number
  reasoning: string
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
}

export interface AnalysisResult {
  jobProfile: JobProfile
  candidates: CandidateScore[]
  analysisDate: Date
  totalCandidates: number
  averageScore: number
}

export interface UploadResponse {
  success: boolean
  files: CVData[]
  errors?: string[]
}

export interface AnalysisRequest {
  jobProfile: JobProfile
  cvIds: string[]
}

export interface RateLimitInfo {
  remaining: number
  reset: number
  limit: number
}

export interface APIError {
  message: string
  code: string
  details?: any
}
