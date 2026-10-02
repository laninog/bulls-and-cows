import { describe, expect, it } from 'vitest'
import { FALLBACK_LOCALE, LOCALES, detectLocale, isLocale } from './locale'

describe('locale', () => {
  it('soporta español e inglés', () => {
    expect([...LOCALES]).toEqual(['es', 'en'])
    expect(isLocale('es')).toBe(true)
    expect(isLocale('fr')).toBe(false)
    expect(isLocale(null)).toBe(false)
  })

  it('toma el primer idioma soportado de la lista del navegador, ignorando la región', () => {
    expect(detectLocale(['es-AR', 'en-US'])).toBe('es')
    expect(detectLocale(['fr-FR', 'EN-gb', 'es'])).toBe('en')
  })

  it('si ninguno está soportado, usa el de reserva (inglés)', () => {
    expect(FALLBACK_LOCALE).toBe('en')
    expect(detectLocale(['fr-FR', 'de'])).toBe('en')
    expect(detectLocale([])).toBe('en')
  })
})
