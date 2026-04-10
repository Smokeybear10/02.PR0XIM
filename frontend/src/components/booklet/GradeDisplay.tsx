'use client'

type Props = {
  score: number
  label: string
  max?: number
}

export default function GradeDisplay({ score, label, max = 100 }: Props) {
  const pct = Math.round((score / max) * 100)
  const isHigh = pct >= 75
  const isLow = pct < 50
  const colorClass = isHigh ? 'pass' : isLow ? 'fail' : 'mid'

  return (
    <div className="score-display">
      <div className="score-label-text">{label}</div>
      <div className={`score-val ${colorClass}`}>{pct}%</div>
      <div className="score-bar-track">
        <div
          className={`score-bar-fill ${colorClass}`}
          data-bar={pct}
          style={{ '--bar-target': `${pct}%` } as React.CSSProperties}
        />
      </div>
      <div style={{ marginTop: 4 }}>
        <span className={`stamp ${pct >= 60 ? 'pass' : 'fail'}`}>
          {pct >= 60 ? 'Pass' : 'Fail'}
        </span>
      </div>
    </div>
  )
}
