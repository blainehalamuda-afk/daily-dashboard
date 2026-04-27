import { getDailyData } from '@/lib/data'

export const revalidate = 21600

function StatusBadge({ status }: { status: string }) {
  if (status === 'FINISHED') return <span className="text-[10px] font-bold text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded">FT</span>
  if (status === 'IN_PLAY')  return <span className="text-[10px] font-bold text-orange-400 bg-orange-400/10 px-1.5 py-0.5 rounded animate-pulse">LIVE</span>
  if (status === 'POSTPONED') return <span className="text-[10px] font-bold text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded">PPD</span>
  return <span className="text-[10px] font-bold text-muted bg-zinc-800 px-1.5 py-0.5 rounded">SCH</span>
}

export default async function SportsPage() {
  const data = await getDailyData()
  const matches = data?.sports?.matches ?? []
  const standings = data?.sports?.standings ?? []
  const plContent = data?.pl_content

  return (
    <div className="space-y-8 animate-fade-in">

      <section className="pt-4">
        <p className="section-label mb-1">The Beautiful Game</p>
        <h1 className="text-3xl font-black tracking-tight text-white">Premier League</h1>
      </section>

      {/* Matches */}
      {matches.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-3">
            <span className="section-label">Fixtures & Results</span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="space-y-2">
            {matches.map((m, i) => (
              <div key={i} className={`card-base flex items-center gap-3 ${m.highlighted ? 'border-accent/40' : ''}`}>
                <span className="flex-1 text-sm font-bold text-right text-white">{m.home}</span>
                <div className="text-center min-w-[64px]">
                  {m.status === 'FINISHED' || m.status === 'IN_PLAY' ? (
                    <span className="text-xl font-black text-white">{m.home_score}–{m.away_score}</span>
                  ) : (
                    <span className="text-xs text-muted font-medium">{m.time || m.date}</span>
                  )}
                </div>
                <span className="flex-1 text-sm font-bold text-white">{m.away}</span>
                <StatusBadge status={m.status} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Transfer News */}
      {plContent?.transfer_news && plContent.transfer_news.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-3">
            <span className="accent-tag">Transfer News</span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="space-y-3">
            {plContent.transfer_news.map((t, i) => (
              <div key={i} className="card-base">
                <div className="flex items-center gap-2 mb-1.5">
                  {t.clubs.map(c => (
                    <span key={c} className="text-xs font-bold text-muted border border-border px-2 py-0.5 rounded-full">{c}</span>
                  ))}
                </div>
                <p className="text-white font-semibold text-sm">{t.headline}</p>
                <p className="text-muted text-xs mt-1 leading-relaxed">{t.summary}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Match Preview */}
      {plContent?.match_preview && (
        <section>
          <div className="flex items-center gap-3 mb-3">
            <span className="accent-tag">Match Preview</span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="card-base space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-lg font-black text-white">{plContent.match_preview.home}</span>
              <span className="text-muted font-bold">vs</span>
              <span className="text-lg font-black text-white">{plContent.match_preview.away}</span>
            </div>
            <p className="text-xs text-muted">{plContent.match_preview.date}</p>
            <p className="text-sm text-zinc-300 leading-relaxed">{plContent.match_preview.preview}</p>
            {plContent.match_preview.key_players.length > 0 && (
              <div>
                <p className="section-label mb-1.5">Key Players to Watch</p>
                <div className="flex flex-wrap gap-2">
                  {plContent.match_preview.key_players.map(p => (
                    <span key={p} className="text-xs text-zinc-300 bg-zinc-800 px-2 py-1 rounded-full">{p}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Injury News */}
      {plContent?.injury_news && plContent.injury_news.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-3">
            <span className="section-label">Injury & Squad News</span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="space-y-2">
            {plContent.injury_news.map((inj, i) => (
              <div key={i} className="card-base flex items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold text-sm">{inj.player}</span>
                    <span className="text-xs text-muted">— {inj.team}</span>
                  </div>
                  <p className="text-xs text-muted mt-0.5">Return: {inj.return}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  inj.status === 'Doubtful' ? 'text-yellow-400 bg-yellow-400/10' :
                  inj.status === 'Out' ? 'text-red-400 bg-red-400/10' :
                  'text-green-400 bg-green-400/10'
                }`}>{inj.status}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Standings */}
      {standings.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-3">
            <span className="section-label">Top 6 Standings</span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="card-base overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted text-xs uppercase tracking-wider">
                  <th className="text-left pb-2 w-6">#</th>
                  <th className="text-left pb-2">Team</th>
                  <th className="text-center pb-2">P</th>
                  <th className="text-center pb-2">W</th>
                  <th className="text-center pb-2">D</th>
                  <th className="text-center pb-2">L</th>
                  <th className="text-center pb-2">GD</th>
                  <th className="text-center pb-2 text-white font-bold">Pts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {standings.map(row => (
                  <tr key={row.position} className={row.highlighted ? 'bg-accent/5' : ''}>
                    <td className="py-2 text-muted text-xs">{row.position}</td>
                    <td className="py-2 font-semibold text-white">{row.team}</td>
                    <td className="py-2 text-center text-muted">{row.played}</td>
                    <td className="py-2 text-center text-muted">{row.won}</td>
                    <td className="py-2 text-center text-muted">{row.drawn}</td>
                    <td className="py-2 text-center text-muted">{row.lost}</td>
                    <td className="py-2 text-center text-muted">{row.gd}</td>
                    <td className="py-2 text-center font-black text-white">{row.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

    </div>
  )
}
