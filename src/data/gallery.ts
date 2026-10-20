import { GalleryItemSchema, type GalleryItem } from './schema'
import attribution from './commons-attribution.json'

const commons = attribution.gallery as unknown as Record<string, { src: string; title: string; credit: string; pageUrl: string; licenseUrl: string }>

const items: Array<Omit<GalleryItem, 'credit' | 'sourceUrl' | 'licenseUrl'> & { src?: string }> = [
  { id: '1947-fundacion', year: 1947, title: 'Fundación del club', caption: 'Primeros años del club en Medellín.' },
  { id: '1954-primer-titulo', year: 1954, title: 'Primer título de liga', caption: 'La primera estrella.' },
  { id: '1989-libertadores', year: 1989, title: 'Campeón de América', caption: 'Celebración de la primera Libertadores.' },
  { id: '1990-recopa', year: 1990, title: 'Recopa Sudamericana', caption: 'Copa levantada tras la gloria continental.' },
  { id: '2016-libertadores-1', year: 2016, title: 'Segunda Libertadores', caption: 'Alzamiento de la copa ante la hinchada verde.', src: '/gallery/libertadores-2016-1.webp' },
  { id: '2016-libertadores-2', year: 2016, title: 'Segunda Libertadores — la copa en casa', caption: 'Celebración nocturna en el Estadio Atanasio Girardot.', src: '/gallery/libertadores-2016-2.webp' },
  { id: '2016-libertadores-3', year: 2016, title: 'Segunda Libertadores — Final 2016', caption: 'Las manos del equipo sostienen la segunda estrella continental.', src: '/gallery/libertadores-2016-3.webp' },
  { id: 'estadio', title: 'Atanasio Girardot en Medellín', caption: 'Panorama del estadio en una noche de partido.', src: '/gallery/estadio.webp' },
]

export const gallery: GalleryItem[] = GalleryItemSchema.array().parse(items.map((item) => {
  const image = commons[item.id]
  return { ...item, src: image?.src ?? item.src, credit: image ? `${image.title} · ${image.credit}` : '', sourceUrl: image?.pageUrl, licenseUrl: image?.licenseUrl }
}))
