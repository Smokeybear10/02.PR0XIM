'use client'

import { useState } from 'react'
import GlassCard from '@/components/GlassCard'
import PillButton from '@/components/PillButton'
import MinimalInput from '@/components/MinimalInput'
import { searchJobs, getMarketInsights, type JobResult } from '@/lib/api'

export default function JobsPage() {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [searching, setSearching] = useState(false)
  const [jobs, setJobs] = useState<JobResult[]>([])
  const [insights, setInsights] = useState<Record<string, unknown> | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!query) return
    setSearching(true)
    setError(null)

    try {
      const [jobResults, insightData] = await Promise.all([
        searchJobs(query, location),
        getMarketInsights().catch(() => null),
      ])
      setJobs(jobResults)
      setInsights(insightData)
      setHasSearched(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Search failed')
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2 stagger-1">
        <p className="label">Career Discovery</p>
        <h1 className="font-display text-3xl font-semibold tracking-wider text-text-primary uppercase">
          Job Search
        </h1>
      </div>

      <GlassCard className="stagger-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MinimalInput
            label="Keywords"
            value={query}
            onChange={setQuery}
            placeholder="Software Engineer"
            required
          />
          <MinimalInput
            label="Location"
            value={location}
            onChange={setLocation}
            placeholder="San Francisco, CA"
          />
        </div>
        <div className="mt-6">
          <PillButton onClick={handleSearch} disabled={!query || searching} variant="filled" fullWidth>
            {searching ? 'Searching...' : 'Search Jobs'}
          </PillButton>
        </div>
      </GlassCard>

      {error && (
        <GlassCard>
          <p className="text-score-low text-sm font-body text-center">{error}</p>
        </GlassCard>
      )}

      {hasSearched && (
        <div className="space-y-5 animate-fade-up">
          <p className="label">{jobs.length} portals found</p>

          {jobs.map((job, i) => (
            <GlassCard key={i} interactive>
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <span
                      className="font-display text-xs font-semibold tracking-[0.2em] uppercase"
                      style={{ color: job.color }}
                    >
                      {job.portal}
                    </span>
                  </div>
                  <p className="text-text-secondary text-sm font-body">{job.title}</p>
                </div>
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill-btn px-5 py-1.5 text-xs text-text-secondary shrink-0"
                >
                  View Jobs
                  <span className="sr-only"> on {job.portal} (opens in new tab)</span>
                </a>
              </div>
            </GlassCard>
          ))}

          {insights && (
            <GlassCard title="Market Insights">
              <div className="space-y-3">
                {Object.entries(insights).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-border-subtle last:border-0">
                    <span className="label">{key.replace(/_/g, ' ')}</span>
                    <span className="text-text-secondary text-sm font-body">
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
        </div>
      )}

      {!hasSearched && (
        <div className="text-center py-20">
          <p className="text-text-muted text-sm font-body">Enter search parameters to begin</p>
        </div>
      )}
    </div>
  )
}
