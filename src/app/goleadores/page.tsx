import SectionHeader from '@/components/ui/SectionHeader'
import SectionIntro from '@/components/ui/SectionIntro'
import DataTable, { type Column } from '@/components/data-table/DataTable'
import { allTimeScorers, currentScorers, otherScorers } from '@/data/scorers'
import { pageMetadata } from '@/lib/metadata'

export const metadata = pageMetadata('Goleadores', 'Máximos anotadores históricos y goleadores de temporada del Atlético Nacional, con fuentes.')

const COLS: Column[] = [
  { key: 'name', header: 'Jugador', kind: 'player' },
  { key: 'position', header: 'Pos.', kind: 'pos' },
  { key: 'goals', header: 'Goles', kind: 'bar' },
]

const HISTORICAL_COLS: Column[] = [
  { key: 'name', header: 'Jugador', kind: 'player' },
  { key: 'goals', header: 'Goles', kind: 'bar' },
  { key: 'source', header: 'Fuente', kind: 'source' },
]

const otherGoals = otherScorers.reduce((total, scorer) => total + scorer.goals, 0)
const currentRows = [
  ...currentScorers.filter((player) => player.goals > 0),
  ...(otherScorers.length ? [{ slug: 'otros', name: 'Otros', position: '—', goals: otherGoals }] : []),
]

export default function GoleadoresPage() {
  return (
    <div>
      <SectionHeader n="V" title="Goleadores históricos y de temporada" />
      <SectionIntro>
        Goleadores de temporada e históricos. Los totales de la temporada incluyen Liga BetPlay, Copa Colombia y
        Sudamericana; cada total histórico enlaza la fuente y el corte consultado.
      </SectionIntro>
      <div className="mb-12">
        <h2 className="mb-6 font-display text-2xl font-bold">Goleadores de la temporada actual</h2>
        <DataTable columns={COLS} rows={currentRows} defaultSort="goals" />
        {otherScorers.length > 0 && (
          <p className="mt-3 text-sm text-mute">
            Otros: {otherScorers.map((scorer) => `${scorer.name} (${scorer.goals})`).join(' · ')}. Anotadores sin ficha
            en la plantilla publicada.
          </p>
        )}
      </div>
      <div>
        <h2 className="mb-6 font-display text-2xl font-bold">Máximos goleadores históricos</h2>
        <DataTable columns={HISTORICAL_COLS} rows={allTimeScorers} defaultSort="goals" />
      </div>
    </div>
  )
}
