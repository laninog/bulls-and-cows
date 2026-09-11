/**
 * Fuente de aleatoriedad: función que devuelve un número en [0, 1).
 *
 * El dominio nunca llama a Math.random ni a crypto directamente: quien lo
 * ejecuta (navegador, Worker, test) inyecta la fuente. Esto hace las partidas
 * reproducibles y los tests deterministas.
 */
export type RandomSource = () => number

/**
 * PRNG determinista (mulberry32). Para tests y replays; NO para producción.
 * Las apps aportan una fuente basada en crypto.getRandomValues.
 */
export function createSeededRandom(seed: number): RandomSource {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
