import type { Level } from './level'

export interface Evaluation {
  /** Dígitos correctos en posición correcta (RN-05). */
  readonly bulls: number
  /** Dígitos presentes en el secreto pero en otra posición (RN-06). */
  readonly cows: number
}

/**
 * Evalúa `guess` contra `secret`. Precondición: ambas cadenas son válidas
 * (misma longitud, dígitos únicos); `validateGuess` lo garantiza aguas arriba.
 *
 * cows = |dígitos(guess) ∩ dígitos(secret)| − bulls. Con dígitos únicos esto
 * es exacto y, además, simétrico: evaluate(a, b) ≡ evaluate(b, a).
 */
export function evaluate(guess: string, secret: string): Evaluation {
  let bulls = 0
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === secret[i]) bulls++
  }
  const secretDigits = new Set(secret)
  let common = 0
  for (const d of guess) {
    if (secretDigits.has(d)) common++
  }
  return { bulls, cows: common - bulls }
}

export function isSolved(evaluation: Evaluation, level: Level): boolean {
  return evaluation.bulls === level
}
