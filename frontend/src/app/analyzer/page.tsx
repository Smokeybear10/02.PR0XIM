'use client'

import { useState, useEffect } from 'react'
import GlassCard from '@/components/GlassCard'
import PillButton from '@/components/PillButton'
import ScoreRing from '@/components/ScoreRing'
import FileUpload from '@/components/FileUpload'
import { getRoles, analyzeResume, analyzeResumeAI, type AnalysisResult, type AIAnalysisResult, type JobRoles } from '@/lib/api'

type DisplayResult = {
  ats_score: number
  keyword_match: number
  format_score: number
  section_score: number
  missing_skills: string[]
  suggestions: string[]
}

export default function AnalyzerPage() {
  const [activeTab, setActiveTab] = useState<'standard' | 'ai'>('standard')
  const [categories, setCategories] = useState<string[]>([])
  const [roleMap, setRoleMap] = useState<JobRoles>({})
  const [category, setCategory] = useState('')
  const [role, setRole] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<DisplayResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getRoles().then((data) => {
      setRoleMap(data)
      setCategories(Object.keys(data))
    }).catch(() => setError('Failed to load job roles'))
  }, [])

  const availableRoles = category ? Object.keys(roleMap[category] ?? {}) : []

  const handleAnalyze = async () => {
    if (!file || !category || !role) return
    setAnalyzing(true)
    setError(null)
    setResult(null)

    try {
      if (activeTab === 'ai') {
        const res = await analyzeResumeAI(file, role)
        setResult({
          ats_score: res.ats_score,
          keyword_match: res.resume_score,
          format_score: 0,
          section_score: 0,
          missing_skills: res.weaknesses,
          suggestions: res.strengths,
        })
      } else {
        const res = await analyzeResume(file, category, role)
        setResult({
          ats_score: res.ats_score,
          keyword_match: res.keyword_match.score,
          format_score: res.format_score,
          section_score: res.section_score,
          missing_skills: res.keyword_match.missing_skills,
          suggestions: res.suggestions,
        })
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Analysis failed')
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2 stagger-1">
        <p className="label">Resume Analysis</p>
        <h1 className="font-display text-3xl font-semibold tracking-wider text-text-primary uppercase">
          Analyzer
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-border-subtle stagger-2">
        {(['standard', 'ai'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setResult(null) }}
            className={`
              font-display text-xs tracking-[0.2em] uppercase pb-3 transition-all duration-300 border-b-2
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 stagger-3">
        <GlassCard title="Category" interactive>
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setRole('') }}
            className="input-minimal"
            aria-label="Job category"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </GlassCard>

        <GlassCard title="Role" interactive>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={!category}
            className="input-minimal disabled:opacity-25"
            aria-label="Job role"
          >
            <option value="">Select role</option>
            {availableRoles.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </GlassCard>
      </div>

      <div className="stagger-4">
        <FileUpload onFileSelect={setFile} />
      </div>

      <div className="stagger-5">
        <PillButton
          onClick={handleAnalyze}
          disabled={!file || !category || !role || analyzing}
          variant="filled"
          fullWidth
        >
          {analyzing ? (
            <span className="animate-pulse-subtle">Analyzing...</span>
          ) : (
            'Analyze Resume'
          )}
        </PillButton>
      </div>

      {error && (
        <GlassCard>
          <p className="text-score-low text-sm font-body text-center">{error}</p>
        </GlassCard>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-8">
          <div className="space-y-2 animate-fade-up">
            <p className="label">{activeTab === 'ai' ? 'AI Analysis' : 'Standard Analysis'}</p>
            <h2 className="font-display text-2xl font-semibold tracking-wider text-text-primary uppercase">
              Results
            </h2>
          </div>

          {/* Scores */}
          <div className={`grid gap-5 ${activeTab === 'ai' ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'}`}>
            {(activeTab === 'ai'
              ? [
                  { score: result.ats_score, label: 'ATS Score' },
                  { score: result.keyword_match, label: 'Resume Score' },
                ]
              : [
                  { score: result.ats_score, label: 'ATS Score' },
                  { score: result.keyword_match, label: 'Keywords' },
                  { score: result.format_score, label: 'Format' },
                  { score: result.section_score, label: 'Sections' },
                ]
            ).map((item, i) => (
              <div
                key={item.label}
                className="animate-fade-up"
                style={{ animationDelay: `${0.1 + i * 0.1}s`, opacity: 0 }}
              >
                <GlassCard>
                  <ScoreRing score={item.score} label={item.label} />
                </GlassCard>
              </div>
            ))}
          </div>

          {/* Missing Skills / Weaknesses */}
          {result.missing_skills.length > 0 && (
            <div className="animate-fade-up" style={{ animationDelay: '0.5s', opacity: 0 }}>
              <GlassCard title={activeTab === 'ai' ? 'Weaknesses' : 'Missing Skills'}>
                <div className="flex flex-wrap gap-2">
                  {result.missing_skills.map((skill, i) => (
                    <span
                      key={skill}
                      className="pill-btn px-4 py-1.5 text-xs text-text-secondary animate-fade-up"
                      style={{ animationDelay: `${0.6 + i * 0.05}s`, opacity: 0 }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </GlassCard>
            </div>
          )}

          {/* Suggestions / Strengths */}
          {result.suggestions.length > 0 && (
            <div className="animate-fade-up" style={{ animationDelay: '0.7s', opacity: 0 }}>
              <GlassCard title={activeTab === 'ai' ? 'Strengths' : 'Suggestions'}>
                <ul className="space-y-4">
                  {result.suggestions.map((s, i) => (
                    <li
                      key={i}
                      className="flex gap-4 text-sm font-body animate-fade-up"
                      style={{ animationDelay: `${0.8 + i * 0.08}s`, opacity: 0 }}
                    >
                      <span className="text-text-muted font-display text-[10px] tracking-wider mt-1 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-text-secondary leading-relaxed">{s}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
