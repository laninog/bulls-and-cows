import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { usePreferencesStore } from '../../application/preferences-store'
import { setupView } from '../test-utils'
import SettingsView from './SettingsView.vue'

describe('SettingsView', () => {
  it('cambia el idioma al instante; cada idioma se nombra en su propio idioma', async () => {
    const { router } = setupView()
    const w = mount(SettingsView, { global: { plugins: [router] } })
    expect(w.get('h2').text()).toBe('Ajustes')
    const names = w.findAll('[lang]').map((el) => [el.attributes('lang'), el.text()])
    expect(names).toEqual([
      ['es', 'Español'],
      ['en', 'English'],
    ])
    expect((w.get('[data-testid="locale-es"]').element as HTMLInputElement).checked).toBe(true)

    await w.get('[data-testid="locale-en"]').setValue(true)
    await flushPromises()
    expect(usePreferencesStore().locale).toBe('en')
    expect(w.get('h2').text()).toBe('Settings')
    expect(localStorage.getItem('bnc:locale')).toBe('en')
  })
})
