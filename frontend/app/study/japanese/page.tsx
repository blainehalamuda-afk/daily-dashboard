import { getDailyData } from '@/lib/data'
import Link from 'next/link'
import { FlipCard } from '@/components/FlipCard'

export const revalidate = 21600

export default async function JapanesePage() {
  const data = await getDailyData()
  const jp = data?.ai?.japanese

  return (
    <div className="space-y-8 animate-fade-in">

      <section className="pt-4">
        <p className="section-label mb-1">毎日の日本語</p>
        <h1 className="text-3xl font-black tracking-tight text-white">Japanese</h1>
      </section>

      {/* Sub-nav */}
      <div className="flex gap-2">
        <Link href="/study" className="flex-1 text-center py-2.5 rounded-xl bg-card border border-border text-muted text-xs font-bold uppercase tracking-widest hover:border-accent/50 transition-colors">CFA / FRM</Link>
        <span className="flex-1 text-center py-2.5 rounded-xl bg-accent text-black text-xs font-black uppercase tracking-widest">Japanese</span>
      </div>

      {!jp ? (
        <div className="card-base text-center py-10 text-muted">Lesson not yet generated.</div>
      ) : (
        <>
          {/* Today's Word */}
          <section>
            <div className="flex items-center gap-3 mb-3">
              <span className="accent-tag">Today&apos;s Word</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="card-base space-y-3">
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-black text-accent">{jp.word}</span>
                <span className="text-muted text-sm italic">{jp.reading}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-white">{jp.meaning}</span>
                <span className="text-xs text-muted border border-border px-2 py-0.5 rounded-full">{jp.part_of_speech}</span>
              </div>
            </div>
          </section>

          {/* Flip Card Practice */}
          <section>
            <div className="flex items-center gap-3 mb-3">
              <span className="section-label">Flip Card</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <FlipCard
              front={jp.word}
              frontSub={jp.reading}
              back={jp.meaning}
              backSub={jp.part_of_speech}
            />
          </section>

          {/* Example sentence */}
          <section>
            <div className="flex items-center gap-3 mb-3">
              <span className="section-label">Example Sentence</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="card-base border-l-2 border-accent space-y-1">
              <p className="text-lg font-bold text-white">{jp.example_jp}</p>
              <p className="text-sm text-muted italic">{jp.example_romaji}</p>
              <p className="text-sm text-zinc-400">{jp.example_en}</p>
            </div>
          </section>

          {/* Grammar Point */}
          <section>
            <div className="flex items-center gap-3 mb-3">
              <span className="accent-tag">Grammar</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="card-base bg-orange-950/20 border-orange-900/40 space-y-2">
              <p className="text-accent font-bold">{jp.grammar_point}</p>
              <p className="text-zinc-300 text-sm leading-relaxed">{jp.grammar_explanation}</p>
            </div>
          </section>

          {/* Memory tip */}
          <section>
            <div className="card-base border border-dashed border-border">
              <p className="text-xs font-bold text-yellow-400 mb-1 uppercase tracking-widest">Memory Tip</p>
              <p className="text-zinc-300 text-sm">{jp.memory_tip}</p>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
