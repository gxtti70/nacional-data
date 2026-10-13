import SectionHeader from '@/components/ui/SectionHeader'
import SectionIntro from '@/components/ui/SectionIntro'
import DataTable, { type Column } from '@/components/data-table/DataTable'
import { allTimeScorers, currentScorers } from '@/data/scorers'
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

const currentScorersActive = currentScorers.filter((p) => p.goals > 0).slice(0, 10)

export default function GoleadoresPage() {
  return (
    <div>
      <SectionHeader n="V" title="Goleadores históricos y de temporada" />
      <SectionIntro>Goleadores de temporada e históricos. Cada total histórico enlaza la fuente y el corte consultado.</SectionIntro>
      <div className="mb-12">
        <h2 className="mb-6 font-display text-2xl font-bold">Goleadores de la temporada actual</h2>
        <DataTable columns={COLS} rows={currentScorers} defaultSort="goals" />
      </div>
      <div>
        <h2 className="mb-6 font-display text-2xl font-bold">Máximos goleadores históricos</h2>
        <DataTable columns={HISTORICAL_COLS} rows={allTimeScorers} defaultSort="goals" />
      </div>
    </div>
  )
}
