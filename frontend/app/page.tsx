import { getDailyData } from '@/lib/data'
import Link from 'next/link'

export const revalidate = 21600

export default async function HomePage() {
  const data = await getDailyData()

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
        <div className="text-5xl">⬡</div>
        <h2 className="text-xl font-bold text-white">Dashboard loading...</h2>
        <p className="text-muted text-sm max-w-xs">
          The daily data hasn&apos;t been generated yet. Run the GitHub Action to generate it.
        </p>
      </div>
    )
  }

  const { weather, stocks, news, sports, ai } = data
  const topStocks = (stocks.tickers ?? []).filter(s => !s.error).slice(0, 4)
  const topNews = (news.articles ?? []).slice(0, 3)
  const todayMatches = (sports.matches ?? []).filter(m =>
    m.status === 'FINISHED' || m.status === 'IN_PLAY' || m.status === 'SCHEDULED' || m.status === 'TIMED'
  ).slice(0, 2)

  return (
    <div className="space-y-5 animate-fade-in">

      {/* ── Hero greeting ─────────────────────────────── */}
      <section className="pt-4">
        <p className="section-label mb-1">Good morning</p>
        <h1 className="text-4xl font-black tracking-tight text-white leading-none">
          {data.date}
        </h1>
        <p className="text-muted text-sm mt-1">Updated {data.generated_at}</p>
      </section>

      {/* ── Weather strip ─────────────────────────────── */}
      {!weather.error && (
        <Link href="/" className="block card-base flex items-center gap-4 no-underline hover:border-accent/50 transition-colors">
          <span className="text-4xl">{weather.icon}</span>
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{weather.temp_f}°</span>
              <span className="text-muted text-sm">{weather.description}</span>
            </div>
            <p className="text-xs text-muted mt-0.5">{weather.city} · H:{weather.high_f}° L:{weather.low_f}° · {weather.humidity}% humidity</p>
          </div>
          <div className="text-right">
            {weather.forecast?.slice(0, 2).map(d => (
              <div key={d.day} className="text-xs text-muted leading-5">
                {d.day} {d.icon} {d.high}°
              </div>
            ))}
          </div>
        </Link>
      )}

      {/* ── Markets strip ─────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <span className="section-label">Markets</span>
          <Link href="/markets" className="text-xs text-accent font-semibold hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {topStocks.map(s => (
            <div key={s.symbol} className="card-base">
              <div className="text-xs font-bold text-muted tracking-wider">{s.symbol}</div>
              <div className="text-lg font-black text-white mt-1">
                ${s.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className={`text-sm font-semibold mt-0.5 ${s.up ? 'text-green-400' : 'text-red-400'}`}>
                {s.up ? '▲' : '▼'} {Math.abs(s.change_pct).toFixed(2)}%
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Top story ─────────────────────────────────── */}
      {topNews.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <span className="section-label">Top Stories</span>
            <Link href="/news" className="text-xs text-accent font-semibold hover:underline">All news →</Link>
          </div>
          <div className="space-y-3">
            {topNews.map((article, i) => (
              <a key={i} href={article.url} target="_blank" rel="noopener noreferrer"
                className="block card-base hover:border-accent/50 transition-colors">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="accent-tag">{article.category}</span>
                  <span className="text-xs text-muted">{article.source}</span>
                </div>
                <p className="text-sm font-semibold text-white leading-snug">{article.title}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* ── PL today ──────────────────────────────────── */}
      {todayMatches.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <span className="section-label">Premier League</span>
            <Link href="/sports" className="text-xs text-accent font-semibold hover:underline">Full coverage →</Link>
          </div>
          <div className="space-y-2">
            {todayMatches.map((m, i) => (
              <div key={i} className="card-base flex items-center gap-3">
                <span className="flex-1 text-sm font-semibold text-right text-white">{m.home}</span>
                <span className="text-sm font-black text-white min-w-[52px] text-center">
                  {m.status === 'FINISHED' || m.status === 'IN_PLAY'
                    ? `${m.home_score} – ${m.away_score}`
                    : m.time}
                </span>
                <span className="flex-1 text-sm font-semibold text-white">{m.away}</span>
                {m.status === 'IN_PLAY' && (
                  <span className="text-[10px] font-bold text-orange-400 bg-orange-400/10 px-1.5 py-0.5 rounded">LIVE</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Today's study preview ─────────────────────── */}
      {ai && !ai.error && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <span className="section-label">Today&apos;s Study</span>
            <Link href="/study" className="text-xs text-accent font-semibold hover:underline">Open →</Link>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {/* CFA/FRM teaser */}
            <Link href="/study" className="block card-base hover:border-accent/50 transition-colors">
              <span className="accent-tag">{ai.cfa_frm?.exam ?? 'CFA/FRM'}</span>
              <p className="text-white font-bold mt-2 leading-snug">
                {ai.cfa_frm?.topic ?? 'Daily practice question'}
              </p>
              <p className="text-muted text-xs mt-1">Tap to study →</p>
            </Link>

            {/* Finance topic teaser */}
            <Link href="/study" className="block card-base hover:border-accent/50 transition-colors">
              <span className="section-label">Finance Deep-Dive</span>
              <p className="text-white font-bold mt-1 leading-snug">
                {ai.finance_topic?.title ?? 'Today\'s topic'}
              </p>
              <p className="text-muted text-xs mt-1">{ai.finance_topic?.subtitle}</p>
            </Link>

            {/* Japanese teaser */}
            <Link href="/study/japanese" className="block card-base hover:border-accent/50 transition-colors">
              <span className="section-label">Japanese</span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-3xl font-black text-accent">{ai.japanese?.word}</span>
                <span className="text-muted text-sm">{ai.japanese?.reading} — {ai.japanese?.meaning}</span>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* ── AI & Strategy teaser ──────────────────────── */}
      {ai?.ai_strategy && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <span className="section-label">AI & Strategy</span>
            <Link href="/ai" className="text-xs text-accent font-semibold hover:underline">More →</Link>
          </div>
          <Link href="/ai" className="block card-base hover:border-accent/50 transition-colors">
            <p className="text-white font-bold leading-snug">{ai.ai_strategy.headline}</p>
            <p className="text-muted text-xs mt-1.5 line-clamp-2">{ai.ai_strategy.summary}</p>
          </Link>
        </section>
      )}

    </div>
  )
}
