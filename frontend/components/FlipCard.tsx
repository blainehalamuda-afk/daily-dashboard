'use client'
import { useState } from 'react'

interface FlipCardProps {
  front: string
  frontSub?: string
  back: string
  backSub?: string
}

export function FlipCard({ front, frontSub, back, backSub }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div
      className={`flip-card h-48 cursor-pointer select-none ${flipped ? 'flipped' : ''}`}
      onClick={() => setFlipped(!flipped)}
    >
      <div className="flip-card-inner w-full h-full">
        {/* Front */}
        <div className="flip-card-front absolute inset-0 rounded-2xl bg-card border border-border flex flex-col items-center justify-center gap-2">
          <p className="text-5xl font-black text-accent">{front}</p>
          {frontSub && <p className="text-muted text-sm italic">{frontSub}</p>}
          <p className="text-xs text-dim mt-2 uppercase tracking-widest">Tap to flip</p>
        </div>
        {/* Back */}
        <div className="flip-card-back absolute inset-0 rounded-2xl bg-accent/10 border border-accent/40 flex flex-col items-center justify-center gap-2">
          <p className="text-3xl font-black text-white">{back}</p>
          {backSub && <p className="text-sm text-muted border border-border px-2 py-0.5 rounded-full">{backSub}</p>}
          <p className="text-xs text-dim mt-2 uppercase tracking-widest">Tap to flip back</p>
        </div>
      </div>
    </div>
  )
}
