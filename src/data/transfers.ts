export type Transfer = {
  player: string
  club: string
  window: string
  type: 'Fichaje' | 'Libre' | 'Cesión' | 'Cantera'
  fee?: string
  note?: string   // motivo, solo si está documentado
}

// Más recientes primero
export const arrivals: Transfer[] = [
  { player: 'James Rodríguez', club: 'Sin club', window: 'Sep 2026', type: 'Libre' },
  { player: 'Elías Cabrera', club: 'Vélez Sarsfield', window: 'Ago 2026', type: 'Cesión' },
  { player: 'Andrés Reyes', club: 'San Diego FC', window: 'Ago 2026', type: 'Libre' },
  { player: 'Ian Poveda', club: 'Inter Bogotá', window: 'Ago 2026', type: 'Libre' },
  { player: 'Franco Armani', club: 'River Plate', window: 'Jul 2026', type: 'Libre' },
  { player: 'César Haydar', club: 'Kawasaki Frontale', window: 'Jul 2026', type: 'Fichaje' },
  { player: 'Néider Parra', club: 'Atlético Nacional Sub-20', window: 'Feb 2026', type: 'Cantera' },
  { player: 'Cristian Arango', club: 'San Jose Earthquakes', window: 'Ene 2026', type: 'Cesión', fee: '€0,4 M' },
  { player: 'Alfredo Morelos', club: 'Santos FC', window: 'Ene 2026', type: 'Libre', note: 'Compra definitiva: el club lo firmó por tres temporadas adicionales.' },
  { player: 'Eduard Bello', club: 'Barcelona SC', window: 'Ene 2026', type: 'Libre' },
  { player: 'Kevin Cataño', club: 'Real Cundinamarca', window: 'Ene 2026', type: 'Fichaje', fee: '€0,5 M' },
  { player: 'Nicolás Rodríguez', club: 'Orlando City', window: 'Ene 2026', type: 'Cesión' },
  { player: 'Milton Casco', club: 'River Plate', window: 'Ene 2026', type: 'Libre' },
]

export const departures: Transfer[] = [
  { player: 'S. García', club: 'Rio Ave', window: 'Sep 2026', type: 'Fichaje', fee: '€2,3 M' },
  { player: 'Eduard Bello', club: 'Deportivo Cali', window: 'Ago 2026', type: 'Cesión' },
  { player: 'David Ospina', club: 'Atlante FC', window: 'Jul 2026', type: 'Libre' },
  { player: 'Kevin Cataño', club: 'Inter Bogotá', window: 'Jul 2026', type: 'Cesión' },
  { player: 'J. Arias', club: 'Real Salt Lake', window: 'Jul 2026', type: 'Fichaje', fee: '€1,7 M' },
  { player: 'Harlen Castillo', club: 'Gimnasia La Plata', window: 'Jul 2026', type: 'Libre' },
  { player: 'D. Asprilla', club: 'Bolívar', window: 'Jul 2026', type: 'Libre' },
  { player: 'J. Torres', club: 'Necaxa', window: 'Jul 2026', type: 'Fichaje', fee: '€1,3 M' },
  { player: 'Emilio Aristizábal', club: 'Toronto FC', window: 'Feb 2026', type: 'Cesión' },
  { player: 'R. Caicedo', club: 'Cercle Brugge', window: 'Feb 2026', type: 'Fichaje', fee: '€1,6 M' },
  { player: 'Andrés Salazar', club: 'Riga FC', window: 'Feb 2026', type: 'Fichaje' },
  { player: 'Jayder Asprilla', club: 'Sheriff', window: 'Feb 2026', type: 'Fichaje', fee: '€0,6 M' },
  { player: 'Marino Hinestroza', club: 'Vasco da Gama', window: 'Ene 2026', type: 'Fichaje', fee: '€5,2 M' },
  { player: 'Luis Marquinez', club: 'Deportes Tolima', window: 'Ene 2026', type: 'Cesión' },
  { player: 'Facundo Batista', club: 'Peñarol', window: 'Ene 2026', type: 'Fichaje', fee: '€0,4 M' },
  { player: 'Kilian Toscano', club: 'Santa Fe', window: 'Ene 2026', type: 'Cesión' },
  { player: 'Billy Arce', club: 'Sin club', window: 'Ene 2026', type: 'Libre' },
  { player: 'Yair Mena', club: 'Ferroviário', window: 'Ene 2026', type: 'Fichaje' },
]