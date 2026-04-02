# Design System - DR4FT

## Product Context
- **What this is:** AI-powered resume optimization tool with ATS analysis, keyword targeting, and resume building
- **Who it's for:** Job seekers optimizing resumes to beat ATS systems and land interviews
- **Space/industry:** Career tech, resume builders
- **Project type:** Streamlit web app with custom CSS theming

## Aesthetic Direction
- **Direction:** Terminal Mode -- a monochrome green-on-black interface that feels like a command-line tool with a GUI skin
- **Decoration level:** Zero -- no shadows, no gradients, no rounded corners, no transforms
- **Mood:** Utilitarian, precise, no-nonsense. Like an operator's console. Green phosphor on black glass.
- **Deliberate departures from category:**
  1. Single monospace font (JetBrains Mono) for everything
  2. Monochrome green (#33FF33) on black (#0A0A0A) -- no other chromatic colors
  3. 0px border-radius everywhere -- sharp edges only
  4. No emojis anywhere in the UI

## Typography
- **Everything:** JetBrains Mono (monospace) -- one font for all purposes
  - Display/Hero: 48px, weight 700, line-height 1.1
  - H1: 28px, weight 600, line-height 1.2
  - H2: 22px, weight 500, line-height 1.2
  - Body: 15px, weight 400, line-height 1.6
  - Small: 13-14px, weight 400
  - Labels: 12px, weight 500, uppercase, letter-spacing 1px
  - Section labels: 11px, weight 500, uppercase, letter-spacing 3px
  - Large readout (ATS score): 72-96px, weight 700
- **Loading:** `@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap')`

## Color
- **Approach:** Monochrome green on black. #33FF33 is the ONLY chromatic color. Everything else is shades of black/dark green.
- **Backgrounds:**
  - `--bg-base: #0A0A0A` -- app background
  - `--bg-surface: #111111` -- cards, panels, sidebar
  - `--bg-raised: #1A1A1A` -- elevated elements, dropdowns, modals
  - `--bg-overlay: #0D1F0D` -- popovers, tooltips, pro-tip boxes
- **Text:**
  - `--text-primary: #33FF33` -- bright green, all primary text and headings
  - `--text-secondary: #22AA22` -- medium green, secondary info
  - `--text-tertiary: #116611` -- dim green, placeholders, labels, dividers
- **Accent:** `--accent: #33FF33` -- the ONE color
  - `--accent-dim: #0D1F0D` -- hover states, active backgrounds
- **Semantic:**
  - All semantic states (success, warning, error, info) use `#33FF33` -- no traffic-light colors
- **Borders:**
  - `--border-subtle: #1A2E1A`
  - `--border-default: #1E3A1E`
  - `--border-strong: #2A4A2A`
- **Dark mode only.** No light mode variant.

## Spacing
- **Base unit:** 4px
- **Density:** Comfortable -- generous whitespace
- **Card padding:** 24px
- **Section gaps:** 24-32px
- **Line-height:** body 1.6, headings 1.1-1.2

## Layout
- **Border radius:** 0px on everything. Sharp corners only. Exception: 50% on avatar images only.
- **Grid:** Single column main content, sidebar (Streamlit default)
- **Max content width:** 1200px

## Motion
- **Approach:** None. No transitions, no transforms, no animations.
- **Hover:** Border-color change only (subtle to default, or default to accent).
- **Forbidden:** No bounce. No spring. No pulse. No fades. No translateY. No translateX. No scale. No box-shadow transitions.

## UI Patterns
- **Labels:** JetBrains Mono 12px, uppercase, letter-spacing 1px, tertiary color
- **Section labels:** JetBrains Mono 11px, uppercase, letter-spacing 3px, border-bottom with --border-default
- **Section prefixes:** Use `//` prefix for section headers (e.g., "// ADMIN TOOLS", "// SEARCH RESULTS")
- **Nav labels:** Use `>` prefix for terminal-style navigation
- **Buttons:** Primary = #33FF33 bg + #0A0A0A text. Secondary = transparent + #1E3A1E border + #33FF33 text. Ghost = #22AA22 text only.
- **Score readout:** Large JetBrains Mono numerals (72-96px) in #33FF33.
- **Data display:** JetBrains Mono, tabular-nums, #22AA22 for values, #33FF33 for primary metric only
- **No emojis:** Use text symbols instead: `[ok]`, `[err]`, `[!]`, `[i]`, `>`, `*`
- **No gradients:** Solid backgrounds only
- **No box-shadows:** Borders define edges

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-01 | Terminal Mode selected | User chose after reviewing 3 options (Industrial Editorial, Manuscript, Terminal Mode). |
| 2026-04-01 | #33FF33 as sole chromatic color | Green-on-black terminal aesthetic. Single color constraint. |
| 2026-04-01 | JetBrains Mono as sole font | Monospace everywhere reinforces the terminal feel. |
| 2026-04-02 | Briefly switched to Manuscript | User tried it, decided it "looks really bad", switched back to Terminal Mode. |
| 2026-04-02 | Terminal Mode full revamp | Complete frontend + backend conversion to Terminal Mode with 0px radius, no emojis, no gradients. |
