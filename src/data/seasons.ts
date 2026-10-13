import { SeasonSchema, type Season } from './schema'

const s = (apps: number, goals: number, assists: number, minutes: number) => ({ apps, goals, assists, minutes })

export const seasons: Season[] = SeasonSchema.array().parse([
  {
    id: '2026', label: '2026', current: true,
    stats: {
      'jugador-01': s(10, 0, 0, 0), 'jugador-02': s(1, 0, 0, 0), 'jugador-03': s(2, 1, 0, 0),
      'jugador-04': s(13, 0, 2, 0), 'jugador-05': s(19, 0, 1, 0), 'jugador-06': s(26, 1, 2, 0),
      'jugador-07': s(16, 0, 1, 0), 'jugador-08': s(26, 2, 2, 0), 'jugador-09': s(32, 4, 2, 0),
      'jugador-10': s(6, 0, 1, 0), 'jugador-11': s(26, 1, 1, 0), 'jugador-12': s(27, 2, 1, 0),
      'jugador-13': s(2, 0, 0, 0), 'jugador-14': s(23, 1, 0, 0), 'jugador-15': s(6, 0, 1, 0),
      'jugador-16': s(29, 6, 3, 0), 'jugador-17': s(32, 7, 7, 0), 'jugador-18': s(6, 1, 1, 0),
      'jugador-19': s(5, 0, 2, 0), 'jugador-20': s(34, 8, 6, 0), 'jugador-21': s(4, 0, 0, 0),
      'jugador-22': s(30, 7, 2, 0), 'jugador-23': s(8, 2, 2, 0), 'jugador-24': s(21, 0, 4, 0),
      'jugador-25': s(24, 2, 1, 0), 'jugador-26': s(30, 14, 6, 0),
    },
  },
])

export const currentSeason = seasons.find((x) => x.current) ?? seasons[seasons.length - 1]
