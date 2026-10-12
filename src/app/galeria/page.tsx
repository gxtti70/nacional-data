import SectionHeader from '@/components/ui/SectionHeader'
import SectionIntro from '@/components/ui/SectionIntro'
import { gallery } from '@/data/gallery'
import Photo from '@/components/ui/Photo'
import { pageMetadata } from '@/lib/metadata'

export const metadata = pageMetadata('Galería histórica', 'Imágenes históricas del Atlético Nacional con atribución y licencia.')

export default function GaleriaPage() {
  return (
    <div>
      <SectionHeader n="IX" title="Galería histórica" />
      <SectionIntro>Fotografías y registros gráficos de la historia del club.</SectionIntro>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
        {gallery.map((item) => (
          <div key={item.id} className="ficha overflow-hidden flex flex-col">
            <Photo src={item.src} alt={item.title} label={item.year ? String(item.year) : '★'} className="h-64 w-full" />
            <div className="p-6 flex flex-1 flex-col justify-between">
              <div>
                {item.year && <span className="font-num text-sm font-extrabold text-primary">{item.year}</span>}
                <h3 className="mt-1 font-display text-xl font-bold">{item.title}</h3>
                <p className="mt-2 text-sm text-mute">{item.caption}</p>
              </div>
              {item.credit && <div className="mt-6 border-t border-line pt-3 text-xs text-mute">Crédito: {item.credit} · {item.sourceUrl && <a className="underline" href={item.sourceUrl} target="_blank" rel="noreferrer">fuente</a>} {item.licenseUrl && <>· <a className="underline" href={item.licenseUrl} target="_blank" rel="noreferrer">licencia</a></>}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
