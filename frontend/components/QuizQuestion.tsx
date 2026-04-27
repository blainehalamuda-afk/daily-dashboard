'use client'
import { useState } from 'react'
import type { CfaFrm } from '@/lib/data'

export function QuizQuestion({ question }: { question: CfaFrm }) {
  const [selected, setSelected] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)

  const handleSelect = (letter: string) => {
    if (revealed) return
    setSelected(letter)
  }

  return (
    <div className="card-base space-y-4">
      {/* Question */}
      <p className="text-white font-semibold leading-relaxed text-sm">{question.question}</p>

      {/* Options */}
      <div className="space-y-2">
        {Object.entries(question.options).map(([letter, text]) => {
          let style = 'border-border text-zinc-300'
          if (revealed) {
            if (letter === question.correct) style = 'border-green-500 bg-green-500/10 text-green-400'
            else if (letter === selected) style = 'border-red-500 bg-red-500/10 text-red-400'
            else style = 'border-border text-dim'
          } else if (selected === letter) {
            style = 'border-accent bg-accent/10 text-accent'
          }

          return (
            <button
              key={letter}
              onClick={() => handleSelect(letter)}
              disabled={revealed}
              className={`w-full text-left flex gap-3 items-start p-3 rounded-xl border transition-all duration-200 text-sm ${style} ${!revealed ? 'hover:border-accent/50 cursor-pointer' : 'cursor-default'}`}
            >
              <span className="font-black flex-shrink-0">{letter}.</span>
              <span className="leading-relaxed">{text}</span>
            </button>
          )
        })}
      </div>

      {/* Reveal button */}
      {!revealed && selected && (
        <button
          onClick={() => setRevealed(true)}
          className="w-full py-2.5 rounded-xl bg-accent text-black text-sm font-black uppercase tracking-widest hover:bg-orange-400 transition-colors"
        >
          Reveal Answer
        </button>
      )}

      {/* Explanation */}
      {revealed && (
        <div className="border-t border-border pt-4 space-y-2 animate-slide-up">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
              Correct: {question.correct}
            </span>
            {selected === question.correct ? (
              <span className="text-xs text-green-400">You got it right!</span>
            ) : (
              <span className="text-xs text-red-400">You selected {selected}</span>
            )}
          </div>
          <p className="text-zinc-300 text-sm leading-relaxed">{question.explanation}</p>
        </div>
      )}
    </div>
  )
}
