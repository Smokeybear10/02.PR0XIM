'use client'

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

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b border-border-subtle animate-nav"
      style={{
        background: 'rgba(8, 10, 16, 0.8)',
        backdropFilter: 'blur(24px) saturate(1.2)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.2)',
      }}
    >
      <div className="px-10 h-10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo size={20} />
          <span className="font-display text-xs font-semibold tracking-[0.2em] text-text-primary uppercase">DR4FT</span>
        </Link>

        <div className="flex items-center gap-7">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  nav-link font-display text-[10px] tracking-[0.22em] uppercase transition-colors duration-300
                  ${isActive ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary'}
                `}
              >
                {item.label}
                {isActive && <span className="nav-dot" />}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
