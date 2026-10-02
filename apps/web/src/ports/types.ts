import type { Attempt, GameStatus, Level } from '@bnc/domain'

export type GameId = string
export type PlayerId = string

export type GameMode = 'casual' | 'ranked'

/**
 * Lo que la UI ve de una partida. Nunca incluye el secreto: en modo
 * clasificatorio el cliente no lo conoce, y en casual no lo necesita para
 * jugar. El secreto solo se expone en `GameDetail` de una partida terminada.
 */
export interface GameView {
  readonly id: GameId
  readonly mode: GameMode
  readonly level: Level
  readonly attempts: readonly Attempt[]
  readonly status: GameStatus | 'abandoned'
  readonly startedAt: number
  readonly finishedAt: number | null
}

export interface GameSummary {
  readonly id: GameId
  readonly mode: GameMode
  readonly level: Level
  readonly attempts: number
  readonly status: GameView['status']
  readonly startedAt: number
  readonly finishedAt: number | null
  readonly durationMs: number | null
}

export interface GameDetail extends GameView {
  /** Solo presente cuando la partida ha terminado. */
  readonly secret: string | null
}
