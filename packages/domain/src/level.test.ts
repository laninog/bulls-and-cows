import { describe, expect, it } from 'vitest'
import { LEVELS, isLevel } from './level'

describe('isLevel', () => {
  it('acepta exactamente 3, 4, 5 y 6', () => {
    for (const l of LEVELS) expect(isLevel(l)).toBe(true)
  })
  it('rechaza fuera de rango, decimales y otros tipos', () => {
    for (const v of [0, 2, 7, 3.5, '3', null, undefined, NaN]) expect(isLevel(v)).toBe(false)
  })
})
