import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'

export const metadata: Metadata = {
  title: 'DR4FT | AI Resume Optimizer',
  description: 'AI-powered resume optimization and analysis tool',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg-dark">
        <Nav />
        <main className="max-w-6xl mx-auto px-6 pt-28 pb-20">
          {children}
        </main>
      </body>
    </html>
  )
}
