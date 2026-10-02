import type { Level, PlayResult } from '@bnc/domain'
import type { GameId, GameView } from './types'

/**
 * Jugar una partida. El adaptador es la autoridad: `guess` DEVUELVE la
 * evaluación, nunca la recibe (docs/03 §2.2). Local evalúa en el navegador;
 * remoto en el Worker, con el mismo paquete de dominio.
 */
export interface GameSession {
  start(level: Level): Promise<GameView>
  guess(id: GameId, value: string): Promise<{ outcome: PlayResult; game: GameView }>
  abandon(id: GameId): Promise<void>
  /** Recupera una partida en curso (p. ej. tras recargar). `null` si no existe o ya terminó. */
  resume(id: GameId): Promise<GameView | null>
}
