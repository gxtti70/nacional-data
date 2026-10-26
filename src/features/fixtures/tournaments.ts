import type { Fixture } from '@/data/fixtures'

export type Tournament = 'apertura' | 'clausura' | 'copa' | 'sudamericana'

export const TOURNAMENT_FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: 'apertura', label: 'Apertura' },
  { id: 'clausura', label: 'Clausura' },
  { id: 'copa', label: 'Copa BetPlay' },
  { id: 'sudamericana', label: 'Sudamericana' },
] as const

export type TournamentFilter = (typeof TOURNAMENT_FILTERS)[number]['id']

export const TOURNAMENT_LABELS: Record<Tournament, string> = {
  apertura: 'Apertura',
  clausura: 'Clausura',
  copa: 'Copa BetPlay',
  sudamericana: 'Sudamericana',
}

/**
 * Clasifica un partido en uno de los torneos que se pueden filtrar.
 * Apertura/Clausura son exclusivos de la Liga BetPlay y se separan por
 * semestre (mes UTC, para que el borde junio/julio no dependa de la zona
 * horaria local). Copa y Sudamericana se identifican por su competencia.
 */
export function tournamentFor({ date, competition }: Pick<Fixture, 'date' | 'competition'>): Tournament {
  if (/copa/i.test(competition)) return 'copa'
  if (/sudamericana/i.test(competition)) return 'sudamericana'
  const month = new Date(date).getUTCMonth()
  return Number.isNaN(month) || month <= 5 ? 'apertura' : 'clausura'
}

// ESPN publica el nombre histórico; en la web mostramos el nombre comercial.
const COMPETITION_LABELS: Record<string, string> = {
  'Copa Colombia': 'Copa BetPlay',
}

export function competitionLabelFor(competition: string): string {
  return COMPETITION_LABELS[competition] ?? competition
}
