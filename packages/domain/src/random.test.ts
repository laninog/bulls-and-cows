import { describe, expect, it } from 'vitest'
import { createSeededRandom } from './random'

describe('createSeededRandom', () => {
  it('es determinista para la misma semilla', () => {
    const a = createSeededRandom(42)
    const b = createSeededRandom(42)
    const seqA = Array.from({ length: 20 }, () => a())
    const seqB = Array.from({ length: 20 }, () => b())
    expect(seqA).toEqual(seqB)
  })
  it('semillas distintas producen secuencias distintas', () => {
    const a = createSeededRandom(1)
    const b = createSeededRandom(2)
    expect(Array.from({ length: 5 }, () => a())).not.toEqual(Array.from({ length: 5 }, () => b()))
  })
  it('siempre devuelve valores en [0, 1)', () => {
    const r = createSeededRandom(7)
    for (let i = 0; i < 10_000; i++) {
      const v = r()
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(1)
    }
  })
})
