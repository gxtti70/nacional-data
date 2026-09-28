import SectionHeader from '@/components/ui/SectionHeader'
import SampleNote from '@/components/ui/SampleNote'
import { gallery } from '@/data/gallery'
import Photo from '@/components/ui/Photo'

export default function GaleriaPage() {
  return (
    <div>
      <SectionHeader n="VIII" title="Galería histórica" />
      <SampleNote>Fotografías y registros gráficos del archivo oficial.</SampleNote>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
        {gallery.map((item) => (
          <div key={item.id} className="ficha overflow-hidden flex flex-col">
            <Photo src={item.src} alt={item.title} label={String(item.year)} className="h-64 w-full" />
            <div className="p-6 flex flex-1 flex-col justify-between">
              <div>
                <span className="font-num text-sm font-extrabold text-primary">{item.year}</span>
                <h3 className="mt-1 font-display text-xl font-bold">{item.title}</h3>
                <p className="mt-2 text-sm text-mute">{item.caption}</p>
              </div>
              <div className="mt-6 border-t border-line pt-3 text-xs text-mute">Crédito: {item.credit}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
