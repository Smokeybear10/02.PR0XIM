'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { label: 'Analyze', href: '/analyzer' },
  { label: 'Build', href: '/builder' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Jobs', href: '/jobs' },
  { label: 'About', href: '/about' },
]

export default function Nav() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border-subtle" style={{ background: 'rgba(8, 10, 16, 0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-display text-lg font-semibold tracking-wider text-text-primary uppercase">
          DR4FT
        </Link>

        <div className="flex items-center gap-8">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  font-display text-xs tracking-[0.2em] uppercase transition-colors duration-200
                  ${isActive ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary'}
                `}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
