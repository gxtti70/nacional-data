'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'
import { SECTIONS } from '@/lib/sections'

export default function TopNav() {
  const path = usePathname()
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-bg">
      <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="shrink-0 whitespace-nowrap font-display text-xl font-bold">
            Atlético <span className="text-primary">Nacional</span>
          </Link>
          <ThemeToggle />
        </div>
        <nav aria-label="Secciones" className="mt-2 flex flex-wrap items-center gap-x-1 border-t border-line pt-1">
          {SECTIONS.map((s) => {
            const active = path === s.href || path.startsWith(s.href + '/')
            return (
              <Link
                key={s.href}
                href={s.href}
                aria-current={active ? 'page' : undefined}
                className={`whitespace-nowrap border-b-2 px-3 py-1.5 text-sm ${active ? 'border-primary text-ink' : 'border-transparent text-mute hover:text-ink'}`}
              >
                <span className="mr-1.5 font-num text-[15px] font-extrabold text-primary" aria-hidden="true">{s.n}</span>
                {s.label.split(' ')[0]}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
