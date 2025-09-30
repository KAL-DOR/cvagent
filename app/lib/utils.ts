import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { SkillMatch } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    return 'Invalid date'
  }
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj)
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function validateFileType(filename: string): boolean {
  const allowedExtensions = ['.pdf', '.docx', '.doc', '.txt']
  const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'))
  return allowedExtensions.includes(extension)
}

export function validateFileSize(size: number, maxSize: number = 10 * 1024 * 1024): boolean {
  return size <= maxSize
}

export function extractTextFromFilename(filename: string): string {
  return filename.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ')
}

export function calculateConfidenceScore(skillMatches: SkillMatch[]): number {
  if (skillMatches.length === 0) return 0
  
  const totalConfidence = skillMatches.reduce((sum, match) => sum + match.confidence, 0)
  return Math.round((totalConfidence / skillMatches.length) * 100)
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600'
  if (score >= 60) return 'text-yellow-600'
  if (score >= 40) return 'text-orange-600'
  return 'text-red-600'
}

export function getScoreBgColor(score: number): string {
  if (score >= 80) return 'bg-green-100'
  if (score >= 60) return 'bg-yellow-100'
  if (score >= 40) return 'bg-orange-100'
  return 'bg-red-100'
}

export function getFileTypeIcon(filename: string): string {
  const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'))
  switch (extension) {
    case '.pdf':
      return '📄'
    case '.docx':
    case '.doc':
      return '📝'
    case '.txt':
      return '📃'
    default:
      return '📎'
  }
}
