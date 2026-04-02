'use client'

import { useState } from 'react'
import GlassCard from '@/components/GlassCard'
import PillButton from '@/components/PillButton'
import ScoreRing from '@/components/ScoreRing'
import FileUpload from '@/components/FileUpload'

const JOB_CATEGORIES = [
  'Software Engineering',
  'Data Science',
  'Product Management',
  'Design',
  'Marketing',
  'Finance',
  'Sales',
  'Operations',
]

const JOB_ROLES: Record<string, string[]> = {
  'Software Engineering': ['Frontend Engineer', 'Backend Engineer', 'Fullstack Engineer', 'DevOps Engineer', 'ML Engineer'],
  'Data Science': ['Data Analyst', 'Data Scientist', 'ML Engineer', 'Data Engineer'],
  'Product Management': ['Product Manager', 'Technical PM', 'Growth PM'],
  'Design': ['UI Designer', 'UX Designer', 'Product Designer'],
  'Marketing': ['Content Marketer', 'Growth Marketer', 'SEO Specialist'],
  'Finance': ['Financial Analyst', 'Accountant', 'Investment Analyst'],
  'Sales': ['Account Executive', 'SDR', 'Sales Manager'],
  'Operations': ['Operations Manager', 'Project Manager', 'Business Analyst'],
}

type AnalysisResult = {
  ats_score: number
  keyword_match: number
  format_score: number
  section_score: number
  missing_skills: string[]
  suggestions: string[]
}

const MOCK_RESULT: AnalysisResult = {
  ats_score: 78,
  keyword_match: 65,
  format_score: 85,
  section_score: 72,
  missing_skills: ['Kubernetes', 'CI/CD Pipelines', 'System Design', 'AWS Lambda', 'GraphQL'],
  suggestions: [
    'Add quantifiable metrics to work experience bullet points',
    'Include a dedicated skills section with keyword-rich terms',
    'Restructure summary to align with target role requirements',
    'Add relevant certifications or training',
    'Optimize file format for ATS parsing compatibility',
  ],
}

export default function AnalyzerPage() {
  const [activeTab, setActiveTab] = useState<'standard' | 'ai'>('standard')
  const [category, setCategory] = useState('')
  const [role, setRole] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)

  const availableRoles = category ? JOB_ROLES[category] ?? [] : []

  const handleAnalyze = async () => {
    if (!file || !category || !role) return
    setAnalyzing(true)
    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setResult(MOCK_RESULT)
    setAnalyzing(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <p className="label">Resume Analysis</p>
        <h1 className="font-display text-3xl font-semibold tracking-wider text-text-primary uppercase">
          Analyzer
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-border-subtle">
        {(['standard', 'ai'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              font-display text-xs tracking-[0.2em] uppercase pb-3 transition-all duration-200 border-b-2
              ${activeTab === tab
                ? 'text-text-primary border-text-primary'
                : 'text-text-muted border-transparent hover:text-text-secondary'
              }
            `}
          >
            {tab === 'standard' ? 'Standard' : 'AI Analysis'}
          </button>
        ))}
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <GlassCard title="Category">
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setRole('') }}
            className="input-minimal"
          >
            <option value="">Select category</option>
            {JOB_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </GlassCard>

        <GlassCard title="Role">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={!category}
            className="input-minimal disabled:opacity-25"
          >
            <option value="">Select role</option>
            {availableRoles.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </GlassCard>
      </div>

      <FileUpload onFileSelect={setFile} />

      <PillButton
        onClick={handleAnalyze}
        disabled={!file || !category || !role || analyzing}
        variant="filled"
        fullWidth
      >
        {analyzing ? 'Analyzing...' : 'Analyze Resume'}
      </PillButton>

      {/* Results */}
      {result && (
        <div className="space-y-8 animate-fade-up">
          <div className="space-y-2">
            <p className="label">{activeTab === 'ai' ? 'AI Analysis' : 'Standard Analysis'}</p>
            <h2 className="font-display text-2xl font-semibold tracking-wider text-text-primary uppercase">
              Results
            </h2>
          </div>

          {/* Scores */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <GlassCard>
              <ScoreRing score={result.ats_score} label="ATS Score" />
            </GlassCard>
            <GlassCard>
              <ScoreRing score={result.keyword_match} label="Keywords" />
            </GlassCard>
            <GlassCard>
              <ScoreRing score={result.format_score} label="Format" />
            </GlassCard>
            <GlassCard>
              <ScoreRing score={result.section_score} label="Sections" />
            </GlassCard>
          </div>

          {/* Missing Skills */}
          <GlassCard title="Missing Skills">
            <div className="flex flex-wrap gap-2">
              {result.missing_skills.map((skill) => (
                <span
                  key={skill}
                  className="pill-btn px-4 py-1.5 text-xs text-text-secondary"
                >
                  {skill}
                </span>
              ))}
            </div>
          </GlassCard>

          {/* Suggestions */}
          <GlassCard title="Suggestions">
            <ul className="space-y-3">
              {result.suggestions.map((s, i) => (
                <li key={i} className="flex gap-3 text-sm font-body">
                  <span className="text-text-muted font-display text-xs mt-0.5">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-text-secondary">{s}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>
      )}
    </div>
  )
}
