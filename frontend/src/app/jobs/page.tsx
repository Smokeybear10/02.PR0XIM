'use client'

import { useState } from 'react'
import GlassCard from '@/components/GlassCard'
import PillButton from '@/components/PillButton'
import MinimalInput from '@/components/MinimalInput'

type JobResult = {
  portal: string
  title: string
  company: string
  location: string
  link: string
}

const MOCK_JOBS: JobResult[] = [
  { portal: 'LinkedIn', title: 'Senior Frontend Engineer', company: 'Stripe', location: 'San Francisco, CA', link: '#' },
  { portal: 'Indeed', title: 'Fullstack Developer', company: 'Vercel', location: 'Remote', link: '#' },
  { portal: 'Glassdoor', title: 'Software Engineer II', company: 'Datadog', location: 'New York, NY', link: '#' },
  { portal: 'LinkedIn', title: 'React Developer', company: 'Notion', location: 'San Francisco, CA', link: '#' },
  { portal: 'Indeed', title: 'Backend Engineer', company: 'Supabase', location: 'Remote', link: '#' },
]

const MOCK_TRENDING = [
  'TypeScript', 'React', 'Next.js', 'AWS', 'Python',
  'Kubernetes', 'GraphQL', 'Rust', 'Go', 'Terraform',
]

export default function JobsPage() {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [searching, setSearching] = useState(false)
  const [jobs, setJobs] = useState<JobResult[]>([])
  const [trendingSkills, setTrendingSkills] = useState<string[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async () => {
    if (!query) return
    setSearching(true)
    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setJobs(MOCK_JOBS)
    setTrendingSkills(MOCK_TRENDING)
    setHasSearched(true)
    setSearching(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <p className="label">Career Discovery</p>
        <h1 className="font-display text-3xl font-semibold tracking-wider text-text-primary uppercase">
          Job Search
        </h1>
      </div>

      <GlassCard>
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

      {hasSearched && (
        <div className="space-y-5 animate-fade-up">
          <p className="label">{jobs.length} results</p>

          {jobs.map((job, i) => (
            <GlassCard key={i}>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <span className="label px-2 py-0.5 rounded-full border border-border-subtle">
                      {job.portal}
                    </span>
                    <span className="font-display text-sm font-semibold tracking-wider text-text-primary uppercase">
                      {job.title}
                    </span>
                  </div>
                  <p className="text-text-secondary text-sm font-body">{job.company}</p>
                  <p className="text-text-muted text-xs font-body">{job.location}</p>
                </div>
                <a
                  href={job.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill-btn px-5 py-1.5 text-xs text-text-secondary shrink-0"
                >
                  Apply
                </a>
              </div>
            </GlassCard>
          ))}

          <GlassCard title="Trending Skills">
            <div className="flex flex-wrap gap-2">
              {trendingSkills.map((skill) => (
                <span
                  key={skill}
                  className="pill-btn px-4 py-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </GlassCard>
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
