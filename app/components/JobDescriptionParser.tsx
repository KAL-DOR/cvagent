'use client'

import { useState } from 'react'
import { useLanguage } from '../lib/language-context'
import { t } from '../lib/i18n'
import { ParsedJobData } from '../lib/job-parser'
import { JobProfile } from '../lib/types'
import { Wand2, Copy, Check } from 'lucide-react'
import toast from 'react-hot-toast'

interface JobDescriptionParserProps {
  onJobParsed: (jobProfile: JobProfile) => void
  isDisabled?: boolean
}

const exampleJobDescription = `Empresa de Autopartes requiere Asesor Comercial de Refacciones para Tractocamiones, 
Objetivo: 
El Asesor Comercial de Autopartes para Tractocamiones pesados y semipesados será responsable 
de promover y vender refacciones de alta calidad, brindando asesoramiento experto a los clientes, 
asegurando la satisfacción y fidelidad de estos. El objetivo es lograr las metas de ventas y 
contribuir con el crecimiento del negocio. 
Responsabilidades: 
• Identificar oportunidades de ventas y desarrollar estrategias para abordarlas. 
• Establecer relaciones con clientes actuales y potenciales, brindando asesoramiento y soluciones 
personalizadas. 
• Presentar refacciones, destacando sus beneficios y ventajas. 
• Negociar precios y condiciones de venta. 
• Mantener actualizados los conocimientos sobre los productos. 
• Cumplir con las metas de ventas y reportar resultados. 
• Colaborar con otros departamentos para asegurar la entrega de productos. 
Competencias deseables: 
• Orientación al cliente 
• Proactividad 
• Trabajo en equipo 
• Resolución de problemas 
• Adaptabilidad 
Requisitos: 
Disponibilidad de horario 
Contar con Licencia de Chofer 
Uso básico de equipo de cómputo y paquetería office 
Ofrecemos: 
Oportunidad de trabajar con una empresa líder en el mercado 
Compensación competitiva y comisiones por ventas 
Ambiente de trabajo dinámico y desafiante 
Requerimientos 
• Educación mínima: Educación media superior - Bachillerato Tecnológico 
• 3 años de experiencia 
• Idiomas: Español 
• Edad: entre 30 y 48 años 
• Conocimientos: Microsoft Office 
• Disponibilidad de viajar: Si 
• Disponibilidad de cambio de residencia: No`

export function JobDescriptionParser({ onJobParsed, isDisabled }: JobDescriptionParserProps) {
  const { language } = useLanguage()
  const [jobText, setJobText] = useState('')
  const [isParsing, setIsParsing] = useState(false)
  const [showExample, setShowExample] = useState(false)

  const handleParseJob = async () => {
    if (!jobText.trim()) {
      toast.error(t(language, 'errors.noJobDescription'))
      return
    }

    setIsParsing(true)
    try {
      const response = await fetch('/api/parse-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobText: jobText.trim(),
          language
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || t(language, 'errors.parsingFailed'))
      }

      if (result.success && result.data) {
        const parsedData: ParsedJobData = result.data
        
        // Convert to JobProfile format
        const jobProfile: JobProfile = {
          title: parsedData.title,
          description: parsedData.description,
          requiredSkills: parsedData.requiredSkills,
          preferredSkills: parsedData.preferredSkills,
          education: parsedData.education,
          experienceLevel: parsedData.experienceLevel,
          industry: parsedData.industry,
          location: parsedData.location,
        }

        onJobParsed(jobProfile)
        toast.success(t(language, 'jobProfile.parseJob.success'))
        setJobText('')
      } else {
        throw new Error(t(language, 'errors.parsingFailed'))
      }
    } catch (error) {
      console.error('Job parsing error:', error)
      toast.error(error instanceof Error ? error.message : t(language, 'jobProfile.parseJob.error'))
    } finally {
      setIsParsing(false)
    }
  }

  const handleUseExample = () => {
    setJobText(exampleJobDescription)
    setShowExample(false)
  }

  const handleCopyExample = () => {
    navigator.clipboard.writeText(exampleJobDescription)
    toast.success(t(language, 'common.copied'))
  }

  return (
    <div className="card mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {t(language, 'jobProfile.parseJob.title')}
        </h3>
        <button
          onClick={() => setShowExample(!showExample)}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          {t(language, 'jobProfile.parseJob.example')}
        </button>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        {t(language, 'jobProfile.parseJob.description')}
      </p>

      <div className="space-y-4">
        <textarea
          value={jobText}
          onChange={(e) => setJobText(e.target.value)}
          placeholder={t(language, 'jobProfile.parseJob.placeholder')}
          className="input-field min-h-[200px] resize-none"
          disabled={isDisabled || isParsing}
        />

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {jobText.length}/10,000 {t(language, 'common.characters')}
          </div>
          <button
            onClick={handleParseJob}
            disabled={isDisabled || isParsing || !jobText.trim()}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Wand2 className="h-4 w-4" />
            <span>
              {isParsing ? t(language, 'jobProfile.parseJob.parsing') : t(language, 'jobProfile.parseJob.parseButton')}
            </span>
          </button>
        </div>
      </div>

      {/* Example Job Description */}
      {showExample && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900">
              {t(language, 'jobProfile.parseJob.example')}
            </h4>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyExample}
                className="text-sm text-gray-600 hover:text-gray-800 flex items-center space-x-1"
              >
                <Copy className="h-3 w-3" />
                <span>{t(language, 'common.copy')}</span>
              </button>
              <button
                onClick={handleUseExample}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                {t(language, 'common.use')}
              </button>
            </div>
          </div>
          <div className="text-sm text-gray-700 whitespace-pre-line max-h-40 overflow-y-auto">
            {exampleJobDescription}
          </div>
        </div>
      )}
    </div>
  )
}
