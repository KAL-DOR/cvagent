'use client'

import { Brain, Github } from 'lucide-react'

export function Header() {
  return (
    <header className="gradient-bg text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Brain className="h-8 w-8" />
            <div>
              <h1 className="text-xl font-bold">CV Agent</h1>
              <p className="text-sm text-primary-100">AI-Powered CV Screener</p>
            </div>
          </div>
          
          <nav className="flex items-center space-x-6">
            <a
              href="https://github.com/your-username/cv-agent"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-primary-100 hover:text-white transition-colors"
            >
              <Github className="h-5 w-5" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}
