# Design System - DR4FT

## Product Context
- **What this is:** AI-powered resume optimization tool with ATS analysis, keyword targeting, job search, and resume building
- **Who it's for:** Job seekers optimizing resumes to beat ATS systems and land interviews
- **Space/industry:** Career tech, resume builders
- **Project type:** Next.js web app with FastAPI backend

## Aesthetic Direction
- **Direction:** Academic Brutalist — editorial serif meets raw data, research paper meets career tool
- **Decoration level:** Zero ornament. Structure IS the decoration. Paper grain for texture.
- **Mood:** Scholarly confidence. Like a well-typeset research paper with the scroll experience of igloo.inc. Instrument Serif headlines give it editorial weight. Barlow Condensed labels keep it functional. JetBrains Mono data keeps it precise.
- **References:** R1VER (Lenis + GSAP scroll, Instrument Serif), PAINT (paper grain, editorial serif), pudding.cool (data narrative)
- **Departures from category:**
  1. Cream base (#F5F0EB) instead of dark mode — most career tools are dark, this stands out
  2. Thick 2px border grid instead of cards — borders define sections, not shadows
  3. Instrument Serif for display — academic editorial, not the typical tech sans-serif
  4. Numbered sections (01, 02, 03) like journal chapters
  5. Paper grain overlay for physical texture
  6. Lenis smooth scroll + GSAP ScrollTrigger for cinematic pacing
  7. No rounded corners anywhere — everything is 0px radius

## Typography
- **Display/Hero:** Instrument Serif (serif), weight 400, italic for emphasis
  - Hero: clamp(72px, 10vw, 140px), line-height 1.05
  - Section headers: clamp(40px, 5vw, 68px)
- **Labels:** Barlow Condensed, weight 600-700, 11px, letter-spacing 0.28em, uppercase
- **Body:** Barlow, weight 400, 15-17px, line-height 1.8
- **Data/Numbers:** JetBrains Mono, weight 400, 11px, letter-spacing 0.05em
- **Stat numbers:** Barlow Condensed 900, clamp(60px, 7vw, 88px)
- **Score numbers:** Barlow Condensed 900, 72px
- **Loading:** Google Fonts — Instrument Serif (400, italic) + Barlow Condensed (400-900) + Barlow (300-600) + JetBrains Mono (400,500)

## Color
- **Base:** `--cream: #F5F0EB` — warm off-white page background
- **Deep cream:** `--cream-deep: #EDE8E2` — slightly darker variant for hover states
- **Ink:** `--ink: #0D0D0B` — near-black for text and borders
- **Saffron:** `--saffron: #E8971A` — primary accent, hero title highlight, CTA hover
- **Danger:** `--danger: #C9321F` — low scores, missing keywords
- **Success:** `--success: #1B6B3A` — high scores, file uploaded
- **Text hierarchy:**
  - Primary: `#0D0D0B` (ink)
  - Secondary: `rgba(13, 13, 11, 0.55)`
  - Labels: `rgba(13, 13, 11, 0.4)`
  - Muted: `rgba(13, 13, 11, 0.25)`
- **Light mode only.** No dark mode variant.
- **Score tiers:** danger (< 50%) | mid (50-74%) | good (≥ 75%)

## Spacing
- **Base unit:** 4px
- **Nav height:** 60px (CSS var: `--nav-height`)
- **Page content:** `max-width: 1100px`, `padding: nav+48px 48px 80px`
- **Card padding:** 28px
- **Section padding:** 64-96px (hero), 80px (content sections)
- **Form field gap:** 24px

## Layout
- **Navigation:** Fixed top bar, 60px, 2px border-bottom solid ink. Brand left (bordered right), links right, CTA far right (ink bg, saffron hover). No blur.
- **Grid:** CSS grid with 2px border lines as design element
- **Border radius:** 0 everywhere
- **Max content width:** 1100px for tool pages, 1200-1400px for home sections
- **Hero:** 2-column grid (55/45) — headline left, stats right, all divided by 2px borders

## Motion
- **Smooth scroll:** Lenis (duration 1.2, exponential easing) — handles all scroll behavior
- **Scroll engine:** GSAP ScrollTrigger — drives all scroll-triggered animations
- **Page-load:** `loadUp` / `loadRight` with stagger classes `.load-1` through `.load-5`
- **Scroll reveal:** GSAP `gsap.from()` with ScrollTrigger. `data-animate="up|left|right|scale|counter"` + `data-delay="N"`. Easing: `power3.out`, duration: 0.8-0.9s
- **Counters:** `data-animate="counter" data-count="N"` — GSAP tween from 0 to N on scroll enter
- **Score bars:** `.score-bar-fill[data-bar="N"]` — GSAP width tween, 1.4s power3.out
- **Hero parallax:** stat blocks drift upward at different rates during scroll (scrub: 0.6)
- **CTA entrance:** left content slides from -60x, right from +60x on scroll enter
- **Hover:** `transition: background 0.15s` on interactive elements
- **Easing:** `cubic-bezier(0.22, 1, 0.36, 1)` for load, `power3.out` for scroll

## UI Patterns
- **Brut card:** `background: #FAF7F2, border: 1px solid rgba(13,13,11,0.12), padding: 28px`. Title as `.brut-card-title`. Hover: background darkens slightly.
- **Brut button (filled):** `background: #0D0D0B, border: 2px solid #0D0D0B, color: cream`. Hover: saffron bg + ink text.
- **Brut button (outline):** `background: transparent, border: 2px solid rgba(13,13,11,0.3)`. Hover: full border opacity + subtle bg.
- **Brut input:** `border-bottom: 2px solid rgba(13,13,11,0.15)` only, no other borders. Focus: ink color.
- **Brut select:** Same as input + custom chevron SVG.
- **Score display:** Label (label-caps) → big number (72px, colored) → 3px bar track + animated fill.
- **Tags:** `border: 2px solid` + Barlow Condensed 700 12px uppercase. Danger variant: red border/text.
- **Upload zone:** `border: 2px dashed` — solid when file present (success color).
- **Page headers:** `border-bottom: 2px solid ink`, kicker label + big stacked title.
- **Tabs:** `border-bottom: 3px solid` active indicator on a 2px base line.

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-01 | Terminal Mode selected | User chose after reviewing 3 options. |
| 2026-04-02 | Terminal Mode rejected | User said "I don't like the terminal design." |
| 2026-04-02 | Monogram Minimal selected | User chose Option A (V3RSUS-inspired) from 3 new design options. |
| 2026-04-02 | Full frontend rebuild | All pages, components, and CSS rebuilt with Monogram Minimal. |
| 2026-04-02 | Renamed to DR4FT | Product renamed from SmartCV to DR4FT. |
| 2026-04-09 | Warm Brutalist selected | User chose Option C from /design-shotgun. Complete rebuild — discard Monogram Minimal. |
| 2026-04-09 | Scroll animations added | Lenis smooth scroll + GSAP ScrollTrigger. Same stack as R1VER. |
| 2026-04-09 | Academic editorial direction | Instrument Serif display, JetBrains Mono data, paper grain, numbered sections. |
| 2026-04-09 | Light mode palette | Cream base — deliberate break from dark-mode-heavy category. |
