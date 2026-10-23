import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { players, playerPhoto } from './players'
import { currentSeason, seasons } from './seasons'
import { gallery } from './gallery'
import { legends } from './legends'
import attribution from './commons-attribution.json'
import { allTimeScorers } from './scorers'

const fileExists = (publicPath: string) => existsSync(join(process.cwd(), 'public', publicPath.replace(/^\//, '')))

describe('integridad del archivo de datos', () => {
  it('mantiene slugs únicos y referencias de temporada válidas', () => {
    const playerSlugs = new Set(players.map((player) => player.slug))
    expect(playerSlugs.size).toBe(players.length)
    for (const season of seasons) {
      for (const slug of Object.keys(season.stats)) expect(playerSlugs.has(slug), `${season.id}: ${slug}`).toBe(true)
    }
  })

  it('no repite dorsales en la plantilla publicada', () => {
    const numbers = players.map((player) => player.number)
    expect(new Set(numbers).size).toBe(numbers.length)
  })

  it('minutos coherentes con partidos', () => {
    for (const season of seasons)
      for (const [slug, st] of Object.entries(season.stats))
        expect(st.minutes, `${season.id}: ${slug}`).toBeLessThanOrEqual(st.apps * 120)
  })

  it('el desglose por competencia suma el total de goles', () => {
    for (const season of seasons) {
      for (const [slug, st] of Object.entries(season.stats)) {
        if (st.leagueGoals == null && st.cupGoals == null && st.continentalGoals == null) continue
        const split = (st.leagueGoals ?? 0) + (st.cupGoals ?? 0) + (st.continentalGoals ?? 0)
        expect(split, `${season.id}: ${slug}`).toBe(st.goals)
      }
    }
  })

  it('los goleadores sin ficha se documentan con goles positivos', () => {
    for (const scorer of currentSeason.others ?? []) {
      expect(Number.isInteger(scorer.goals), scorer.name).toBe(true)
      expect(scorer.goals, scorer.name).toBeGreaterThan(0)
    }
  })

  it('no pierde goles frente a la auditoría de ESPN', () => {
    // Línea base tras la auditoría del 23-10-2026: 85 goles = 75 liga + 9 copa + 1 Sudamericana.
    // Se usan cotas inferiores para que el cron pueda sumar partidos nuevos sin romper el test;
    // la igualdad total = liga + copa + continental se valida aquí y en cada jugador.
    const squadGoals = Object.values(currentSeason.stats).reduce((total, st) => total + st.goals, 0)
    const otherGoals = (currentSeason.others ?? []).reduce((total, scorer) => total + scorer.goals, 0)
    const squadLeagueGoals = Object.values(currentSeason.stats).reduce((total, st) => total + (st.leagueGoals ?? 0), 0)
    const cupGoals = Object.values(currentSeason.stats).reduce((total, st) => total + (st.cupGoals ?? 0), 0)
    const continentalGoals = Object.values(currentSeason.stats).reduce((total, st) => total + (st.continentalGoals ?? 0), 0)

    expect(squadGoals + otherGoals).toBeGreaterThanOrEqual(85)
    expect(squadLeagueGoals + otherGoals).toBeGreaterThanOrEqual(75)
    expect(cupGoals).toBeGreaterThanOrEqual(9)
    expect(continentalGoals).toBeGreaterThanOrEqual(1)
    expect(squadGoals).toBe(squadLeagueGoals + cupGoals + continentalGoals)
  })

  it('tiene archivo local para cada foto declarada', () => {
    for (const player of players) expect(fileExists(playerPhoto(player)), player.slug).toBe(true)
    for (const item of gallery) if (item.src) expect(fileExists(item.src), item.id).toBe(true)
    const legendImages = attribution.legends as Record<string, { src: string }>
    for (const legend of legends) {
      const image = legendImages[legend.slug]
      if (image) expect(fileExists(image.src), legend.slug).toBe(true)
    }
  })

  it('documenta fuente para cada cifra histórica de goles', () => {
    expect(allTimeScorers.length).toBeGreaterThan(0)
    for (const scorer of allTimeScorers) {
      expect(Number.isInteger(scorer.goals), scorer.name).toBe(true)
      expect(scorer.source, scorer.name).toMatch(/^https:\/\//)
      expect('trend' in scorer, `${scorer.name} no debe tener una tendencia inventada`).toBe(false)
    }
  })
})
