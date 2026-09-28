import { GalleryItemSchema, type GalleryItem } from './schema'

export const gallery: GalleryItem[] = GalleryItemSchema.array().parse([
  { id: '1947-fundacion', year: 1947, title: 'Fundación del club', caption: 'Primeros años del club en Medellín.', src: '/gallery/1947-fundacion.jpg', credit: 'Por completar' },
  { id: '1954-primer-titulo', year: 1954, title: 'Primer título de liga', caption: 'La primera estrella.', src: '/gallery/1954-primer-titulo.jpg', credit: 'Por completar' },
  { id: '1989-libertadores', year: 1989, title: 'Campeón de América', caption: 'Celebración de la primera Libertadores.', src: '/gallery/1989-libertadores.jpg', credit: 'Por completar' },
  { id: '1990-recopa', year: 1990, title: 'Recopa Sudamericana', caption: 'Copa levantada tras la gloria continental.', src: '/gallery/1990-recopa.jpg', credit: 'Por completar' },
  { id: '2016-libertadores', year: 2016, title: 'Segunda Libertadores', caption: 'La segunda estrella continental.', src: '/gallery/2016-libertadores.jpg', credit: 'Por completar' },
  { id: 'estadio', year: 2016, title: 'El Atanasio Girardot', caption: 'Noche de partido en el estadio.', src: '/gallery/estadio.jpg', credit: 'Por completar' },
])
