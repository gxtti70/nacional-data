'use client'
import { useMemo, useState } from 'react'
import type { Fixture } from '@/data/fixtures'
import { competitionLabelFor, TOURNAMENT_FILTERS, tournamentFor, type TournamentFilter } from './tournaments'
import { goalLabel, splitGoals } from './goals'

const dateFormat = new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Bogota' })
const dayFormat = new Intl.DateTimeFormat('es-CO', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'America/Bogota' })
const timeFormat = new Intl.DateTimeFormat('es-CO', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Bogota' })

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} aria-pressed={on} className={`border px-3 py-1 text-sm ${on ? 'border-primary bg-primary text-bg' : 'border-line hover:border-primary'}`}>
      {children}
    </button>
  )
}

function venueLabel(match: Fixture) {
  if (match.venue && match.city) return `${match.venue}, ${match.city}`
  return match.venue ?? match.city
}

function Goals({ goals }: { goals?: Fixture['goals'] }) {
  const { home, away } = splitGoals(goals)
  if (!home.length && !away.length) return null
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-1 border-t border-line pt-3 text-sm sm:col-span-3">
      <ul className="space-y-1 sm:text-right">
        {home.map((goal) => (
          <li key={`${goal.minute}-${goal.player}`}>{goalLabel(goal)}</li>
        ))}
      </ul>
      <ul className="space-y-1">
        {away.map((goal) => (
          <li key={`${goal.minute}-${goal.player}`}>{goalLabel(goal)}</li>
        ))}
      </ul>
    </div>
  )
}

export default function FixturesExplorer({ fixtures, upcoming = [] }: { fixtures: Fixture[]; upcoming?: Fixture[] }) {
  const [filter, setFilter] = useState<TournamentFilter>('all')

  const sorted = useMemo(() => [...fixtures].sort((a, b) => b.date.localeCompare(a.date)), [fixtures])
  const next = useMemo(() => [...upcoming].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3), [upcoming])

  const counts = useMemo(() => {
    const result: Record<string, number> = { all: sorted.length }
    for (const match of sorted) {
      const tournament = tournamentFor(match)
      result[tournament] = (result[tournament] ?? 0) + 1
    }
    return result
  }, [sorted])

  const visible = useMemo(
    () => (filter === 'all' ? sorted : sorted.filter((match) => tournamentFor(match) === filter)),
    [sorted, filter],
  )

  return (
    <div>
      {next.length > 0 && (
        <section aria-labelledby="proximos" className="mb-8">
          <h2 id="proximos" className="mb-3 font-display text-xl font-bold">Próximos partidos</h2>
          <div className="space-y-3">
            {next.map((match) => {
              const place = venueLabel(match)
              return (
                <article key={match.id} className="ficha grid gap-2 p-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                  <div className="sm:text-right">
                    <p className="font-display text-lg font-bold">{match.home}</p>
                    <p className="text-xs text-mute">Local</p>
                  </div>
                  <div className="min-w-32 text-center">
                    <time dateTime={match.date} className="block text-sm font-semibold">
                      {dayFormat.format(new Date(match.date))}
                    </time>
                    <p className="font-num text-xl font-extrabold text-primary">{timeFormat.format(new Date(match.date))}</p>
                  </div>
                  <div>
                    <p className="font-display text-lg font-bold">{match.away}</p>
                    <p className="text-xs text-mute">Visitante</p>
                  </div>
                  <p className="text-sm text-mute sm:col-span-3">
                    {competitionLabelFor(match.competition)}
                    {match.stage ? ` · ${match.stage}` : ''}
                    {place ? ` · ${place}` : ''}
                  </p>
                </article>
              )
            })}
          </div>
        </section>
      )}

      <div className="mb-6 flex flex-wrap items-center gap-2 border border-line bg-surface p-4">
        <span className="mr-2 text-sm font-semibold text-mute">Torneo:</span>
        {TOURNAMENT_FILTERS.map((t) => (
          <Chip key={t.id} on={filter === t.id} onClick={() => setFilter(t.id)}>
            {t.label} <span className="font-num">{counts[t.id] ?? 0}</span>
          </Chip>
        ))}
      </div>

      {visible.length ? (
        <div className="space-y-3">
          {visible.map((match) => {
            const place = venueLabel(match)
            return (
              <article key={match.id} className="ficha grid gap-3 p-5 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                <div className="sm:text-right"><p className="font-display text-lg font-bold">{match.home}</p><p className="text-xs text-mute">Local</p></div>
                <div className="min-w-32 text-center">
                  <p className="font-num text-2xl font-extrabold">{match.homeScore ?? '—'} <span className="text-mute">:</span> {match.awayScore ?? '—'}</p>
                  <p className="mt-1 text-xs font-semibold text-primary">{match.statusDetail || match.status}</p>
                </div>
                <div><p className="font-display text-lg font-bold">{match.away}</p><p className="text-xs text-mute">Visitante</p></div>
                <Goals goals={match.goals} />
                <p className="text-sm text-mute sm:col-span-3">
                  {dateFormat.format(new Date(match.date))} · {competitionLabelFor(match.competition)}
                  {match.stage ? ` · ${match.stage}` : ''}
                  {place ? ` · ${place}` : ''}
                </p>
              </article>
            )
          })}
        </div>
      ) : (
        <p className="ficha p-6 text-mute">
          {sorted.length ? 'No hay partidos para este torneo.' : <>Todavía no hay partidos sincronizados. Ejecuta <code>npm run sync:espn</code>.</>}
        </p>
      )}
    </div>
  )
}
