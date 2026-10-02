import { describe, expect, it } from 'vitest'
import { cryptoRandom, newUuid, systemClock, uuidV4 } from './platform'

const V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/

describe('platform', () => {
  it('cryptoRandom devuelve valores en [0, 1)', () => {
    for (let i = 0; i < 1000; i++) {
      const v = cryptoRandom()
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(1)
    }
  })

  it('systemClock devuelve un epoch plausible', () => {
    expect(systemClock()).toBeGreaterThan(1_700_000_000_000)
  })

  it('newUuid genera UUIDs v4 distintos', () => {
    expect(newUuid()).not.toBe(newUuid())
    expect(newUuid()).toMatch(V4)
  })

  it('newUuid funciona sin crypto.randomUUID (contexto no seguro: http://IP-de-la-LAN)', () => {
    Object.defineProperty(crypto, 'randomUUID', { value: undefined, configurable: true })
    try {
      const a = newUuid()
      expect(a).toMatch(V4)
      expect(newUuid()).not.toBe(a)
    } finally {
      // Restaurar la implementación nativa para el resto de tests
      delete (crypto as { randomUUID?: unknown }).randomUUID
    }
  })

  it('uuidV4 fija versión y variante y es determinista para unos bytes dados', () => {
    expect(uuidV4(new Uint8Array(16))).toBe('00000000-0000-4000-8000-000000000000')
    expect(uuidV4(new Uint8Array(16).fill(0xff))).toBe('ffffffff-ffff-4fff-bfff-ffffffffffff')
  })

  it('uuidV4 no muta la entrada y rechaza longitudes incorrectas', () => {
    const input = new Uint8Array(16).fill(0xff)
    uuidV4(input)
    expect(input[6]).toBe(0xff)
    expect(() => uuidV4(new Uint8Array(15))).toThrow()
  })
})
