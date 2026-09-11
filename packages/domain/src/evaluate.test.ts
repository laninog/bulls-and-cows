import { describe, expect, it } from 'vitest'
import { evaluate, isSolved } from './evaluate'
import { LEVELS } from './level'
import { createSeededRandom } from './random'
import { generateSecret } from './secret'

describe('evaluate', () => {
  // Ejemplos del levantamiento funcional §3, secreto 471
  it.each([
    ['423', 1, 0], // 4 en su sitio
    ['147', 0, 3], // todos presentes, ninguno en su sitio
    ['471', 3, 0], // victoria
    ['714', 0, 3],
    ['417', 1, 2],
    ['568', 0, 0],
    ['478', 2, 0],
  ])('secreto 471, intento %s → %i bulls, %i cows', (guess, bulls, cows) => {
    expect(evaluate(guess, '471')).toEqual({ bulls, cows })
  })

  it('el intento igual al secreto da nivel bulls y cero cows, en todos los niveles', () => {
    for (const level of LEVELS) {
      const s = generateSecret(level, createSeededRandom(level))
      expect(evaluate(s, s)).toEqual({ bulls: level, cows: 0 })
    }
  })

  it('secreto con cero inicial se evalúa como cadena', () => {
    expect(evaluate('012', '012')).toEqual({ bulls: 3, cows: 0 })
    expect(evaluate('120', '012')).toEqual({ bulls: 0, cows: 3 })
  })

  it('propiedad: bulls + cows ≤ nivel y ambos ≥ 0', () => {
    for (const level of LEVELS) {
      for (let seed = 0; seed < 300; seed++) {
        const r = createSeededRandom(seed)
        const a = generateSecret(level, r)
        const b = generateSecret(level, r)
        const e = evaluate(a, b)
        expect(e.bulls).toBeGreaterThanOrEqual(0)
        expect(e.cows).toBeGreaterThanOrEqual(0)
        expect(e.bulls + e.cows).toBeLessThanOrEqual(level)
      }
    }
  })

  it('propiedad: evaluate es simétrica con dígitos únicos', () => {
    for (const level of LEVELS) {
      for (let seed = 0; seed < 300; seed++) {
        const r = createSeededRandom(seed)
        const a = generateSecret(level, r)
        const b = generateSecret(level, r)
        expect(evaluate(a, b)).toEqual(evaluate(b, a))
      }
    }
  })
})

describe('isSolved', () => {
  it('solo cuando bulls == nivel', () => {
    expect(isSolved({ bulls: 3, cows: 0 }, 3)).toBe(true)
    expect(isSolved({ bulls: 2, cows: 1 }, 3)).toBe(false)
    expect(isSolved({ bulls: 3, cows: 0 }, 4)).toBe(false)
  })
})
