import SectionHeader from '@/components/ui/SectionHeader'
import SampleNote from '@/components/ui/SampleNote'
import { arrivals, departures } from '@/data/transfers'

export default function TraspasosPage() {
  return (
    <div>
      <SectionHeader n="VI" title="Registro de traspasos" />
      <SampleNote />
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div>
          <h2 className="mb-6 font-display text-2xl font-bold">Altas recientes</h2>
          <div className="space-y-4">
            {arrivals.map((a) => (
              <div key={a.player} className="ficha p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold">{a.player}</h3>
                  <p className="text-sm text-mute">Origen: {a.club}</p>
                </div>
                <span className="border border-primary px-2.5 py-1 font-num text-xs font-extrabold text-primary">{a.window}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-6 font-display text-2xl font-bold">Bajas recientes</h2>
          <div className="space-y-4">
            {departures.map((d) => (
              <div key={d.player} className="ficha p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold">{d.player}</h3>
                  <p className="text-sm text-mute">Destino: {d.club}</p>
                </div>
                <span className="border border-line px-2.5 py-1 font-num text-xs font-extrabold text-mute">{d.window}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
