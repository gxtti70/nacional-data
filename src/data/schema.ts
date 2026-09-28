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
  photo: z.string().optional(),
})
export type Player = z.infer<typeof PlayerSchema>

export const SeasonStatSchema = z.object({ apps: z.number(), goals: z.number(), assists: z.number(), minutes: z.number() })
export type SeasonStat = z.infer<typeof SeasonStatSchema>

export const SeasonSchema = z.object({
  id: z.string(),
  label: z.string(),
  current: z.boolean().optional(),
  stats: z.record(z.string(), SeasonStatSchema),
})
export type Season = z.infer<typeof SeasonSchema>

export const GalleryItemSchema = z.object({
  id: z.string(),
  year: z.number(),
  title: z.string(),
  caption: z.string(),
  src: z.string(),
  credit: z.string(),
})
export type GalleryItem = z.infer<typeof GalleryItemSchema>