#!/usr/bin/env node
/** Descarga imágenes de Wikimedia Commons con licencias compatibles y guarda su atribución. */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

const ROOT = join(import.meta.dirname, '..')
const PUBLIC = join(ROOT, 'public')
const MANIFEST = join(ROOT, 'src/data/commons-attribution.json')
const REFRESH = process.argv.includes('--refresh')
const API = 'https://commons.wikimedia.org/w/api.php'
const UA = 'nacional-portal/1.0 (image attribution sync; educational archive)'

const galleryTargets = [
  ['1947-fundacion', 'Atlético Nacional Medellín historical team', /1947|nacional|medell[ií]n/i],
  ['1954-primer-titulo', 'Atlético Nacional 1954 campeón', /1954|nacional/i],
  ['1989-libertadores', 'Atlético Nacional 1989 Copa Libertadores campeón', /1989|nacional/i],
  ['1990-recopa', 'Atlético Nacional 1990 Recopa Sudamericana', /1990|nacional|recopa/i],
  ['2016-libertadores', 'Atlético Nacional 2016 Copa Libertadores campeón', /2016|nacional/i],
  ['estadio', 'Estadio Atanasio Girardot Medellín', /atanasio|girardot/i],
]
const legendTargets = [
  ['andres-escobar', 'Andrés Escobar footballer', /escobar/i],
  ['rene-higuita', 'René Higuita footballer', /higuita/i],
  ['victor-aristizabal', 'Víctor Aristizábal footballer', /aristiz[aá]bal/i],
  ['leonel-alvarez', 'Leonel Álvarez footballer', /álvarez|alvarez/i],
  ['francisco-maturana', 'Francisco Maturana football manager', /maturana/i],
]

const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'))
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const clean = (value) => String(value ?? '').replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&#39;/g, "'").trim()

async function getJson(url) {
  let lastError
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const response = await fetch(url, { headers: { 'User-Agent': UA } })
      if (!response.ok) throw new Error(`HTTP ${response.status} al consultar Wikimedia`)
      return response.json()
    } catch (error) {
      lastError = error
      await sleep(1500 * (attempt + 1))
    }
  }
  throw lastError
}

function allowedLicense(name) {
  return /^(CC BY(-SA)?|Creative Commons Attribution(-ShareAlike)?)\s*(1\.|2\.|3\.|4\.)/i.test(name) || /public domain/i.test(name)
}

async function findImage(query, expectedTitle) {
  const search = new URL(API)
  Object.entries({ action: 'query', generator: 'search', gsrsearch: query, gsrnamespace: '6', gsrlimit: '15', prop: 'imageinfo', iiprop: 'url|extmetadata', iiurlwidth: '1200', format: 'json', origin: '*' }).forEach(([k, v]) => search.searchParams.set(k, v))
  const data = await getJson(search)
  for (const page of Object.values(data.query?.pages ?? {})) {
    if (!expectedTitle.test(page.title)) continue
    const info = page.imageinfo?.[0]
    const meta = info?.extmetadata ?? {}
    const license = clean(meta.LicenseShortName?.value || meta.UsageTerms?.value)
    if (!info?.thumburl || !allowedLicense(license)) continue
    const author = clean(meta.Attribution?.value || meta.Artist?.value || meta.Credit?.value || 'Autor no indicado')
    return { title: page.title, url: info.thumburl, pageUrl: info.descriptionurl, author, license, licenseUrl: meta.LicenseUrl?.value ?? '', credit: `${author} · ${license} · Wikimedia Commons` }
  }
  return null
}

async function sync(items, folder, existing) {
  for (const [slug, query, expectedTitle] of items) {
    if (existing[slug] && !REFRESH) continue
    let result
    try {
      result = await findImage(query, expectedTitle)
    } catch (error) {
      console.warn(`No se pudo consultar ${slug}: ${error.message}`)
      await sleep(5000)
      continue
    }
    if (!result) {
      console.warn(`Sin imagen compatible para ${slug} (${query})`)
      continue
    }
    let bytes
    for (let attempt = 0; attempt < 4; attempt++) {
      try {
        const response = await fetch(result.url, { headers: { 'User-Agent': UA } })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        bytes = Buffer.from(await response.arrayBuffer())
        break
      } catch (error) {
        if (attempt === 3) throw new Error(`No se pudo descargar ${result.title}: ${error.message}`)
        await sleep(2000 * (attempt + 1))
      }
    }
    const src = `/${folder}/${slug}.jpg`
    const path = join(PUBLIC, folder, `${slug}.jpg`)
    mkdirSync(dirname(path), { recursive: true })
    writeFileSync(path, bytes)
    existing[slug] = { src, title: result.title.replace(/^File:/, ''), author: result.author, license: result.license, licenseUrl: result.licenseUrl, pageUrl: result.pageUrl, credit: result.credit }
    console.log(`✔ ${src} — ${result.credit}`)
    await sleep(1500)
  }
}

try {
  await sync(galleryTargets, 'gallery', manifest.gallery ??= {})
  await sync(legendTargets, 'legends', manifest.legends ??= {})
} finally {
  writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`)
  console.log(`Atribuciones actualizadas en ${MANIFEST}`)
}
