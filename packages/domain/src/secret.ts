import type { Level } from './level'
import type { RandomSource } from './random'

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const

/**
 * Genera un secreto de `level` dígitos distintos (RN-01). Puede empezar por
 * '0' (RN-03): el secreto es una cadena, no un número.
 *
 * Fisher-Yates parcial sobre los diez dígitos: cada permutación de `level`
 * dígitos es equiprobable, sin reintentos (el legacy hacía `i--` al repetir).
 */
export function generateSecret(level: Level, random: RandomSource): string {
  const pool: string[] = [...DIGITS]
  let out = ''
  for (let i = 0; i < level; i++) {
    const j = i + Math.floor(random() * (pool.length - i))
    const picked = pool[j] as string
    pool[j] = pool[i] as string
    pool[i] = picked
    out += picked
  }
  return out
}
