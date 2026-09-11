import { describe, expect, it } from 'vitest'
import { LEVELS } from './level'
import { createSeededRandom } from './random'
import { generateSecret } from './secret'

describe('generateSecret', () => {
  it.each(LEVELS)('nivel %i: longitud exacta y dígitos únicos, en 500 semillas', (level) => {
    for (let seed = 0; seed < 500; seed++) {
      const s = generateSecret(level, createSeededRandom(seed))
      expect(s).toHaveLength(level)
      expect(s).toMatch(/^[0-9]+$/)
      expect(new Set(s).size).toBe(level)
    }
  })

  it('es determinista con la misma fuente', () => {
    expect(generateSecret(4, createSeededRandom(99))).toBe(
      generateSecret(4, createSeededRandom(99)),
    )
  })

  it('puede empezar por 0 (RN-03): con random() = 0 el primer dígito es "0"', () => {
    const zero = () => 0
    expect(generateSecret(3, zero)).toBe('012')
  })

  it('con random() → 1⁻ no se sale del rango (sin undefined) y sigue siendo válido', () => {
    const almostOne = () => 0.999999
    for (const level of LEVELS) {
      const s = generateSecret(level, almostOne)
      expect(s).toHaveLength(level)
      expect(s).not.toContain('undefined')
      expect(new Set(s).size).toBe(level)
    }
  })

  it('cada dígito aparece en primera posición con frecuencia razonable (sin sesgo grosero)', () => {
    const counts = new Map<string, number>()
    const N = 10_000
    for (let seed = 0; seed < N; seed++) {
      const first = generateSecret(3, createSeededRandom(seed))[0] as string
      counts.set(first, (counts.get(first) ?? 0) + 1)
    }
    expect(counts.size).toBe(10)
    for (const c of counts.values()) {
      // esperado 1000; tolerancia amplia: solo detecta sesgos gruesos
      expect(c).toBeGreaterThan(800)
      expect(c).toBeLessThan(1200)
    }
  })
})
