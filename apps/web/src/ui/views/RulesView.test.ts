import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { setupView } from '../test-utils'
import RulesView from './RulesView.vue'

describe('RulesView', () => {
  it('el ejemplo usa el motor real: 423 → 1/0, 147 → 0/3, 471 → 3/0', () => {
    const { router } = setupView()
    const w = mount(RulesView, { global: { plugins: [router] } })
    const items = w.get('[data-testid="rules-example"]').findAll('li')
    // Texto accesible de cada ejemplo
    expect(items.map((li) => li.get('[data-testid="example-label"]').text())).toEqual([
      'Intento 4 2 3: 1 bull, 0 cows.',
      'Intento 1 4 7: 0 bulls, 3 cows.',
      'Intento 4 7 1: 3 bulls, 0 cows.',
    ])
    // Insignias visuales coherentes con el texto
    expect(items.map((li) => li.findAll('.badge').map((b) => b.text()))).toEqual([
      ['1', '0'],
      ['0', '3'],
      ['3', '0'],
    ])
    expect(w.text()).toContain('4 7 1')
    expect(w.get('h2').text()).toBe('Cómo se juega')
    expect(w.get('a.btn').attributes('href')).toBe('/')
  })
})
