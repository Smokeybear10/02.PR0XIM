import type { Metadata, Viewport } from 'next'
import { Oswald, Barlow } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-oswald',
  display: 'swap',
})

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-barlow',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'DR4FT | AI Resume Optimizer',
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
    <html lang="en" className={`${oswald.variable} ${barlow.variable}`}>
      <body className="min-h-screen bg-bg-dark">
        <Nav />
        <main className="max-w-6xl mx-auto px-6 pt-20 pb-20">
          {children}
        </main>
      </body>
    </html>
  )
}
