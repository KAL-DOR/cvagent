export type Language = 'en' | 'es'

export interface Translations {
  // Header
  header: {
    title: string
    subtitle: string
    github: string
  }
  
  // Main page
  main: {
    hero: {
      title: string
      subtitle: string
    }
    features: {
      title: string
      aiAnalysis: {
        title: string
        description: string
      }
      confidenceScoring: {
        title: string
        description: string
      }
      fastEfficient: {
        title: string
        description: string
      }
    }
  }
  
  // Job Profile Form
  jobProfile: {
    title: string
    basicInfo: {
      jobTitle: string
      jobTitlePlaceholder: string
      description: string
      descriptionPlaceholder: string
      industry: string
      industryPlaceholder: string
      location: string
      locationPlaceholder: string
      experienceLevel: string
      experienceLevels: {
        entry: string
        mid: string
        senior: string
        lead: string
      }
    }
    skills: {
      requiredSkills: string
      preferredSkills: string
      skillPlaceholder: string
      add: string
    }
    education: {
      title: string
      placeholder: string
      add: string
    }
    submit: string
  }
  
  // File Upload
  fileUpload: {
    title: string
    dragDrop: string
    clickToSelect: string
    fileTypes: string
    uploadProgress: string
    errors: {
      title: string
    }
    uploadedFiles: string
    tips: {
      title: string
      tip1: string
      tip2: string
      tip3: string
      tip4: string
    }
  }
  
  // Analysis Results
  analysis: {
    title: string
    sortBy: string
    sortOptions: {
      score: string
      name: string
    }
    summary: {
      averageScore: string
      totalCandidates: string
      topPerformers: string
    }
    topCandidates: string
    allCandidates: string
    scoreLabels: {
      excellent: string
      good: string
      fair: string
      poor: string
    }
    details: {
      analysisSummary: string
      skillMatches: string
      strengths: string
      weaknesses: string
      recommendations: string
    }
    analysisInfo: string
  }
  
  // Common
  common: {
    loading: string
    error: string
    success: string
    cancel: string
    save: string
    delete: string
    edit: string
    view: string
    close: string
    next: string
    previous: string
    submit: string
    reset: string
    search: string
    filter: string
    sort: string
    export: string
    import: string
    download: string
    upload: string
    processing: string
    completed: string
    failed: string
    retry: string
    required: string
    optional: string
    max: string
    min: string
    characters: string
    files: string
    size: string
    type: string
    date: string
    time: string
    score: string
    percentage: string
    candidates: string
    skills: string
    experience: string
    education: string
    strengths: string
    weaknesses: string
    recommendations: string
    reasoning: string
    overall: string
    match: string
    matches: string
    found: string
    notFound: string
    context: string
    confidence: string
    relevance: string
    qualification: string
    fit: string
    suitable: string
    excellent: string
    good: string
    fair: string
    poor: string
    excellentMatch: string
    goodMatch: string
    fairMatch: string
    poorMatch: string
    ready: string
    to: string
    analyze: string
    analysis: string
    start: string
  }
  
  // Errors
  errors: {
    uploadFailed: string
    analysisFailed: string
    invalidFileType: string
    fileTooLarge: string
    noFilesSelected: string
    apiKeyMissing: string
    rateLimitExceeded: string
    networkError: string
    unknownError: string
  }
}

export const translations: Record<Language, Translations> = {
  en: {
    header: {
      title: 'CV Agent',
      subtitle: 'AI-Powered CV Screener',
      github: 'GitHub'
    },
    main: {
      hero: {
        title: 'CV Agent',
        subtitle: 'AI-powered CV screening with confidence scoring. Upload job profiles and CVs to get intelligent candidate rankings.'
      },
      features: {
        title: 'Why Choose CV Agent?',
        aiAnalysis: {
          title: 'AI-Powered Analysis',
          description: 'Advanced machine learning algorithms provide accurate candidate assessments with detailed reasoning.'
        },
        confidenceScoring: {
          title: 'Confidence Scoring',
          description: 'Get precise confidence scores for each candidate with breakdowns of skills, experience, and education matches.'
        },
        fastEfficient: {
          title: 'Fast & Efficient',
          description: 'Process multiple CVs simultaneously with our optimized pipeline and get results in minutes.'
        }
      }
    },
    jobProfile: {
      title: 'Job Profile',
      basicInfo: {
        jobTitle: 'Job Title *',
        jobTitlePlaceholder: 'e.g., Senior Software Engineer',
        description: 'Job Description *',
        descriptionPlaceholder: 'Describe the role, responsibilities, and requirements...',
        industry: 'Industry',
        industryPlaceholder: 'e.g., Technology, Healthcare',
        location: 'Location',
        locationPlaceholder: 'e.g., New York, NY',
        experienceLevel: 'Experience Level',
        experienceLevels: {
          entry: 'Entry Level',
          mid: 'Mid Level',
          senior: 'Senior Level',
          lead: 'Lead/Management'
        }
      },
      skills: {
        requiredSkills: 'Required Skills',
        preferredSkills: 'Preferred Skills',
        skillPlaceholder: 'e.g., JavaScript, React',
        add: 'Add'
      },
      education: {
        title: 'Education Requirements',
        placeholder: 'e.g., Bachelor\'s in Computer Science',
        add: 'Add'
      },
      submit: 'Save Job Profile'
    },
    fileUpload: {
      title: 'Upload CVs',
      dragDrop: 'Drag & drop CVs here',
      clickToSelect: 'or click to select files',
      fileTypes: 'Supports PDF, DOCX, DOC, TXT (max 10MB each, up to 10 files)',
      uploadProgress: 'Uploading files...',
      errors: {
        title: 'Upload Errors'
      },
      uploadedFiles: 'Uploaded Files',
      tips: {
        title: 'Tips for best results:',
        tip1: '• Ensure CVs are clear and well-formatted',
        tip2: '• Include relevant skills and experience details',
        tip3: '• Use standard file formats (PDF preferred)',
        tip4: '• Keep file sizes under 10MB for faster processing'
      }
    },
    analysis: {
      title: 'Analysis Results',
      sortBy: 'Sort by:',
      sortOptions: {
        score: 'Score',
        name: 'Name'
      },
      summary: {
        averageScore: 'Average Score',
        totalCandidates: 'Total Candidates',
        topPerformers: 'Top Performers'
      },
      topCandidates: 'Top Candidates',
      allCandidates: 'All Candidates',
      scoreLabels: {
        excellent: 'Excellent',
        good: 'Good',
        fair: 'Fair',
        poor: 'Poor'
      },
      details: {
        analysisSummary: 'Analysis Summary',
        skillMatches: 'Skill Matches',
        strengths: 'Strengths',
        weaknesses: 'Areas for Improvement',
        recommendations: 'Recommendations'
      },
      analysisInfo: 'Analysis completed on'
    },
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      close: 'Close',
      next: 'Next',
      previous: 'Previous',
      submit: 'Submit',
      reset: 'Reset',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      export: 'Export',
      import: 'Import',
      download: 'Download',
      upload: 'Upload',
      processing: 'Processing...',
      completed: 'Completed',
      failed: 'Failed',
      retry: 'Retry',
      required: 'Required',
      optional: 'Optional',
      max: 'Max',
      min: 'Min',
      characters: 'characters',
      files: 'files',
      size: 'Size',
      type: 'Type',
      date: 'Date',
      time: 'Time',
      score: 'Score',
      percentage: 'Percentage',
      candidates: 'Candidates',
      skills: 'Skills',
      experience: 'Experience',
      education: 'Education',
      strengths: 'Strengths',
      weaknesses: 'Weaknesses',
      recommendations: 'Recommendations',
      reasoning: 'Reasoning',
      overall: 'Overall',
      match: 'Match',
      matches: 'Matches',
      found: 'Found',
      notFound: 'Not Found',
      context: 'Context',
      confidence: 'Confidence',
      relevance: 'Relevance',
      qualification: 'Qualification',
      fit: 'Fit',
      suitable: 'Suitable',
      excellent: 'Excellent',
      good: 'Good',
      fair: 'Fair',
      poor: 'Poor',
      excellentMatch: 'Excellent Match',
      goodMatch: 'Good Match',
      fairMatch: 'Fair Match',
      poorMatch: 'Poor Match',
      ready: 'Ready',
      to: 'to',
      analyze: 'Analyze',
      analysis: 'Analysis',
      start: 'Start'
    },
    errors: {
      uploadFailed: 'Upload failed. Please try again.',
      analysisFailed: 'Analysis failed. Please try again.',
      invalidFileType: 'Invalid file type',
      fileTooLarge: 'File too large',
      noFilesSelected: 'No files selected',
      apiKeyMissing: 'OpenAI API key not configured',
      rateLimitExceeded: 'Rate limit exceeded. Please try again later.',
      networkError: 'Network error. Please check your connection.',
      unknownError: 'An unknown error occurred.'
    }
  },
  es: {
    header: {
      title: 'CV Agent',
      subtitle: 'Evaluador de CV con IA',
      github: 'GitHub'
    },
    main: {
      hero: {
        title: 'CV Agent',
        subtitle: 'Evaluación de CV con IA y puntuación de confianza. Sube perfiles de trabajo y CVs para obtener rankings inteligentes de candidatos.'
      },
      features: {
        title: '¿Por qué elegir CV Agent?',
        aiAnalysis: {
          title: 'Análisis con IA',
          description: 'Algoritmos avanzados de machine learning proporcionan evaluaciones precisas de candidatos con razonamiento detallado.'
        },
        confidenceScoring: {
          title: 'Puntuación de Confianza',
          description: 'Obtén puntuaciones de confianza precisas para cada candidato con desgloses de habilidades, experiencia y coincidencias educativas.'
        },
        fastEfficient: {
          title: 'Rápido y Eficiente',
          description: 'Procesa múltiples CVs simultáneamente con nuestra pipeline optimizada y obtén resultados en minutos.'
        }
      }
    },
    jobProfile: {
      title: 'Perfil del Puesto',
      basicInfo: {
        jobTitle: 'Título del Puesto *',
        jobTitlePlaceholder: 'ej., Ingeniero de Software Senior',
        description: 'Descripción del Puesto *',
        descriptionPlaceholder: 'Describe el rol, responsabilidades y requisitos...',
        industry: 'Industria',
        industryPlaceholder: 'ej., Tecnología, Salud',
        location: 'Ubicación',
        locationPlaceholder: 'ej., Madrid, España',
        experienceLevel: 'Nivel de Experiencia',
        experienceLevels: {
          entry: 'Nivel Inicial',
          mid: 'Nivel Intermedio',
          senior: 'Nivel Senior',
          lead: 'Líder/Gestión'
        }
      },
      skills: {
        requiredSkills: 'Habilidades Requeridas',
        preferredSkills: 'Habilidades Preferidas',
        skillPlaceholder: 'ej., JavaScript, React',
        add: 'Agregar'
      },
      education: {
        title: 'Requisitos Educativos',
        placeholder: 'ej., Licenciatura en Informática',
        add: 'Agregar'
      },
      submit: 'Guardar Perfil del Puesto'
    },
    fileUpload: {
      title: 'Subir CVs',
      dragDrop: 'Arrastra y suelta CVs aquí',
      clickToSelect: 'o haz clic para seleccionar archivos',
      fileTypes: 'Soporta PDF, DOCX, DOC, TXT (máx 10MB cada uno, hasta 10 archivos)',
      uploadProgress: 'Subiendo archivos...',
      errors: {
        title: 'Errores de Carga'
      },
      uploadedFiles: 'Archivos Subidos',
      tips: {
        title: 'Consejos para mejores resultados:',
        tip1: '• Asegúrate de que los CVs estén claros y bien formateados',
        tip2: '• Incluye habilidades y detalles de experiencia relevantes',
        tip3: '• Usa formatos de archivo estándar (PDF preferido)',
        tip4: '• Mantén los archivos bajo 10MB para procesamiento más rápido'
      }
    },
    analysis: {
      title: 'Resultados del Análisis',
      sortBy: 'Ordenar por:',
      sortOptions: {
        score: 'Puntuación',
        name: 'Nombre'
      },
      summary: {
        averageScore: 'Puntuación Promedio',
        totalCandidates: 'Total de Candidatos',
        topPerformers: 'Mejores Candidatos'
      },
      topCandidates: 'Mejores Candidatos',
      allCandidates: 'Todos los Candidatos',
      scoreLabels: {
        excellent: 'Excelente',
        good: 'Bueno',
        fair: 'Regular',
        poor: 'Pobre'
      },
      details: {
        analysisSummary: 'Resumen del Análisis',
        skillMatches: 'Coincidencias de Habilidades',
        strengths: 'Fortalezas',
        weaknesses: 'Áreas de Mejora',
        recommendations: 'Recomendaciones'
      },
      analysisInfo: 'Análisis completado el'
    },
    common: {
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
      cancel: 'Cancelar',
      save: 'Guardar',
      delete: 'Eliminar',
      edit: 'Editar',
      view: 'Ver',
      close: 'Cerrar',
      next: 'Siguiente',
      previous: 'Anterior',
      submit: 'Enviar',
      reset: 'Restablecer',
      search: 'Buscar',
      filter: 'Filtrar',
      sort: 'Ordenar',
      export: 'Exportar',
      import: 'Importar',
      download: 'Descargar',
      upload: 'Subir',
      processing: 'Procesando...',
      completed: 'Completado',
      failed: 'Fallido',
      retry: 'Reintentar',
      required: 'Requerido',
      optional: 'Opcional',
      max: 'Máx',
      min: 'Mín',
      characters: 'caracteres',
      files: 'archivos',
      size: 'Tamaño',
      type: 'Tipo',
      date: 'Fecha',
      time: 'Hora',
      score: 'Puntuación',
      percentage: 'Porcentaje',
      candidates: 'Candidatos',
      skills: 'Habilidades',
      experience: 'Experiencia',
      education: 'Educación',
      strengths: 'Fortalezas',
      weaknesses: 'Debilidades',
      recommendations: 'Recomendaciones',
      reasoning: 'Razonamiento',
      overall: 'General',
      match: 'Coincidencia',
      matches: 'Coincidencias',
      found: 'Encontrado',
      notFound: 'No Encontrado',
      context: 'Contexto',
      confidence: 'Confianza',
      relevance: 'Relevancia',
      qualification: 'Calificación',
      fit: 'Ajuste',
      suitable: 'Adecuado',
      excellent: 'Excelente',
      good: 'Bueno',
      fair: 'Regular',
      poor: 'Pobre',
      excellentMatch: 'Coincidencia Excelente',
      goodMatch: 'Buena Coincidencia',
      fairMatch: 'Coincidencia Regular',
      poorMatch: 'Coincidencia Pobre',
      ready: 'Listo',
      to: 'para',
      analyze: 'Analizar',
      analysis: 'Análisis',
      start: 'Comenzar'
    },
    errors: {
      uploadFailed: 'La carga falló. Por favor, inténtalo de nuevo.',
      analysisFailed: 'El análisis falló. Por favor, inténtalo de nuevo.',
      invalidFileType: 'Tipo de archivo inválido',
      fileTooLarge: 'Archivo demasiado grande',
      noFilesSelected: 'No se seleccionaron archivos',
      apiKeyMissing: 'Clave API de OpenAI no configurada',
      rateLimitExceeded: 'Límite de tasa excedido. Por favor, inténtalo más tarde.',
      networkError: 'Error de red. Por favor, verifica tu conexión.',
      unknownError: 'Ocurrió un error desconocido.'
    }
  }
}

export function getTranslation(language: Language, key: string): string {
  const keys = key.split('.')
  let value: any = translations[language]
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      return key // Return the key if translation not found
    }
  }
  
  return typeof value === 'string' ? value : key
}

export function t(language: Language, key: string): string {
  return getTranslation(language, key)
}
