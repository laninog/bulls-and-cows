import { describe, expect, it } from 'vitest'
import { LEVELS, isLevel } from './index'

describe('domain placeholder', () => {
  it('reconoce los niveles válidos', () => {
    for (const level of LEVELS) expect(isLevel(level)).toBe(true)
  })
  it('rechaza valores fuera de rango o de otro tipo', () => {
    expect(isLevel(2)).toBe(false)
    expect(isLevel(7)).toBe(false)
    expect(isLevel('3')).toBe(false)
  })
})
