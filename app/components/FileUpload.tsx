'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, FileText, AlertCircle } from 'lucide-react'
import { CVData } from '../lib/types'
import { formatFileSize, getFileTypeIcon } from '../lib/utils'
import { validateFileType, validateFileSize } from '../lib/utils'
import { useLanguage } from '../lib/language-context'
import { t } from '../lib/i18n'

interface FileUploadProps {
  onFilesUploaded: (files: CVData[]) => void
  isDisabled?: boolean
}

export function FileUpload({ onFilesUploaded, isDisabled }: FileUploadProps) {
  const { language } = useLanguage()
  const [uploadedFiles, setUploadedFiles] = useState<CVData[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (isDisabled || isUploading) return

    setIsUploading(true)
    setErrors([])

    const validFiles: File[] = []
    const validationErrors: string[] = []

    // Validate files
    for (const file of acceptedFiles) {
      if (!validateFileType(file.name)) {
        validationErrors.push(`Unsupported file type: ${file.name}`)
        continue
      }

      if (!validateFileSize(file.size)) {
        validationErrors.push(`File too large: ${file.name} (max 10MB)`)
        continue
      }

      validFiles.push(file)
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      setIsUploading(false)
      return
    }

    if (validFiles.length === 0) {
      setIsUploading(false)
      return
    }

    try {
      const formData = new FormData()
      validFiles.forEach(file => {
        formData.append('files', file)
      })

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        const newFiles = [...uploadedFiles, ...result.files]
        setUploadedFiles(newFiles)
        onFilesUploaded(newFiles)
        
        if (result.errors && result.errors.length > 0) {
          setErrors(result.errors)
        }
      } else {
        setErrors([result.error || 'Upload failed'])
      }
    } catch (error) {
      console.error('Upload error:', error)
      setErrors(['Failed to upload files. Please try again.'])
    } finally {
      setIsUploading(false)
    }
  }, [uploadedFiles, onFilesUploaded, isDisabled, isUploading])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/plain': ['.txt'],
    },
    disabled: isDisabled || isUploading,
    maxFiles: 10,
  })

  const removeFile = (fileId: string) => {
    const newFiles = uploadedFiles.filter(file => file.id !== fileId)
    setUploadedFiles(newFiles)
    onFilesUploaded(newFiles)
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{t(language, 'fileUpload.title')}</h2>
      
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-primary-400 bg-primary-50' 
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }
          ${isDisabled || isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">
          {isDragActive ? t(language, 'fileUpload.dragDrop') : t(language, 'fileUpload.dragDrop')}
        </p>
        <p className="text-gray-600 mb-4">
          {t(language, 'fileUpload.clickToSelect')}
        </p>
        <p className="text-sm text-gray-500">
          {t(language, 'fileUpload.fileTypes')}
        </p>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
            <span className="text-sm text-blue-700">{t(language, 'fileUpload.uploadProgress')}</span>
          </div>
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <div className="mt-4 p-4 bg-red-50 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-red-800 mb-1">{t(language, 'fileUpload.errors.title')}</h4>
              <ul className="text-sm text-red-700 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t(language, 'fileUpload.uploadedFiles')} ({uploadedFiles.length})
          </h3>
          <div className="space-y-3">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getFileTypeIcon(file.filename)}</span>
                  <div>
                    <p className="font-medium text-gray-900">{file.filename}</p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(file.fileSize)} • {file.uploadDate.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(file.id)}
                  disabled={isDisabled}
                  className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-primary-50 rounded-lg">
        <h4 className="font-medium text-primary-900 mb-2">{t(language, 'fileUpload.tips.title')}</h4>
        <ul className="text-sm text-primary-800 space-y-1">
          <li>{t(language, 'fileUpload.tips.tip1')}</li>
          <li>{t(language, 'fileUpload.tips.tip2')}</li>
          <li>{t(language, 'fileUpload.tips.tip3')}</li>
          <li>{t(language, 'fileUpload.tips.tip4')}</li>
        </ul>
      </div>
    </div>
  )
}
