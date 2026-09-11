import { evaluate, isSolved } from './evaluate'
import type { GuessRejection } from './guess'
import { validateGuess } from './guess'
import type { Level } from './level'
import type { RandomSource } from './random'
import { generateSecret } from './secret'

export interface Attempt {
  /** Ordinal 1-based; único dentro de la partida (BF-04). */
  readonly ordinal: number
  readonly guess: string
  readonly bulls: number
  readonly cows: number
}

export type GameStatus = 'in_progress' | 'won'

/**
 * Estado completo de una partida. Inmutable: `play` devuelve un estado nuevo.
 * Es solo datos, sin métodos: se serializa tal cual a IndexedDB o D1.
 *
 * `secret` está aquí porque el dominio lo necesita para evaluar; quién puede
 * ver este objeto es responsabilidad de la capa que lo custodia (en modo
 * clasificatorio, solo el Worker).
 */
export interface GameState {
  readonly level: Level
  readonly secret: string
  readonly attempts: readonly Attempt[]
  readonly status: GameStatus
}

export type PlayResult =
  | { readonly kind: 'invalid'; readonly reason: GuessRejection }
  | { readonly kind: 'evaluated'; readonly attempt: Attempt; readonly solved: boolean }
  | { readonly kind: 'finished' }

export function startGame(level: Level, random: RandomSource): GameState {
  return { level, secret: generateSecret(level, random), attempts: [], status: 'in_progress' }
}

/**
 * Juega un intento. Un intento inválido no consume turno ni se registra
 * (RN-08). Sobre una partida ya ganada no se puede jugar.
 */
export function play(state: GameState, guess: string): { state: GameState; result: PlayResult } {
  if (state.status === 'won') return { state, result: { kind: 'finished' } }

  const validation = validateGuess(guess, state.level)
  if (!validation.ok) return { state, result: { kind: 'invalid', reason: validation.reason } }

  const { bulls, cows } = evaluate(guess, state.secret)
  const attempt: Attempt = { ordinal: state.attempts.length + 1, guess, bulls, cows }
  const solved = isSolved({ bulls, cows }, state.level)
  const next: GameState = {
    ...state,
    attempts: [...state.attempts, attempt],
    status: solved ? 'won' : 'in_progress',
  }
  return { state: next, result: { kind: 'evaluated', attempt, solved } }
}
