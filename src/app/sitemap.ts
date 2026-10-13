import type { MetadataRoute } from 'next'
import { players } from '@/data/players'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (!baseUrl) throw new Error('Configura NEXT_PUBLIC_SITE_URL para generar el sitemap')
  const routes = [
    '/', '/historia', '/plantilla', '/institucional', '/asistencias', '/goleadores',
    '/traspasos', '/partidos', '/leyendas', '/galeria',
  ]

  return [
    ...routes.map((route) => ({ url: new URL(route, baseUrl).toString(), changeFrequency: route === '/' ? 'weekly' as const : 'monthly' as const })),
    ...players.map((player) => ({ url: new URL(`/plantilla/${player.slug}`, baseUrl).toString(), changeFrequency: 'monthly' as const })),
  ]
}
