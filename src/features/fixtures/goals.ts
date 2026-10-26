import type { Goal } from '@/data/fixtures'

export type GoalColumns = { home: Goal[]; away: Goal[] }

/** Reparte los goles del partido en las dos columnas del marcador. */
export function splitGoals(goals?: Goal[]): GoalColumns {
  const columns: GoalColumns = { home: [], away: [] }
  for (const goal of goals ?? []) columns[goal.side].push(goal)
  return columns
}

/** Texto de una línea de gol: minuto, goleador y marcas de penalti/autogol. */
export function goalLabel(goal: Goal): string {
  const notes: string[] = []
  if (goal.penalty) notes.push('pen.')
  if (goal.ownGoal) notes.push('autogol')
  const suffix = notes.length ? ` (${notes.join(', ')})` : ''
  return `${goal.minute} ${goal.player}${suffix}`
}
