import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { usePreferencesStore } from './preferences-store'

const setNavigatorLanguages = (langs: string[]) =>
  Object.defineProperty(window.navigator, 'languages', { value: langs, configurable: true })

describe('preferences store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })
  afterEach(() => setNavigatorLanguages(['es-ES', 'es']))

  it('por defecto, entrada por teclado', () => {
    expect(usePreferencesStore().inputMode).toBe('keyboard')
  })

  it('persiste el modo de entrada y lo recupera en una nueva sesión', async () => {
    usePreferencesStore().toggleInputMode()
    await nextTick()
    expect(localStorage.getItem('bnc:input-mode')).toBe('stepper')
    setActivePinia(createPinia())
    expect(usePreferencesStore().inputMode).toBe('stepper')
    usePreferencesStore().setInputMode('keyboard')
    expect(usePreferencesStore().inputMode).toBe('keyboard')
  })

  it('un modo desconocido en almacenamiento cae a teclado', () => {
    localStorage.setItem('bnc:input-mode', 'raro')
    expect(usePreferencesStore().inputMode).toBe('keyboard')
  })

  it('sin preferencia guardada, el idioma se detecta del navegador y no se persiste', () => {
    setNavigatorLanguages(['en-GB'])
    expect(usePreferencesStore().locale).toBe('en')
    expect(localStorage.getItem('bnc:locale')).toBeNull()
  })

  it('el idioma elegido se persiste y prevalece sobre el del navegador', () => {
    setNavigatorLanguages(['en-GB'])
    usePreferencesStore().setLocale('es')
    expect(localStorage.getItem('bnc:locale')).toBe('es')
    setActivePinia(createPinia())
    expect(usePreferencesStore().locale).toBe('es')
  })

  it('un idioma guardado inválido se ignora', () => {
    localStorage.setItem('bnc:locale', 'xx')
    expect(usePreferencesStore().locale).toBe('es')
  })
})
