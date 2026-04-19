'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollStageRef = useRef<HTMLDivElement>(null)
  const coverRef = useRef<HTMLElement>(null)
  const page1Ref = useRef<HTMLDivElement>(null)
  const page2Ref = useRef<HTMLDivElement>(null)
  const page3Ref = useRef<HTMLDivElement>(null)
  // Shadows cast onto each page as the page above it flips
  const shadow1Ref = useRef<HTMLDivElement>(null)
  const shadow2Ref = useRef<HTMLDivElement>(null)
  const shadow3Ref = useRef<HTMLDivElement>(null)
  const shadow4Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {

      /* ── COVER: load animation ── */
      const loadTl = gsap.timeline({ delay: 0.2 })
      loadTl
        .from('.cover-tag', { opacity: 0, y: 8, duration: 0.5, ease: 'power3.out' })
        .from('.cover-word', {
          opacity: 0, y: 50, rotationX: 20,
          stagger: 0.06, duration: 0.7, ease: 'power4.out',
        }, '-=0.2')
        .from('.cover-sub', { opacity: 0, y: 16, duration: 0.5, ease: 'power3.out' }, '-=0.3')
        .from('.cover-lines-anim', { opacity: 0, y: 10, stagger: 0.04, duration: 0.3, ease: 'power3.out' }, '-=0.2')
        .from('.cover-btn', { opacity: 0, y: 16, scale: 0.95, duration: 0.5, ease: 'power3.out' }, '-=0.15')
        .from('.cover-meta span', { opacity: 0, stagger: 0.05, duration: 0.3, ease: 'power3.out' }, '-=0.15')
        .from('.cover-warning', { opacity: 0, duration: 0.4 }, '-=0.1')

      /* ── MASTER TIMELINE ──
         Every page is physically stacked under the cover from the start. Each flip
         has three phases to feel weighty and tactile:
           1) LIFT  — element tilts a few degrees and Z-translates toward the viewer
                      (like a hand grabbing the corner of the paper)
           2) SWING — main rotation around the left binding with expo.inOut ease
                      (slow grab, fast middle, slow land — the physics of a falling page)
           3) SETTLE— a tiny overshoot resolves back to rest, like paper slapping down

         A cast shadow sweeps across the page being revealed, peaking when the
         flipping page is edge-on (mid-flip) and fading out as it lies flat. */

      // Perspective lives on .book-page-frame now, so every flip just sets
      // rotationY / z on the page itself and inherits correct 3D depth.
      const FLIP_ANGLE = -180
      const LIFT_Z     = 80
      const LIFT_TILT  = -10

      const flipPage = (
        tl: gsap.core.Timeline,
        target: Element | null,
        shadowTarget: Element | null,
      ) => {
        if (!target) return
        const label = `flip_${Math.random().toString(36).slice(2, 7)}`
        tl.addLabel(label)
          // LIFT — the page's outer edge is lifted toward the viewer, about 10°
          // off the flat position and 80px forward. Feels like a hand pinching
          // the corner before turning.
          .to(target, {
            rotationY: LIFT_TILT,
            z: LIFT_Z,
            duration: 0.1,
            ease: 'power2.out',
          })
          // SWING — the main turn. power3.inOut gives a hinge feel: slow grip,
          // fast plunge through vertical, slow landing.
          .to(target, {
            rotationY: FLIP_ANGLE,
            z: 0,
            duration: 0.55,
            ease: 'power3.inOut',
          })

        // Cast shadow sweeps across the page being revealed — peaks when the
        // flipping page is edge-on (halfway), CLEARS fully before the flip
        // lands so the revealed page is never left dim.
        if (shadowTarget) {
          tl.fromTo(shadowTarget,
            { opacity: 0, xPercent: -8 },
            { opacity: 1, xPercent: 0, duration: 0.16, ease: 'power2.out' },
            `${label}+=0.08`,
          )
          tl.to(shadowTarget, {
            opacity: 0,
            xPercent: 12,
            duration: 0.18,
            ease: 'power3.in',
          }, `${label}+=0.26`)
          // Hard-reset well before the flip lands so no residue can linger.
          tl.set(shadowTarget, { opacity: 0, xPercent: 0 }, `${label}+=0.48`)
        }
      }

      const master = gsap.timeline({
        scrollTrigger: {
          trigger: scrollStageRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.35,
          invalidateOnRefresh: true,
        },
      })

      // Initial HOLD — cover sits locked in place
      master.to({}, { duration: 0.35 })
      master.to('.scroll-hint', { opacity: 0, duration: 0.08, ease: 'none' }, 0.22)

      flipPage(master, coverRef.current, shadow1Ref.current)
      master.to({}, { duration: 0.3 })
      flipPage(master, page1Ref.current, shadow2Ref.current)
      master.to({}, { duration: 0.3 })
      flipPage(master, page2Ref.current, shadow3Ref.current)
      master.to({}, { duration: 0.3 })
      flipPage(master, page3Ref.current, shadow4Ref.current)
      master.to({}, { duration: 0.25 })

      /* ── On-page micro-animations (fire when each page first comes into view) ── */

      // Bar fills on the score report (page 2)
      document.querySelectorAll<HTMLElement>('.table-bar-fill').forEach((bar) => {
        gsap.to(bar, {
          width: `${bar.dataset.w ?? 0}%`,
          duration: 1.3,
          delay: 0.2,
          ease: 'power3.out',
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const titleWords = ['Does', 'your', 'resume', 'pass', 'the']

  return (
    <div ref={containerRef}>

      {/* 3D stage — perspective container so the cover swings like a real book */}
      <div className="booklet-stage">

      {/* ONE scroll stage for the whole booklet — cover + all pages layered in
          a single sticky pin. The pages are already there, waiting underneath
          the cover; flipping the cover reveals page 1 directly. */}
      <div className="book-scroll-stage" ref={scrollStageRef}>
      <div className="book-stage-pin">
      <div className="book-page-frame">

      {/* ── BLUE COVER — sits on top of the whole stack ── */}
      <section ref={coverRef} className="cover-page">
        {/* Stitched binding along the left edge */}
        <div className="cover-spine" aria-hidden />

        <div className="cover-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, position: 'relative', zIndex: 1 }}>

          <p className="cover-tag">Examination Booklet</p>

          <h1 className="cover-title" style={{ perspective: 400, marginBottom: 4 }}>
            {titleWords.map((w, i) => (
              <span key={i} className="cover-word" style={{ display: 'inline-block', marginRight: '0.28em' }}>{w}</span>
            ))}
            <br />
            <span className="cover-word" style={{ display: 'inline-block' }}>
              <em>test?</em>
            </span>
          </h1>

          <p className="cover-sub">
            76% of resumes are automatically failed by ATS screening
            before a human ever opens the file.
          </p>

          {/* Cover writing lines — like a real blue book */}
          <div className="cover-lines">
            <div className="cover-line-field cover-lines-anim">
              <span>Name</span><div className="cover-line-blank" />
            </div>
            <div className="cover-line-field cover-lines-anim">
              <span>Course</span><div className="cover-line-blank" />
            </div>
            <div className="cover-line-field cover-lines-anim">
              <span>Date</span><div className="cover-line-blank" />
            </div>
          </div>

          <Link href="/analyzer" className="cover-btn" style={{ marginTop: 8 }}>Begin Examination →</Link>

          <div className="cover-meta">
            <span>DR4FT / Spring 2026</span>
            <span>Time: 30 seconds</span>
            <span>100 points</span>
          </div>

          <p className="cover-warning" style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.38)',
            marginTop: 8,
          }}>
            Do not open this booklet until instructed to do so
          </p>
        </div>

        <div className="scroll-hint">
          <span>Open booklet</span>
          <div className="scroll-dot" />
        </div>
      </section>
      {/* /cover-page — end of top-of-stack cover */}

          {/* ─── PAGE 1 — The problem ─── */}
          <div className="book-page page-1" ref={page1Ref}>
            <div className="book-page-reveal-shadow" ref={shadow1Ref} aria-hidden />
            <div className="book-page-inner">
              <div className="book-page-binding" />

              <div className="book-page-header">
                <div className="book-page-header-left">DR4FT · The Problem</div>
                <div className="book-page-header-right">Page 1 of 4</div>
              </div>

              <div className="book-page-content">
                <div className="product-group">
                  <div className="product-eyebrow">The Problem</div>

                  <div className="product-split">
                    <div>
                      <div className="product-stat">76<span>%</span></div>
                      <div style={{ fontFamily: 'var(--font-typewriter)', fontSize: 'clamp(10px, 0.8vw, 12px)', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(30,22,16,0.55)', marginTop: 10 }}>
                        Source: Jobscan, 2023
                      </div>
                    </div>
                    <div className="product-split-right">
                      <div className="product-stat-sub">
                        of resumes are filtered by <em style={{ fontStyle: 'italic' }}>applicant tracking systems</em> before a human reads them.
                      </div>
                      <div className="product-body">
                        Every Fortune 500 company runs your file through a keyword-matching,
                        format-checking algorithm first. If it fails the machine, it never
                        reaches a recruiter.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="product-group">
                  <div className="product-sub-label">Why resumes get rejected</div>
                  <ul className="product-bullets">
                    <li>Keywords don&apos;t match the job posting verbatim</li>
                    <li>Non-standard or stylized section headings</li>
                    <li>Tables, columns, and images the parser can&apos;t read</li>
                    <li>PDFs that are actually scanned images</li>
                    <li>Vague bullets with no measurable impact</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* ─── PAGE 2 — How it works ─── */}
          <div className="book-page page-2" ref={page2Ref}>
            <div className="book-page-reveal-shadow" ref={shadow2Ref} aria-hidden />
            <div className="book-page-inner">
              <div className="book-page-binding" />

              <div className="book-page-header">
                <div className="book-page-header-left">DR4FT · How It Works</div>
                <div className="book-page-header-right">Page 2 of 4</div>
              </div>

              <div className="book-page-content">
                <div className="product-group">
                  <div className="product-eyebrow">How It Works</div>

                  <h2 className="product-headline">
                    Your resume,<br />graded in 30 seconds.
                  </h2>
                </div>

                <ol className="product-steps">
                  <li>
                    <div className="product-step-title">Upload your resume</div>
                    <div className="product-step-body">
                      PDF or DOCX. Drag-and-drop, or paste a Google Docs link.
                      Paste the job posting alongside it so we know what to grade against.
                    </div>
                  </li>
                  <li>
                    <div className="product-step-title">Get graded on four criteria</div>
                    <div className="product-step-body">
                      ATS compatibility, keyword match, format compliance, and section
                      coverage — scored out of 100 with a per-criterion breakdown.
                    </div>
                  </li>
                  <li>
                    <div className="product-step-title">Fix it in red pen</div>
                    <div className="product-step-body">
                      Specific missing keywords. Bullet-by-bullet rewrites with
                      measurable impact. Format corrections with exact before/after.
                    </div>
                  </li>
                </ol>

                <div className="product-group">
                  <div className="product-sub-label">Supports</div>
                  <div className="product-supports">
                    <strong>PDF</strong> · <strong>DOCX</strong> · <strong>Google Docs</strong> · <strong>LinkedIn URL</strong> · <strong>Paste text</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── PAGE 3 — What we grade (the rubric) ─── */}
          <div className="book-page page-3" ref={page3Ref}>
            <div className="book-page-reveal-shadow" ref={shadow3Ref} aria-hidden />
            <div className="book-page-inner">
              <div className="book-page-binding" />

              <div className="book-page-header">
                <div className="book-page-header-left">DR4FT · The Rubric</div>
                <div className="book-page-header-right">Page 3 of 4</div>
              </div>

              <div className="book-page-content">
                <div className="product-group">
                  <div className="product-eyebrow">The Rubric</div>

                  <h2 className="product-headline">
                    Graded on four criteria.
                  </h2>
                </div>

                <div className="product-rubric-table">
                  <div className="product-rubric-row">
                    <div className="product-rubric-row-main">
                      <div className="product-rubric-row-title">ATS Compatibility</div>
                      <div className="product-rubric-row-body">
                        Can the parser actually read your file?
                      </div>
                    </div>
                    <div className="product-rubric-row-weight">40<small>pts</small></div>
                  </div>

                  <div className="product-rubric-row">
                    <div className="product-rubric-row-main">
                      <div className="product-rubric-row-title">Keyword Match</div>
                      <div className="product-rubric-row-body">
                        Do your exact words match the posting?
                      </div>
                    </div>
                    <div className="product-rubric-row-weight">30<small>pts</small></div>
                  </div>

                  <div className="product-rubric-row">
                    <div className="product-rubric-row-main">
                      <div className="product-rubric-row-title">Format Compliance</div>
                      <div className="product-rubric-row-body">
                        Standard headings, clean hierarchy, one column.
                      </div>
                    </div>
                    <div className="product-rubric-row-weight">20<small>pts</small></div>
                  </div>

                  <div className="product-rubric-row">
                    <div className="product-rubric-row-main">
                      <div className="product-rubric-row-title">Section Coverage</div>
                      <div className="product-rubric-row-body">
                        Summary, Experience, Skills, Education — all present.
                      </div>
                    </div>
                    <div className="product-rubric-row-weight">10<small>pts</small></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── PAGE 4 — Final CTA ─── */}
          <div className="book-page page-4">
            <div className="book-page-reveal-shadow" ref={shadow4Ref} aria-hidden />
            <div className="book-page-inner">
              <div className="book-page-binding" />

              <div className="book-page-header">
                <div className="book-page-header-left">DR4FT · Submit</div>
                <div className="book-page-header-right">Page 4 of 4</div>
              </div>

              <div className="book-page-content" style={{ justifyContent: 'center' }}>
                <div className="product-eyebrow">Ready?</div>

                <h2 className="product-headline" style={{ fontSize: 'clamp(30px, 3.6vw, 50px)' }}>
                  Stop getting filtered.<br />
                  <span style={{ color: 'var(--color-ink-red)' }}>Start getting interviews.</span>
                </h2>

                <div className="product-body">
                  Upload your resume. Get your full grade in 30 seconds.
                  Then fix exactly what&apos;s broken — and apply with confidence.
                </div>

                <Link href="/analyzer" className="product-cta">
                  Grade my resume →
                </Link>

                <div className="product-cta-fine">
                  Free · No account · PDF or DOCX
                </div>

                <div className="product-sub-label">What&apos;s included</div>
                <div className="product-trust">
                  <span>Works with every major ATS</span>
                  <span>50+ role templates</span>
                  <span>AI-powered rewrites</span>
                  <span>Your data stays yours</span>
                </div>
              </div>
            </div>
          </div>

      </div>
      {/* /book-page-frame */}
      </div>
      {/* /book-stage-pin */}
      </div>
      {/* /book-scroll-stage */}

      </div>
      {/* /booklet-stage */}
    </div>
  )
}
