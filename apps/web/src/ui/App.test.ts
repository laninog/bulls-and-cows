import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { useSessionStore } from '../application/session-store'
import App from './App.vue'
import { setupView } from './test-utils'

describe('App', () => {
  it('muestra cabecera, navegación y carga la sesión', async () => {
    const { router } = setupView()
    const w = mount(App, { global: { plugins: [router] } })
    await flushPromises()
    expect(w.get('h1').text()).toBe('Bulls and Cows')
    expect(w.findAll('nav a').map((a) => a.text())).toEqual(['Inicio', 'Historial'])
    expect(useSessionStore().session?.kind).toBe('guest')
  })
})
