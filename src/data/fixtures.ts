import { z } from 'zod'

export const FixtureSchema = z.object({ id: z.string(), date: z.string(), competition: z.string(), home: z.string(), away: z.string(), homeScore: z.number().nullable(), awayScore: z.number().nullable(), status: z.string(), statusDetail: z.string() })
export type Fixture = z.infer<typeof FixtureSchema>

// Generado desde ESPN por scripts/sync-espn.mjs
export const fixtures: Fixture[] = FixtureSchema.array().parse([
  { id: '401877883', date: '2026-10-08T23:05Z', competition: 'Liga BetPlay', home: 'Atlético Nacional', away: 'Deportes Tolima', homeScore: 0, awayScore: 0, status: 'post', statusDetail: 'FT' },
  { id: '401877865', date: '2026-10-01T01:00Z', competition: 'Liga BetPlay', home: 'Atlético Nacional', away: 'Atlético Junior', homeScore: 3, awayScore: 1, status: 'post', statusDetail: 'FT' },
  { id: '401878053', date: '2026-09-25T00:30Z', competition: 'Liga BetPlay', home: 'Atlético Nacional', away: 'Millonarios', homeScore: 1, awayScore: 1, status: 'post', statusDetail: 'FT' },
  { id: '401877864', date: '2026-09-21T01:15Z', competition: 'Liga BetPlay', home: 'Llaneros FC', away: 'Atlético Nacional', homeScore: 2, awayScore: 0, status: 'post', statusDetail: 'FT' },
  { id: '401878010', date: '2026-09-17T01:20Z', competition: 'Liga BetPlay', home: 'Internacional de Bogotá', away: 'Atlético Nacional', homeScore: 2, awayScore: 3, status: 'post', statusDetail: 'FT' },
  { id: '401877948', date: '2026-09-13T21:05Z', competition: 'Liga BetPlay', home: 'Atlético Nacional', away: 'Águilas Doradas', homeScore: 2, awayScore: 0, status: 'post', statusDetail: 'FT' },
  { id: '401878039', date: '2026-08-30T01:30Z', competition: 'Liga BetPlay', home: 'Alianza FC', away: 'Atlético Nacional', homeScore: 1, awayScore: 5, status: 'post', statusDetail: 'FT' },
  { id: '401877897', date: '2026-08-27T01:30Z', competition: 'Liga BetPlay', home: 'Atlético Nacional', away: 'Deportivo Cali', homeScore: 2, awayScore: 1, status: 'post', statusDetail: 'FT' },
  { id: '401878016', date: '2026-08-23T19:00Z', competition: 'Liga BetPlay', home: 'Fortaleza CEIF', away: 'Atlético Nacional', homeScore: 1, awayScore: 2, status: 'post', statusDetail: 'FT' },
  { id: '401877857', date: '2026-08-10T01:15Z', competition: 'Liga BetPlay', home: 'América de Cali', away: 'Atlético Nacional', homeScore: 1, awayScore: 0, status: 'post', statusDetail: 'FT' },
  { id: '401877990', date: '2026-08-02T20:45Z', competition: 'Liga BetPlay', home: 'Jaguares de Córdoba', away: 'Atlético Nacional', homeScore: 0, awayScore: 3, status: 'post', statusDetail: 'FT' },
  { id: '401873659', date: '2026-06-08T22:00Z', competition: 'Liga BetPlay', home: 'Atlético Nacional', away: 'Atlético Junior', homeScore: 1, awayScore: 0, status: 'post', statusDetail: 'FT' },
  { id: '401873658', date: '2026-06-03T00:30Z', competition: 'Liga BetPlay', home: 'Atlético Junior', away: 'Atlético Nacional', homeScore: 3, awayScore: 0, status: 'post', statusDetail: 'FT' },
  { id: '401872653', date: '2026-05-23T23:00Z', competition: 'Liga BetPlay', home: 'Atlético Nacional', away: 'Deportes Tolima', homeScore: 3, awayScore: 1, status: 'post', statusDetail: 'FT' },
  { id: '401872651', date: '2026-05-16T23:00Z', competition: 'Liga BetPlay', home: 'Deportes Tolima', away: 'Atlético Nacional', homeScore: 0, awayScore: 1, status: 'post', statusDetail: 'FT' },
  { id: '401871522', date: '2026-05-12T23:20Z', competition: 'Liga BetPlay', home: 'Atlético Nacional', away: 'Internacional de Bogotá', homeScore: 7, awayScore: 1, status: 'post', statusDetail: 'FT' },
  { id: '401871518', date: '2026-05-09T21:00Z', competition: 'Liga BetPlay', home: 'Internacional de Bogotá', away: 'Atlético Nacional', homeScore: 1, awayScore: 2, status: 'post', statusDetail: 'FT' },
  { id: '401850892', date: '2026-05-01T23:00Z', competition: 'Liga BetPlay', home: 'Once Caldas', away: 'Atlético Nacional', homeScore: 1, awayScore: 0, status: 'post', statusDetail: 'FT' },
  { id: '401850884', date: '2026-04-25T21:00Z', competition: 'Liga BetPlay', home: 'Deportivo Pereira', away: 'Atlético Nacional', homeScore: 1, awayScore: 0, status: 'post', statusDetail: 'FT' },
  { id: '401850878', date: '2026-04-21T01:30Z', competition: 'Liga BetPlay', home: 'Atlético Nacional', away: 'Atlético Bucaramanga', homeScore: 2, awayScore: 0, status: 'post', statusDetail: 'FT' },
  { id: '401850864', date: '2026-04-12T01:20Z', competition: 'Liga BetPlay', home: 'Independiente Medellín', away: 'Atlético Nacional', homeScore: 2, awayScore: 3, status: 'post', statusDetail: 'FT' },
  { id: '401850727', date: '2026-04-07T01:10Z', competition: 'Liga BetPlay', home: 'Atlético Nacional', away: 'Jaguares de Córdoba', homeScore: 2, awayScore: 1, status: 'post', statusDetail: 'FT' },
  { id: '401850851', date: '2026-04-02T01:30Z', competition: 'Liga BetPlay', home: 'Atlético Nacional', away: 'Cúcuta Deportivo', homeScore: 0, awayScore: 0, status: 'post', statusDetail: 'FT' },
  { id: '401850844', date: '2026-03-29T23:20Z', competition: 'Liga BetPlay', home: 'Deportivo Pasto', away: 'Atlético Nacional', homeScore: 1, awayScore: 2, status: 'post', statusDetail: 'FT' },
  { id: '401850831', date: '2026-03-22T01:30Z', competition: 'Liga BetPlay', home: 'Atlético Nacional', away: 'Internacional de Bogotá', homeScore: 3, awayScore: 0, status: 'post', statusDetail: 'FT' },
  { id: '401850820', date: '2026-03-18T01:30Z', competition: 'Liga BetPlay', home: 'Millonarios', away: 'Atlético Nacional', homeScore: 3, awayScore: 0, status: 'post', statusDetail: 'FT' },
  { id: '401850809', date: '2026-03-14T01:30Z', competition: 'Liga BetPlay', home: 'Atlético Nacional', away: 'Llaneros FC', homeScore: 2, awayScore: 0, status: 'post', statusDetail: 'FT' },
  { id: '401850737', date: '2026-03-11T01:30Z', competition: 'Liga BetPlay', home: 'Atlético Junior', away: 'Atlético Nacional', homeScore: 0, awayScore: 4, status: 'post', statusDetail: 'FT' },
  { id: '401850807', date: '2026-03-07T21:00Z', competition: 'Liga BetPlay', home: 'Águilas Doradas', away: 'Atlético Nacional', homeScore: 1, awayScore: 2, status: 'post', statusDetail: 'FT' },
  { id: '401850797', date: '2026-03-02T01:30Z', competition: 'Liga BetPlay', home: 'Deportes Tolima', away: 'Atlético Nacional', homeScore: 1, awayScore: 0, status: 'post', statusDetail: 'FT' },
  { id: '401850753', date: '2026-02-26T00:00Z', competition: 'Liga BetPlay', home: 'Independiente Santa Fe', away: 'Atlético Nacional', homeScore: 1, awayScore: 2, status: 'post', statusDetail: 'FT' },
  { id: '401850783', date: '2026-02-21T23:20Z', competition: 'Liga BetPlay', home: 'Atlético Nacional', away: 'Alianza FC', homeScore: 3, awayScore: 0, status: 'post', statusDetail: 'FT' },
  { id: '401850774', date: '2026-02-15T23:30Z', competition: 'Liga BetPlay', home: 'Deportivo Cali', away: 'Atlético Nacional', homeScore: 1, awayScore: 0, status: 'post', statusDetail: 'FT' },
  { id: '401850767', date: '2026-02-13T01:30Z', competition: 'Liga BetPlay', home: 'Atlético Nacional', away: 'Fortaleza CEIF', homeScore: 4, awayScore: 1, status: 'post', statusDetail: 'FT' },
  { id: '401850747', date: '2026-02-05T01:00Z', competition: 'Liga BetPlay', home: 'Atlético Nacional', away: 'América de Cali', homeScore: 2, awayScore: 1, status: 'post', statusDetail: 'FT' },
  { id: '401843149', date: '2026-01-17T23:20Z', competition: 'Liga BetPlay', home: 'Atlético Nacional', away: 'Boyacá Chicó FC', homeScore: 4, awayScore: 0, status: 'post', statusDetail: 'FT' },
])
