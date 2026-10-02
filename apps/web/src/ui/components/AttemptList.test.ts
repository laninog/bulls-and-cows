import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AttemptList from './AttemptList.vue'

describe('AttemptList', () => {
  it('muestra el mensaje de vacío', () => {
    const w = mount(AttemptList, { props: { attempts: [] } })
    expect(w.text()).toContain('Todavía no has hecho ningún intento.')
    expect(w.find('[data-testid="attempts"]').exists()).toBe(false)
  })
  it('lista intentos con dígitos separados, bulls y cows, y etiqueta accesible', () => {
    const w = mount(AttemptList, {
      props: { attempts: [{ ordinal: 2, guess: '471', bulls: 1, cows: 2 }] },
    })
    const li = w.get('[data-testid="attempts"] li')
    expect(li.attributes('value')).toBe('2')
    expect(li.attributes('aria-label')).toBe('Intento 2: 4 7 1 — 1 bulls, 2 cows')
    expect(li.get('[data-testid="guess"]').text()).toBe('4 7 1')
    expect(li.get('[data-testid="bulls"]').text()).toContain('1')
    expect(li.get('[data-testid="cows"]').text()).toContain('2')
  })
})
