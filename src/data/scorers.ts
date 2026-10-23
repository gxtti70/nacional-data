import { players, playerPhoto } from './players'
import { currentSeason, seasons } from './seasons'

// Totales publicados por ESPN al retiro de Duque (2024) y por Atlético Nacional (2022).
// Las fuentes difieren: el corte oficial de 2022 reportaba 206/131/90 para los tres primeros.
export const allTimeScorers = [
  { slug: 'historico-a', name: 'Víctor Hugo Aristizábal', position: 'DEL', goals: 208, sourceLabel: 'ESPN · 2024', source: 'https://www.espn.com.co/futbol/colombia/nota/_/id/13857738/los-numeros-de-jefferson-duque-en-atletico-nacional' },
  { slug: 'historico-b', name: 'John Jairo Tréllez', position: 'DEL', goals: 132, sourceLabel: 'ESPN · 2024', source: 'https://www.espn.com.co/futbol/colombia/nota/_/id/13857738/los-numeros-de-jefferson-duque-en-atletico-nacional' },
  { slug: 'historico-c', name: 'Jefferson Duque', position: 'DEL', goals: 122, sourceLabel: 'ESPN · 2024', source: 'https://www.espn.com.co/futbol/colombia/nota/_/id/13857738/los-numeros-de-jefferson-duque-en-atletico-nacional' },
  { slug: 'historico-d', name: 'Gustavo Santa Pulgarín', position: 'DEL', goals: 99, sourceLabel: 'Atlético Nacional · 2022', source: 'https://www.atlnacional.com.co/wp-content/uploads/2022/05/140-a-la-cancha-vs-CALDAS.pdf' },
  { slug: 'historico-e', name: 'Luis Humberto Álvarez', position: 'DEL', goals: 99, sourceLabel: 'Atlético Nacional · 2022', source: 'https://www.atlnacional.com.co/wp-content/uploads/2022/05/140-a-la-cancha-vs-CALDAS.pdf' },
]

// Goleadores de la temporada en la plantilla publicada (total de todas las competencias).
export const currentScorers = players
  .filter((p) => currentSeason.stats[p.slug])
  .map((p) => ({
    slug: p.slug, name: p.name, number: p.number, position: p.position, photo: playerPhoto(p),
    goals: currentSeason.stats[p.slug].goals,
    trend: seasons.map((s) => s.stats[p.slug]?.goals ?? 0),
    href: `/plantilla/${p.slug}`,
  }))
  .sort((a, b) => b.goals - a.goals)

// Anotadores que ya no tienen perfil en la plantilla publicada.
export const otherScorers = currentSeason.others ?? []
