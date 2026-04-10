# DR4FT | AI Resume Optimizer

**Live demo: [proj-dr4ft.vercel.app](https://proj-dr4ft.vercel.app/)**

Beat the ATS. Land the interview. DR4FT analyzes resumes against real applicant tracking systems using NLP and Google Gemini, surfaces skill gaps, scores formatting, and generates optimized resumes from scratch.

## Quick Start

### Prerequisites
- Node.js 18+ and Python 3.10+
- Google Gemini API key

### Backend
```bash
pip install -r requirements.txt
```

Create a `.env` in the project root:
```
GOOGLE_API_KEY=your_key_here
```

```bash
cd backend && uvicorn main:app --reload --port 3200
```

### Frontend
```bash
cd frontend && npm install && npm run dev
```

Open `http://localhost:2200`

## What It Does

**Analyzer** — Upload a PDF or DOCX resume, select a target job category and role. Two analysis modes:
- **Standard**: NLP-based scoring across ATS compatibility, keyword matching, formatting, and section structure. Returns per-section scores and actionable suggestions.
- **AI**: Sends resume text to Google Gemini for deep evaluation — overall quality, strengths, weaknesses, ATS score, and skill gaps.

**Builder** — Guided form to construct a resume from scratch. Personal info, summary, work experience, education, projects, skills. Five templates: Modern, Classic, Minimal, Technical, Executive.

**Jobs** — Multi-portal aggregation across LinkedIn, Indeed, Naukri, Foundit, FreshersWorld, TimesJobs, and Instahyre. Auto-detects your location. Returns direct search links with market insights on trending skills, top locations, and salary ranges.

**About** — Tech stack, capabilities, and course syllabus style overview.

## Tech Stack

| Layer | Tools |
|-------|-------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| Motion | Lenis smooth scroll + GSAP ScrollTrigger |
| Backend | Python, FastAPI, Pydantic |
| AI / NLP | Google Gemini (gemini-1.5-flash), NLTK, scikit-learn, spaCy |
| PDF / Doc | pdfplumber, pypdf, PyPDF2, python-docx, reportlab |
| Database | SQLite via SQLAlchemy |
| Design | Blue Book exam booklet — Libre Baskerville, IBM Plex Mono, Barlow Condensed |

## Project Structure

```
DR4FT/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx              # Blue cover + exam paper landing
│   │   │   ├── layout.tsx            # Root layout, fonts, nav
│   │   │   ├── globals.css           # Blue Book design system
│   │   │   ├── analyzer/             # Submit your paper for grading
│   │   │   ├── builder/              # Draft your resume
│   │   │   ├── jobs/                 # Job board
│   │   │   └── about/                # Course syllabus
│   │   ├── components/
│   │   │   ├── Nav.tsx               # Scroll-revealed top nav
│   │   │   ├── SmoothScroll.tsx      # Lenis scroll initialization
│   │   │   ├── ScrollReveal.tsx      # GSAP ScrollTrigger animations
│   │   │   └── booklet/              # Exam booklet UI primitives
│   │   │       ├── ExamCard.tsx      # Paper-inside-paper card
│   │   │       ├── ExamButton.tsx    # Dark blue / outline button
│   │   │       ├── ExamInput.tsx     # Fill-in-the-blank input
│   │   │       ├── GradeDisplay.tsx  # Score + pass/fail stamp
│   │   │       └── PaperUpload.tsx   # Submit-your-paper drop zone
│   │   └── lib/
│   │       └── api.ts                # Typed API client
│   └── package.json
├── backend/
│   ├── main.py                       # FastAPI app + CORS + router registration
│   ├── routers/
│   │   ├── analyze.py                # /api/analyze, /api/analyze/ai, /api/roles
│   │   ├── jobs.py                   # /api/jobs/search, /companies, /insights
│   │   ├── feedback.py               # /api/feedback
│   │   ├── dashboard.py              # /api/dashboard/metrics, /skills, /trends
│   │   └── auth.py                   # /api/auth/login, /logout
│   ├── services/
│   │   ├── analyzer.py               # NLP resume analyzer
│   │   ├── ai_analyzer.py            # Gemini-powered analysis
│   │   └── resume_builder.py         # Template-based resume generation
│   ├── models/
│   │   └── schemas.py                # Pydantic request/response models
│   └── config/
│       ├── database.py               # SQLite init + query helpers
│       └── job_roles.py              # 50+ role definitions with required skills
├── requirements.txt
├── Dockerfile
└── DESIGN.md                         # Blue Book design system specification
```

## Design

Blue Book exam booklet. Dark blue cover page (the booklet exterior) transitions into a cream-colored paper interior with ruled lines, red margin annotations, a staple mark, and page numbers. Scores are graded out of 100 with PASS/FAIL stamps. Missing keywords are highlighted in yellow. Your resume IS the exam, and DR4FT is the grader.

Typography: Libre Baskerville (display), IBM Plex Mono (data/labels), Barlow Condensed (buttons/nav). Motion: Lenis smooth scroll + GSAP ScrollTrigger for the pinned cover reveal and paper slide-up. Full spec in `DESIGN.md`.

## API

All endpoints prefixed with `/api`. Backend runs on port 3200, frontend on 2200.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analyze` | Standard NLP resume analysis |
| POST | `/api/analyze/ai` | Gemini-powered AI analysis |
| GET | `/api/roles` | All job categories and roles |
| POST | `/api/jobs/search` | Multi-portal job search |
| GET | `/api/jobs/insights` | Market trends and salary data |
| GET | `/api/dashboard/metrics` | Resume submission analytics |

---

Built by Thomas Ou
