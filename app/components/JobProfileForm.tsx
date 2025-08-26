'use client'

import { useState } from 'react'
import { JobProfile } from '../lib/types'
import { cn } from '../lib/utils'
import { useLanguage } from '../lib/language-context'
import { t } from '../lib/i18n'

interface JobProfileFormProps {
  onSubmit: (profile: JobProfile) => void
  isDisabled?: boolean
}

export function JobProfileForm({ onSubmit, isDisabled }: JobProfileFormProps) {
  const { language } = useLanguage()
  const [formData, setFormData] = useState<Partial<JobProfile>>({
    title: '',
    description: '',
    requiredSkills: [],
    preferredSkills: [],
    education: [],
    experienceLevel: 'mid',
    industry: '',
    location: '',
  })

  const [skillInput, setSkillInput] = useState('')
  const [educationInput, setEducationInput] = useState('')

  const handleInputChange = (field: keyof JobProfile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddSkill = (type: 'required' | 'preferred') => {
    if (skillInput.trim()) {
      const skills = type === 'required' ? formData.requiredSkills || [] : formData.preferredSkills || []
      const newSkills = [...skills, skillInput.trim()]
      setFormData(prev => ({
        ...prev,
        [type === 'required' ? 'requiredSkills' : 'preferredSkills']: newSkills
      }))
      setSkillInput('')
    }
  }

  const handleRemoveSkill = (type: 'required' | 'preferred', index: number) => {
    const skills = type === 'required' ? formData.requiredSkills || [] : formData.preferredSkills || []
    const newSkills = skills.filter((_, i) => i !== index)
    setFormData(prev => ({
      ...prev,
      [type === 'required' ? 'requiredSkills' : 'preferredSkills']: newSkills
    }))
  }

  const handleAddEducation = () => {
    if (educationInput.trim()) {
      const education = formData.education || []
      setFormData(prev => ({
        ...prev,
        education: [...education, educationInput.trim()]
      }))
      setEducationInput('')
    }
  }

  const handleRemoveEducation = (index: number) => {
    const education = formData.education || []
    const newEducation = education.filter((_, i) => i !== index)
    setFormData(prev => ({ ...prev, education: newEducation }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.title && formData.description) {
      onSubmit(formData as JobProfile)
    }
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{t(language, 'jobProfile.title')}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t(language, 'jobProfile.basicInfo.jobTitle')}
            </label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="input-field"
              placeholder={t(language, 'jobProfile.basicInfo.jobTitlePlaceholder')}
              required
              disabled={isDisabled}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t(language, 'jobProfile.basicInfo.description')}
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="input-field min-h-[100px]"
              placeholder={t(language, 'jobProfile.basicInfo.descriptionPlaceholder')}
              required
              disabled={isDisabled}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t(language, 'jobProfile.basicInfo.industry')}
              </label>
              <input
                type="text"
                value={formData.industry || ''}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                className="input-field"
                placeholder={t(language, 'jobProfile.basicInfo.industryPlaceholder')}
                disabled={isDisabled}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t(language, 'jobProfile.basicInfo.location')}
              </label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="input-field"
                placeholder={t(language, 'jobProfile.basicInfo.locationPlaceholder')}
                disabled={isDisabled}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t(language, 'jobProfile.basicInfo.experienceLevel')}
            </label>
            <select
              value={formData.experienceLevel || 'mid'}
              onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
              className="input-field"
              disabled={isDisabled}
            >
              <option value="entry">{t(language, 'jobProfile.basicInfo.experienceLevels.entry')}</option>
              <option value="mid">{t(language, 'jobProfile.basicInfo.experienceLevels.mid')}</option>
              <option value="senior">{t(language, 'jobProfile.basicInfo.experienceLevels.senior')}</option>
              <option value="lead">{t(language, 'jobProfile.basicInfo.experienceLevels.lead')}</option>
            </select>
          </div>
        </div>

        {/* Required Skills */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t(language, 'jobProfile.skills.requiredSkills')}
          </label>
          <div className="flex space-x-2 mb-3">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              className="input-field flex-1"
              placeholder={t(language, 'jobProfile.skills.skillPlaceholder')}
              disabled={isDisabled}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddSkill('required')
                }
              }}
            />
            <button
              type="button"
              onClick={() => handleAddSkill('required')}
              disabled={isDisabled}
              className="btn-primary px-4"
            >
              {t(language, 'jobProfile.skills.add')}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(formData.requiredSkills || []).map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill('required', index)}
                  disabled={isDisabled}
                  className="ml-2 text-primary-600 hover:text-primary-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Preferred Skills */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t(language, 'jobProfile.skills.preferredSkills')}
          </label>
          <div className="flex space-x-2 mb-3">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              className="input-field flex-1"
              placeholder={t(language, 'jobProfile.skills.skillPlaceholder')}
              disabled={isDisabled}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddSkill('preferred')
                }
              }}
            />
            <button
              type="button"
              onClick={() => handleAddSkill('preferred')}
              disabled={isDisabled}
              className="btn-primary px-4"
            >
              {t(language, 'jobProfile.skills.add')}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(formData.preferredSkills || []).map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill('preferred', index)}
                  disabled={isDisabled}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Education Requirements */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t(language, 'jobProfile.education.title')}
          </label>
          <div className="flex space-x-2 mb-3">
            <input
              type="text"
              value={educationInput}
              onChange={(e) => setEducationInput(e.target.value)}
              className="input-field flex-1"
              placeholder={t(language, 'jobProfile.education.placeholder')}
              disabled={isDisabled}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddEducation()
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddEducation}
              disabled={isDisabled}
              className="btn-primary px-4"
            >
              {t(language, 'jobProfile.education.add')}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(formData.education || []).map((edu, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
              >
                {edu}
                <button
                  type="button"
                  onClick={() => handleRemoveEducation(index)}
                  disabled={isDisabled}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isDisabled || !formData.title || !formData.description}
          className={cn(
            "btn-primary w-full",
            (!formData.title || !formData.description) && "opacity-50 cursor-not-allowed"
          )}
        >
          {t(language, 'jobProfile.submit')}
        </button>
      </form>
    </div>
  )
}
