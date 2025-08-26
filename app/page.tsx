'use client'

import { useState } from 'react'
import { Header } from './components/Header'
import { JobProfileForm } from './components/JobProfileForm'
import { FileUpload } from './components/FileUpload'
import { AnalysisResults } from './components/AnalysisResults'
import { JobProfile, CVData, AnalysisResult } from './lib/types'
import { useLanguage } from './lib/language-context'
import { t } from './lib/i18n'

export default function Home() {
  const { language } = useLanguage()
  const [jobProfile, setJobProfile] = useState<JobProfile | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<CVData[]>([])
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleJobProfileSubmit = (profile: JobProfile) => {
    setJobProfile(profile)
  }

  const handleFilesUploaded = (files: CVData[]) => {
    setUploadedFiles(files)
  }

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResult(result)
    setIsAnalyzing(false)
  }

  const handleStartAnalysis = async () => {
    if (!jobProfile || uploadedFiles.length === 0) return
    
    setIsAnalyzing(true)
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobProfile,
          cvIds: uploadedFiles.map(file => file.id),
        }),
      })

      const result = await response.json()

      if (result.success && result.data) {
        handleAnalysisComplete(result.data)
      } else {
        console.error('Analysis failed:', result.error || 'Unknown error')
        // Reset analyzing state on error
        setIsAnalyzing(false)
        // Show user-friendly error
        alert('Analysis failed. Please try again.')
      }
    } catch (error) {
      console.error('Analysis error:', error)
      // Reset analyzing state on error
      setIsAnalyzing(false)
    }
  }

  const canStartAnalysis = jobProfile && uploadedFiles.length > 0

  return (
    <div className="min-h-screen bg-primary-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-gradient">
              {t(language, 'main.hero.title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t(language, 'main.hero.subtitle')}
            </p>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Job Profile & File Upload */}
            <div className="space-y-6">
              <JobProfileForm 
                onSubmit={handleJobProfileSubmit}
                isDisabled={isAnalyzing}
              />
              
              <FileUpload 
                onFilesUploaded={handleFilesUploaded}
                isDisabled={isAnalyzing}
              />
            </div>

            {/* Right Column - Analysis Results */}
            <div className="space-y-6">
              {canStartAnalysis && (
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {t(language, 'common.ready')} {t(language, 'common.to')} {t(language, 'common.analyze')}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• {t(language, 'jobProfile.title')}: {jobProfile?.title}</p>
                    <p>• {t(language, 'fileUpload.uploadedFiles')}: {uploadedFiles.length}</p>
                  </div>
                  <button
                    onClick={handleStartAnalysis}
                    disabled={isAnalyzing}
                    className="btn-primary w-full mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? t(language, 'common.processing') : t(language, 'common.start') + ' ' + t(language, 'common.analysis')}
                  </button>
                </div>
              )}

              {analysisResult && (
                <AnalysisResults 
                  result={analysisResult}
                  onAnalysisComplete={handleAnalysisComplete}
                />
              )}
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              {t(language, 'main.features.title')}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="card text-center">
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="text-xl font-semibold mb-2">{t(language, 'main.features.aiAnalysis.title')}</h3>
                <p className="text-gray-600">
                  {t(language, 'main.features.aiAnalysis.description')}
                </p>
              </div>
              <div className="card text-center">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold mb-2">{t(language, 'main.features.confidenceScoring.title')}</h3>
                <p className="text-gray-600">
                  {t(language, 'main.features.confidenceScoring.description')}
                </p>
              </div>
              <div className="card text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-semibold mb-2">{t(language, 'main.features.fastEfficient.title')}</h3>
                <p className="text-gray-600">
                  {t(language, 'main.features.fastEfficient.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
