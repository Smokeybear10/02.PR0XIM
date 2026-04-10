import type { Metadata, Viewport } from 'next'
import { Libre_Baskerville, IBM_Plex_Mono, Barlow_Condensed } from 'next/font/google'
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
      className={`${libreBaskerville.variable} ${ibmPlexMono.variable} ${barlowCondensed.variable}`}
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
