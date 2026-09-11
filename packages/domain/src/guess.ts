import type { Level } from './level'

export type GuessRejection = 'length' | 'non-digit' | 'repeated'

export type GuessValidation = { ok: true } | { ok: false; reason: GuessRejection }

/**
 * Un intento es válido si tiene exactamente `level` caracteres, todos dígitos
 * y sin repeticiones (RN-04). El orden de comprobación fija qué motivo se
 * devuelve cuando hay varios: primero longitud, luego alfabeto, luego repetidos.
 */
export function validateGuess(guess: string, level: Level): GuessValidation {
  if (guess.length !== level) return { ok: false, reason: 'length' }
  if (!/^[0-9]+$/.test(guess)) return { ok: false, reason: 'non-digit' }
  if (new Set(guess).size !== guess.length) return { ok: false, reason: 'repeated' }
  return { ok: true }
}
