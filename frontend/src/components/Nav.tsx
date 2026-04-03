'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from '@/components/Logo'

const NAV_ITEMS = [
  { label: 'Analyze', href: '/analyzer' },
  { label: 'Build', href: '/builder' },
  { label: 'Jobs', href: '/jobs' },
  { label: 'About', href: '/about' },
]

export default function Nav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b border-border-subtle animate-nav"
      style={{
        background: 'rgba(8, 10, 16, 0.8)',
        backdropFilter: 'blur(24px) saturate(1.2)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.2)',
      }}
    >
      <div className="px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo size={20} />
          <div className="flex flex-col leading-none">
            <span className="font-display text-[15px] sm:text-[17px] font-bold tracking-[0.25em] text-text-primary uppercase">DR4FT</span>
            <span className="mt-0.5 text-[9px] font-medium tracking-[0.05em] text-text-muted">by Thomas Ou</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  font-display text-[10px] tracking-[0.22em] uppercase transition-colors duration-300 py-2
                  ${isActive ? 'text-text-primary underline underline-offset-4 decoration-1' : 'text-text-muted hover:text-text-secondary'}
                `}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 -mr-2"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-primary">
            {open ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border-subtle px-4 py-4 space-y-1"
          style={{ background: 'rgba(8, 10, 16, 0.95)', backdropFilter: 'blur(24px)' }}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`
                  block font-display text-xs tracking-[0.22em] uppercase py-3 transition-colors duration-200
                  ${isActive ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary'}
                `}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      )}
    </nav>
  )
}
