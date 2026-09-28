import { players, playerPhoto } from './players'
import { currentSeason, seasons } from './seasons'

export const allTimeScorers = [
  { slug: 'historico-a', name: 'Víctor Hugo Aristizábal', position: 'DEL', goals: 206, trend: [8, 15, 22, 30, 27, 35, 40, 33] },
  { slug: 'historico-b', name: 'John Jairo Tréllez', position: 'DEL', goals: 131, trend: [5, 12, 20, 18, 25, 22, 30, 26] },
  { slug: 'historico-c', name: 'Jefferson Duque', position: 'DEL', goals: 121, trend: [3, 8, 14, 19, 22, 20, 25, 20] },
  { slug: 'historico-d', name: 'Gustavo Santa', position: 'DEL', goals: 102, trend: [10, 18, 16, 22, 15, 14, 12, 10] },
  { slug: 'historico-e', name: 'Humberto "Turrón" Álvarez', position: 'DEL', goals: 96, trend: [4, 9, 12, 15, 18, 14, 13, 11] },
]

export const currentScorers = players
  .filter((p) => currentSeason.stats[p.slug])
  .map((p) => ({
    slug: p.slug, name: p.name, number: p.number, position: p.position, photo: playerPhoto(p),
    goals: currentSeason.stats[p.slug].goals,
    trend: seasons.map((s) => s.stats[p.slug]?.goals ?? 0),
    href: `/plantilla/${p.slug}`,
  }))
  .sort((a, b) => b.goals - a.goals)
