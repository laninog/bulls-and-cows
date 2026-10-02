import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { useGameStore } from '../../application/game-store'
import { useSessionStore } from '../../application/session-store'
import { setupView } from '../test-utils'
import HomeView from './HomeView.vue'

describe('HomeView', () => {
  it('ofrece los cuatro niveles, empieza en 3, crea la partida y navega a /play', async () => {
    const { router } = setupView()
    await useSessionStore().load()
    const w = mount(HomeView, { global: { plugins: [router] } })
    expect(w.text()).toContain('Jugando como invitado')
    const radios = w.findAll('input[type="radio"]')
    expect(radios.map((r) => r.attributes('value'))).toEqual(['3', '4', '5', '6'])
    expect((radios[0]!.element as HTMLInputElement).checked).toBe(true)
    expect(w.get('legend').text()).toBe('Nivel')
    expect(w.text()).toContain('Experto')
    expect(w.text()).toContain('6 dígitos')

    await radios[2]!.setValue(true)
    await w.get('form').trigger('submit')
    await flushPromises()

    expect(useGameStore().current?.level).toBe(5)
    expect(router.currentRoute.value.name).toBe('play')
  })
})
