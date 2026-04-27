import { getDailyData } from '@/lib/data'
import Link from 'next/link'
import { QuizQuestion } from '@/components/QuizQuestion'

export const revalidate = 21600

export default async function StudyPage() {
  const data = await getDailyData()
  const q = data?.ai?.cfa_frm
  const ft = data?.ai?.finance_topic

  return (
    <div className="space-y-8 animate-fade-in">

      <section className="pt-4">
        <p className="section-label mb-1">Learn Every Day</p>
        <h1 className="text-3xl font-black tracking-tight text-white">Study</h1>
      </section>

      {/* Sub-nav */}
      <div className="flex gap-2">
        <span className="flex-1 text-center py-2.5 rounded-xl bg-accent text-black text-xs font-black uppercase tracking-widest">CFA / FRM</span>
        <Link href="/study/japanese" className="flex-1 text-center py-2.5 rounded-xl bg-card border border-border text-muted text-xs font-bold uppercase tracking-widest hover:border-accent/50 transition-colors">Japanese</Link>
      </div>

      {!q ? (
        <div className="card-base text-center py-10 text-muted">Study content not yet generated.</div>
      ) : (
        <>
          {/* Exam badge + topic */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="accent-tag">{q.exam}</span>
              <span className="text-sm text-muted">Topic: {q.topic}</span>
            </div>

            {/* Finance concept intro */}
            {ft && (
              <div className="card-base mb-6 border-l-2 border-accent space-y-3">
                <div>
                  <p className="section-label mb-1">Concept Overview</p>
                  <h2 className="text-xl font-black text-white">{ft.title}</h2>
                  <p className="text-muted text-sm mt-1">{ft.subtitle}</p>
                </div>
                <div className="space-y-2">
                  {ft.paragraphs.map((p, i) => (
                    <p key={i} className="text-zinc-300 text-sm leading-relaxed">{p}</p>
                  ))}
                </div>
                <div className="border-t border-border pt-3 space-y-1.5">
                  <p className="section-label">Key Takeaways</p>
                  {ft.key_takeaways.map((kt, i) => (
                    <div key={i} className="flex gap-2 text-sm text-zinc-300">
                      <span className="text-accent font-bold flex-shrink-0">→</span>
                      <span>{kt}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Practice question */}
            <div className="mb-4">
              <p className="section-label mb-3">Practice Question</p>
              <QuizQuestion question={q} />
            </div>
          </section>
        </>
      )}
    </div>
  )
}
