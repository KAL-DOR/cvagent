'use client'

import { useState } from 'react'
import { Header } from './components/Header'
import { JobProfileForm } from './components/JobProfileForm'
import { FileUpload } from './components/FileUpload'
import { AnalysisResults } from './components/AnalysisResults'
import { JobProfile, CVData, AnalysisResult } from './lib/types'

export default function Home() {
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

  const handleStartAnalysis = () => {
    setIsAnalyzing(true)
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
              CV Agent
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              AI-powered CV screening with confidence scoring. Upload job profiles and CVs to get intelligent candidate rankings.
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
                    Ready to Analyze
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• Job Profile: {jobProfile?.title}</p>
                    <p>• CVs Uploaded: {uploadedFiles.length}</p>
                  </div>
                  <button
                    onClick={handleStartAnalysis}
                    disabled={isAnalyzing}
                    className="btn-primary w-full mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Start Analysis'}
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
              Why Choose CV Agent?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="card text-center">
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="text-xl font-semibold mb-2">AI-Powered Analysis</h3>
                <p className="text-gray-600">
                  Advanced machine learning algorithms provide accurate candidate assessments with detailed reasoning.
                </p>
              </div>
              <div className="card text-center">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold mb-2">Confidence Scoring</h3>
                <p className="text-gray-600">
                  Get precise confidence scores for each candidate with breakdowns of skills, experience, and education matches.
                </p>
              </div>
              <div className="card text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-semibold mb-2">Fast & Efficient</h3>
                <p className="text-gray-600">
                  Process multiple CVs simultaneously with our optimized pipeline and get results in minutes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
