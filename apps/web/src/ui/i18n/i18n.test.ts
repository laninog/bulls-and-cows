import { describe, expect, it } from 'vitest'
import { LOCALES } from '../../application/locale'
import { MESSAGES } from './index'
import { mmss } from './format'

/** Recorre el catálogo y devuelve rutas con su "forma" (tipo, aridad, longitud). */
function shape(obj: unknown, path = ''): string[] {
  if (Array.isArray(obj)) return [`${path}:array(${obj.length})`]
  if (typeof obj === 'function') return [`${path}:fn(${obj.length})`]
  if (obj && typeof obj === 'object') {
    return Object.keys(obj)
      .sort()
      .flatMap((k) => shape((obj as Record<string, unknown>)[k], path ? `${path}.${k}` : k))
  }
  return [`${path}:${typeof obj}`]
}

describe('catálogos i18n', () => {
  it('hay un catálogo por idioma soportado', () => {
    expect(Object.keys(MESSAGES).sort()).toEqual([...LOCALES].sort())
  })

  it('todos los catálogos tienen la misma forma que el español (claves, aridad, listas)', () => {
    const reference = shape(MESSAGES.es)
    for (const l of LOCALES) expect(shape(MESSAGES[l]), l).toEqual(reference)
  })

  it('ninguna cadena está vacía', () => {
    const empties = (obj: unknown, path = ''): string[] =>
      typeof obj === 'string'
        ? obj.trim() === ''
          ? [path]
          : []
        : obj && typeof obj === 'object'
          ? Object.entries(obj).flatMap(([k, v]) => empties(v, `${path}.${k}`))
          : []
    for (const l of LOCALES) expect(empties(MESSAGES[l]), l).toEqual([])
  })

  it('plurales según el idioma', () => {
    expect(MESSAGES.es.history.attempts(1)).toBe('1 intento')
    expect(MESSAGES.es.history.attempts(0)).toBe('0 intentos')
    expect(MESSAGES.en.history.attempts(1)).toBe('1 guess')
    expect(MESSAGES.en.history.attempts(3)).toBe('3 guesses')
    expect(MESSAGES.es.play.announce(2, 1, 0)).toBe('Intento 2: 1 bull y 0 cows.')
    expect(MESSAGES.en.play.won(1)).toBe('You won in 1 guess!')
  })

  it('fechas en el formato de cada idioma', () => {
    const ms = Date.UTC(2026, 9, 2, 12, 0)
    expect(MESSAGES.es.history.date(ms)).toMatch(/oct/)
    expect(MESSAGES.en.history.date(ms)).toMatch(/Oct/)
    expect(MESSAGES.es.history.date(ms)).not.toBe(MESSAGES.en.history.date(ms))
  })

  it('duración y valores nulos', () => {
    expect(mmss(65_000)).toBe('1:05')
    expect(MESSAGES.en.history.duration(null)).toBe('—')
  })
})
