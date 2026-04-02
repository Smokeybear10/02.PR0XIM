'use client'

type Props = {
  score: number
  label: string
  max?: number
  size?: number
}

export default function ScoreRing({ score, label, max = 100, size = 100 }: Props) {
  const percentage = Math.round((score / max) * 100)
  const radius = 45
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference
  const color = percentage >= 75 ? 'var(--color-score-high)' : percentage >= 50 ? 'var(--color-score-mid)' : 'var(--color-score-low)'

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" className="transform -rotate-90" style={{ width: size, height: size }}>
          <circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="4"
          />
          <circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="animate-score"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-display text-2xl font-semibold"
            style={{ color }}
          >
            {score}
          </span>
        </div>
      </div>
      <span className="label">{label}</span>
    </div>
  )
}
