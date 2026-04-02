'use client'

import { useState } from 'react'
import GlassCard from '@/components/GlassCard'
import ScoreRing from '@/components/ScoreRing'

const PERIODS = ['Today', 'This Week', 'This Month', 'All Time'] as const

const MOCK_STATS = {
  total_resumes: 47,
  avg_ats_score: 74,
  avg_keyword_score: 68,
  high_scoring: 12,
}

export default function DashboardPage() {
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>('All Time')

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="space-y-2">
        <p className="label">Performance Metrics</p>
        <h1 className="font-display text-3xl font-semibold tracking-wider text-text-primary uppercase">
          Dashboard
        </h1>
      </div>

      {/* Period Tabs */}
      <div className="flex gap-6 border-b border-border-subtle">
        {PERIODS.map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`
              font-display text-xs tracking-[0.2em] uppercase pb-3 transition-all duration-200 border-b-2
              ${period === p
                ? 'text-text-primary border-text-primary'
                : 'text-text-muted border-transparent hover:text-text-secondary'
              }
            `}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <GlassCard>
          <div className="flex flex-col items-center gap-3">
            <span className="font-display text-4xl font-semibold text-text-primary">
              {MOCK_STATS.total_resumes}
            </span>
            <span className="label">Total Resumes</span>
          </div>
        </GlassCard>
        <GlassCard>
          <ScoreRing score={MOCK_STATS.avg_ats_score} label="Avg ATS" />
        </GlassCard>
        <GlassCard>
          <ScoreRing score={MOCK_STATS.avg_keyword_score} label="Avg Keywords" />
        </GlassCard>
        <GlassCard>
          <div className="flex flex-col items-center gap-3">
            <span className="font-display text-4xl font-semibold text-score-high">
              {MOCK_STATS.high_scoring}
            </span>
            <span className="label">High Scoring</span>
          </div>
        </GlassCard>
      </div>

      {/* Chart Placeholders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[
          { title: 'Score Trend', desc: 'ATS score history over time' },
          { title: 'Keyword Distribution', desc: 'Top matched keywords' },
          { title: 'Submissions', desc: 'Resumes analyzed per day' },
          { title: 'Categories', desc: 'Breakdown by job category' },
        ].map((chart) => (
          <GlassCard key={chart.title} title={chart.title}>
            <div className="h-48 flex items-center justify-center">
              <p className="text-text-muted text-xs font-body">{chart.desc}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Recent Activity */}
      <GlassCard title="Recent Activity">
        <div className="space-y-0">
          {[
            { time: '2 min ago', action: 'Resume analyzed', detail: 'Frontend Engineer, ATS: 82' },
            { time: '15 min ago', action: 'Resume built', detail: 'Fullstack Engineer, Modern template' },
            { time: '1 hr ago', action: 'Resume analyzed', detail: 'Data Scientist, ATS: 71' },
            { time: '3 hr ago', action: 'Job search', detail: 'Software Engineer, San Francisco' },
            { time: '5 hr ago', action: 'Resume analyzed', detail: 'Product Manager, ATS: 89' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-6 py-3 border-b border-border-subtle last:border-0">
              <span className="text-text-muted text-xs font-body w-20 shrink-0">{item.time}</span>
              <span className="text-text-secondary text-sm font-body w-32 shrink-0">{item.action}</span>
              <span className="text-text-primary text-sm font-body">{item.detail}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
