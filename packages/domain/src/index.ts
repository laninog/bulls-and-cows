/**
 * Dominio de Bulls and Cows.
 *
 * Restricciones (docs/03-arquitectura-target.md §2.1):
 *  - Sin dependencias. pnpm impide importar cualquier paquete no declarado.
 *  - Sin Math.random ni reloj: la aleatoriedad se inyecta; el tiempo no existe aquí.
 *  - Se ejecuta sin cambios en navegador, en Cloudflare Workers y en tests.
 */
export { LEVELS, isLevel } from './level'
export type { Level } from './level'
export { createSeededRandom } from './random'
export type { RandomSource } from './random'
export { generateSecret } from './secret'
export { validateGuess } from './guess'
export type { GuessRejection, GuessValidation } from './guess'
export { evaluate, isSolved } from './evaluate'
export type { Evaluation } from './evaluate'
export { play, startGame } from './game'
export type { Attempt, GameState, GameStatus, PlayResult } from './game'
