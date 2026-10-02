import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import GuessInput from './GuessInput.vue'

async function type(w: ReturnType<typeof mount>, i: number, v: string) {
  const el = w.get(`[data-testid="digit-${i}"]`)
  ;(el.element as HTMLInputElement).value = v
  await el.trigger('input')
}

describe('GuessInput', () => {
  it('renderiza un campo por dígito con etiqueta accesible', () => {
    const w = mount(GuessInput, { props: { level: 4 }, attachTo: document.body })
    expect(w.findAll('input')).toHaveLength(4)
    expect(w.get('[data-testid="digit-0"]').attributes('aria-label')).toBe('Dígito 1 de 4')
    w.unmount()
  })

  it('auto-avanza el foco al teclear y emite submit con el valor completo', async () => {
    const w = mount(GuessInput, { props: { level: 3 }, attachTo: document.body })
    await type(w, 0, '4')
    expect(document.activeElement).toBe(w.get('[data-testid="digit-1"]').element)
    await type(w, 1, '7')
    await type(w, 2, '1')
    expect(w.get('button').attributes('disabled')).toBeUndefined()
    await w.get('form').trigger('submit')
    expect(w.emitted('submit')).toEqual([['471']])
    w.unmount()
  })

  it('marca repetidos como inválidos y deshabilita el envío', async () => {
    const w = mount(GuessInput, { props: { level: 3 }, attachTo: document.body })
    await type(w, 0, '4')
    await type(w, 1, '4')
    expect(w.get('[data-testid="digit-0"]').attributes('aria-invalid')).toBe('true')
    expect(w.get('[data-testid="digit-1"]').attributes('aria-invalid')).toBe('true')
    expect(w.get('[data-testid="guess-message"]').text()).toBe('No repitas dígitos.')
    expect(w.get('button').attributes('disabled')).toBeDefined()
    w.unmount()
  })

  it('distribuye un pegado de varios dígitos', async () => {
    const w = mount(GuessInput, { props: { level: 4 }, attachTo: document.body })
    await type(w, 0, '1234')
    const values = w.findAll('input').map((i) => (i.element as HTMLInputElement).value)
    expect(values).toEqual(['1', '2', '3', '4'])
    w.unmount()
  })

  it('Backspace en un campo vacío retrocede y borra el anterior', async () => {
    const w = mount(GuessInput, { props: { level: 3 }, attachTo: document.body })
    await type(w, 0, '5')
    await w.get('[data-testid="digit-1"]').trigger('keydown', { key: 'Backspace' })
    expect((w.get('[data-testid="digit-0"]').element as HTMLInputElement).value).toBe('')
    expect(document.activeElement).toBe(w.get('[data-testid="digit-0"]').element)
    w.unmount()
  })

  it('las flechas mueven el foco y Enter envía si es válido', async () => {
    const w = mount(GuessInput, { props: { level: 3 }, attachTo: document.body })
    await type(w, 0, '1')
    await type(w, 1, '2')
    await type(w, 2, '3')
    await w.get('[data-testid="digit-2"]').trigger('keydown', { key: 'ArrowLeft' })
    expect(document.activeElement).toBe(w.get('[data-testid="digit-1"]').element)
    await w.get('[data-testid="digit-1"]').trigger('keydown', { key: 'ArrowRight' })
    expect(document.activeElement).toBe(w.get('[data-testid="digit-2"]').element)
    await w.get('[data-testid="digit-2"]').trigger('keydown', { key: 'Enter' })
    expect(w.emitted('submit')).toEqual([['123']])
    w.unmount()
  })

  it('con un intento incompleto, enviar muestra el motivo y no emite', async () => {
    const w = mount(GuessInput, { props: { level: 3 }, attachTo: document.body })
    await type(w, 0, '1')
    await w.get('[data-testid="digit-0"]').trigger('keydown', { key: 'Enter' })
    expect(w.emitted('submit')).toBeUndefined()
    expect(w.get('[data-testid="guess-message"]').text()).toBe('Completa todos los dígitos.')
    w.unmount()
  })

  it('reset limpia y cambiar de nivel redimensiona', async () => {
    const w = mount(GuessInput, { props: { level: 3 }, attachTo: document.body })
    await type(w, 0, '1')
    ;(w.vm as unknown as { reset: () => void }).reset()
    await w.vm.$nextTick()
    expect((w.get('[data-testid="digit-0"]').element as HTMLInputElement).value).toBe('')
    await w.setProps({ level: 5 })
    expect(w.findAll('input')).toHaveLength(5)
    w.unmount()
  })
})
