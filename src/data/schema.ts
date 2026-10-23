import { z } from 'zod'

export const PositionSchema = z.enum(['POR', 'DEF', 'LI', 'LD', 'MCD', 'MED', 'MCO', 'EXD', 'EXI', 'DEL'])
export type Position = z.infer<typeof PositionSchema>

export const PlayerSchema = z.object({
  slug: z.string(),
  name: z.string(),
  number: z.number(),
  position: PositionSchema,
  birthDate: z.string(),
  nationality: z.string(),
  // ID de ESPN usado por scripts/sync-espn.mjs para un matching estable.
  espnId: z.string().optional(),
  photo: z.string().optional(),
  credit: z.string().optional(),
})
export type Player = z.infer<typeof PlayerSchema>

// `goals` es el total de todas las competencias. El desglose es opcional para
// temporadas antiguas que solo registraban liga.
export const SeasonStatSchema = z.object({
  apps: z.number(),
  goals: z.number(),
  assists: z.number(),
  minutes: z.number(),
  leagueGoals: z.number().optional(),
  cupGoals: z.number().optional(),
  continentalGoals: z.number().optional(),
})
export type SeasonStat = z.infer<typeof SeasonStatSchema>

// Goleadores sin perfil en la plantilla publicada (p. ej. jugadores que ya salieron).
export const OtherScorerSchema = z.object({ name: z.string(), goals: z.number() })
export type OtherScorer = z.infer<typeof OtherScorerSchema>

export const SeasonSchema = z.object({
  id: z.string(),
  label: z.string(),
  current: z.boolean().optional(),
  stats: z.record(z.string(), SeasonStatSchema),
  others: OtherScorerSchema.array().optional(),
})
export type Season = z.infer<typeof SeasonSchema>

export const GalleryItemSchema = z.object({
  id: z.string(),
  year: z.number().optional(),
  title: z.string(),
  caption: z.string(),
  src: z.string().optional(),
  credit: z.string(),
  sourceUrl: z.string().optional(),
  licenseUrl: z.string().optional(),
})
export type GalleryItem = z.infer<typeof GalleryItemSchema>
