import SectionHeader from '@/components/ui/SectionHeader'
import SectionIntro from '@/components/ui/SectionIntro'
import { fixtures, upcomingFixtures } from '@/data/fixtures'
import FixturesExplorer from '@/features/fixtures/FixturesExplorer'
import { pageMetadata } from '@/lib/metadata'

export const metadata = pageMetadata('Partidos y resultados', 'Calendario, fixtures y resultados del Atlético Nacional.')

export default function PartidosPage() {
  return (
    <div>
      <SectionHeader n="VII" title="Partidos y resultados" />
      <SectionIntro>Calendario, próximos partidos y marcadores de Atlético Nacional. Resultados y goles desde ESPN; próximos desde 365Scores.</SectionIntro>
      <FixturesExplorer fixtures={fixtures} upcoming={upcomingFixtures} />
    </div>
  )
}
