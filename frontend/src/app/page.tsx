'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const coverRef = useRef<HTMLElement>(null)
  const paperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {

      /* ── COVER: load animation (not scroll-driven) ── */
      const loadTl = gsap.timeline({ delay: 0.15 })
      loadTl
        .from('.cover-tag', { opacity: 0, y: 10, duration: 0.6, ease: 'power3.out' })
        .from('.cover-word', {
          opacity: 0, y: 50, rotationX: 25,
          stagger: 0.07, duration: 0.7, ease: 'power4.out',
        }, '-=0.3')
        .from('.cover-sub', { opacity: 0, y: 20, duration: 0.5, ease: 'power3.out' }, '-=0.3')
        .from('.cover-btn', { opacity: 0, y: 20, duration: 0.4, ease: 'power3.out' }, '-=0.2')
        .from('.cover-meta span', { opacity: 0, stagger: 0.06, duration: 0.3, ease: 'power3.out' }, '-=0.15')

      /* ── COVER: pin + scroll-driven exit ── */
      const coverTl = gsap.timeline({
        scrollTrigger: {
          trigger: coverRef.current,
          start: 'top top',
          end: '+=120%',
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
        },
      })

      // Hold briefly then fade out
      coverTl
        .to({}, { duration: 0.4 })
        .to('.cover-content', { opacity: 0, y: -50, scale: 0.96, duration: 0.4, ease: 'power2.in' })
        .to('.scroll-hint', { opacity: 0, duration: 0.2 }, '<')

      /* ── PAPER: slides up dramatically ── */
      if (paperRef.current) {
        gsap.from(paperRef.current, {
          y: 120,
          opacity: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: paperRef.current,
            start: 'top 85%',
            once: true,
          },
        })

        // Exam header fields appear
        gsap.from('.exam-field-anim', {
          opacity: 0, x: -20, stagger: 0.06, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: '.exam-header-anim', start: 'top 80%', once: true },
        })

        // Questions stagger in
        gsap.from('.q-anim', {
          opacity: 0, y: 50, stagger: 0.15, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.q-anim', start: 'top 82%', once: true },
        })

        // Table rows
        gsap.from('.table-row-anim', {
          opacity: 0, x: -30, stagger: 0.08, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: '.table-row-anim', start: 'top 85%', once: true },
        })

        // Bar fills
        const bars = paperRef.current.querySelectorAll<HTMLElement>('.table-bar-fill')
        bars.forEach((bar) => {
          const w = bar.dataset.w ?? '0'
          gsap.to(bar, {
            width: `${w}%`,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: { trigger: bar, start: 'top 88%', once: true },
          })
        })

        // Keywords highlight in
        gsap.from('.kw-anim', {
          opacity: 0, scale: 0.8, stagger: 0.04, duration: 0.4, ease: 'back.out(1.4)',
          scrollTrigger: { trigger: '.kw-anim', start: 'top 85%', once: true },
        })

        // Final grade — dramatic scale
        gsap.from('.grade-mark-anim', {
          scale: 2, opacity: 0, duration: 0.8, ease: 'power4.out',
          scrollTrigger: { trigger: '.grade-mark-anim', start: 'top 80%', once: true },
        })

        gsap.from('.grade-comment-anim', {
          opacity: 0, y: 20, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: '.grade-comment-anim', start: 'top 85%', once: true },
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  /* Split title into words for staggered reveal */
  const titleWords = ['Does', 'your', 'resume', 'pass', 'the']
  const titleAccent = 'test?'

  return (
    <div ref={containerRef}>

      {/* ── BLUE COVER ── */}
      <section ref={coverRef} className="cover-page">
        <div className="cover-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
          <p className="cover-tag">Examination Booklet — AI Resume Analysis</p>

          <h1 className="cover-title" style={{ perspective: 400 }}>
            {titleWords.map((w, i) => (
              <span key={i} className="cover-word" style={{ display: 'inline-block', marginRight: '0.3em' }}>{w}</span>
            ))}
            <br />
            <span className="cover-word" style={{ display: 'inline-block' }}>
              <em>{titleAccent}</em>
            </span>
          </h1>

          <p className="cover-sub">
            76% of resumes are automatically failed by ATS screening
            before a human ever opens the file.
          </p>

          <Link href="/analyzer" className="cover-btn">Begin Examination →</Link>

          <div className="cover-meta">
            <span>DR4FT / Spring 2026</span>
            <span>Time Limit: 30 seconds</span>
            <span>Total: 100 points</span>
          </div>
        </div>

        <div className="scroll-hint">
          <span>Open booklet</span>
          <div className="scroll-dot" />
        </div>
      </section>

      {/* ── WHITE PAPER PAGE ── */}
      <div className="paper-page" ref={paperRef}>
        <div className="paper-inner">

          {/* Exam header */}
          <div className="exam-header exam-header-anim">
            <div>
              <div className="exam-field exam-field-anim">Name: <span className="fill-blank">Your Resume</span></div>
              <div className="exam-field exam-field-anim">Date: <span className="fill-blank">Today</span></div>
              <div className="exam-field exam-field-anim">Course: <span className="fill-blank">ATS 101</span></div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="exam-field exam-field-anim">Instructor: <span className="fill-blank">The Algorithm</span></div>
              <div className="exam-field exam-field-anim">Section: <span className="fill-blank">Job Applications</span></div>
              <div className="exam-field exam-field-anim">Time: <span className="fill-blank">30 seconds</span></div>
            </div>
          </div>

          {/* Q1 */}
          <div className="question q-anim">
            <div className="q-num">QUESTION 1 — 40 POINTS</div>
            <div className="q-text">Does your resume contain the required keywords for the target role?</div>
            <div className="q-answer">
              Your resume matched 44% of required keywords. 10 critical terms are
              completely absent. ATS systems don&apos;t infer synonyms... they match exact strings.
            </div>
          </div>

          {/* Score table */}
          <table className="exam-table">
            <thead>
              <tr>
                <th>Criterion</th>
                <th>Score</th>
                <th>Progress</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'ATS Compatibility', val: 31, cls: 'fail', label: 'F' },
                { name: 'Keyword Match', val: 44, cls: 'fail', label: 'D-' },
                { name: 'Format Compliance', val: 87, cls: 'pass', label: 'B+' },
                { name: 'Section Coverage', val: 62, cls: 'mid', label: 'C' },
              ].map((r) => (
                <tr key={r.name} className="table-row-anim">
                  <td>{r.name}</td>
                  <td><span className={`val ${r.cls}`}>{r.val}%</span></td>
                  <td>
                    <div className="table-bar">
                      <div className={`table-bar-fill ${r.cls}`} data-w={r.val} />
                    </div>
                  </td>
                  <td>
                    <span className={`stamp ${r.cls === 'pass' || r.cls === 'mid' && r.val >= 60 ? 'pass' : 'fail'}`}>
                      {r.val >= 60 ? 'Pass' : 'Fail'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Q2 */}
          <div className="question q-anim">
            <div className="q-num">QUESTION 2 — 30 POINTS</div>
            <div className="q-text">List the missing keywords that would have earned you the interview.</div>
          </div>

          <div className="highlight-box">
            <div className="highlight-label">Highlighted Terms — Not Found in Submission</div>
            <div className="kw-grid">
              {['Kubernetes', 'FastAPI', 'Python 3.x', 'CI/CD pipelines', 'Docker', 'Agile', 'REST APIs', 'PostgreSQL', 'Microservices', 'AWS'].map((kw) => (
                <span key={kw} className="kw-chip kw-anim">{kw}</span>
              ))}
            </div>
          </div>

          {/* Q3 */}
          <div className="question q-anim">
            <div className="q-num">QUESTION 3 — 30 POINTS</div>
            <div className="q-text">What corrections must be made before resubmission?</div>
            <div className="q-answer">
              Add technical stack keywords verbatim. Restructure experience bullets
              with quantified metrics. Add a dedicated Skills section labeled exactly
              &quot;Skills&quot; or &quot;Technical Skills.&quot;
            </div>
          </div>

          {/* Final grade */}
          <div className="final-grade">
            <div className="final-grade-label">Final Examination Score</div>
            <div className="final-grade-mark grade-mark-anim" style={{ color: 'var(--color-red-grade)' }}>
              31/100
            </div>
            <div className="final-grade-comment grade-comment-anim">
              &quot;Needs significant revision before resubmission. The content is there
              but the presentation doesn&apos;t match what the grader expects.&quot;
            </div>
          </div>

          {/* CTA */}
          <div className="paper-cta">
            <div className="paper-cta-title">Ready to retake the exam?</div>
            <p className="paper-cta-body">
              Upload your resume and get your full score in 30 seconds. No account required.
            </p>
            <Link href="/analyzer" className="paper-btn">Submit for Grading →</Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        padding: '28px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        background: 'var(--color-cover-deep)',
      }}>
        <span style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 10, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.2)' }}>
          DR4FT — AI Resume Intelligence
        </span>
        <span style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 10, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.15)' }}>
          built by Thomas Ou
        </span>
      </footer>
    </div>
  )
}
