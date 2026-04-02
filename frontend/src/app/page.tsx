import Link from 'next/link'

const FEATURES = [
  {
    title: 'Analyze',
    description: 'AI-powered resume scoring against real ATS systems. Keyword matching, format checks, gap analysis.',
    link: '/analyzer',
  },
  {
    title: 'Build',
    description: 'Construct ATS-optimized resumes with intelligent autofill and real-time scoring feedback.',
    link: '/builder',
  },
  {
    title: 'Discover',
    description: 'Search jobs across portals, track trending skills, and monitor your performance over time.',
    link: '/jobs',
  },
]

export default function Home() {
  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center text-center">
      {/* Monogram */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden
      >
        <span
          className="font-display font-black leading-none"
          style={{
            fontSize: 'clamp(200px, 30vw, 500px)',
            color: 'rgba(240, 240, 248, 0.025)',
          }}
        >
          D4
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 space-y-8">
        <div className="space-y-4">
          <p className="label">AI Resume Optimizer</p>
          <h1 className="font-display text-5xl md:text-7xl font-semibold tracking-wider text-text-primary uppercase">
            DR4FT
          </h1>
          <p className="text-text-secondary text-lg font-body max-w-lg mx-auto leading-relaxed">
            Optimize your resume with AI analysis, ATS scoring, and actionable suggestions to land your next role.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Link href="/analyzer" className="pill-btn-filled px-10 py-3 text-sm font-medium tracking-wider inline-block">
            Get Started
          </Link>
          <Link href="/about" className="pill-btn px-10 py-3 text-sm text-text-secondary font-medium tracking-wider inline-block">
            Learn More
          </Link>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-5 mt-24 w-full">
        {FEATURES.map((feature) => (
          <Link key={feature.title} href={feature.link} className="glass p-8 group transition-all duration-300 hover:border-border-focus">
            <h3 className="font-display text-sm font-semibold tracking-[0.2em] uppercase text-text-primary mb-3">
              {feature.title}
            </h3>
            <p className="text-text-muted text-sm font-body leading-relaxed group-hover:text-text-secondary transition-colors">
              {feature.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
