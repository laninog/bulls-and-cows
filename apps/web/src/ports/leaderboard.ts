import type { Level } from '@bnc/domain'
import type { PlayerId } from './types'

export type BoardScope = { kind: 'global' } | { kind: 'country'; code: string }
export type BoardPeriod = 'all-time' | 'monthly'

export interface BoardSpec {
  readonly level: Level
  readonly scope: BoardScope
  readonly period: BoardPeriod
}

export interface LeaderboardEntry {
  readonly rank: number
  readonly alias: string
  readonly country: string | null
  readonly attempts: number
  readonly durationMs: number
}

/** Solo tiene adaptador remoto (F7). Definido aquí para que la app compile contra el contrato. */
export interface Leaderboard {
  top(board: BoardSpec, limit: number): Promise<LeaderboardEntry[]>
  positionOf(playerId: PlayerId, board: BoardSpec): Promise<number | null>
}
