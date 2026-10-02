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
    const options = w.findAll('option').map((o) => o.attributes('value'))
    expect(options).toEqual(['3', '4', '5', '6'])
    expect((w.get('select').element as HTMLSelectElement).value).toBe('3')

    await w.get('select').setValue('5')
    await w.get('form').trigger('submit')
    await flushPromises()

    expect(useGameStore().current?.level).toBe(5)
    expect(router.currentRoute.value.name).toBe('play')
  })
})
