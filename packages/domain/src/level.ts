/** Niveles del juego: número de dígitos del secreto (RN-02). */
export const LEVELS = [3, 4, 5, 6] as const
export type Level = (typeof LEVELS)[number]

export function isLevel(value: unknown): value is Level {
  return typeof value === 'number' && (LEVELS as readonly number[]).includes(value)
}
