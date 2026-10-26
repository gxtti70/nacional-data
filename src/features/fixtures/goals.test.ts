import { describe, expect, it } from 'vitest'
import type { Goal } from '@/data/fixtures'
import { goalLabel, splitGoals } from './goals'

const goal = (overrides: Partial<Goal>): Goal => ({ minute: "10'", player: 'Jugador', side: 'home', ...overrides })

describe('goles de un partido', () => {
  it('separa local y visitante conservando el orden', () => {
    const goals = [
      goal({ minute: "5'", player: 'A', side: 'away' }),
      goal({ minute: "20'", player: 'B', side: 'home' }),
      goal({ minute: "70'", player: 'C', side: 'away' }),
      goal({ minute: "80'", player: 'D', side: 'home' }),
    ]
    const { home, away } = splitGoals(goals)
    expect(home.map((item) => item.player)).toEqual(['B', 'D'])
    expect(away.map((item) => item.player)).toEqual(['A', 'C'])
  })

  it('acepta partidos sin goles', () => {
    expect(splitGoals(undefined)).toEqual({ home: [], away: [] })
    expect(splitGoals([])).toEqual({ home: [], away: [] })
  })

  it('etiqueta minuto y goleador, con penalti y autogol', () => {
    expect(goalLabel(goal({ minute: "53'", player: 'Edwin Cardona' }))).toBe("53' Edwin Cardona")
    expect(goalLabel(goal({ minute: "83'", player: 'Juan Díaz', penalty: true }))).toBe("83' Juan Díaz (pen.)")
    expect(goalLabel(goal({ minute: "42'", player: 'Frank Fabra', ownGoal: true }))).toBe("42' Frank Fabra (autogol)")
  })
})
