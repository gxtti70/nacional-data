#!/usr/bin/env node
/**
 * Sincroniza Atlético Nacional desde la API pública de ESPN (sin key):
 *   - src/data/players.ts   plantilla actual
 *   - src/data/seasons.ts   goles/asistencias de Liga + Copa + Sudamericana y partidos de liga
 *   - src/data/fixtures.ts  calendario de Liga BetPlay, Copa Colombia y Sudamericana
 *
 * Uso:
 *   node scripts/sync-espn.mjs --dry        # solo reporte, no escribe nada
 *   node scripts/sync-espn.mjs              # sincroniza plantilla, stats y partidos
 *   node scripts/sync-espn.mjs --add-new    # además agrega jugadores nuevos del roster
 *   node scripts/sync-espn.mjs --refresh    # ignora la caché y vuelve a consultar ESPN
 *   node scripts/sync-espn.mjs --fixtures   # solo calendario/resultados
 *
 * Fuentes:
 *   https://site.web.api.espn.com/apis/site/v2/sports/soccer/col.1/teams/5264
 *   https://site.api.espn.com/apis/site/v2/sports/soccer/{liga}/summary?event={id}
 *
 * ESPN aplica rate-limit agresivo. Los calendarios compactos se guardan en
 * src/data/raw/espn/schedule-{liga}.json (se commitean) y los resúmenes grandes
 * de cada partido en src/data/raw/espn/.cache/ (ignorados por git).
 *
 * Limitaciones conocidas:
 *   - ESPN solo publica partidos y minutos de liga; Copa/Sudamericana no traen apps.
 *   - Minutos: ESPN no los expone en el endpoint público → se escriben como 0.
 *   - Posiciones granulares: salen de src/data/position-overrides.ts (manual).
 *   - Traspasos, leyendas, historia y galería NO tienen API → siguen manuales.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { z } from 'zod'

// ---------------------------------------------------------------- config
const ROOT = join(import.meta.dirname, '..')
const TEAM_ID = 5264 // Atlético Nacional en ESPN
const ROSTER_URL = `https://site.web.api.espn.com/apis/site/v2/sports/soccer/col.1/teams/${TEAM_ID}/roster`
const ATHLETE_URL = (id) => `https://site.web.api.espn.com/apis/common/v3/sports/soccer/athletes/${id}`
const SUMMARY_URL = (league, id) => `https://site.api.espn.com/apis/site/v2/sports/soccer/${league}/summary?event=${id}`
const SCHEDULE_URL = (league) => `https://site.api.espn.com/apis/site/v2/sports/soccer/${league}/teams/${TEAM_ID}/schedule`
const CACHE_DIR = join(ROOT, 'src/data/raw/espn')
const SUMMARY_CACHE_DIR = join(CACHE_DIR, '.cache')
const PLAYERS_TS = join(ROOT, 'src/data/players.ts')
const SEASONS_TS = join(ROOT, 'src/data/seasons.ts')
const FIXTURES_TS = join(ROOT, 'src/data/fixtures.ts')
const OVERRIDES_TS = join(ROOT, 'src/data/position-overrides.ts')

// Competencias que cuentan para los totales de la temporada.
const COMPETITIONS = [
  { key: 'col.1', label: 'Liga BetPlay', goalsField: 'leagueGoals' },
  { key: 'col.copa', label: 'Copa Colombia', goalsField: 'cupGoals' },
  { key: 'conmebol.sudamericana', label: 'Sudamericana', goalsField: 'continentalGoals' },
]

// Jugadores del roster de ESPN que NO queremos en el archivo (ej. cantera).
const EXCLUDE_NAMES = []

// Alias de nombres ESPN → nombre normalizado de players.ts.
const ALIASES = {
  'yaicar perlaza': 'yeicar perlaza',
  'mateus uribe': 'matheus uribe',
  'ian poveda ocampo': 'ian poveda',
  'juan zapata': 'juan manuel zapata',
  'andres roman': 'andres felipe roman',
}

// Nombres de anotadores sin ficha que ESPN reporta con nombre completo.
const OTHER_NAME_OVERRIDES = {
  'jose rafael escorcia de la cruz': 'José Escorcia',
}

const DRY = process.argv.includes('--dry')
const REFRESH = process.argv.includes('--refresh')
const ADD_NEW = process.argv.includes('--add-new')
const FIXTURES_ONLY = process.argv.includes('--fixtures')

// Espejo de src/data/schema.ts (no podemos importar .ts desde Node puro)
const POSITIONS = ['POR', 'DEF', 'LI', 'LD', 'MCD', 'MED', 'MCO', 'EXD', 'EXI', 'DEL']
const PlayerSchema = z.object({
  slug: z.string(),
  name: z.string(),
  number: z.number(),
  position: z.enum(POSITIONS),
  birthDate: z.string(),
  nationality: z.string(),
  espnId: z.string().optional(),
  photo: z.string().optional(),
  credit: z.string().optional(),
})
const SeasonStatSchema = z.object({
  apps: z.number(),
  goals: z.number(),
  assists: z.number(),
  minutes: z.number(),
  leagueGoals: z.number().optional(),
  cupGoals: z.number().optional(),
  continentalGoals: z.number().optional(),
})
const SeasonSchema = z.object({
  id: z.string(),
  label: z.string(),
  current: z.boolean().optional(),
  stats: z.record(z.string(), SeasonStatSchema),
  others: z.object({ name: z.string(), goals: z.number() }).array().optional(),
})

// ---------------------------------------------------------------- helpers
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const FIXTURE_FIELDS = {
  id: z.string(),
  date: z.string(),
  competition: z.string(),
  stage: z.string().optional(),
  home: z.string(),
  away: z.string(),
  homeScore: z.number().nullable(),
  awayScore: z.number().nullable(),
  status: z.string(),
  statusDetail: z.string(),
}

async function fetchRaw(url, retries = 3) {
  let lastErr
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'nacional-portal-sync/1.0' } })
      if (!res.ok) throw new Error(`HTTP ${res.status} para ${url}`)
      return await res.json()
    } catch (err) {
      lastErr = err
      if (i < retries - 1) await sleep(2000 * (i + 1))
    }
  }
  throw lastErr
}

async function fetchCached(url, cacheFile, retries = 3) {
  if (!REFRESH && existsSync(cacheFile)) return JSON.parse(readFileSync(cacheFile, 'utf8'))
  const json = await fetchRaw(url, retries)
  mkdirSync(dirname(cacheFile), { recursive: true })
  writeFileSync(cacheFile, JSON.stringify(json, null, 2))
  return json
}

const normalizeName = (name = '') =>
  name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

// ESPN sirve el roster en dos formas: {roster:{athletes:[…]}} o {athletes:[…]}
const extractAthletes = (json) => json?.roster?.athletes ?? json?.athletes ?? []

const parsePlayersTs = () => {
  const src = readFileSync(PLAYERS_TS, 'utf8')
  const start = src.indexOf('parse([')
  const end = src.indexOf('])', start)
  const body = src.slice(start + 'parse(['.length, end)
  return body
    .split('\n')
    .map((line) => line.trim().replace(/^,/, '').replace(/,$/, '').trim())
    .filter((line) => line.startsWith('{') && line.endsWith('}'))
    .map((line) => {
      const json = line.replace(/(\w+):/g, '"$1":').replace(/'/g, '"')
      return JSON.parse(json)
    })
}

const parseOverrides = () => {
  const src = readFileSync(OVERRIDES_TS, 'utf8')
  const out = {}
  for (const m of src.matchAll(/'([^']+)':\s*'(\w+)'/g)) out[m[1]] = m[2]
  return out
}

const COARSE_POSITION = { G: 'POR', D: 'DEF', M: 'MED', F: 'DEL' }

const parseDob = (dob) => {
  if (!dob) return ''
  const m = String(dob).match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (m) return `${m[1].padStart(2, '0')}-${m[2].padStart(2, '0')}-${m[3]}`
  return String(dob)
}

const parseLeagueStats = (statistics = [], seen) => {
  if (!statistics.length) return null
  const byName = new Map(statistics.map((s) => [s.name, s]))
  statistics.forEach((s) => seen.add(s.name))
  const starts = byName.get('starts-subIns')
  let apps = 0
  if (starts) {
    const m = String(starts.displayValue ?? '').match(/(\d+)\s*\((\d+)\)/)
    apps = m ? Number(m[1]) + Number(m[2]) : Number(starts.value ?? 0)
  }
  const num = (keys) => {
    for (const k of keys) if (byName.has(k)) return Number(byName.get(k).value ?? 0)
    return 0
  }
  return {
    apps,
    leagueGoals: num(['totalGoals', 'goals']),
    leagueAssists: num(['goalAssists', 'assists']),
    minutes: num(['minutes', 'minutesPlayed']),
  }
}

const seasonLabelFrom = (statsSummary) => {
  const m = String(statsSummary?.displayName ?? '').match(/(\d{4})/)
  return m ? m[1] : null
}

// Stats previos de una temporada (para conservar las de jugadores sin match en ESPN).
const parseSeasonStats = (seasonId) => {
  const src = readFileSync(SEASONS_TS, 'utf8')
  const start = src.indexOf(`// sync:${seasonId}:start`)
  const end = src.indexOf(`// sync:${seasonId}:end`)
  const body = start !== -1 && end !== -1 ? src.slice(start, end) : src
  const out = {}
  const re = /'([^']+)':\s*s\((\d+),\s*(\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+),\s*(\d+),\s*(\d+))?\)/g
  for (const e of body.matchAll(re)) {
    const goals = +e[3]
    out[e[1]] = {
      apps: +e[2],
      goals,
      assists: +e[4],
      minutes: +e[5],
      leagueGoals: e[6] != null ? +e[6] : goals,
      cupGoals: e[7] != null ? +e[7] : 0,
      continentalGoals: e[8] != null ? +e[8] : 0,
    }
  }
  return out
}

function levenshtein(a, b) {
  const m = a.length
  const n = b.length
  if (!m) return n
  if (!n) return m
  let prev = Array.from({ length: n + 1 }, (_, j) => j)
  for (let i = 1; i <= m; i++) {
    const curr = [i, ...Array(n).fill(0)]
    for (let j = 1; j <= n; j++) {
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
    }
    prev = curr
  }
  return prev[n]
}

// Matching ESPN → players.ts: espnId, exacto, alias, tokens, Levenshtein.
function matchPlayer(athlete, existingByNorm, existingByEspnId) {
  const id = String(athlete.id ?? athlete.espnId ?? '')
  if (id && existingByEspnId.has(id)) {
    return { player: existingByEspnId.get(id), strategy: 'espnId' }
  }
  const espnName = athlete.name ?? athlete.displayName ?? ''
  const norm = normalizeName(espnName)
  if (!norm) return null
  if (existingByNorm.has(norm)) return { player: existingByNorm.get(norm), strategy: 'exacto' }
  if (ALIASES[norm] && existingByNorm.has(ALIASES[norm])) {
    return { player: existingByNorm.get(ALIASES[norm]), strategy: 'alias' }
  }
  const espnTokens = norm.split(' ')
  const espnLast = espnTokens[espnTokens.length - 1]
  for (const [key, player] of existingByNorm) {
    const keyTokens = key.split(' ')
    const allTokensIn = espnTokens.every((t) => keyTokens.includes(t)) || keyTokens.every((t) => espnTokens.includes(t))
    const sameLastName = keyTokens[keyTokens.length - 1] === espnLast
    if (allTokensIn && sameLastName && key !== norm) return { player, strategy: 'tokens' }
  }
  let best = null
  let bestD = 3
  for (const [key, player] of existingByNorm) {
    const d = levenshtein(norm, key)
    if (d < bestD) {
      bestD = d
      best = player
    }
  }
  if (best) return { player: best, strategy: 'similar' }
  return null
}

// ---------------------------------------------------------------- calendario
const short = (value) => String(value ?? '').trim()

// ESPN etiqueta las llaves en inglés ("1st Leg", "2nd Leg", "Quarterfinals"…).
// Las dos primeras se traducen; el resto se deja tal cual.
function translateStage(text) {
  if (/^1(st)? leg$/i.test(text)) return 'Ida'
  if (/^2(nd)? leg$/i.test(text)) return 'Vuelta'
  return text
}

function stageLabel(competition) {
  const leg = competition?.leg?.leg
  if (leg) {
    if (Number(leg.value) === 1) return 'Ida'
    if (Number(leg.value) === 2) return 'Vuelta'
    const text = short(leg.displayValue)
    if (text) return translateStage(text)
  }
  const headline = short(competition?.notes?.find((note) => note.headline)?.headline)
  if (headline) {
    const legMatch = headline.match(/^(1st|2nd)\s+leg\b/i)
    if (legMatch) return translateStage(`${legMatch[1]} Leg`)
    if (!/advance|aggregate/i.test(headline)) return translateStage(headline)
  }
  return undefined
}

function compactEvent(event, competitionLabel) {
  const competition = event.competitions?.[0] ?? {}
  const competitors = competition.competitors ?? []
  const home = competitors.find((team) => team.homeAway === 'home')
  const away = competitors.find((team) => team.homeAway === 'away')
  const status = competition.status ?? event.status ?? {}
  const type = status.type ?? {}
  const state = type.state ?? 'pre'
  const score = (team) => {
    if (state !== 'post') return null
    const value = Number(team?.score?.value ?? team?.score)
    return Number.isFinite(value) ? value : null
  }
  return {
    id: String(event.id),
    date: event.date,
    competition: competitionLabel,
    stage: stageLabel(competition),
    home: home?.team?.displayName ?? home?.team?.name ?? 'Por definir',
    away: away?.team?.displayName ?? away?.team?.name ?? 'Por definir',
    homeScore: score(home),
    awayScore: score(away),
    status: state,
    statusDetail: short(type.detail || type.shortDetail),
    leagueKey: undefined,
  }
}

async function loadFixtures() {
  const all = []
  for (const competition of COMPETITIONS) {
    const cacheFile = join(CACHE_DIR, `schedule-${competition.key.replace(/\./g, '-')}.json`)
    let compact
    if (!REFRESH && existsSync(cacheFile)) {
      compact = JSON.parse(readFileSync(cacheFile, 'utf8'))
    } else {
      const schedule = await fetchRaw(SCHEDULE_URL(competition.key))
      const events = schedule.events ?? schedule.team?.events ?? []
      compact = events.map((event) => compactEvent(event, competition.label))
      mkdirSync(dirname(cacheFile), { recursive: true })
      writeFileSync(cacheFile, JSON.stringify(compact, null, 2))
      await sleep(500)
    }
    for (const match of compact) all.push({ ...match, leagueKey: competition.key })
  }
  // Un mismo partido puede aparecer en dos calendarios: se conserva la primera copia.
  const byId = new Map()
  for (const match of all) if (match.id && match.date && !byId.has(match.id)) byId.set(match.id, match)
  return [...byId.values()].sort((a, b) => b.date.localeCompare(a.date))
}

function writeFixtures(fixtures) {
  const q = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
  const lines = fixtures.map((f) => {
    const stage = f.stage ? `, stage: ${q(f.stage)}` : ''
    return `  { id: ${q(f.id)}, date: ${q(f.date)}, competition: ${q(f.competition)}${stage}, home: ${q(f.home)}, away: ${q(f.away)}, homeScore: ${f.homeScore ?? 'null'}, awayScore: ${f.awayScore ?? 'null'}, status: ${q(f.status)}, statusDetail: ${q(f.statusDetail)} },`
  })
  writeFileSync(
    FIXTURES_TS,
    `import { z } from 'zod'\n\nexport const FixtureSchema = z.object({ id: z.string(), date: z.string(), competition: z.string(), stage: z.string().optional(), home: z.string(), away: z.string(), homeScore: z.number().nullable(), awayScore: z.number().nullable(), status: z.string(), statusDetail: z.string() })\nexport type Fixture = z.infer<typeof FixtureSchema>\n\n// Generado desde ESPN por scripts/sync-espn.mjs\nexport const fixtures: Fixture[] = FixtureSchema.array().parse([\n${lines.join('\n')}\n])\n`,
  )
  console.log(`✔ ${FIXTURES_TS} actualizado (${fixtures.length} partidos)`)
}

if (FIXTURES_ONLY) {
  const fixtures = await loadFixtures()
  if (!fixtures.length) throw new Error('ESPN no devolvió partidos para este equipo. Revisa el caché o reintenta con --refresh.')
  if (DRY) {
    console.log(`[dry-run] ${fixtures.length} partidos (${COMPETITIONS.map((c) => c.label).join(', ')})`)
    process.exit(0)
  }
  writeFixtures(fixtures)
  process.exit(0)
}

// ---------------------------------------------------------------- goles y asistencias
const isOwnGoal = (event) => {
  const type = String(event.type?.type ?? '').toLowerCase()
  const text = String(event.type?.text ?? '').toLowerCase()
  return type.includes('own-goal') || text.includes('own goal')
}

const isNacionalGoal = (event) => event.scoringPlay === true && String(event.team?.id) === String(TEAM_ID) && !event.shootout

// Los keyEvents de ESPN enumeran goleador y asistente en `participants`.
function parseScoringEvents(summary) {
  const goals = []
  const assists = []
  for (const event of summary.keyEvents ?? []) {
    if (!isNacionalGoal(event)) continue
    const participants = event.participants ?? []
    const scorer = participants[0]?.athlete
    if (!scorer) continue
    if (isOwnGoal(event)) {
      // Cuenta para el marcador del equipo, no para las estadísticas del jugador.
      goals.push({ ownGoal: true, id: String(scorer.id ?? ''), name: scorer.displayName })
      continue
    }
    goals.push({ ownGoal: false, id: String(scorer.id ?? ''), name: scorer.displayName })
    const text = String(event.text ?? '')
    const assister = /assisted by/i.test(text) ? participants[1]?.athlete : null
    if (assister) assists.push({ id: String(assister.id ?? ''), name: assister.displayName })
  }
  return { goals, assists }
}

const nationalScore = (fixture) => {
  const isHome = fixture.home === 'Atlético Nacional' || /Atlético Nacional/i.test(fixture.home)
  const own = isHome ? fixture.homeScore : fixture.awayScore
  return Number.isFinite(Number(own)) ? Number(own) : null
}

async function aggregateCompetitions(fixtures, existingByNorm, existingByEspnId) {
  const totals = new Map() // espnId o nombre normalizado → acumulados
  const idToName = new Map()
  const events = []
  const warnings = []

  const bump = (key, name, competition, field) => {
    if (!key) return
    if (!totals.has(key)) totals.set(key, { name, byComp: {}, assists: 0 })
    const item = totals.get(key)
    if (name && !item.name) item.name = name
    if (field === 'goals') item.byComp[competition] = (item.byComp[competition] ?? 0) + 1
    if (field === 'assists') item.assists += 1
  }

  for (const fixture of fixtures) {
    if (fixture.status !== 'post') continue
    const competition = fixture.competition
    const summaryFile = join(SUMMARY_CACHE_DIR, `summary-${fixture.id}.json`)
    const summary = await fetchCached(SUMMARY_URL(fixture.leagueKey, fixture.id), summaryFile)
    const score = nationalScore(fixture)
    const { goals, assists } = parseScoringEvents(summary)
    const teamGoals = goals.length
    if (score == null) {
      warnings.push(`${fixture.id}: sin marcador disponible, no se valida`)
    } else if (teamGoals !== score) {
      throw new Error(
        `Inconsistencia en ${fixture.id} (${competition}): keyEvents=${teamGoals} goles, marcador=${score}. ` +
          `Revisa el resumen en ${summaryFile} o ejecuta con --refresh.`,
      )
    }
    events.push({ id: fixture.id, competition, score, teamGoals })
    for (const goal of goals) {
      if (goal.ownGoal) continue
      const key = goal.id || normalizeName(goal.name)
      const name = idToName.get(key) ?? goal.name
      if (!idToName.has(key)) idToName.set(key, goal.name)
      bump(key, name, competition, 'goals')
    }
    for (const assist of assists) {
      const key = assist.id || normalizeName(assist.name)
      if (!idToName.has(key)) idToName.set(key, assist.name)
      bump(key, idToName.get(key), competition, 'assists')
    }
    await sleep(250)
  }

  // Resolver cada goleador a un jugador de la plantilla (por id ESPN o nombre).
  const resolved = new Map() // slug → acumulado
  const others = new Map() // nombre normalizado → { name, goals }
  for (const [key, item] of totals) {
    const athlete = { id: key, name: item.name }
    const match = matchPlayer(athlete, existingByNorm, existingByEspnId)
    const goals = Object.values(item.byComp).reduce((total, value) => total + value, 0)
    if (match) {
      const slug = match.player.slug
      const acc = resolved.get(slug) ?? { goals: 0, assists: 0, leagueGoals: 0, cupGoals: 0, continentalGoals: 0 }
      acc.goals += goals
      acc.assists += item.assists
      acc.leagueGoals += item.byComp['Liga BetPlay'] ?? 0
      acc.cupGoals += item.byComp['Copa Colombia'] ?? 0
      acc.continentalGoals += item.byComp['Sudamericana'] ?? 0
      resolved.set(slug, acc)
    } else if (goals > 0) {
      const norm = normalizeName(item.name)
      const name = OTHER_NAME_OVERRIDES[norm] ?? item.name
      const acc = others.get(norm) ?? { name, goals: 0 }
      acc.goals += goals
      others.set(norm, acc)
    }
  }

  return { resolved, others: [...others.values()].sort((a, b) => b.goals - a.goals || a.name.localeCompare(b.name)), events, warnings }
}

// ---------------------------------------------------------------- flujo principal
const rosterJson = await fetchCached(ROSTER_URL, join(CACHE_DIR, 'roster.json'))
const athletes = extractAthletes(rosterJson)
if (!athletes.length) {
  console.error('Respuesta de roster inesperada. Keys:', Object.keys(rosterJson))
  process.exit(1)
}
console.log(`Roster ESPN: ${athletes.length} atletas (equipo ${TEAM_ID})`)

const existing = parsePlayersTs()
const overrides = parseOverrides()
const existingByNorm = new Map(existing.map((p) => [normalizeName(p.name), p]))
const existingByEspnId = new Map(existing.filter((p) => p.espnId).map((p) => [String(p.espnId), p]))

const seen = new Set()
const details = []
const seasonYears = []

for (const a of athletes) {
  const raw = await fetchCached(ATHLETE_URL(a.id), join(CACHE_DIR, 'athletes', `${a.id}.json`))
  const d = raw.athlete ?? raw
  const stats = parseLeagueStats(d.statsSummary?.statistics ?? [], seen)
  const year = seasonLabelFrom(d.statsSummary)
  if (year) seasonYears.push(year)
  details.push({
    espnId: String(a.id),
    id: String(a.id),
    name: d.displayName ?? a.displayName,
    jersey: Number(a.jersey ?? d.jersey ?? 0),
    coarse: a.position?.abbreviation ?? d.position?.abbreviation ?? '',
    dob: parseDob(d.displayDOB),
    nationality: d.citizenship ?? a.citizenship ?? '',
    stats,
  })
  await sleep(350) // cortesía ante el rate-limit de ESPN
}

const yearCounts = {}
seasonYears.forEach((y) => (yearCounts[y] = (yearCounts[y] ?? 0) + 1))
const seasonId = Object.entries(yearCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '2026'

const fixtures = await loadFixtures()
console.log(`Partidos ESPN: ${fixtures.length} (${COMPETITIONS.map((c) => c.label).join(' + ')})`)
const { resolved, others, events, warnings } = await aggregateCompetitions(fixtures, existingByNorm, existingByEspnId)

// Merge: existente (preserva slug/foto) + nuevos (solo con --add-new)
let nextNum = existing.reduce((max, p) => Math.max(max, Number(p.slug.match(/(\d+)/)?.[1] ?? 0)), 0)
const merged = []
const matchedSlugs = new Set()
const report = { updated: [], added: [], potential: [], excluded: [], missingFromRoster: [], jerseyClash: [], noDob: [], noStats: [], keptStats: [] }

for (const d of details) {
  const norm = normalizeName(d.name)
  if (EXCLUDE_NAMES.some((x) => normalizeName(x) === norm)) {
    report.excluded.push(d.name)
    continue
  }
  const match = matchPlayer(d, existingByNorm, existingByEspnId)
  if (match) {
    const prev = match.player
    matchedSlugs.add(prev.slug)
    merged.push({
      ...prev,
      espnId: d.espnId,
      number: d.jersey || prev.number,
      position: overrides[prev.slug] ?? prev.position ?? COARSE_POSITION[d.coarse] ?? 'MED',
      birthDate: d.dob || prev.birthDate,
      nationality: d.nationality || prev.nationality,
    })
    if (!d.dob) report.noDob.push(d.name)
    if (d.stats && d.stats.apps + d.stats.leagueGoals + d.stats.leagueAssists === 0) report.noStats.push(d.name)
    report.updated.push({ prev, d, strategy: match.strategy })
  } else if (ADD_NEW) {
    const slug = `jugador-${String(nextNum).padStart(2, '0')}`
    nextNum += 1
    merged.push({
      slug,
      name: d.name,
      number: d.jersey,
      position: COARSE_POSITION[d.coarse] ?? 'MED',
      birthDate: d.dob,
      nationality: d.nationality,
      espnId: d.espnId,
      credit: 'Datos: ESPN',
    })
    if (!d.dob) report.noDob.push(d.name)
    report.added.push({ slug, d })
  } else {
    report.potential.push(d)
  }
}

for (const p of existing) {
  if (!matchedSlugs.has(p.slug)) {
    merged.push(p)
    const byJersey = details.find((d) => d.jersey && d.jersey === p.number)
    report.missingFromRoster.push({ player: p, jerseyHint: byJersey ?? null })
  }
}

merged.sort((a, b) => a.slug.localeCompare(b.slug, undefined, { numeric: true }))

const jerseySeen = new Map()
for (const p of merged) {
  if (jerseySeen.has(p.number)) report.jerseyClash.push([jerseySeen.get(p.number), p])
  else jerseySeen.set(p.number, p)
}

// Stats: goles/asistencias de todas las competencias; partidos solo de liga.
const prevStats = parseSeasonStats(seasonId)
const seasonStats = { ...prevStats }
const keptStats = []
for (const p of merged) {
  const goals = resolved.get(p.slug)
  if (goals) {
    seasonStats[p.slug] = {
      apps: details.find((d) => d.espnId === p.espnId)?.stats?.apps ?? prevStats[p.slug]?.apps ?? 0,
      goals: goals.goals,
      assists: goals.assists,
      minutes: 0,
      leagueGoals: goals.leagueGoals,
      cupGoals: goals.cupGoals,
      continentalGoals: goals.continentalGoals,
    }
  } else if (prevStats[p.slug]) {
    keptStats.push(p.name)
  } else {
    const league = details.find((d) => d.espnId === p.espnId)?.stats
    seasonStats[p.slug] = {
      apps: league?.apps ?? 0,
      goals: 0,
      assists: 0,
      minutes: 0,
      leagueGoals: 0,
      cupGoals: 0,
      continentalGoals: 0,
    }
  }
}

// Partidos con goles de ESPN que no coinciden con el marcador ya se abortaron arriba.
for (const warning of warnings) console.warn(`⚠ ${warning}`)

// ---------------------------------------------------------------- reporte
console.log('\n================ ESPN SYNC — REPORTE ================')
console.log(`Temporada detectada en ESPN: ${seasonId}`)
console.log(`Plantilla actual: ${existing.length} · Roster ESPN: ${athletes.length} · Resultado: ${merged.length}`)
console.log(`Partidos con detalle: ${events.length} · Goles de jugadores: ${Object.values(Object.fromEntries(resolved)).reduce((t, s) => t + s.goals, 0)}`)
console.log(`\n~ Actualizados (${report.updated.length}):`)
for (const { prev, d, strategy } of report.updated) {
  const diffs = []
  if (prev.number !== d.jersey) diffs.push(`#${prev.number}→#${d.jersey}`)
  if (prev.birthDate !== d.dob) diffs.push(`DOB ${prev.birthDate}→${d.dob}`)
  if (prev.nationality !== d.nationality) diffs.push(`nac ${prev.nationality}→${d.nationality}`)
  console.log(`  ${prev.slug} ${d.name}  [${strategy}]${diffs.length ? '  (' + diffs.join(', ') + ')' : ''}`)
}
if (report.added.length) {
  console.log(`\n+ Nuevos agregados (${report.added.length}):`)
  for (const { slug, d } of report.added) console.log(`  ${slug} ${d.name} (${COARSE_POSITION[d.coarse] ?? '?'} #${d.jersey})`)
}
if (report.potential.length) {
  console.log(`\n+ Candidatos a nuevos del roster ESPN (${report.potential.length}) — usar --add-new para incluirlos:`)
  for (const d of report.potential) console.log(`  ${d.name} (${COARSE_POSITION[d.coarse] ?? '?'} #${d.jersey}) ← ¿primera plantilla o cantera?`)
}
if (report.excluded.length) console.log(`\n− Excluidos por EXCLUDE_NAMES (${report.excluded.length}): ${report.excluded.join(', ')}`)
if (report.missingFromRoster.length) {
  console.log(`\n? Sin match en el roster de ESPN (${report.missingFromRoster.length}):`)
  for (const { player, jerseyHint } of report.missingFromRoster) {
    const hint = jerseyHint ? ` ← ¿es "${jerseyHint.name}" (#${jerseyHint.jersey})? Si sí, añadir alias en ALIASES` : ''
    console.log(`  ${player.slug} ${player.name}${hint}`)
  }
}
if (report.jerseyClash.length) {
  console.log(`\n! Dorsales duplicados en el resultado:`)
  for (const [a, b] of report.jerseyClash) console.log(`  #${a.number}: ${a.name} vs ${b.name}`)
}
console.log(`\n? Sin fecha de nacimiento en ESPN (${report.noDob.length}): ${report.noDob.join(', ') || 'ninguno'}`)
console.log(`? Sin stats de liga (${report.noStats.length}): ${report.noStats.join(', ') || 'ninguno'}`)
if (keptStats.length) console.log(`⚠ Conservan stats ANTERIORES (sin match en ESPN — verificar): ${keptStats.join(', ')}`)
if (others.length) console.log(`\nOtros goleadores (${others.length}): ${others.map((o) => `${o.name} (${o.goals})`).join(' · ')}`)
console.log(`\nStats disponibles en ESPN: ${[...seen].join(', ')}`)
console.log('Nota: ESPN no expone minutos jugados → se escriben como 0 (TODO manual).')

if (DRY) {
  console.log('\n[dry-run] No se escribió nada. Revisa el reporte y re-run sin --dry.')
  process.exit(0)
}

// ---------------------------------------------------------------- validación (gate zod)
const parsedPlayers = PlayerSchema.array().parse(merged)
const newSeason = SeasonSchema.parse({
  id: seasonId,
  label: seasonId,
  current: true,
  stats: seasonStats,
  others: others.length ? others : undefined,
})

// ---------------------------------------------------------------- escribir players.ts
const q = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
const playerLines = parsedPlayers.map(
  (p) =>
    `  { slug: ${q(p.slug)}, name: ${q(p.name)}, number: ${p.number}, position: ${q(p.position)}, birthDate: ${q(p.birthDate)}, nationality: ${q(p.nationality)}${p.espnId ? `, espnId: ${q(p.espnId)}` : ''}${p.photo ? `, photo: ${q(p.photo)}` : ''}${p.credit ? `, credit: ${q(p.credit)}` : ''} },`,
)
const playersTs = `import { PlayerSchema, type Player } from './schema'

// Sincronizado desde ESPN (site.web.api.espn.com) con scripts/sync-espn.mjs
// Las posiciones granulares se afinan en src/data/position-overrides.ts
export const players: Player[] = PlayerSchema.array().parse([
${playerLines.join('\n')}
])

export const playerPhoto = (p: Pick<Player, 'slug' | 'photo'>) => p.photo ?? \`/players/\${p.slug}.webp\`
`
writeFileSync(PLAYERS_TS, playersTs)
console.log(`\n✔ ${PLAYERS_TS} reescrito (${parsedPlayers.length} jugadores)`)

// ---------------------------------------------------------------- escribir la temporada en seasons.ts
const s = (st) => `s(${st.apps}, ${st.goals}, ${st.assists}, ${st.minutes}, ${st.leagueGoals ?? 0}, ${st.cupGoals ?? 0}, ${st.continentalGoals ?? 0})`
const statEntries = Object.entries(newSeason.stats)
const statLines = []
for (let i = 0; i < statEntries.length; i += 3) {
  statLines.push('      ' + statEntries.slice(i, i + 3).map(([slug, st]) => `${q(slug)}: ${s(st)}`).join(', ') + ',')
}
const othersLines = (newSeason.others ?? []).map((other) => `      { name: ${q(other.name)}, goals: ${other.goals} },`)
const block = `// sync:${newSeason.id}:start
  {
    id: ${q(newSeason.id)}, label: ${q(newSeason.label)}, current: true,
    stats: {
${statLines.join('\n')}
    },${othersLines.length ? `\n    others: [\n${othersLines.join('\n')}\n    ],` : ''}
  },
// sync:${newSeason.id}:end`

let seasonsSrc = readFileSync(SEASONS_TS, 'utf8')
const blockRe = new RegExp(`// sync:${newSeason.id}:start[\\s\\S]*?// sync:${newSeason.id}:end`)
if (blockRe.test(seasonsSrc)) {
  seasonsSrc = seasonsSrc.replace(blockRe, block)
} else {
  seasonsSrc = seasonsSrc.replace(/\n\]\s*$/, `,\n${block}\n]`)
}
writeFileSync(SEASONS_TS, seasonsSrc)
console.log(`✔ ${SEASONS_TS} actualizado (temporada ${newSeason.id}: ${statEntries.length} jugadores, ${others.length} otros)`)

// ---------------------------------------------------------------- escribir fixtures.ts
writeFixtures(fixtures)
console.log('\nListo. Verifica con: npm test && npx tsc --noEmit && npm run build')
