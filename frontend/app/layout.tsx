import type { Metadata, Viewport } from 'next'
import './globals.css'
import { BottomNav } from '@/components/BottomNav'
import { TopBar } from '@/components/TopBar'

export const metadata: Metadata = {
  title: 'Daily Dashboard',
  description: 'Your personal intelligence briefing — markets, news, Premier League, CFA/FRM, Japanese, AI & Strategy.',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Dashboard' },
}

export const viewport: Viewport = {
  themeColor: '#09090b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-bg text-zinc-100">
        <TopBar />
        <main className="max-w-2xl mx-auto px-4 pt-16 pb-24">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  )
}
