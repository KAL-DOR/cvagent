import pdf from 'pdf-parse'
import mammoth from 'mammoth'
import { FILE_SIZE_LIMITS, BATCH_LIMITS } from './rate-limiter'
import { validateFileType, validateFileSize } from './utils'

export interface ProcessedFile {
  id: string
  filename: string
  content: string
  extractedText: string
  fileSize: number
  uploadDate: Date
}

export async function processFile(
  file: File,
  content: string
): Promise<ProcessedFile> {
  // Validate file type
  if (!validateFileType(file.name)) {
    throw new Error(`Unsupported file type: ${file.name}`)
  }

  // Validate file size
  if (!validateFileSize(file.size)) {
    throw new Error(`File too large: ${file.name}`)
  }

  const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
  let extractedText = ''

  try {
    switch (extension) {
      case '.pdf':
        extractedText = await extractPDFText(content)
        break
      case '.docx':
        extractedText = await extractDOCXText(content)
        break
      case '.doc':
        extractedText = await extractDOCText(content)
        break
      case '.txt':
        extractedText = content
        break
      default:
        throw new Error(`Unsupported file type: ${extension}`)
    }

    // Truncate text if too long
    if (extractedText.length > BATCH_LIMITS.MAX_TEXT_LENGTH) {
      extractedText = extractedText.substring(0, BATCH_LIMITS.MAX_TEXT_LENGTH)
    }

    return {
      id: generateFileId(),
      filename: file.name,
      content,
      extractedText,
      fileSize: file.size,
      uploadDate: new Date(),
    }
  } catch (error) {
    console.error('File processing error:', error)
    throw new Error(`Failed to process file: ${file.name}`)
  }
}

async function extractPDFText(content: string): Promise<string> {
  try {
    const buffer = Buffer.from(content, 'base64')
    const data = await pdf(buffer)
    return data.text || ''
  } catch (error) {
    console.error('PDF extraction error:', error)
    throw new Error('Failed to extract text from PDF')
  }
}

async function extractDOCXText(content: string): Promise<string> {
  try {
    const buffer = Buffer.from(content, 'base64')
    const result = await mammoth.extractRawText({ buffer })
    return result.value || ''
  } catch (error) {
    console.error('DOCX extraction error:', error)
    throw new Error('Failed to extract text from DOCX')
  }
}

async function extractDOCText(content: string): Promise<string> {
  try {
    const buffer = Buffer.from(content, 'base64')
    const result = await mammoth.extractRawText({ buffer })
    return result.value || ''
  } catch (error) {
    console.error('DOC extraction error:', error)
    throw new Error('Failed to extract text from DOC')
  }
}

function generateFileId(): string {
  return `file_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}

export function validateFiles(files: File[]): { valid: File[]; errors: string[] } {
  const valid: File[] = []
  const errors: string[] = []

  if (files.length > BATCH_LIMITS.MAX_FILES_PER_UPLOAD) {
    errors.push(`Maximum ${BATCH_LIMITS.MAX_FILES_PER_UPLOAD} files allowed per upload`)
    return { valid, errors }
  }

  for (const file of files) {
    try {
      if (!validateFileType(file.name)) {
        errors.push(`Unsupported file type: ${file.name}`)
        continue
      }

      if (!validateFileSize(file.size)) {
        errors.push(`File too large: ${file.name}`)
        continue
      }

      valid.push(file)
    } catch (error) {
      errors.push(`Error validating file ${file.name}: ${error}`)
    }
  }

  return { valid, errors }
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
