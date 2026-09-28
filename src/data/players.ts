import { PlayerSchema, type Player } from './schema'

export const players: Player[] = PlayerSchema.array().parse([
  { slug: 'jugador-01', name: 'Franco Armani', number: 34, position: 'POR', birthDate: '16-10-1986', nationality: 'Argentina' },
  { slug: 'jugador-02', name: 'Luis Marquinez', number: 25, position: 'POR', birthDate: '10-04-2003', nationality: 'Colombia' },
  { slug: 'jugador-03', name: 'Andrés Reyes', number: 15, position: 'DEF', birthDate: '08-09-1999', nationality: 'Colombia' },
  { slug: 'jugador-04', name: 'Néider Parra', number: 3, position: 'DEF', birthDate: '30-04-2005', nationality: 'Colombia' },
  { slug: 'jugador-05', name: 'César Haydar', number: 4, position: 'DEF', birthDate: '31-03-2001', nationality: 'Colombia' },
  { slug: 'jugador-06', name: 'William Tesillo', number: 16, position: 'DEF', birthDate: '02-02-1990', nationality: 'Colombia' },
  { slug: 'jugador-07', name: 'Samuel Velásquez', number: 33, position: 'LI', birthDate: '29-05-2003', nationality: 'Colombia' },
  { slug: 'jugador-08', name: 'Milton Casco', number: 20, position: 'LI', birthDate: '11-04-1988', nationality: 'Argentina' },
  { slug: 'jugador-09', name: 'Andrés Felipe Román', number: 6, position: 'LD', birthDate: '05-10-1995', nationality: 'Colombia' },
  { slug: 'jugador-10', name: 'Yeicar Perlaza', number: 27, position: 'LD', birthDate: '24-01-2003', nationality: 'Colombia' },
  { slug: 'jugador-11', name: 'Jorman Campuzano', number: 21, position: 'MCD', birthDate: '30-04-1996', nationality: 'Colombia' },
  { slug: 'jugador-12', name: 'Matheus Uribe', number: 8, position: 'MCD', birthDate: '21-03-1991', nationality: 'Colombia' },
  { slug: 'jugador-13', name: 'Elkin Rivero', number: 26, position: 'MCD', birthDate: '27-02-2006', nationality: 'Colombia' },
  { slug: 'jugador-14', name: 'Juan Manuel Zapata', number: 80, position: 'MED', birthDate: '19-05-2000', nationality: 'Colombia' },
  { slug: 'jugador-15', name: 'Felipe Marín', number: 26, position: 'MED', birthDate: '02-04-2007', nationality: 'Colombia' },
  { slug: 'jugador-16', name: 'Edwin Cardona', number: 10, position: 'MCO', birthDate: '08-12-1992', nationality: 'Colombia' },
  { slug: 'jugador-17', name: 'Juan Manuel Rengifo', number: 19, position: 'MCO', birthDate: '02-04-2005', nationality: 'Colombia' },
  { slug: 'jugador-18', name: 'Elías Cabrera', number: 22, position: 'MCO', birthDate: '25-02-2003', nationality: 'Argentina' },
  { slug: 'jugador-19', name: 'James Rodríguez', number: 23, position: 'MCO', birthDate: '12-07-1991', nationality: 'Colombia' },
  { slug: 'jugador-20', name: 'Andrés Sarmiento', number: 29, position: 'EXI', birthDate: '15-01-1998', nationality: 'Colombia' },
  { slug: 'jugador-21', name: 'Kevin Parra', number: 30, position: 'EXI', birthDate: '22-02-2003', nationality: 'Colombia' },
  { slug: 'jugador-22', name: 'Marlos Moreno', number: 7, position: 'EXI', birthDate: '20-09-1996', nationality: 'Colombia' },
  { slug: 'jugador-23', name: 'Ian Poveda', number: 99, position: 'EXD', birthDate: '09-02-2000', nationality: 'Colombia' },
  { slug: 'jugador-24', name: 'Nicolás Rodríguez', number: 13, position: 'EXD', birthDate: '25-04-2004', nationality: 'Colombia' },
  { slug: 'jugador-25', name: 'Cristian Arango', number: 17, position: 'DEL', birthDate: '09-03-1995', nationality: 'Colombia' },
  { slug: 'jugador-26', name: 'Alfredo Morelos', number: 9, position: 'DEL', birthDate: '21-06-1996', nationality: 'Colombia' },
])

export const playerPhoto = (p: Pick<Player, 'slug' | 'photo'>) => p.photo ?? `/players/${p.slug}.jpg`