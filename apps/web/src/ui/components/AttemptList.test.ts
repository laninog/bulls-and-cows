import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AttemptList from './AttemptList.vue'

describe('AttemptList', () => {
  it('muestra el mensaje de vacío y la leyenda', () => {
    const w = mount(AttemptList, { props: { attempts: [] } })
    expect(w.text()).toContain('Todavía no has hecho ningún intento.')
    expect(w.text()).toContain('dígito y posición correctos')
    expect(w.text()).toContain('dígito correcto en otra posición')
    expect(w.find('[data-testid="attempts"]').exists()).toBe(false)
  })

  it('cada intento tiene texto accesible completo y la parte visual oculta al lector', () => {
    const w = mount(AttemptList, {
      props: {
        attempts: [
          { ordinal: 2, guess: '471', bulls: 1, cows: 2 },
          { ordinal: 1, guess: '012', bulls: 0, cows: 0 },
        ],
      },
    })
    const items = w.findAll('[data-testid="attempts"] li')
    expect(items).toHaveLength(2)
    const li = items[0]!
    expect(li.attributes('value')).toBe('2')
    expect(li.classes()).toContain('attempt--latest')
    expect(items[1]!.classes()).not.toContain('attempt--latest')
    expect(li.get('[data-testid="attempt-label"]').text()).toBe(
      'Intento 2: 4 7 1 — 1 bulls, 2 cows',
    )
    expect(li.get('[data-testid="guess"]').attributes('aria-hidden')).toBe('true')
    expect(li.findAll('.chip').map((c) => c.text())).toEqual(['4', '7', '1'])
    expect(li.get('[data-testid="bulls"]').text()).toContain('1')
    expect(li.get('[data-testid="cows"]').text()).toContain('2')
    // Los iconos son decorativos
    expect(li.findAll('svg').every((s) => s.attributes('aria-hidden') === 'true')).toBe(true)
  })
})
