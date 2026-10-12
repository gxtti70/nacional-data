import type { Position } from './schema'

/**
 * Posiciones granulares por slug.
 *
 * ESPN solo clasifica G / D / M / F; este archivo afina a las 10 posiciones
 * del proyecto (POR, DEF, LI, LD, MCD, MED, MCO, EXD, EXI, DEL).
 *
 * Mantener al día al editar la plantilla a mano. Los jugadores nuevos que no
 * estén aquí reciben la posición genérica (POR/DEF/MED/DEL) hasta afinarse.
 */
export const positionOverrides: Record<string, Position> = {
  'jugador-01': 'POR',
  'jugador-02': 'POR',
  'jugador-03': 'DEF',
  'jugador-04': 'DEF',
  'jugador-05': 'DEF',
  'jugador-06': 'DEF',
  'jugador-07': 'LI',
  'jugador-08': 'LI',
  'jugador-09': 'LD',
  'jugador-10': 'LD',
  'jugador-11': 'MCD',
  'jugador-12': 'MCD',
  'jugador-13': 'MCD',
  'jugador-14': 'MED',
  'jugador-15': 'MED',
  'jugador-16': 'MCO',
  'jugador-17': 'MCO',
  'jugador-18': 'MCO',
  'jugador-19': 'MCO',
  'jugador-20': 'EXI',
  'jugador-21': 'EXI',
  'jugador-22': 'EXI',
  'jugador-23': 'EXD',
  'jugador-24': 'EXD',
  'jugador-25': 'DEL',
  'jugador-26': 'DEL',
}
