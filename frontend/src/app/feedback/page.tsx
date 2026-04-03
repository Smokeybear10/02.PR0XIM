'use client'

import { useState, useEffect } from 'react'
import GlassCard from '@/components/GlassCard'
import PillButton from '@/components/PillButton'
import MinimalInput from '@/components/MinimalInput'
import { submitFeedback, getFeedbackStats, type FeedbackStats } from '@/lib/api'

export default function FeedbackPage() {
  const [activeTab, setActiveTab] = useState<'submit' | 'stats'>('submit')
  const [rating, setRating] = useState(0)
  const [usability, setUsability] = useState(50)
  const [satisfaction, setSatisfaction] = useState(50)
  const [suggestions, setSuggestions] = useState('')
  const [additional, setAdditional] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<FeedbackStats | null>(null)
  const [loadingStats, setLoadingStats] = useState(false)

  useEffect(() => {
    if (activeTab === 'stats') {
      setLoadingStats(true)
      getFeedbackStats()
        .then(setStats)
        .catch(() => setStats(null))
        .finally(() => setLoadingStats(false))
    }
  }, [activeTab])

  const handleSubmit = async () => {
    if (rating === 0) return
    setSubmitting(true)
    setError(null)

    try {
      await submitFeedback({
        rating,
        usability_score: usability,
        feature_satisfaction: satisfaction,
        missing_features: suggestions,
        improvement_suggestions: suggestions,
        user_experience: additional,
      })
      setSubmitted(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to submit feedback')
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setRating(0)
    setUsability(50)
    setSatisfaction(50)
    setSuggestions('')
    setAdditional('')
    setSubmitted(false)
    setError(null)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="space-y-2 stagger-1">
        <p className="label">Help Us Improve</p>
        <h1 className="font-display text-3xl font-semibold tracking-wider text-text-primary uppercase">
          Feedback
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-border-subtle">
        {(['submit', 'stats'] as const).map((tab) => (
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
            {tab === 'submit' ? 'Submit' : 'Stats'}
          </button>
        ))}
      </div>

      {activeTab === 'submit' && !submitted && (
        <div className="space-y-6">
          <GlassCard title="Rating">
            <div className="space-y-3">
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    aria-label={`Rate ${star} out of 5`}
                    aria-pressed={star <= rating}
                    className={`
                      w-10 h-10 rounded-full border transition-all duration-200
                      ${star <= rating
                        ? 'border-text-primary bg-text-primary text-bg-dark'
                        : 'border-border-subtle text-text-muted hover:border-text-secondary'
                      }
                    `}
                  >
                    <span className="font-display text-sm">{star}</span>
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-text-muted text-xs font-body">{rating}/5</p>
              )}
            </div>
          </GlassCard>

          <GlassCard title="Usability">
            <div className="space-y-3">
              <input
                type="range"
                min="0"
                max="100"
                value={usability}
                onChange={(e) => setUsability(Number(e.target.value))}
                className="w-full"
                aria-label="Usability score"
              />
              <div className="flex justify-between">
                <span className="text-text-muted text-xs font-body">0</span>
                <span className="font-display text-sm text-text-primary">{usability}</span>
                <span className="text-text-muted text-xs font-body">100</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard title="Feature Satisfaction">
            <div className="space-y-3">
              <input
                type="range"
                min="0"
                max="100"
                value={satisfaction}
                onChange={(e) => setSatisfaction(Number(e.target.value))}
                className="w-full"
                aria-label="Feature satisfaction"
              />
              <div className="flex justify-between">
                <span className="text-text-muted text-xs font-body">0</span>
                <span className="font-display text-sm text-text-primary">{satisfaction}</span>
                <span className="text-text-muted text-xs font-body">100</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard title="Suggestions">
            <MinimalInput
              value={suggestions}
              onChange={setSuggestions}
              multiline
              rows={4}
              placeholder="What features would you like to see?"
            />
          </GlassCard>

          <GlassCard title="Additional Feedback">
            <MinimalInput
              value={additional}
              onChange={setAdditional}
              multiline
              rows={3}
              placeholder="Anything else you want us to know..."
            />
          </GlassCard>

          {error && (
            <p className="text-score-low text-sm font-body text-center">{error}</p>
          )}

          <PillButton onClick={handleSubmit} disabled={rating === 0 || submitting} variant="filled" fullWidth>
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </PillButton>
        </div>
      )}

      {activeTab === 'submit' && submitted && (
        <GlassCard>
          <div className="text-center py-12 space-y-4">
            <p className="font-display text-lg tracking-wider text-text-primary uppercase">Feedback Submitted</p>
            <p className="text-text-muted text-sm font-body">Thank you for your input</p>
            <PillButton onClick={resetForm}>Submit Another</PillButton>
          </div>
        </GlassCard>
      )}

      {activeTab === 'stats' && (
        loadingStats ? (
          <div className="text-center py-20">
            <p className="text-text-muted text-sm font-body animate-pulse-subtle">Loading stats...</p>
          </div>
        ) : stats ? (
          <div className="grid grid-cols-2 gap-5 animate-fade-up">
            <GlassCard>
              <div className="text-center space-y-2 py-4">
                <span className="font-display text-4xl font-semibold text-text-primary">
                  {stats.avg_rating.toFixed(1)}
                </span>
                <p className="label">Avg Rating</p>
              </div>
            </GlassCard>
            <GlassCard>
              <div className="text-center space-y-2 py-4">
                <span className="font-display text-4xl font-semibold text-text-secondary">
                  {stats.total_responses}
                </span>
                <p className="label">Total Responses</p>
              </div>
            </GlassCard>
            <GlassCard>
              <div className="text-center space-y-2 py-4">
                <span className="font-display text-4xl font-semibold text-text-secondary">
                  {Math.round(stats.avg_usability)}%
                </span>
                <p className="label">Avg Usability</p>
              </div>
            </GlassCard>
            <GlassCard>
              <div className="text-center space-y-2 py-4">
                <span className="font-display text-4xl font-semibold text-text-secondary">
                  {Math.round(stats.avg_satisfaction)}%
                </span>
                <p className="label">Avg Satisfaction</p>
              </div>
            </GlassCard>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-text-muted text-sm font-body">No feedback data available</p>
          </div>
        )
      )}
    </div>
  )
}
