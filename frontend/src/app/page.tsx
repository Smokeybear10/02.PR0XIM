import Link from 'next/link'

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center text-center overflow-hidden -mt-20 -mb-20 h-screen">
      {/* Ambient orbs */}
      <div
        className="ambient-orb"
        style={{ width: 400, height: 400, top: '10%', left: '15%', background: 'rgba(100, 120, 200, 0.03)' }}
        aria-hidden="true"
      />
      <div
        className="ambient-orb"
        style={{ width: 300, height: 300, bottom: '20%', right: '10%', background: 'rgba(140, 100, 180, 0.025)', animationDelay: '-4s' }}
        aria-hidden="true"
      />

      {/* Monogram */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <span
          className="font-display font-black leading-none animate-monogram"
          style={{
            fontSize: 'clamp(220px, 32vw, 520px)',
            color: 'transparent',
            WebkitTextStroke: '1px rgba(240, 240, 248, 0.025)',
          }}
        >
          D4
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="space-y-5">
          <p className="label stagger-1">AI Resume Optimizer</p>
          <h1 className="font-display text-7xl md:text-9xl font-bold tracking-[0.08em] text-text-primary uppercase stagger-2">
            DR4FT
          </h1>
          <p className="text-text-secondary text-xl font-body max-w-sm mx-auto leading-relaxed stagger-3">
            Beat the ATS. Land the interview.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 mt-10 stagger-4">
          <Link href="/analyzer" className="pill-btn-filled px-12 py-3.5 text-sm font-medium tracking-wider inline-block">
            Get Started
          </Link>
          <Link href="/about" className="pill-btn px-12 py-3.5 text-sm text-text-secondary font-medium tracking-wider inline-block">
            Learn More
          </Link>
        </div>
      </div>

    </div>
  )
}
