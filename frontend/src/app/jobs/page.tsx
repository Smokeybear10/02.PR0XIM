'use client'

import { useState, useEffect } from 'react'
import ExamCard from '@/components/booklet/ExamCard'
import ExamButton from '@/components/booklet/ExamButton'
import ExamInput from '@/components/booklet/ExamInput'
import { searchJobs, getMarketInsights, type JobResult } from '@/lib/api'

type TrendingSkill = { name: string; growth: string; icon?: string }
type TopLocation = { name: string; jobs: string; icon?: string }
type SalaryInsight = { role: string; range: string; experience: string }
type Insights = {
  trending_skills?: TrendingSkill[]
  top_locations?: TopLocation[]
  salary_insights?: SalaryInsight[]
}

export default function JobsPage() {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [detectingLocation, setDetectingLocation] = useState(false)
  const [searching, setSearching] = useState(false)
  const [jobs, setJobs] = useState<JobResult[]>([])
  const [insights, setInsights] = useState<Insights | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setDetectingLocation(true)
    fetch('https://ipapi.co/json/')
      .then((r) => r.json())
      .then((d) => { if (d.city && d.region) setLocation(`${d.city}, ${d.region}`) })
      .catch(() => {})
      .finally(() => setDetectingLocation(false))
  }, [])

  const handleSearch = async () => {
    if (!query) return
    setSearching(true); setError(null)
    try {
      const [jobResults, insightData] = await Promise.all([searchJobs(query, location), getMarketInsights().catch(() => null)])
      setJobs(jobResults); setInsights(insightData as Insights | null); setHasSearched(true)
    } catch (e) { setError(e instanceof Error ? e.message : 'Search failed') }
    finally { setSearching(false) }
  }

  return (
    <div className="tool-wrapper">
      <div className="tool-paper">
        <div className="tool-binding" aria-hidden />

        <div className="tool-running-head">
          <span>DR4FT · Career Research</span>
          <span>Section C · Field Notes</span>
        </div>

        <div className="tool-header">
          <div className="tool-header-kicker">Examination Booklet</div>
          <h1 className="tool-header-title">Job search.</h1>
        </div>

        <ExamCard>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
            <ExamInput label="Keywords" value={query} onChange={setQuery} placeholder="Software Engineer" required />
            <div>
              <ExamInput label="Location" value={detectingLocation ? 'Detecting...' : location} onChange={setLocation} placeholder="San Francisco, CA" />
              <button
                type="button"
                onClick={() => {
                  navigator.geolocation.getCurrentPosition(
                    async (pos) => {
                      try {
                        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`, { headers: { Accept: 'application/json' } })
                        const data = await res.json()
                        const city = data.address?.city || data.address?.town || data.address?.village || ''
                        const state = data.address?.state || ''
                        if (city) setLocation(`${city}${state ? `, ${state}` : ''}`)
                      } catch {}
                    }, () => {}, { enableHighAccuracy: true }
                  )
                }}
                style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-cover)', background: 'none', border: 'none', cursor: 'pointer', marginTop: 6, padding: 0 }}
              >
                Use precise location
              </button>
            </div>
          </div>
          <ExamButton onClick={handleSearch} disabled={!query || searching} variant="filled" fullWidth>
            {searching ? 'Searching...' : 'Search Jobs'}
          </ExamButton>
        </ExamCard>

        {error && <div style={{ marginTop: 16, padding: 12, border: '1px solid rgba(185,28,28,0.2)', textAlign: 'center' }}><p style={{ color: '#B91C1C', fontSize: 13 }}>{error}</p></div>}

        {hasSearched && (
          <div style={{ marginTop: 32 }}>
            <p style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-pencil-dim)', marginBottom: 16 }}>{jobs.length} portals found</p>
            {jobs.map((job, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid rgba(0,0,0,0.06)', transition: 'background 0.3s' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.02)')} onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                <div>
                  <span style={{ fontFamily: 'var(--font-label)', fontWeight: 800, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: job.color }}>{job.portal}</span>
                  <p style={{ fontSize: 14, color: 'var(--color-pencil)', marginTop: 2 }}>{job.title}</p>
                </div>
                <a href={job.url} target="_blank" rel="noopener noreferrer" className="btn-exam-outline" style={{ padding: '6px 16px', fontSize: 10 }}>
                  View<span className="sr-only"> on {job.portal}</span>
                </a>
              </div>
            ))}
            {insights && (
              <div className="market-insights">
                <div className="market-insights-head">
                  <div className="product-eyebrow">Market Insights</div>
                  <h2 className="market-insights-title">The state of the market.</h2>
                </div>

                <div className="market-insights-grid">
                  {insights.trending_skills && insights.trending_skills.length > 0 && (
                    <section className="insight-block">
                      <div className="insight-block-label">Trending Skills</div>
                      <ul className="insight-list">
                        {insights.trending_skills.map((s) => (
                          <li key={s.name} className="insight-row">
                            <span className="insight-row-name">{s.name}</span>
                            <span className="insight-row-meta insight-growth">{s.growth}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {insights.top_locations && insights.top_locations.length > 0 && (
                    <section className="insight-block">
                      <div className="insight-block-label">Top Locations</div>
                      <ul className="insight-list">
                        {insights.top_locations.map((loc) => (
                          <li key={loc.name} className="insight-row">
                            <span className="insight-row-name">{loc.name}</span>
                            <span className="insight-row-meta">{loc.jobs}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {insights.salary_insights && insights.salary_insights.length > 0 && (
                    <section className="insight-block insight-block-wide">
                      <div className="insight-block-label">Salary Insights</div>
                      <ul className="insight-list">
                        {insights.salary_insights.map((s) => (
                          <li key={s.role} className="insight-row insight-row-salary">
                            <span className="insight-row-name">{s.role}</span>
                            <span className="insight-row-range">{s.range}</span>
                            <span className="insight-row-exp">{s.experience}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        {!hasSearched && <div style={{ textAlign: 'center', padding: '64px 0' }}><p style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.2)' }}>Enter search parameters to begin</p></div>}
      </div>
    </div>
  )
}
