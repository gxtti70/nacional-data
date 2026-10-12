import { headers } from 'next/headers'
import type { MetadataRoute } from 'next'
import { players } from '@/data/players'

export const dynamic = 'force-dynamic'

export default function sitemap(): MetadataRoute.Sitemap {
  const requestHeaders = headers()
  const forwardedHost = requestHeaders.get('x-forwarded-host')?.split(',')[0].trim()
  const host = forwardedHost || requestHeaders.get('host') || 'localhost:3000'
  const forwardedProtocol = requestHeaders.get('x-forwarded-proto')?.split(',')[0].trim()
  const protocol = forwardedProtocol || (host.startsWith('localhost') ? 'http' : 'https')
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`
  const routes = [
    '/', '/historia', '/plantilla', '/institucional', '/asistencias', '/goleadores',
    '/traspasos', '/partidos', '/leyendas', '/galeria',
  ]

  return [
    ...routes.map((route) => ({ url: new URL(route, baseUrl).toString(), changeFrequency: route === '/' ? 'weekly' as const : 'monthly' as const })),
    ...players.map((player) => ({ url: new URL(`/plantilla/${player.slug}`, baseUrl).toString(), changeFrequency: 'monthly' as const })),
  ]
}
