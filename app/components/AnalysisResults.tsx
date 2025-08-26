'use client'

import { useState } from 'react'
import { AnalysisResult, CandidateScore } from '../lib/types'
import { getScoreColor, getScoreBgColor, formatDate } from '../lib/utils'
import { ChevronDown, ChevronUp, Star, TrendingUp, Award } from 'lucide-react'

interface AnalysisResultsProps {
  result: AnalysisResult
  onAnalysisComplete: (result: AnalysisResult) => void
}

export function AnalysisResults({ result, onAnalysisComplete }: AnalysisResultsProps) {
  const [expandedCandidate, setExpandedCandidate] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'score' | 'name'>('score')

  const sortedCandidates = [...result.candidates].sort((a, b) => {
    if (sortBy === 'score') {
      return b.overallScore - a.overallScore
    }
    return a.filename.localeCompare(b.filename)
  })

  const topCandidates = sortedCandidates.slice(0, 3)
  const averageScore = result.averageScore

  const toggleCandidateExpansion = (candidateId: string) => {
    setExpandedCandidate(expandedCandidate === candidateId ? null : candidateId)
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Poor'
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'score' | 'name')}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            <option value="score">Score</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-primary-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-primary-600" />
            <span className="text-sm font-medium text-primary-800">Average Score</span>
          </div>
          <p className="text-2xl font-bold text-primary-900">{averageScore}%</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Total Candidates</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">{result.totalCandidates}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-800">Top Performers</span>
          </div>
          <p className="text-2xl font-bold text-green-900">
            {topCandidates.filter(c => c.overallScore >= 70).length}
          </p>
        </div>
      </div>

      {/* Top Candidates */}
      {topCandidates.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Candidates</h3>
          <div className="space-y-3">
            {topCandidates.map((candidate, index) => (
              <div
                key={candidate.id}
                className="bg-gradient-to-r from-primary-50 to-primary-100 p-4 rounded-lg border border-primary-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-full text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{candidate.filename}</p>
                      <p className="text-sm text-gray-600">
                        {getScoreLabel(candidate.overallScore)} Match
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${getScoreColor(candidate.overallScore)}`}>
                      {candidate.overallScore}%
                    </p>
                    <p className="text-sm text-gray-600">
                      {candidate.skillMatches.length} skills matched
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Candidates */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">All Candidates</h3>
        <div className="space-y-3">
          {sortedCandidates.map((candidate) => (
            <div
              key={candidate.id}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* Candidate Header */}
              <div
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleCandidateExpansion(candidate.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getScoreBgColor(candidate.overallScore)}`}></div>
                    <div>
                      <p className="font-medium text-gray-900">{candidate.filename}</p>
                      <p className="text-sm text-gray-600">
                        Experience: {candidate.experienceScore}% • Education: {candidate.educationScore}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className={`text-xl font-bold ${getScoreColor(candidate.overallScore)}`}>
                        {candidate.overallScore}%
                      </p>
                      <p className="text-sm text-gray-600">{getScoreLabel(candidate.overallScore)}</p>
                    </div>
                    {expandedCandidate === candidate.id ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedCandidate === candidate.id && (
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                  <div className="space-y-4">
                    {/* Reasoning */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Analysis Summary</h4>
                      <p className="text-sm text-gray-700">{candidate.reasoning}</p>
                    </div>

                    {/* Skill Matches */}
                    {candidate.skillMatches.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Skill Matches</h4>
                        <div className="grid md:grid-cols-2 gap-2">
                          {candidate.skillMatches.map((skill, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-white rounded border"
                            >
                              <span className="text-sm font-medium">{skill.skill}</span>
                              <span className={`text-sm font-bold ${getScoreColor(skill.confidence)}`}>
                                {skill.confidence}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Strengths & Weaknesses */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {candidate.strengths.length > 0 && (
                        <div>
                          <h4 className="font-medium text-green-900 mb-2">Strengths</h4>
                          <ul className="text-sm text-green-800 space-y-1">
                            {candidate.strengths.map((strength, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-green-600 mr-2">•</span>
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {candidate.weaknesses.length > 0 && (
                        <div>
                          <h4 className="font-medium text-red-900 mb-2">Areas for Improvement</h4>
                          <ul className="text-sm text-red-800 space-y-1">
                            {candidate.weaknesses.map((weakness, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-red-600 mr-2">•</span>
                                {weakness}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Recommendations */}
                    {candidate.recommendations.length > 0 && (
                      <div>
                        <h4 className="font-medium text-blue-900 mb-2">Recommendations</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          {candidate.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-blue-600 mr-2">•</span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Analysis Info */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          Analysis completed on {formatDate(result.analysisDate)} • 
          Job Profile: {result.jobProfile.title}
        </p>
      </div>
    </div>
  )
}
