import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { usePreferencesStore } from '../application/preferences-store'
import { useSessionStore } from '../application/session-store'
import App from './App.vue'
import { setupView } from './test-utils'

describe('App', () => {
  it('muestra cabecera, navegación y carga la sesión', async () => {
    const { router } = setupView()
    const w = mount(App, { global: { plugins: [router] } })
    await flushPromises()
    expect(w.get('h1').text()).toBe('Bulls and Cows')
    expect(w.findAll('nav a').map((a) => a.text())).toEqual(['Reglas', 'Historial', 'Ajustes'])
    expect(useSessionStore().session?.kind).toBe('guest')
    expect(w.get('a.skip-link').attributes('href')).toBe('#main')
    expect(w.get('nav').attributes('aria-label')).toBe('Navegación principal')
  })

  it('fija lang y el título de la vista, y los cambia al cambiar de idioma sin recargar', async () => {
    const { router } = setupView()
    await router.push('/history')
    const w = mount(App, { global: { plugins: [router] } })
    await flushPromises()
    expect(document.documentElement.lang).toBe('es')
    expect(document.title).toBe('Historial · Bulls and Cows')
    expect(w.get('a.skip-link').text()).toBe('Saltar al contenido')

    usePreferencesStore().setLocale('en')
    await flushPromises()
    expect(document.documentElement.lang).toBe('en')
    expect(document.title).toBe('History · Bulls and Cows')
    expect(w.get('a.skip-link').text()).toBe('Skip to content')
    expect(w.findAll('nav a').map((a) => a.text())).toEqual(['Rules', 'History', 'Settings'])
  })

  it('no mueve el foco en la carga inicial pero sí al navegar', async () => {
    const { router } = setupView()
    await router.push('/')
    const w = mount(App, { global: { plugins: [router] }, attachTo: document.body })
    await flushPromises()
    const before = document.activeElement
    await router.push('/history')
    await flushPromises()
    expect(document.activeElement).not.toBe(before)
    expect(document.activeElement?.closest('main')).not.toBeNull()
    w.unmount()
  })
})
