import GlassCard from '@/components/GlassCard'

const FEATURES = [
  { name: 'ATS Optimization', desc: 'Real-time scoring against industry standards' },
  { name: 'AI Analysis', desc: 'Deep learning models for resume evaluation' },
  { name: 'Keyword Matching', desc: 'NLP-powered skill extraction and gap analysis' },
  { name: 'Resume Builder', desc: 'Template engine with smart autofill' },
  { name: 'Job Search', desc: 'Multi-portal aggregation and market data' },
  { name: 'Analytics', desc: 'Track performance trends over time' },
]

const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/Smokeybear10' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/thomasou0/' },
  { label: 'Website', href: 'https://thomasou.com' },
]

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="space-y-2 stagger-1">
        <p className="label">System Information</p>
        <h1 className="font-display text-3xl font-semibold tracking-wider text-text-primary uppercase">
          About
        </h1>
      </div>

      {/* Profile */}
      <GlassCard>
        <div className="space-y-3">
          <h2 className="font-display text-xl font-semibold tracking-wider text-text-primary uppercase">Thomas Ou</h2>
          <p className="text-text-secondary text-sm font-body">Fullstack Engineer & Designer</p>
          <div className="flex gap-3 mt-4">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="pill-btn px-5 py-1.5 text-xs text-text-secondary"
              >
                {link.label}
                <span className="sr-only"> (opens in new tab)</span>
              </a>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Vision */}
      <GlassCard title="Vision">
        <div className="space-y-4">
          <p className="text-text-secondary text-sm font-body leading-relaxed">
            DR4FT is built to give job seekers an unfair advantage. Using AI and NLP,
            it analyzes resumes against real ATS systems, identifies gaps, and provides
            actionable optimization strategies.
          </p>
          <p className="text-text-secondary text-sm font-body leading-relaxed">
            The goal is simple: help people land interviews by ensuring their resumes
            pass automated screening and stand out to human reviewers.
          </p>
        </div>
      </GlassCard>

      {/* Features Grid */}
      <div>
        <p className="label mb-5">Capabilities</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature) => (
            <GlassCard key={feature.name}>
              <h3 className="font-display text-xs font-semibold tracking-[0.2em] uppercase text-text-primary mb-2">{feature.name}</h3>
              <p className="text-text-muted text-sm font-body leading-relaxed">{feature.desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <GlassCard title="Tech Stack">
        <div className="space-y-0">
          {[
            { layer: 'Frontend', tools: 'Next.js, React, TypeScript, Tailwind CSS' },
            { layer: 'Backend', tools: 'Python, FastAPI' },
            { layer: 'AI/ML', tools: 'NLP Models, ATS Parsing Engine' },
            { layer: 'Deploy', tools: 'Vercel, Docker' },
          ].map((row) => (
            <div key={row.layer} className="flex gap-6 py-3 border-b border-border-subtle last:border-0">
              <span className="label w-20 shrink-0 pt-0.5">{row.layer}</span>
              <span className="text-text-secondary text-sm font-body">{row.tools}</span>
            </div>
          ))}
        </div>
      </GlassCard>

    </div>
  )
}
