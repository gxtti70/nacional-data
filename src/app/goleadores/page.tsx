import SectionHeader from '@/components/ui/SectionHeader'
import SectionIntro from '@/components/ui/SectionIntro'
import DataTable, { type Column } from '@/components/data-table/DataTable'
import { allTimeScorers, currentScorers } from '@/data/scorers'

const COLS: Column[] = [
  { key: 'name', header: 'Jugador', kind: 'player' },
  { key: 'position', header: 'Pos.', kind: 'pos' },
  { key: 'goals', header: 'Goles totales', kind: 'bar' },
  { key: 'trend', header: 'Tendencia histórica', kind: 'spark' },
]

export default function GoleadoresPage() {
  return (
    <div>
      <SectionHeader n="V" title="Goleadores históricos y de temporada" />
      <SectionIntro>Máximos anotadores de la temporada en curso y de toda la historia del club.</SectionIntro>
      <div className="mb-12">
        <h2 className="mb-6 font-display text-2xl font-bold">Goleadores de la temporada actual</h2>
        <DataTable columns={COLS} rows={currentScorers} defaultSort="goals" />
      </div>
      <div>
        <h2 className="mb-6 font-display text-2xl font-bold">Máximos goleadores históricos</h2>
        <DataTable columns={COLS} rows={allTimeScorers} defaultSort="goals" />
      </div>
    </div>
  )
}
