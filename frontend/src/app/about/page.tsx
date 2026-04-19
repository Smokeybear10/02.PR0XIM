const FEATURES = [
  { name: 'ATS Optimization', desc: 'Real-time scoring against industry-standard ATS rubrics.' },
  { name: 'AI Analysis', desc: 'Deep learning models evaluate content, tone, and keyword density.' },
  { name: 'Keyword Matching', desc: 'NLP-powered skill extraction and gap analysis.' },
  { name: 'Resume Builder', desc: 'Template engine with smart autofill and section scoring.' },
  { name: 'Job Search', desc: 'Multi-portal aggregation and real-time market data.' },
  { name: 'Analytics', desc: 'Track performance trends over time across roles.' },
]

const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/Smokeybear10' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/thomasou0/' },
  { label: 'Website', href: 'https://thomasou.com' },
]

const STACK = [
  { layer: 'Frontend', tools: 'Next.js, React, TypeScript, Tailwind CSS' },
  { layer: 'Backend', tools: 'Python, FastAPI' },
  { layer: 'AI / ML', tools: 'NLP Models, ATS Parsing Engine' },
  { layer: 'Deploy', tools: 'Vercel, Docker' },
]

export default function AboutPage() {
  return (
    <div className="tool-wrapper">
      <div className="tool-paper">
        <div className="tool-binding" aria-hidden />

        <div className="tool-running-head">
          <span>DR4FT · Course Syllabus</span>
          <span>Appendix · The Instructor</span>
        </div>

        <div className="tool-header">
          <div className="tool-header-kicker">Examination Booklet</div>
          <h1 className="tool-header-title">About DR4FT.</h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
          <div className="exam-card">
            <div className="exam-card-title">Instructor</div>
            <h2 style={{ fontFamily: 'var(--font-libre-baskerville)', fontSize: 24, fontWeight: 700, marginBottom: 4, color: 'var(--color-ink)' }}>Thomas Ou</h2>
            <p style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 12, color: 'var(--color-pencil)', marginBottom: 20 }}>Fullstack Engineer & Designer</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {SOCIAL_LINKS.map((link) => (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="btn-exam-outline" style={{ padding: '6px 14px', fontSize: 10 }}>
                  {link.label}<span className="sr-only"> (opens in new tab)</span>
                </a>
              ))}
            </div>
          </div>
          <div className="exam-card">
            <div className="exam-card-title">Course Description</div>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: 'rgba(26,26,24,0.6)' }}>
              DR4FT gives job seekers an unfair advantage. Using AI and NLP, it reads resumes
              the way ATS systems do, then tells you exactly what to fix.
            </p>
          </div>
        </div>

        <div style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontWeight: 600, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-pencil-dim)', marginBottom: 16 }}>Capabilities</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, border: '1px solid rgba(0,0,0,0.08)' }}>
            {FEATURES.map((f, i) => (
              <div
                key={f.name}
                className="about-feature-cell"
                style={{
                  padding: '20px',
                  borderRight: (i + 1) % 3 !== 0 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                  borderBottom: i < 3 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                }}
              >
                <p style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontWeight: 600, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-pencil-dim)', marginBottom: 6 }}>{f.name}</p>
                <p style={{ fontSize: 13, color: 'rgba(26,26,24,0.55)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
            <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(0,0,0,0.08)', background: 'var(--color-paper-dim)' }}>
              <span style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontWeight: 600, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-pencil-dim)' }}>Required Textbooks (Tech Stack)</span>
            </div>
            {STACK.map((row, i) => (
              <div key={row.layer} style={{ display: 'flex', gap: 24, padding: '14px 20px', borderBottom: i < STACK.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none', alignItems: 'baseline' }}>
                <span style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontWeight: 600, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-pencil-dim)', width: 72, flexShrink: 0 }}>{row.layer}</span>
                <span style={{ fontSize: 14, color: 'rgba(26,26,24,0.6)' }}>{row.tools}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
