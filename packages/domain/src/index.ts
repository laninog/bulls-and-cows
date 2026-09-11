/**
 * Dominio de Bulls and Cows.
 *
 * Restricciones (ver docs/03-arquitectura-target.md §2.1):
 *  - Sin dependencias de ningún tipo.
 *  - Sin acceso directo a Math.random ni Date.now: se inyectan.
 *  - Se ejecuta sin cambios en navegador, en Cloudflare Workers y en tests.
 *
 * F1 sustituye este placeholder por el motor real.
 */

export const LEVELS = [3, 4, 5, 6] as const
export type Level = (typeof LEVELS)[number]

export function isLevel(value: unknown): value is Level {
  return typeof value === 'number' && (LEVELS as readonly number[]).includes(value)
}
