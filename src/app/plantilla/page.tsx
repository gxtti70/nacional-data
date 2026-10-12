import SectionHeader from '@/components/ui/SectionHeader'
import SectionIntro from '@/components/ui/SectionIntro'
import SquadExplorer from '@/features/squad/SquadExplorer'
import { players } from '@/data/players'
import { seasons } from '@/data/seasons'
import { pageMetadata } from '@/lib/metadata'

export const metadata = pageMetadata('Plantilla', 'Jugadores del Atlético Nacional y estadísticas por temporada y posición.')

export default function PlantillaPage() {
  return (
    <div>
      <SectionHeader n="II" title="Plantilla profesional" />
      <SectionIntro>Selecciona la temporada y la posición para filtrar el rendimiento detallado.</SectionIntro>
      <SquadExplorer players={players} seasons={seasons} />
    </div>
  )
}
