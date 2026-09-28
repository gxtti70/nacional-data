import SectionHeader from '@/components/ui/SectionHeader'
import SampleNote from '@/components/ui/SampleNote'
import SquadExplorer from '@/features/squad/SquadExplorer'
import { players } from '@/data/players'
import { seasons } from '@/data/seasons'

export default function PlantillaPage() {
  return (
    <div>
      <SectionHeader n="II" title="Plantilla profesional" />
      <SampleNote>Selecciona la temporada y posición para filtrar el rendimiento detallado.</SampleNote>
      <SquadExplorer players={players} seasons={seasons} />
    </div>
  )
}
