import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import App from './App.vue'

describe('App', () => {
  it('renderiza el título y los niveles del dominio', () => {
    const wrapper = mount(App)
    expect(wrapper.get('h1').text()).toBe('Bulls and Cows')
    expect(wrapper.get('[data-testid="levels"]').text()).toContain('3, 4, 5, 6')
  })
})
