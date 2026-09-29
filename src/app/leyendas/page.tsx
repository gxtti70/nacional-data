import SectionHeader from '@/components/ui/SectionHeader'
import SectionIntro from '@/components/ui/SectionIntro'
import { legends } from '@/data/legends'
import Photo from '@/components/ui/Photo'

export default function LeyendasPage() {
  return (
    <div>
      <SectionHeader n="VII" title="Galería de leyendas" />
      <SectionIntro>Las figuras que escribieron la historia verdolaga.</SectionIntro>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {legends.map((l) => (
          <div key={l.slug} className="ficha p-6 flex items-center gap-4">
            <Photo src={`/legends/${l.slug}.jpg`} alt={l.name} label={l.mark} className="h-16 w-16 shrink-0 rounded-full" />
            <div>
              <span className="text-xs uppercase tracking-wider text-primary">{l.role}</span>
              <h3 className="mt-1 font-display text-xl font-bold">{l.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
