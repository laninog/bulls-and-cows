import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { useGameStore } from '../../application/game-store'
import { setupView } from '../test-utils'
import HistoryView from './HistoryView.vue'

describe('HistoryView', () => {
  it('muestra el vacío y luego las partidas con estado, intentos y tiempo', async () => {
    const env = setupView()
    const w = mount(HistoryView, { global: { plugins: [env.router] } })
    await flushPromises()
    expect(w.text()).toContain('Aún no hay partidas.')

    const game = useGameStore()
    await game.start(3)
    env.clock.now += 65_000
    await game.submit(await env.secretOf(game.current!.id))
    await game.start(4)
    await game.abandon()

    const w2 = mount(HistoryView, { global: { plugins: [env.router] } })
    await flushPromises()
    const rows = w2.get('[data-testid="history"]').findAll('tbody tr')
    expect(rows).toHaveLength(2)
    expect(rows[0]!.text()).toContain('Abandonada')
    expect(rows[0]!.text()).toContain('—')
    expect(rows[1]!.text()).toContain('Ganada')
    expect(rows[1]!.text()).toContain('1 intento')
    expect(rows[1]!.text()).toContain('1:05')

    // Versión móvil: mismas partidas, mismo orden
    const cards = w2.get('[data-testid="history-cards"]').findAll('li')
    expect(cards).toHaveLength(2)
    expect(cards[1]!.text()).toContain('Ganada')
    expect(cards[1]!.text()).toContain('Nivel 3')
    expect(cards[1]!.text()).toContain('1:05')
  })
})
