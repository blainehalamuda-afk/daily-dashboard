import { getDailyData } from '@/lib/data'

export const revalidate = 21600

const CATEGORIES = ['Business', 'Technology', 'General', 'Transfer News', 'Risk Management']

export default async function NewsPage() {
  const data = await getDailyData()
  const articles = data?.news?.articles ?? []

  // Group by category
  const grouped: Record<string, typeof articles> = {}
  for (const a of articles) {
    const cat = a.category ?? 'General';
    (grouped[cat] = grouped[cat] ?? []).push(a)
  }

  return (
    <div className="space-y-8 animate-fade-in">

      <section className="pt-4">
        <p className="section-label mb-1">Intelligence Feed</p>
        <h1 className="text-3xl font-black tracking-tight text-white">News</h1>
      </section>

      {/* Category filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 no-scrollbar">
        {CATEGORIES.map(c => (
          <span key={c}
            className="flex-shrink-0 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-border text-muted cursor-default hover:border-accent hover:text-accent transition-colors">
            {c}
          </span>
        ))}
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="card-base text-center py-10 text-muted">No articles loaded yet.</div>
      ) : (
        Object.entries(grouped).map(([category, arts]) => (
          <section key={category}>
            <div className="flex items-center gap-3 mb-3">
              <span className="accent-tag">{category}</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="space-y-3">
              {arts.map((a, i) => (
                <a key={i} href={a.url} target="_blank" rel="noopener noreferrer"
                  className="block card-base hover:border-accent/50 transition-all group">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-muted font-medium">{a.source}</span>
                    {a.published && <span className="text-xs text-dim">{a.published}</span>}
                  </div>
                  <p className="text-white font-semibold leading-snug group-hover:text-accent transition-colors">
                    {a.title}
                  </p>
                  {a.description && (
                    <p className="text-muted text-xs mt-1.5 leading-relaxed line-clamp-2">{a.description}</p>
                  )}
                </a>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  )
}
