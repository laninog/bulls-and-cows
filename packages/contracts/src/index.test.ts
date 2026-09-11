import { describe, expect, it } from 'vitest'
import { HealthResponse, LevelSchema } from './index'

describe('contracts placeholder', () => {
  it('valida la respuesta de /health', () => {
    expect(HealthResponse.safeParse({ status: 'ok', version: '1' }).success).toBe(true)
    expect(HealthResponse.safeParse({ status: 'ko', version: '1' }).success).toBe(false)
  })
  it('acepta sólo niveles del dominio', () => {
    expect(LevelSchema.safeParse(4).success).toBe(true)
    expect(LevelSchema.safeParse(9).success).toBe(false)
    expect(LevelSchema.safeParse('4').success).toBe(false)
  })
})
