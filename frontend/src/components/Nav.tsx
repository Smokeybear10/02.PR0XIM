'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { label: 'Build', href: '/builder' },
  { label: 'Jobs', href: '/jobs' },
  { label: 'About', href: '/about' },
]

export default function Nav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false)

  const isHome = pathname === '/'

  useEffect(() => {
    if (!isHome) {
      setVisible(true)
      return
    }

    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.85)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  return (
    <nav
      className="exam-nav"
      aria-label="Main navigation"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1), transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      <Link href="/" className="exam-nav-brand">DR4FT</Link>

      <ul className="exam-nav-links hidden md:flex">
        {NAV_ITEMS.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`exam-nav-link ${pathname === item.href ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          </li>
        ))}
        <li>
          <Link href="/analyzer" className="exam-nav-cta">Begin Exam</Link>
        </li>
      </ul>

      <button
        onClick={() => setOpen(!open)}
        className="md:hidden ml-auto flex items-center px-4"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        style={{ color: 'white' }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {open ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
        </svg>
      </button>

      {open && (
        <div className="md:hidden absolute top-full left-0 right-0 border-b" style={{ background: '#0F2847', borderColor: 'rgba(255,255,255,0.08)' }}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block py-3 px-6"
              style={{
                fontFamily: 'var(--font-ibm-plex-mono)',
                fontSize: 12,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: pathname === item.href ? 'white' : 'rgba(255,255,255,0.4)',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
