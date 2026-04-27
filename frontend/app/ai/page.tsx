import { getDailyData } from '@/lib/data'

export const revalidate = 21600

export default async function AiPage() {
  const data = await getDailyData()
  const ai = data?.ai?.ai_strategy
  const news = data?.news?.articles?.filter(a =>
    a.category?.toLowerCase().includes('tech') ||
    a.title?.toLowerCase().includes('ai') ||
    a.title?.toLowerCase().includes('artificial intelligence')
  ) ?? []

  return (
    <div className="space-y-8 animate-fade-in">

      <section className="pt-4">
        <p className="section-label mb-1">The Future of Work</p>
        <h1 className="text-3xl font-black tracking-tight text-white">AI & Strategy</h1>
      </section>

      {/* Daily Insight */}
      {ai && (
        <>
          <section>
            <div className="flex items-center gap-3 mb-3">
              <span className="accent-tag">Daily Insight</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="card-base border-l-2 border-accent space-y-3">
              <h2 className="text-xl font-black text-white leading-tight">{ai.headline}</h2>
              <p className="text-zinc-300 text-sm leading-relaxed">{ai.summary}</p>
            </div>
          </section>

          {/* Key Concepts */}
          {ai.concepts?.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-3">
                <span className="section-label">Key Concepts</span>
                <div className="flex-1 h-px bg-border" />
              </div>
              <div className="space-y-3">
                {ai.concepts.map((c, i) => (
                  <div key={i} className="card-base">
                    <p className="text-accent font-bold text-sm">{c.term}</p>
                    <p className="text-zinc-300 text-sm mt-1 leading-relaxed">{c.definition}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Career Insight */}
          {ai.career_insight && (
            <section>
              <div className="flex items-center gap-3 mb-3">
                <span className="accent-tag">Career Insight</span>
                <div className="flex-1 h-px bg-border" />
              </div>
              <div className="card-base bg-orange-950/20 border-orange-900/40">
                <p className="text-zinc-300 text-sm leading-relaxed">{ai.career_insight}</p>
              </div>
            </section>
          )}
        </>
      )}

      {/* AI/Tech News */}
      {news.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-3">
            <span className="section-label">AI & Tech News</span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="space-y-3">
            {news.map((a, i) => (
              <a key={i} href={a.url} target="_blank" rel="noopener noreferrer"
                className="block card-base hover:border-accent/50 transition-colors group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted">{a.source}</span>
                </div>
                <p className="text-white font-semibold text-sm leading-snug group-hover:text-accent transition-colors">{a.title}</p>
                {a.description && (
                  <p className="text-muted text-xs mt-1.5 line-clamp-2 leading-relaxed">{a.description}</p>
                )}
              </a>
            ))}
          </div>
        </section>
      )}

    </div>
  )
}
