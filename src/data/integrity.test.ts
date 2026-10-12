import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { players, playerPhoto } from './players'
import { seasons } from './seasons'
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
