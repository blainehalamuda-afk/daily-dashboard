'use client'
import { useEffect, useState } from 'react'

export function TopBar() {
  const [date, setDate] = useState('')

  useEffect(() => {
    setDate(new Date().toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric'
    }))
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-md border-b border-border">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <span className="text-lg font-black tracking-tight text-white">
          DASH<span className="text-accent">.</span>
        </span>
        <span className="text-xs text-muted font-medium">{date}</span>
      </div>
    </header>
  )
}
