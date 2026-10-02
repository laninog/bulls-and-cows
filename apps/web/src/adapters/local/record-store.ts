import type { Attempt, Level } from '@bnc/domain'
import type { GameId, GameMode, GameView, PlayerId } from '../../ports'

/** Fila persistida de una partida. Contiene el secreto: nunca sale tal cual hacia la UI. */
export interface GameRecord {
  readonly id: GameId
  readonly playerId: PlayerId
  readonly mode: GameMode
  readonly level: Level
  readonly secret: string
  readonly attempts: readonly Attempt[]
  readonly status: GameView['status']
  readonly startedAt: number
  readonly finishedAt: number | null
}

/**
 * Almacén mínimo de partidas. Dos implementaciones: memoria (tests) e
 * IndexedDB (navegador). Toda la lógica de juego vive fuera, en
 * `LocalGameSession`, para que ambas compartan exactamente el mismo
 * comportamiento y la misma suite de contrato.
 */
export interface GameRecordStore {
  put(record: GameRecord): Promise<void>
  get(id: GameId): Promise<GameRecord | null>
  listByPlayer(playerId: PlayerId, limit: number): Promise<GameRecord[]>
}
