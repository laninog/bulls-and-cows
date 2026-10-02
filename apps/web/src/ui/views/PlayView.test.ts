import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { useGameStore } from '../../application/game-store'
import { setupView } from '../test-utils'
import PlayView from './PlayView.vue'

async function typeAll(w: ReturnType<typeof mount>, guess: string) {
  for (let i = 0; i < guess.length; i++) {
    const el = w.get(`[data-testid="digit-${i}"]`)
    ;(el.element as HTMLInputElement).value = guess[i]!
    await el.trigger('input')
  }
  await w.get('form').trigger('submit')
  await flushPromises()
}

describe('PlayView', () => {
  let env: ReturnType<typeof setupView>
  beforeEach(() => {
    env = setupView()
  })

  it('no renderiza nada sin partida', () => {
    const w = mount(PlayView, { global: { plugins: [env.router] } })
    expect(w.find('section').exists()).toBe(false)
  })

  it('juega: intento fallido se lista, intento ganador muestra el panel de victoria', async () => {
    const game = useGameStore()
    await game.start(3)
    const secret = await env.secretOf(game.current!.id)
    const w = mount(PlayView, { global: { plugins: [env.router] }, attachTo: document.body })
    expect(w.get('h2').text()).toContain('Nivel 3')

    await typeAll(w, secret === '012' ? '345' : '012')
    expect(w.get('[data-testid="attempts"]').findAll('li')).toHaveLength(1)
    expect(w.find('[data-testid="won"]').exists()).toBe(false)

    await typeAll(w, secret)
    expect(w.get('[data-testid="won"] h3').text()).toBe('¡Has ganado en 2 intentos!')
    expect(w.find('form').exists()).toBe(false)
    w.unmount()
  })

  it('abandonar limpia la partida y navega a inicio', async () => {
    const game = useGameStore()
    await game.start(3)
    const w = mount(PlayView, { global: { plugins: [env.router] } })
    await w.get('button[type="button"]').trigger('click')
    await flushPromises()
    expect(game.current).toBeNull()
    expect(env.router.currentRoute.value.name).toBe('home')
  })

  it('tras ganar, "jugar otra vez" y "ver historial" navegan y limpian', async () => {
    const game = useGameStore()
    await game.start(3)
    await game.submit(await env.secretOf(game.current!.id))
    const w = mount(PlayView, { global: { plugins: [env.router] } })
    const buttons = w.get('[data-testid="won"]').findAll('button')
    await buttons[1]!.trigger('click')
    await flushPromises()
    expect(env.router.currentRoute.value.name).toBe('history')
    expect(game.current).toBeNull()

    await game.start(3)
    await game.submit(await env.secretOf(game.current!.id))
    const w2 = mount(PlayView, { global: { plugins: [env.router] } })
    await w2.get('[data-testid="won"]').findAll('button')[0]!.trigger('click')
    await flushPromises()
    expect(env.router.currentRoute.value.name).toBe('home')
  })
})

describe('PlayView · accesibilidad', () => {
  it('anuncia el resultado de cada intento en la región viva y el foco va a "Jugar otra vez" al ganar', async () => {
    const env = setupView()
    const game = useGameStore()
    await game.start(3)
    const secret = await env.secretOf(game.current!.id)
    const w = mount(PlayView, { global: { plugins: [env.router] }, attachTo: document.body })
    const announcer = () => w.get('[data-testid="announcer"]').text()
    expect(w.get('[data-testid="announcer"]').attributes('role')).toBe('status')
    expect(announcer()).toBe('')

    await typeAll(w, secret === '012' ? '345' : '012')
    expect(announcer()).toMatch(/^Intento 1: \d bulls? y \d cows?\.$/)

    env.clock.now += 65_000
    await typeAll(w, secret)
    expect(announcer()).toBe('¡Has ganado en 2 intentos!')
    expect(w.get('[data-testid="won"]').text()).toContain('Tiempo: 1:05')
    await flushPromises()
    expect(document.activeElement?.textContent?.trim()).toBe('Jugar otra vez')
    w.unmount()
  })

  it('tras un intento fallido el foco vuelve al primer dígito', async () => {
    const env = setupView()
    const game = useGameStore()
    await game.start(3)
    const secret = await env.secretOf(game.current!.id)
    const w = mount(PlayView, { global: { plugins: [env.router] }, attachTo: document.body })
    await typeAll(w, secret === '012' ? '345' : '012')
    expect(document.activeElement).toBe(w.get('[data-testid="digit-0"]').element)
    w.unmount()
  })
})
