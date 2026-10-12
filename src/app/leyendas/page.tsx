import SectionHeader from '@/components/ui/SectionHeader'
import SectionIntro from '@/components/ui/SectionIntro'
import { legends } from '@/data/legends'
import Photo from '@/components/ui/Photo'
import attribution from '@/data/commons-attribution.json'
import { pageMetadata } from '@/lib/metadata'

export const metadata = pageMetadata('Leyendas', 'Figuras históricas del Atlético Nacional y fotografías con créditos y licencias.')

const commons = attribution.legends as unknown as Record<string, { src: string; title: string; credit: string; pageUrl: string; licenseUrl: string }>

export default function LeyendasPage() {
  return (
    <div>
      <SectionHeader n="VIII" title="Galería de leyendas" />
      <SectionIntro>Las figuras que escribieron la historia verdolaga.</SectionIntro>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {legends.map((l) => (
          <div key={l.slug} className="ficha p-6 flex items-center gap-4">
            <Photo src={commons[l.slug]?.src} alt={l.name} label={l.mark} className="h-16 w-16 shrink-0 rounded-full" />
            <div className="min-w-0 break-words">
              <span className="text-xs uppercase tracking-wider text-primary">{l.role}</span>
              <h3 className="mt-1 font-display text-xl font-bold">{l.name}</h3>
              {commons[l.slug] && <p className="mt-1 text-xs text-mute">{commons[l.slug].title} · {commons[l.slug].credit} · <a className="underline" href={commons[l.slug].pageUrl} target="_blank" rel="noreferrer">fuente</a>{commons[l.slug].licenseUrl && <> · <a className="underline" href={commons[l.slug].licenseUrl} target="_blank" rel="noreferrer">licencia</a></>}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
