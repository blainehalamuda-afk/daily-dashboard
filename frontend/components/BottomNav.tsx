'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { href: '/',         label: 'Home',    icon: '⬡' },
  { href: '/news',     label: 'News',    icon: '◈' },
  { href: '/markets',  label: 'Markets', icon: '◎' },
  { href: '/sports',   label: 'PL',      icon: '◉' },
  { href: '/study',    label: 'Study',   icon: '◇' },
  { href: '/ai',       label: 'AI',      icon: '◈' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-bg/90 backdrop-blur-md border-t border-border">
      <div className="max-w-2xl mx-auto px-2 h-16 flex items-center justify-around">
        {TABS.map((tab) => {
          const active = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href)
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all duration-200 ${
                active
                  ? 'text-accent'
                  : 'text-muted hover:text-zinc-400'
              }`}
            >
              <span className={`text-lg leading-none transition-transform duration-200 ${active ? 'scale-110' : ''}`}>
                {tab.icon}
              </span>
              <span className={`text-[10px] font-bold tracking-wider uppercase ${active ? 'text-accent' : ''}`}>
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
