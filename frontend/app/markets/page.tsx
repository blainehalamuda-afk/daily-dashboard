import { getDailyData } from '@/lib/data'

export const revalidate = 21600

export default async function MarketsPage() {
  const data = await getDailyData()
  const tickers = data?.stocks?.tickers?.filter(s => !s.error) ?? []
  const equities = tickers.filter(s => !s.is_crypto)
  const crypto = tickers.filter(s => s.is_crypto)
  const sentiment = data?.ai?.market_sentiment ?? null
  const financeTopic = data?.ai?.finance_topic ?? null

  return (
    <div className="space-y-8 animate-fade-in">

      <section className="pt-4">
        <p className="section-label mb-1">Watchlist</p>
        <h1 className="text-3xl font-black tracking-tight text-white">Markets</h1>
      </section>

      {/* AI Sentiment */}
      {sentiment && (
        <section>
          <div className="flex items-center gap-3 mb-3">
            <span className="accent-tag">AI Sentiment</span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="card-base border-l-2 border-accent">
            <p className="text-sm text-zinc-300 leading-relaxed">{sentiment}</p>
          </div>
        </section>
      )}

      {/* Equities */}
      {equities.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-3">
            <span className="section-label">Equities & ETFs</span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="space-y-2">
            {equities.map(s => (
              <div key={s.symbol} className="card-base flex items-center">
                <div className="flex-1">
                  <div className="text-xs font-black text-muted tracking-widest">{s.symbol}</div>
                  <div className="text-sm text-zinc-400">{s.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-white">
                    ${s.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className={`text-sm font-bold ${s.up ? 'text-green-400' : 'text-red-400'}`}>
                    {s.up ? '▲' : '▼'} {s.change > 0 ? '+' : ''}{s.change.toFixed(2)} ({s.change_pct.toFixed(2)}%)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Crypto */}
      {crypto.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-3">
            <span className="section-label">Crypto</span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="space-y-2">
            {crypto.map(s => (
              <div key={s.symbol} className="card-base flex items-center">
                <div className="flex-1">
                  <div className="text-xs font-black text-muted tracking-widest">{s.symbol}</div>
                  <div className="text-sm text-zinc-400">{s.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-white">
                    ${s.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className={`text-sm font-bold ${s.up ? 'text-green-400' : 'text-red-400'}`}>
                    {s.up ? '▲' : '▼'} {s.change > 0 ? '+' : ''}{s.change.toFixed(2)} ({s.change_pct.toFixed(2)}%)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Finance Deep-Dive */}
      {financeTopic && (
        <section>
          <div className="flex items-center gap-3 mb-3">
            <span className="accent-tag">Finance Deep-Dive</span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="card-base space-y-4">
            <div>
              <h2 className="text-xl font-black text-white">{financeTopic.title}</h2>
              <p className="text-muted text-sm mt-1">{financeTopic.subtitle}</p>
            </div>
            <div className="space-y-3">
              {financeTopic.paragraphs.map((p, i) => (
                <p key={i} className="text-zinc-300 text-sm leading-relaxed">{p}</p>
              ))}
            </div>
            <div className="border-t border-border pt-4 space-y-2">
              <p className="section-label">Key Takeaways</p>
              {financeTopic.key_takeaways.map((kt, i) => (
                <div key={i} className="flex gap-2 text-sm text-zinc-300">
                  <span className="text-accent font-bold flex-shrink-0">→</span>
                  <span>{kt}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  )
}
