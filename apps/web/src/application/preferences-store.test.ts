import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { usePreferencesStore } from './preferences-store'

describe('preferences store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('por defecto, entrada por teclado', () => {
    expect(usePreferencesStore().inputMode).toBe('keyboard')
  })

  it('persiste el modo y lo recupera en una nueva sesión', async () => {
    usePreferencesStore().toggleInputMode()
    await nextTick()
    expect(localStorage.getItem('bnc:input-mode')).toBe('stepper')
    setActivePinia(createPinia())
    expect(usePreferencesStore().inputMode).toBe('stepper')
    usePreferencesStore().toggleInputMode()
    expect(usePreferencesStore().inputMode).toBe('keyboard')
  })

  it('un valor desconocido en almacenamiento cae a teclado', () => {
    localStorage.setItem('bnc:input-mode', 'raro')
    expect(usePreferencesStore().inputMode).toBe('keyboard')
  })
})
