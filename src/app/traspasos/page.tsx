import SectionHeader from '@/components/ui/SectionHeader'
import SectionIntro from '@/components/ui/SectionIntro'
import { arrivals, departures } from '@/data/transfers'
import TransferCard from '@/features/transfers/TransferCard'

export default function TraspasosPage() {
  return (
    <div>
      <SectionHeader n="VI" title="Registro de traspasos" />
     <SectionIntro>Movimientos de jugadores en los últimos mercados de fichajes.</SectionIntro>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div>
          <h2 className="mb-6 font-display text-2xl font-bold">Altas recientes</h2>
          <div className="space-y-4">
            {arrivals.map((a) => (
  <TransferCard key={`${a.player}-${a.window}-${a.type}`} t={a} dir="in" />
))}
          </div>
        </div>
        <div>
          <h2 className="mb-6 font-display text-2xl font-bold">Bajas recientes</h2>
          <div className="space-y-4">
            {departures.map((d) => (
  <TransferCard key={`${d.player}-${d.window}-${d.type}`} t={d} dir="out" />
))}
          </div>
        </div>
      </div>
    </div>
  )
}
