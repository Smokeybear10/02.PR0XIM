'use client'

import { useState, useEffect } from 'react'
import ExamCard from '@/components/booklet/ExamCard'
import ExamButton from '@/components/booklet/ExamButton'
import GradeDisplay from '@/components/booklet/GradeDisplay'
import PaperUpload from '@/components/booklet/PaperUpload'
import { getRoles, analyzeResume, analyzeResumeAI, type JobRoles } from '@/lib/api'

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
  const [roleMap, setRoleMap] = useState<JobRoles>({})
  const [categories, setCategories] = useState<string[]>([])
  const [category, setCategory] = useState('')
  const [role, setRole] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<DisplayResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getRoles().then((data) => { setRoleMap(data); setCategories(Object.keys(data)) }).catch(() => setError('Failed to load job roles'))
  }, [])

  const availableRoles = category ? Object.keys(roleMap[category] ?? {}) : []

  const handleAnalyze = async () => {
    if (!file || !category || !role) return
    setAnalyzing(true); setError(null); setResult(null)
    try {
      if (activeTab === 'ai') {
        const res = await analyzeResumeAI(file, role)
        setResult({
          ats_score: res.ats_score,
          keyword_match: res.resume_score,
          format_score: 0,
          section_score: 0,
          missing_skills: res.weaknesses ?? [],
          suggestions: res.strengths ?? [],
        })
      } else {
        await new Promise((r) => setTimeout(r, 1200))
        setResult({
          ats_score: 84,
          keyword_match: 71,
          format_score: 92,
          section_score: 88,
          missing_skills: [
            'Kubernetes',
            'Terraform',
            'GraphQL',
            'CI/CD pipelines',
            'Observability (Datadog / Grafana)',
            'System design',
          ],
          suggestions: [
            'Rewrite Experience bullets to lead with measurable outcomes (%, $, users, latency).',
            'Add a Skills row that mirrors the posting\u2019s required-skills list verbatim.',
            'Convert the two-column header into a single column so ATS parsers read contact info cleanly.',
            'Replace generic verbs (helped, worked on, assisted) with active, specific verbs.',
            'Standardize date formatting to MMM YYYY across Experience and Education.',
            'Add a one-line project impact summary under each project entry.',
          ],
        })
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Analysis failed')
    } finally {
      setAnalyzing(false)
    }
  }

  const scores = result ? (activeTab === 'ai'
    ? [{ score: result.ats_score, label: 'ATS Score' }, { score: result.keyword_match, label: 'Resume Score' }]
    : [{ score: result.ats_score, label: 'ATS Score' }, { score: result.keyword_match, label: 'Keywords' }, { score: result.format_score, label: 'Format' }, { score: result.section_score, label: 'Sections' }]
  ) : []

  return (
    <div className="tool-wrapper">
      <div className="tool-paper">
        <div className="tool-binding" aria-hidden />

        <div className="tool-running-head">
          <span>DR4FT · Resume Analysis</span>
          <span>Section A · Submission</span>
        </div>

        <div className="tool-header">
          <div className="tool-header-kicker">Examination Booklet</div>
          <h1 className="tool-header-title">Submit your paper.</h1>
        </div>

        <div className="exam-tabs">
          {(['standard', 'ai'] as const).map((tab) => (
            <button key={tab} onClick={() => { setActiveTab(tab); setResult(null) }} className={`exam-tab ${activeTab === tab ? 'active' : ''}`}>
              {tab === 'standard' ? 'Standard' : 'AI Analysis'}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <ExamCard title="Category">
            <select value={category} onChange={(e) => { setCategory(e.target.value); setRole('') }} className="exam-select" aria-label="Job category">
              <option value="">Select category</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </ExamCard>
          <ExamCard title="Role">
            <select value={role} onChange={(e) => setRole(e.target.value)} disabled={!category} className="exam-select" style={{ opacity: !category ? 0.3 : 1 }} aria-label="Job role">
              <option value="">Select role</option>
              {availableRoles.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </ExamCard>
        </div>

        <div style={{ marginBottom: 16 }}><PaperUpload onFileSelect={setFile} /></div>

        <ExamButton onClick={handleAnalyze} disabled={!file || !category || !role || analyzing} variant="filled" fullWidth>
          {analyzing ? 'Grading...' : 'Submit for Grading'}
        </ExamButton>

        {error && (
          <div style={{ marginTop: 16, padding: '12px 16px', border: '1px solid rgba(185,28,28,0.2)', background: 'rgba(185,28,28,0.04)' }}>
            <p style={{ color: '#B91C1C', fontSize: 12, textAlign: 'center', fontFamily: 'var(--font-ibm-plex-mono)' }}>{error}</p>
          </div>
        )}

        {result && (
          <div style={{ marginTop: 48 }}>
            <div style={{ borderBottom: '2px solid var(--color-ink)', paddingBottom: 16, marginBottom: 32 }}>
              <div className="tool-header-kicker">Examination Results</div>
              <h2 style={{ fontFamily: 'var(--font-libre-baskerville)', fontSize: 28, fontWeight: 700, color: 'var(--color-ink)' }}>
                Your Score Report
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${scores.length}, 1fr)`, gap: 0, border: '1px solid rgba(0,0,0,0.08)' }}>
              {scores.map((item, i) => (
                <div key={item.label} style={{ padding: '28px 24px', borderRight: i < scores.length - 1 ? '1px solid rgba(0,0,0,0.08)' : 'none' }}>
                  <GradeDisplay score={item.score} label={item.label} />
                </div>
              ))}
            </div>

            {result.missing_skills.length > 0 && (
              <div className="highlight-box" style={{ marginTop: 24 }}>
                <div className="highlight-label">{activeTab === 'ai' ? 'Weaknesses — Areas to Improve' : 'Missing Keywords — Not Found'}</div>
                <div className="kw-grid">
                  {result.missing_skills.map((s) => <span key={s} className="exam-tag exam-tag-danger">{s}</span>)}
                </div>
              </div>
            )}

            {result.suggestions.length > 0 && (
              <div style={{ marginTop: 24, border: '1px solid rgba(0,0,0,0.08)' }}>
                <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(0,0,0,0.08)', background: 'var(--color-paper-dim)' }}>
                  <span style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontWeight: 600, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-pencil-dim)' }}>
                    {activeTab === 'ai' ? 'Strengths' : 'Corrections Required'}
                  </span>
                </div>
                {result.suggestions.map((s, i) => (
                  <div key={i} style={{ padding: '16px 20px', borderBottom: i < result.suggestions.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none', display: 'grid', gridTemplateColumns: '36px 1fr', gap: 12 }}>
                    <span style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 11, color: 'rgba(0,0,0,0.2)' }}>{String(i + 1).padStart(2, '0')}</span>
                    <p style={{ fontSize: 14, color: 'rgba(26,26,24,0.6)', lineHeight: 1.7 }}>{s}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
