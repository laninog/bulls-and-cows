import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { needRefresh, updateCalls } from '../../test-stubs/pwa-register-vue'
import UpdateBanner from './UpdateBanner.vue'

describe('UpdateBanner', () => {
  afterEach(() => {
    needRefresh.value = false
    updateCalls.length = 0
  })

  it('no se muestra si no hay versión nueva', () => {
    const w = mount(UpdateBanner)
    expect(w.find('[data-testid="update-banner"]').exists()).toBe(false)
  })

  it('con versión nueva, se anuncia y "Actualizar" activa el service worker y recarga', async () => {
    needRefresh.value = true
    const w = mount(UpdateBanner)
    await nextTick()
    const banner = w.get('[data-testid="update-banner"]')
    expect(banner.attributes('role')).toBe('status')
    expect(banner.text()).toContain('Hay una versión nueva del juego.')
    await banner.findAll('button')[0]!.trigger('click')
    expect(updateCalls).toEqual([true])
  })

  it('"Más tarde" lo oculta sin actualizar', async () => {
    needRefresh.value = true
    const w = mount(UpdateBanner)
    await nextTick()
    await w.get('[data-testid="update-banner"]').findAll('button')[1]!.trigger('click')
    expect(w.find('[data-testid="update-banner"]').exists()).toBe(false)
    expect(updateCalls).toEqual([])
  })
})
