import type { Metadata, Viewport } from 'next'
import { Libre_Baskerville, IBM_Plex_Mono, Barlow_Condensed, Caveat, Special_Elite } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'
import SmoothScroll from '@/components/SmoothScroll'
import ScrollReveal from '@/components/ScrollReveal'

const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-libre-baskerville',
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
})

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-barlow-condensed',
  display: 'swap',
})

// "Student" handwriting — used for answers, teacher's margin notes, grades
const caveat = Caveat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-caveat',
  display: 'swap',
})

// Typewriter — used for printed exam question text. Carries more ink-on-paper
// character than IBM Plex Mono; the two are paired for contrast.
const specialElite = Special_Elite({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-special-elite',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: {
    template: 'DR4FT | %s',
    default: 'DR4FT | AI Resume Optimizer',
  },
  description: 'Beat the ATS and land the interview. DR4FT uses AI and NLP to analyze resumes against real ATS systems, identify gaps, and optimize for job seekers.',
  openGraph: {
    title: 'DR4FT | AI Resume Optimizer',
    description: 'Beat the ATS and land the interview.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${libreBaskerville.variable} ${ibmPlexMono.variable} ${barlowCondensed.variable} ${caveat.variable} ${specialElite.variable}`}
    >
      <body>
        <Nav />
        <main className="w-full">{children}</main>
        <SmoothScroll />
        <ScrollReveal />
      </body>
    </html>
  )
}
