import SectionHeader from '@/components/ui/SectionHeader'
import SampleNote from '@/components/ui/SampleNote'
import Timeline from '@/features/history/Timeline'
import { events, honours } from '@/data/history'

export default function HistoriaPage() {
  return (
    <div>
      <SectionHeader n="I" title="Historia y palmarés" />
      <SampleNote />
      <div className="mb-16">
        <h2 className="mb-8 font-display text-2xl font-bold">Hitos institucionales</h2>
        <Timeline events={events} />
      </div>
      <div>
        <h2 className="mb-8 font-display text-2xl font-bold">Títulos oficiales</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {honours.map((h) => (
            <div key={h.name} className="ficha p-6">
              <span className={`font-num text-5xl font-extrabold ${h.gold ? 'text-gold' : 'text-primary'}`}>
                {h.count !== null ? h.count : 'Por verificar'}
              </span>
              <h3 className="mt-2 font-display text-xl font-bold">{h.name}</h3>
              <p className="mt-1 text-sm text-mute">Período: {h.years}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
