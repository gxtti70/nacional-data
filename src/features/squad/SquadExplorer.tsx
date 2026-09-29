'use client'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import DataTable, { type Column } from '@/components/data-table/DataTable'
import Photo from '@/components/ui/Photo'
import { playerPhoto } from '@/data/players'
import type { Player, Position, Season } from '@/data/schema'

const COLS: Column[] = [
  { key: 'name', header: 'Jugador', kind: 'player' },
  { key: 'position', header: 'Pos.', kind: 'pos' },
  { key: 'apps', header: 'Partidos', kind: 'num' },
  { key: 'goals', header: 'Goles', kind: 'bar' },
  { key: 'assists', header: 'Asist.', kind: 'num' },
  { key: 'trend', header: 'Goles por temporada', kind: 'spark' },
  { key: 'href', header: '', kind: 'action' },
]
const POS: ('ALL' | Position)[] = ['ALL', 'POR', 'DEF', 'LI', 'LD', 'MCD', 'MED', 'MCO', 'EXD', 'EXI', 'DEL']

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} aria-pressed={on} className={`border px-3 py-1 text-sm ${on ? 'border-primary bg-primary text-bg' : 'border-line hover:border-primary'}`}>
      {children}
    </button>
  )
}

export default function SquadExplorer({ players, seasons }: { players: Player[]; seasons: Season[] }) {
  const [seasonId, setSeasonId] = useState(seasons.find((s) => s.current)?.id ?? seasons[seasons.length - 1].id)
  const [pos, setPos] = useState<'ALL' | Position>('ALL')
  const [view, setView] = useState<'table' | 'cards'>('table')

  const inSeason = useMemo(() => {
    const season = seasons.find((s) => s.id === seasonId)!
    return players
      .filter((p) => season.stats[p.slug])
      .map((p) => ({
        slug: p.slug, name: p.name, number: p.number, position: p.position, photo: playerPhoto(p),
        ...season.stats[p.slug],
        trend: seasons.map((s) => s.stats[p.slug]?.goals ?? 0),
        href: `/plantilla/${p.slug}`,
      }))
  }, [players, seasons, seasonId])

  const rows = inSeason.filter((r) => pos === 'ALL' || r.position === pos)

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border border-line bg-surface p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-2 text-sm font-semibold text-mute">Temporada:</span>
          {seasons.map((s) => (
            <Chip key={s.id} on={seasonId === s.id} onClick={() => setSeasonId(s.id)}>
              {s.label} {s.current && '· Actual'}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-2 text-sm font-semibold text-mute">Posición:</span>
          {POS.map((p) => (
            <Chip key={p} on={pos === p} onClick={() => setPos(p)}>
              {p === 'ALL' ? 'Todas' : p}
            </Chip>
          ))}
          <div className="ml-4 flex border border-line">
            <button onClick={() => setView('table')} className={`px-3 py-1 text-sm ${view === 'table' ? 'bg-primary text-bg' : 'hover:text-primary'}`}>Tabla</button>
            <button onClick={() => setView('cards')} className={`px-3 py-1 text-sm ${view === 'cards' ? 'bg-primary text-bg' : 'hover:text-primary'}`}>Tarjetas</button>
          </div>
        </div>
      </div>

      {view === 'table' ? (
        <DataTable columns={COLS} rows={rows} />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {rows.map((r) => (
            <Link key={r.slug} href={r.href!} className="ficha p-5 transition hover:border-primary">
              <div className="flex items-center gap-4">
                <Photo src={r.photo} alt={r.name} label={r.number != null ? String(r.number) : '★'} className="h-14 w-14 shrink-0 rounded-full" />
                <div>
                  <span className="border border-line px-1.5 py-0.5 text-xs">{r.position}</span>
                  <h3 className="mt-1 font-display text-lg font-bold">{r.name}</h3>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-3 text-center font-num text-sm">
                <div><b className="block text-lg font-extrabold text-primary">{r.apps}</b>Partidos</div>
                <div><b className="block text-lg font-extrabold text-primary">{r.goals}</b>Goles</div>
                <div><b className="block text-lg font-extrabold text-primary">{r.assists}</b>Asist.</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
