'use client'
import { useMemo, useState } from 'react'
import type { Fixture } from '@/data/fixtures'
import { competitionLabelFor, TOURNAMENT_FILTERS, tournamentFor, type TournamentFilter } from './tournaments'

const dateFormat = new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Bogota' })

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} aria-pressed={on} className={`border px-3 py-1 text-sm ${on ? 'border-primary bg-primary text-bg' : 'border-line hover:border-primary'}`}>
      {children}
    </button>
  )
}

export default function FixturesExplorer({ fixtures }: { fixtures: Fixture[] }) {
  const [filter, setFilter] = useState<TournamentFilter>('all')

  const sorted = useMemo(() => [...fixtures].sort((a, b) => b.date.localeCompare(a.date)), [fixtures])

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
          {visible.map((match) => (
            <article key={match.id} className="ficha grid gap-3 p-5 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
              <div className="sm:text-right"><p className="font-display text-lg font-bold">{match.home}</p><p className="text-xs text-mute">Local</p></div>
              <div className="min-w-32 text-center">
                <p className="font-num text-2xl font-extrabold">{match.homeScore ?? '—'} <span className="text-mute">:</span> {match.awayScore ?? '—'}</p>
                <p className="mt-1 text-xs font-semibold text-primary">{match.statusDetail || match.status}</p>
              </div>
              <div><p className="font-display text-lg font-bold">{match.away}</p><p className="text-xs text-mute">Visitante</p></div>
              <p className="text-sm text-mute sm:col-span-3">{dateFormat.format(new Date(match.date))} · {competitionLabelFor(match.competition)}{match.stage ? ` · ${match.stage}` : ''}</p>
            </article>
          ))}
        </div>
      ) : (
        <p className="ficha p-6 text-mute">
          {sorted.length ? 'No hay partidos para este torneo.' : <>Todavía no hay partidos sincronizados. Ejecuta <code>npm run sync:espn</code>.</>}
        </p>
      )}
    </div>
  )
}
