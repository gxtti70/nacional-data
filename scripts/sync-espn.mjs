#!/usr/bin/env node
/**
 * Sincroniza la plantilla de Atlético Nacional desde la API pública de ESPN
 * (sin key) y reescribe:
 *   - src/data/players.ts        (plantilla actual)
 *   - el bloque de la temporada actual en src/data/seasons.ts  (stats reales)
 *
 * Uso:
 *   node scripts/sync-espn.mjs --dry        # solo reporte, no escribe nada
 *   node scripts/sync-espn.mjs              # actualiza jugadores existentes
 *   node scripts/sync-espn.mjs --add-new    # además agrega jugadores nuevos del roster
 *   node scripts/sync-espn.mjs --refresh    # ignora la caché y vuelve a consultar ESPN
 *
 * Fuente: https://site.web.api.espn.com/apis/site/v2/sports/soccer/col.1/teams/5264
 * ESPN aplica rate-limit agresivo → las respuestas se cachean en src/data/raw/espn/
 * para re-ejecuciones offline. El cache se puede commitear para reproducibilidad.
 *
 * Limitaciones conocidas:
 *   - Posiciones: ESPN da G/D/M/F; las granulares (LI/LD/MCD/MCO/EXI/EXD) salen de
 *     src/data/position-overrides.ts (manual).
 *   - Minutos: ESPN no los expone en el endpoint público → se escriben como 0 (TODO).
 *   - Traspasos, leyendas, historia y galería NO tienen API → siguen manuales.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { z } from 'zod'

// ---------------------------------------------------------------- config
const ROOT = join(import.meta.dirname, '..')
const TEAM_ID = 5264 // Atlético Nacional en ESPN (liga col.1 = Liga BetPlay)
const ROSTER_URL = `https://site.web.api.espn.com/apis/site/v2/sports/soccer/col.1/teams/${TEAM_ID}/roster`
const ATHLETE_URL = (id) => `https://site.web.api.espn.com/apis/common/v3/sports/soccer/athletes/${id}`
const CACHE_DIR = join(ROOT, 'src/data/raw/espn')
const PLAYERS_TS = join(ROOT, 'src/data/players.ts')
const SEASONS_TS = join(ROOT, 'src/data/seasons.ts')
const OVERRIDES_TS = join(ROOT, 'src/data/position-overrides.ts')
const SCHEDULE_URL = `https://site.api.espn.com/apis/site/v2/sports/soccer/col.1/teams/${TEAM_ID}/schedule`
const FIXTURES_JSON = join(ROOT, 'src/data/raw/espn/schedule.json')
const FIXTURES_TS = join(ROOT, 'src/data/fixtures.ts')

// Jugadores del roster de ESPN que NO queremos en el archivo (ej. cantera).
// Rellenar con nombres tal como los reporta el --dry-run.
const EXCLUDE_NAMES = []

// Alias de nombres ESPN → nombre normalizado de players.ts.
// Para casos donde el matching difuso no alcanza (errores tipográficos de ESPN,
// nombres compuestos, apellidos maternos).
const ALIASES = {
  'yaicar perlaza': 'yeicar perlaza',
  'mateus uribe': 'matheus uribe',
  'ian poveda ocampo': 'ian poveda',
  'juan zapata': 'juan manuel zapata',
  'andres roman': 'andres felipe roman',
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
  photo: z.string().optional(),
  credit: z.string().optional(),
})
const SeasonStatSchema = z.object({ apps: z.number(), goals: z.number(), assists: z.number(), minutes: z.number() })
const SeasonSchema = z.object({
  id: z.string(),
  label: z.string(),
  current: z.boolean().optional(),
  stats: z.record(z.string(), SeasonStatSchema),
})

// ---------------------------------------------------------------- helpers
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function fetchJson(url, cacheFile, retries = 3) {
  if (!REFRESH && existsSync(cacheFile)) {
    return JSON.parse(readFileSync(cacheFile, 'utf8'))
  }
  let lastErr
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'nacional-portal-sync/1.0' } })
      if (!res.ok) throw new Error(`HTTP ${res.status} para ${url}`)
      const json = await res.json()
      // Roster vacío = rate-limit típico de ESPN; reintentar con backoff
      if (url.includes('/roster') && !extractAthletes(json).length) {
        if (i < retries - 1) {
          await sleep(2000 * (i + 1))
          continue
        }
        throw new Error(`Roster vacío tras ${retries} intentos (rate-limit de ESPN). Reintentar en unos minutos con --refresh.`)
      }
      mkdirSync(dirname(cacheFile), { recursive: true })
      writeFileSync(cacheFile, JSON.stringify(json, null, 2))
      return json
    } catch (err) {
      lastErr = err
      if (i < retries - 1) await sleep(2000 * (i + 1))
    }
  }
  throw lastErr
}

const normalizeName = (name = '') =>
  name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    // Los guiones/puntuación se convierten en espacio ("Poveda-Ocampo" → "poveda ocampo")
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

const parseStats = (statistics = [], seen) => {
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
    goals: num(['totalGoals', 'goals']),
    assists: num(['goalAssists', 'assists']),
    minutes: num(['minutes', 'minutesPlayed']),
  }
}

const seasonLabelFrom = (statsSummary) => {
  const m = String(statsSummary?.displayName ?? '').match(/(\d{4})/)
  return m ? m[1] : null
}

// Stats previos de una temporada (para conservar las de jugadores sin match en ESPN)
const parseSeasonStats = (seasonId) => {
  const src = readFileSync(SEASONS_TS, 'utf8')
  const m = src.match(new RegExp(`id: '${seasonId}'[\\s\\S]*?stats: \\{([\\s\\S]*?)\\n    \\}`))
  const out = {}
  if (m) {
    for (const e of m[1].matchAll(/'([^']+)':\s*s\((\d+),\s*(\d+),\s*(\d+),\s*(\d+)\)/g)) {
      out[e[1]] = { apps: +e[2], goals: +e[3], assists: +e[4], minutes: +e[5] }
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

// Matching difuso ESPN → players.ts. Devuelve {player, strategy} o null.
function matchPlayer(espnName, existingByNorm) {
  const norm = normalizeName(espnName)
  if (!norm) return null
  // 1. exacto
  if (existingByNorm.has(norm)) return { player: existingByNorm.get(norm), strategy: 'exacto' }
  // 2. alias conocido
  if (ALIASES[norm] && existingByNorm.has(ALIASES[norm])) {
    return { player: existingByNorm.get(ALIASES[norm]), strategy: 'alias' }
  }
  // 3. subconjunto de tokens con mismo apellido ("andres roman" ⊂ "andres felipe roman")
  const espnTokens = norm.split(' ')
  const espnLast = espnTokens[espnTokens.length - 1]
  for (const [key, player] of existingByNorm) {
    const keyTokens = key.split(' ')
    const allTokensIn = espnTokens.every((t) => keyTokens.includes(t)) || keyTokens.every((t) => espnTokens.includes(t))
    const sameLastName = keyTokens[keyTokens.length - 1] === espnLast
    if (allTokensIn && sameLastName && key !== norm) {
      return { player, strategy: 'tokens' }
    }
  }
  // 4. similar (levenshtein ≤ 2)
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

// ---------------------------------------------------------------- flujo
if (FIXTURES_ONLY) {
  const schedule = await fetchJson(SCHEDULE_URL, FIXTURES_JSON)
  const events = schedule.events ?? schedule.team?.events ?? []
  const fixtures = events.map((event) => {
    const competition = event.competitions?.[0] ?? {}
    const competitors = competition.competitors ?? []
    const home = competitors.find((team) => team.homeAway === 'home')
    const away = competitors.find((team) => team.homeAway === 'away')
    const status = competition.status ?? event.status ?? {}
    const type = status.type ?? {}
    return {
      id: String(event.id),
      date: event.date,
      competition: competition.competitors?.[0]?.team?.name ? (competition.series?.summary ?? competition.notes?.[0]?.headline ?? event.season?.name ?? 'Liga BetPlay') : 'Liga BetPlay',
      home: home?.team?.displayName ?? home?.team?.name ?? 'Por definir',
      away: away?.team?.displayName ?? away?.team?.name ?? 'Por definir',
      homeScore: Number.isFinite(Number(home?.score?.value ?? home?.score)) ? Number(home?.score?.value ?? home?.score) : null,
      awayScore: Number.isFinite(Number(away?.score?.value ?? away?.score)) ? Number(away?.score?.value ?? away?.score) : null,
      status: type.state ?? 'pre',
      statusDetail: type.detail ?? type.shortDetail ?? '',
    }
  }).filter((match) => match.date && match.id)
  if (!fixtures.length) throw new Error('ESPN no devolvió partidos para este equipo. Revisa el caché o reintenta con --refresh.')
  const q = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
  const lines = fixtures.map((f) => `  { id: ${q(f.id)}, date: ${q(f.date)}, competition: ${q(f.competition)}, home: ${q(f.home)}, away: ${q(f.away)}, homeScore: ${f.homeScore ?? 'null'}, awayScore: ${f.awayScore ?? 'null'}, status: ${q(f.status)}, statusDetail: ${q(f.statusDetail)} },`)
  writeFileSync(FIXTURES_TS, `import { z } from 'zod'\n\nexport const FixtureSchema = z.object({ id: z.string(), date: z.string(), competition: z.string(), home: z.string(), away: z.string(), homeScore: z.number().nullable(), awayScore: z.number().nullable(), status: z.string(), statusDetail: z.string() })\nexport type Fixture = z.infer<typeof FixtureSchema>\n\n// Generado desde ESPN por scripts/sync-espn.mjs\nexport const fixtures: Fixture[] = FixtureSchema.array().parse([\n${lines.join('\n')}\n])\n`)
  console.log(`✔ ${FIXTURES_TS} actualizado (${fixtures.length} partidos)`)
  process.exit(0)
}

const rosterJson = await fetchJson(ROSTER_URL, join(CACHE_DIR, 'roster.json'))
const athletes = extractAthletes(rosterJson)
if (!athletes.length) {
  console.error('Respuesta de roster inesperada. Keys:', Object.keys(rosterJson))
  process.exit(1)
}
console.log(`Roster ESPN: ${athletes.length} atletas (equipo ${TEAM_ID})`)

const existing = parsePlayersTs()
const overrides = parseOverrides()
const existingByNorm = new Map(existing.map((p) => [normalizeName(p.name), p]))

const seen = new Set()
const details = []
const seasonYears = []

for (const a of athletes) {
  const raw = await fetchJson(ATHLETE_URL(a.id), join(CACHE_DIR, 'athletes', `${a.id}.json`))
  const d = raw.athlete ?? raw
  const stats = parseStats(d.statsSummary?.statistics ?? [], seen)
  const year = seasonLabelFrom(d.statsSummary)
  if (year) seasonYears.push(year)
  details.push({
    espnId: String(a.id),
    name: d.displayName ?? a.displayName,
    jersey: Number(a.jersey ?? d.jersey ?? 0),
    coarse: a.position?.abbreviation ?? d.position?.abbreviation ?? '',
    dob: parseDob(d.displayDOB),
    nationality: d.citizenship ?? a.citizenship ?? '',
    stats,
  })
  await sleep(400) // cortesía ante el rate-limit de ESPN
}

const yearCounts = {}
seasonYears.forEach((y) => (yearCounts[y] = (yearCounts[y] ?? 0) + 1))
const seasonId = Object.entries(yearCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '2026'

// Merge: existente (preserva slug/foto) + nuevos (solo con --add-new)
let nextNum = existing.reduce(
  (max, p) => Math.max(max, Number(p.slug.match(/(\d+)/)?.[1] ?? 0)),
  0,
)
const merged = []
const matchedSlugs = new Set()
const report = {
  updated: [],
  added: [],
  potential: [],
  excluded: [],
  missingFromRoster: [],
  jerseyClash: [],
  noDob: [],
  noStats: [],
  keptStats: [],
}

for (const d of details) {
  const norm = normalizeName(d.name)
  if (EXCLUDE_NAMES.some((x) => normalizeName(x) === norm)) {
    report.excluded.push(d.name)
    continue
  }
  const match = matchPlayer(d.name, existingByNorm)
  if (match) {
    const prev = match.player
    matchedSlugs.add(prev.slug)
    merged.push({
      ...prev,
      number: d.jersey || prev.number,
      position: overrides[prev.slug] ?? COARSE_POSITION[d.coarse] ?? 'MED',
      birthDate: d.dob || prev.birthDate,
      nationality: d.nationality || prev.nationality,
    })
    if (!d.dob) report.noDob.push(d.name)
    if (d.stats.apps + d.stats.goals + d.stats.assists === 0) report.noStats.push(d.name)
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
      credit: 'Datos: ESPN',
    })
    if (!d.dob) report.noDob.push(d.name)
    report.added.push({ slug, d })
  } else {
    report.potential.push(d)
  }
}

// Jugadores actuales sin match en ESPN: se conservan (no se borran) y se reportan
for (const p of existing) {
  if (!matchedSlugs.has(p.slug)) {
    merged.push(p)
    const byJersey = details.find((d) => d.jersey && d.jersey === p.number)
    report.missingFromRoster.push({ player: p, jerseyHint: byJersey ?? null })
  }
}

// Orden estable por slug para el archivo generado
merged.sort((a, b) => a.slug.localeCompare(b.slug, undefined, { numeric: true }))

// Duplicados de dorsal en el resultado
const jerseySeen = new Map()
for (const p of merged) {
  if (jerseySeen.has(p.number)) report.jerseyClash.push([jerseySeen.get(p.number), p])
  else jerseySeen.set(p.number, p)
}

// Stats de la temporada: ESPN para los que casaron; las anteriores para el resto
const prevStats = parseSeasonStats(seasonId)
const seasonStats = { ...prevStats }
const keptStats = []
for (const p of merged) {
  const m = details.find((d) => matchPlayer(d.name, existingByNorm)?.player.slug === p.slug)
  if (m) seasonStats[p.slug] = m.stats
  else if (prevStats[p.slug]) keptStats.push(p.name)
}

// ---------------------------------------------------------------- reporte
console.log('\n================ ESPN SYNC — REPORTE ================')
console.log(`Temporada detectada en ESPN: ${seasonId}`)
console.log(`Plantilla actual: ${existing.length} · Roster ESPN: ${athletes.length} · Resultado: ${merged.length}`)
console.log(`\n~ Actualizados (${report.updated.length}):`)
for (const { prev, d, strategy } of report.updated) {
  const diffs = []
  if (prev.number !== d.jersey) diffs.push(`#${prev.number}→#${d.jersey}`)
  if (prev.birthDate !== d.dob) diffs.push(`DOB ${prev.birthDate}→${d.dob}`)
  if (prev.nationality !== d.nationality) diffs.push(`nac ${prev.nationality}→${d.nationality}`)
  console.log(
    `  ${prev.slug} ${d.name}  [${strategy}]${diffs.length ? '  (' + diffs.join(', ') + ')' : ''}  [${d.stats.apps}P ${d.stats.goals}G ${d.stats.assists}A]`,
  )
}
if (report.added.length) {
  console.log(`\n+ Nuevos agregados (${report.added.length}):`)
  for (const { slug, d } of report.added) {
    console.log(`  ${slug} ${d.name} (${COARSE_POSITION[d.coarse] ?? '?'} #${d.jersey})`)
  }
}
if (report.potential.length) {
  console.log(`\n+ Candidatos a nuevos del roster ESPN (${report.potential.length}) — usar --add-new para incluirlos:`)
  for (const d of report.potential) {
    console.log(`  ${d.name} (${COARSE_POSITION[d.coarse] ?? '?'} #${d.jersey}) ← revisar: ¿primera plantilla o cantera?`)
  }
}
if (report.excluded.length) {
  console.log(`\n− Excluidos por EXCLUDE_NAMES (${report.excluded.length}): ${report.excluded.join(', ')}`)
}
if (report.missingFromRoster.length) {
  console.log(`\n? Sin match en el roster de ESPN (${report.missingFromRoster.length}):`)
  for (const { player, jerseyHint } of report.missingFromRoster) {
    const hint = jerseyHint
      ? ` ← ¿es "${jerseyHint.name}" (#${jerseyHint.jersey})? Si sí, añadir alias en ALIASES`
      : ''
    console.log(`  ${player.slug} ${player.name}${hint}`)
  }
}
if (report.jerseyClash.length) {
  console.log(`\n! Dorsales duplicados en el resultado:`)
  for (const [a, b] of report.jerseyClash) console.log(`  #${a.number}: ${a.name} vs ${b.name}`)
}
console.log(`\n? Sin fecha de nacimiento en ESPN (${report.noDob.length}): ${report.noDob.join(', ') || 'ninguno'}`)
console.log(`? Sin stats de temporada (${report.noStats.length}): ${report.noStats.join(', ') || 'ninguno'}`)
if (keptStats.length) {
  console.log(`⚠ Conservan stats ANTERIORES (sin match en ESPN — verificar): ${keptStats.join(', ')}`)
}
console.log(`\nStats disponibles en ESPN: ${[...seen].join(', ')}`)
console.log('Nota: ESPN no expone minutos jugados → se escriben como 0 (TODO manual).')

if (DRY) {
  console.log('\n[dry-run] No se escribió nada. Revisa el reporte y re-run sin --dry.')
  process.exit(0)
}

// ---------------------------------------------------------------- validación (gate zod)
const parsedPlayers = PlayerSchema.array().parse(merged)
const newSeason = SeasonSchema.parse({ id: seasonId, label: seasonId, current: true, stats: seasonStats })

// ---------------------------------------------------------------- escribir players.ts
const q = (s) => `'${String(s).replace(/'/g, "\\'")}'`
const playerLines = parsedPlayers.map(
  (p) =>
    `  { slug: ${q(p.slug)}, name: ${q(p.name)}, number: ${p.number}, position: ${q(p.position)}, birthDate: ${q(p.birthDate)}, nationality: ${q(p.nationality)}${p.photo ? `, photo: ${q(p.photo)}` : ''}${p.credit ? `, credit: ${q(p.credit)}` : ''} },`,
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

// ---------------------------------------------------------------- escribir el bloque de temporada en seasons.ts
const s = (st) => `s(${st.apps}, ${st.goals}, ${st.assists}, ${st.minutes})`
const statEntries = Object.entries(newSeason.stats)
const statLines = []
for (let i = 0; i < statEntries.length; i += 3) {
  statLines.push('      ' + statEntries.slice(i, i + 3).map(([slug, st]) => `${q(slug)}: ${s(st)}`).join(', ') + ',')
}
const newBlock = `  {
    id: ${q(newSeason.id)}, label: ${q(newSeason.label)}, current: true,
    stats: {
${statLines.join('\n')}
    },
  },
]`

let seasonsSrc = readFileSync(SEASONS_TS, 'utf8')
const blockRe = new RegExp(`\\n  \\{\\n    id: ${q(seasonId)}[\\s\\S]*?\\n  \\},?\\n\\]`)
if (blockRe.test(seasonsSrc)) {
  seasonsSrc = seasonsSrc.replace(blockRe, '\n' + newBlock)
} else {
  // La temporada no existe todavía: añadir al final
  seasonsSrc = seasonsSrc.replace(/\n\]\s*$/, `,\n${newBlock}`)
}
writeFileSync(SEASONS_TS, seasonsSrc)
console.log(`✔ ${SEASONS_TS} actualizado (temporada ${newSeason.id}: ${statEntries.length} jugadores con stats)`)
console.log('\nListo. Verifica con: npm run build && npm run dev')
