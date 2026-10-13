import { GalleryItemSchema, type GalleryItem } from './schema'
import attribution from './commons-attribution.json'

const commons = attribution.gallery as unknown as Record<string, { src: string; title: string; credit: string; pageUrl: string; licenseUrl: string }>

const items: Array<Omit<GalleryItem, 'credit' | 'sourceUrl' | 'licenseUrl'> & { src?: string }> = [
  { id: '1947-fundacion', year: 1947, title: 'Fundación del club', caption: 'Primeros años del club en Medellín.' },
  { id: '1954-primer-titulo', year: 1954, title: 'Primer título de liga', caption: 'La primera estrella.' },
  { id: '1989-libertadores', year: 1989, title: 'Campeón de América', caption: 'Celebración de la primera Libertadores.' },
  { id: '1990-recopa', year: 1990, title: 'Recopa Sudamericana', caption: 'Copa levantada tras la gloria continental.' },
  { id: '2016-libertadores', year: 2016, title: 'Segunda Libertadores', caption: 'La segunda estrella continental.' },
  { id: 'estadio', title: 'Atanasio Girardot en Medellín', caption: 'Busto de Atanasio Girardot, nombre del estadio de Atlético Nacional.' },
]

export const gallery: GalleryItem[] = GalleryItemSchema.array().parse(items.map((item) => {
  const image = commons[item.id]
  return { ...item, src: image?.src ?? item.src, credit: image ? `${image.title} · ${image.credit}` : '', sourceUrl: image?.pageUrl, licenseUrl: image?.licenseUrl }
}))
