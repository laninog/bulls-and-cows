import type { RandomSource } from '@bnc/domain'
import type { Clock } from '../../ports'

/** Fuente de aleatoriedad de producción: CSPRNG del navegador (y de workerd). */
export const cryptoRandom: RandomSource = () => {
  const buf = new Uint32Array(1)
  crypto.getRandomValues(buf)
  return (buf[0] as number) / 4294967296
}

export const systemClock: Clock = () => Date.now()

/**
 * UUID v4 a partir de 16 bytes aleatorios (RFC 9562 §5.4).
 *
 * Existe porque `crypto.randomUUID()` solo está disponible en contextos seguros
 * (HTTPS o localhost). Al abrir la app por la IP de la LAN en HTTP no existe,
 * mientras que `crypto.getRandomValues()` sí está disponible en cualquier contexto.
 */
export function uuidV4(bytes: Uint8Array): string {
  if (bytes.length !== 16) throw new Error('uuidV4 requires 16 bytes')
  const b = Uint8Array.from(bytes)
  b[6] = ((b[6] ?? 0) & 0x0f) | 0x40 // versión 4
  b[8] = ((b[8] ?? 0) & 0x3f) | 0x80 // variante RFC
  const h = Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('')
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`
}

export const newUuid = (): string =>
  typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : uuidV4(crypto.getRandomValues(new Uint8Array(16)))
