import { describe, expect, it } from 'vitest'
import { fixtures } from '../../data/fixtures'
import { competitionLabelFor, tournamentFor } from './tournaments'

const fixture = (date: string, competition = 'Liga BetPlay') => ({ date, competition })

describe('tournamentFor', () => {
  it('clasifica la liga del primer semestre como Apertura', () => {
    expect(tournamentFor(fixture('2026-01-17T23:20Z'))).toBe('apertura')
    expect(tournamentFor(fixture('2026-06-30T23:59Z'))).toBe('apertura')
  })

  it('clasifica la liga del segundo semestre como Clausura', () => {
    expect(tournamentFor(fixture('2026-07-01T00:00Z'))).toBe('clausura')
    expect(tournamentFor(fixture('2026-12-31T23:59Z'))).toBe('clausura')
  })

  it('clasifica los partidos de Copa como Copa BetPlay sin importar la fecha', () => {
    expect(tournamentFor(fixture('2026-03-01T00:00Z', 'Copa Colombia'))).toBe('copa')
    expect(tournamentFor(fixture('2026-10-15T00:00Z', 'Copa Colombia'))).toBe('copa')
  })

  it('clasifica la Sudamericana en su propia categoría', () => {
    expect(tournamentFor(fixture('2026-03-05T00:30Z', 'Sudamericana'))).toBe('sudamericana')
  })

  it('asigna exactamente una categoría válida a todos los partidos sincronizados', () => {
    const valid = ['apertura', 'clausura', 'copa', 'sudamericana']
    for (const match of fixtures) {
      expect(valid, `${match.id} ${match.date}`).toContain(tournamentFor(match))
    }
  })
})

describe('competitionLabelFor', () => {
  it('muestra la Copa Colombia de ESPN como Copa BetPlay', () => {
    expect(competitionLabelFor('Copa Colombia')).toBe('Copa BetPlay')
  })

  it('deja intactas las demás competencias', () => {
    expect(competitionLabelFor('Liga BetPlay')).toBe('Liga BetPlay')
    expect(competitionLabelFor('Sudamericana')).toBe('Sudamericana')
  })
})
