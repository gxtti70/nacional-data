import { SeasonSchema, type Season } from './schema'

// `goals` es el total de la temporada (Liga BetPlay + Copa Colombia + Sudamericana).
// El desglose por competencia se muestra únicamente en la ficha del jugador.
// ESPN solo publica partidos y minutos de liga, por eso apps/minutes son de liga.
const s = (
  apps: number,
  goals: number,
  assists: number,
  minutes: number,
  leagueGoals = goals,
  cupGoals = 0,
  continentalGoals = 0,
) => ({ apps, goals, assists, minutes, leagueGoals, cupGoals, continentalGoals })

export const seasons: Season[] = SeasonSchema.array().parse([
  // sync:2026:start
  {
    id: '2026', label: '2026', current: true,
    stats: {
      'jugador-01': s(10, 0, 0, 0, 0, 0, 0), 'jugador-02': s(1, 0, 0, 0, 0, 0, 0), 'jugador-03': s(2, 1, 0, 0, 1, 0, 0),
      'jugador-04': s(13, 0, 2, 0, 0, 0, 0), 'jugador-06': s(26, 1, 2, 0, 1, 0, 0), 'jugador-08': s(26, 2, 2, 0, 2, 0, 0),
      'jugador-11': s(26, 1, 2, 0, 1, 0, 0), 'jugador-12': s(27, 2, 1, 0, 2, 0, 0), 'jugador-13': s(2, 0, 0, 0, 0, 0, 0),
      'jugador-15': s(6, 0, 1, 0, 0, 0, 0), 'jugador-16': s(29, 8, 4, 0, 8, 0, 0), 'jugador-17': s(32, 8, 7, 0, 8, 0, 0),
      'jugador-18': s(6, 1, 1, 0, 1, 0, 0), 'jugador-19': s(5, 0, 2, 0, 0, 0, 0), 'jugador-20': s(34, 10, 6, 0, 10, 0, 0),
      'jugador-21': s(4, 0, 1, 0, 0, 0, 0), 'jugador-23': s(8, 2, 2, 0, 2, 0, 0), 'jugador-24': s(21, 2, 6, 0, 0, 1, 1),
      'jugador-25': s(24, 2, 1, 0, 2, 0, 0), 'jugador-27': s(2, 1, 0, 0, 1, 0, 0), 'jugador-28': s(7, 1, 0, 0, 1, 0, 0),
      'jugador-29': s(3, 1, 0, 0, 1, 0, 0), 'jugador-05': s(19, 1, 1, 0, 0, 1, 0), 'jugador-07': s(16, 1, 1, 0, 0, 1, 0),
      'jugador-09': s(32, 5, 2, 0, 4, 1, 0), 'jugador-10': s(6, 1, 1, 0, 0, 1, 0), 'jugador-14': s(23, 2, 1, 0, 1, 1, 0),
      'jugador-22': s(30, 8, 2, 0, 7, 1, 0), 'jugador-26': s(30, 16, 6, 0, 14, 2, 0),
    },
    others: [
      { name: 'Dairon Asprilla', goals: 2 },
      { name: 'Eduard Bello', goals: 2 },
      { name: 'Simón García', goals: 2 },
      { name: 'José Escorcia', goals: 1 },
      { name: 'Juan Bauza', goals: 1 },
    ],
  },
// sync:2026:end
])

export const currentSeason = seasons.find((x) => x.current) ?? seasons[seasons.length - 1]
