import { SeasonSchema, type Season } from './schema'

const s = (apps: number, goals: number, assists: number, minutes: number) => ({ apps, goals, assists, minutes })

export const seasons: Season[] = SeasonSchema.array().parse([
  {
    id: '2024', label: '2024',
    stats: {
      'jugador-01': s(30, 0, 0, 2700), 'jugador-02': s(28, 1, 3, 2400), 'jugador-03': s(25, 2, 1, 2100),
      'jugador-04': s(31, 3, 5, 2650), 'jugador-05': s(20, 1, 1, 1800), 'jugador-06': s(29, 11, 4, 2300), 
      'jugador-07': s(20, 4, 6, 1500), 'jugador-08': s(18, 2, 2, 1400), 'jugador-09': s(22, 4, 5, 1900),
      'jugador-10': s(15, 1, 3, 1200), 'jugador-11': s(19, 3, 2, 1500), 'jugador-12': s(14, 0, 1, 1100),
      'jugador-13': s(21, 5, 4, 1750), 'jugador-14': s(16, 2, 2, 1300), 'jugador-15': s(25, 6, 7, 2100),
      // Nuevos jugadores (16 al 26) para 2024
      'jugador-16': s(18, 1, 2, 1400), 'jugador-17': s(22, 3, 4, 1850), 'jugador-18': s(12, 0, 1, 900),
      'jugador-19': s(26, 4, 3, 2100), 'jugador-20': s(15, 2, 1, 1200), 'jugador-21': s(20, 5, 2, 1650),
      'jugador-22': s(14, 1, 0, 1000), 'jugador-23': s(24, 2, 5, 2000), 'jugador-24': s(16, 0, 2, 1300),
      'jugador-25': s(19, 3, 3, 1550), 'jugador-26': s(21, 4, 4, 1750),
    },
  },
  {
    id: '2025', label: '2025',
    stats: {
      'jugador-01': s(34, 0, 0, 3060), 'jugador-02': s(30, 2, 4, 2650), 'jugador-03': s(27, 1, 0, 2300),
      'jugador-04': s(32, 4, 6, 2700), 'jugador-05': s(18, 2, 3, 1200), 'jugador-06': s(33, 16, 5, 2800),
      'jugador-07': s(30, 6, 8, 2400), 'jugador-08': s(24, 3, 4, 1950), 'jugador-09': s(28, 5, 6, 2300),
      'jugador-10': s(20, 2, 3, 1600), 'jugador-11': s(22, 4, 3, 1800), 'jugador-12': s(18, 1, 2, 1400),
      'jugador-13': s(26, 7, 5, 2200), 'jugador-14': s(21, 3, 3, 1700), 'jugador-15': s(29, 8, 9, 2500),
      // Nuevos jugadores (16 al 26) para 2025
      'jugador-16': s(24, 2, 3, 1900), 'jugador-17': s(28, 5, 6, 2350), 'jugador-18': s(16, 1, 2, 1250),
      'jugador-19': s(30, 6, 4, 2500), 'jugador-20': s(21, 3, 2, 1700), 'jugador-21': s(25, 7, 3, 2100),
      'jugador-22': s(18, 2, 1, 1400), 'jugador-23': s(29, 4, 7, 2450), 'jugador-24': s(20, 1, 3, 1600),
      'jugador-25': s(23, 4, 5, 1900), 'jugador-26': s(6, 6, 5, 2200),
    },
  },
  {
    id: '2026', label: '2026', current: true,
    stats: {
      'jugador-01': s(10, 0, 0, 1980), 'jugador-02': s(3, 0, 0, 1750), 'jugador-03': s(2, 1, 0, 1600),
      'jugador-04': s(1, 0, 1, 1800), 'jugador-05': s(4, 0, 0, 1700), 'jugador-06': s(9, 0, 0, 1750),
      'jugador-07': s(9, 1, 2, 1650), 'jugador-08': s(7, 0, 0, 1100), 'jugador-09': s(10, 0, 2, 1500),
      'jugador-10': s(6, 1, 1, 1100), 'jugador-11': s(6, 0, 0, 1300), 'jugador-12': s(4, 0, 1, 950),
      'jugador-13': s(0, 0, 0, 0), 'jugador-14': s(9, 2, 0, 1200), 'jugador-15': s(6, 0, 1, 1750),
      // Nuevos jugadores (16 al 26) para 2026
      'jugador-16': s(8, 2, 1, 1300), 'jugador-17': s(10, 0, 1, 1550), 'jugador-18': s(5, 1, 2, 850),
      'jugador-19': s(3, 0, 1, 106), 'jugador-20': s(10, 3, 1, 612), 'jugador-21': s(6, 0, 1, 195),
      'jugador-22': s(11, 5, 1, 179),  'jugador-23': s(7, 2, 1, 335), 'jugador-24': s(5, 1, 0, 202),
      'jugador-25': s(11, 0, 0, 357), 'jugador-26': s(9, 5, 2, 597),
    },
  },
])

export const currentSeason = seasons.find((x) => x.current) ?? seasons[seasons.length - 1]