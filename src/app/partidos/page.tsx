import SectionHeader from '@/components/ui/SectionHeader'
import SectionIntro from '@/components/ui/SectionIntro'
import { fixtures } from '@/data/fixtures'
import FixturesExplorer from '@/features/fixtures/FixturesExplorer'
import { pageMetadata } from '@/lib/metadata'

export const metadata = pageMetadata('Partidos y resultados', 'Calendario, fixtures y resultados del Atlético Nacional.')

export default function PartidosPage() {
  return (
    <div>
      <SectionHeader n="VII" title="Partidos y resultados" />
      <SectionIntro>Calendario y marcadores de Atlético Nacional sincronizados desde ESPN.</SectionIntro>
      <FixturesExplorer fixtures={fixtures} />
    </div>
  )
}
