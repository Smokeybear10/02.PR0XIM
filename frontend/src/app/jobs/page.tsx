'use client'

import { useState, useEffect } from 'react'
import ExamCard from '@/components/booklet/ExamCard'
import ExamButton from '@/components/booklet/ExamButton'
import ExamInput from '@/components/booklet/ExamInput'
import { searchJobs, getMarketInsights, type JobResult } from '@/lib/api'

export default function JobsPage() {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [detectingLocation, setDetectingLocation] = useState(false)
  const [searching, setSearching] = useState(false)
  const [jobs, setJobs] = useState<JobResult[]>([])
  const [insights, setInsights] = useState<Record<string, unknown> | null>(null)
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
      setJobs(jobResults); setInsights(insightData); setHasSearched(true)
    } catch (e) { setError(e instanceof Error ? e.message : 'Search failed') }
    finally { setSearching(false) }
  }

  return (
    <div className="tool-wrapper">
      <div className="tool-paper">
        <div className="tool-header">
          <div className="tool-header-kicker">Career Research</div>
          <h1 className="tool-header-title">Job Search</h1>
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
              <ExamCard title="Market Insights" className="mt-6">
                {Object.entries(insights).map(([key, value]) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                    <span style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-pencil-dim)' }}>{key.replace(/_/g, ' ')}</span>
                    <span style={{ fontSize: 13, color: 'var(--color-pencil)' }}>{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
                  </div>
                ))}
              </ExamCard>
            )}
          </div>
        )}
        {!hasSearched && <div style={{ textAlign: 'center', padding: '64px 0' }}><p style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.2)' }}>Enter search parameters to begin</p></div>}
      </div>
    </div>
  )
}
