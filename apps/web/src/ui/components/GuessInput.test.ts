import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { usePreferencesStore } from '../../application/preferences-store'
import GuessInput from './GuessInput.vue'

type W = ReturnType<typeof mount>

async function type(w: W, i: number, v: string) {
  const el = w.get(`[data-testid="digit-${i}"]`)
  ;(el.element as HTMLInputElement).value = v
  await el.trigger('input')
}
const values = (w: W) => w.findAll('input').map((i) => (i.element as HTMLInputElement).value)
const make = (level: 3 | 4 | 5 | 6) =>
  mount(GuessInput, { props: { level }, attachTo: document.body })

describe('GuessInput', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('renderiza un campo por dígito con etiqueta accesible y leyenda del grupo', () => {
    const w = make(4)
    expect(w.findAll('input')).toHaveLength(4)
    expect(w.get('[data-testid="digit-0"]').attributes('aria-label')).toBe('Dígito 1 de 4')
    expect(w.get('[data-testid="digit-0"]').attributes('data-autofocus')).toBeDefined()
    // <legend> es el primer hijo del <fieldset>: da nombre al grupo
    expect(w.get('fieldset').element.firstElementChild?.tagName).toBe('LEGEND')
    w.unmount()
  })

  it('auto-avanza el foco al teclear y emite submit con el valor completo', async () => {
    const w = make(3)
    await type(w, 0, '4')
    expect(document.activeElement).toBe(w.get('[data-testid="digit-1"]').element)
    await type(w, 1, '7')
    await type(w, 2, '1')
    expect(w.get('button[type="submit"]').attributes('disabled')).toBeUndefined()
    await w.get('form').trigger('submit')
    expect(w.emitted('submit')).toEqual([['471']])
    w.unmount()
  })

  it('marca repetidos como inválidos, enlaza el mensaje y deshabilita el envío', async () => {
    const w = make(3)
    await type(w, 0, '4')
    await type(w, 1, '4')
    expect(w.get('[data-testid="digit-0"]').attributes('aria-invalid')).toBe('true')
    expect(w.get('[data-testid="digit-1"]').attributes('aria-invalid')).toBe('true')
    expect(w.get('[data-testid="digit-0"]').attributes('aria-describedby')).toBe('guess-message')
    expect(w.get('[data-testid="guess-message"]').text()).toBe('No repitas dígitos.')
    expect(w.get('button[type="submit"]').attributes('disabled')).toBeDefined()
    w.unmount()
  })

  it('con repetidos, enviar con Enter lleva el foco al primer repetido', async () => {
    const w = make(3)
    await type(w, 0, '1')
    await type(w, 1, '1')
    await type(w, 2, '2')
    await w.get('[data-testid="digit-2"]').trigger('keydown', { key: 'Enter' })
    expect(w.emitted('submit')).toBeUndefined()
    expect(document.activeElement).toBe(w.get('[data-testid="digit-0"]').element)
    w.unmount()
  })

  it('distribuye un pegado de varios dígitos', async () => {
    const w = make(4)
    await type(w, 0, '1234')
    expect(values(w)).toEqual(['1', '2', '3', '4'])
    w.unmount()
  })

  it('Backspace borra el actual y, si está vacío, retrocede y borra el anterior', async () => {
    const w = make(3)
    await type(w, 0, '5')
    await type(w, 1, '6')
    await w.get('[data-testid="digit-1"]').trigger('keydown', { key: 'Backspace' })
    expect(values(w)).toEqual(['5', '', ''])
    await w.get('[data-testid="digit-1"]').trigger('keydown', { key: 'Backspace' })
    expect(values(w)).toEqual(['', '', ''])
    expect(document.activeElement).toBe(w.get('[data-testid="digit-0"]').element)
    w.unmount()
  })

  it('flechas laterales mueven el foco y Enter envía si es válido', async () => {
    const w = make(3)
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

  it('flechas arriba/abajo son cíclicas: vacío↑0, 9↑0, vacío↓9, 0↓9', async () => {
    const w = make(3)
    const d0 = w.get('[data-testid="digit-0"]')
    await d0.trigger('keydown', { key: 'ArrowUp' })
    expect(values(w)[0]).toBe('0')
    await d0.trigger('keydown', { key: 'ArrowDown' })
    expect(values(w)[0]).toBe('9')
    await d0.trigger('keydown', { key: 'ArrowUp' })
    expect(values(w)[0]).toBe('0')
    const d1 = w.get('[data-testid="digit-1"]')
    await d1.trigger('keydown', { key: 'ArrowDown' })
    expect(values(w)[1]).toBe('9')
    w.unmount()
  })

  it('otras teclas no se interceptan', async () => {
    const w = make(3)
    const ev = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true })
    w.get('[data-testid="digit-0"]').element.dispatchEvent(ev)
    expect(ev.defaultPrevented).toBe(false)
    w.unmount()
  })

  it('modo selectores: el conmutador muestra los +/−, persiste y los botones funcionan', async () => {
    const w = make(3)
    expect(w.find('[data-testid="inc-0"]').exists()).toBe(false)
    const toggle = w.get('[data-testid="stepper-toggle"]')
    expect(toggle.attributes('aria-pressed')).toBe('false')
    await toggle.trigger('click')
    expect(toggle.attributes('aria-pressed')).toBe('true')
    expect(usePreferencesStore().inputMode).toBe('stepper')

    const inc = w.get('[data-testid="inc-1"]')
    expect(inc.attributes('aria-label')).toBe('Aumentar dígito 2')
    expect(inc.attributes('tabindex')).toBe('-1')
    await inc.trigger('click')
    await inc.trigger('click')
    expect(values(w)[1]).toBe('1')
    await w.get('[data-testid="dec-2"]').trigger('click')
    expect(values(w)[2]).toBe('9')
    w.unmount()
  })

  it('con un intento incompleto, enviar muestra el motivo, no emite y enfoca el primer vacío', async () => {
    const w = make(3)
    await type(w, 0, '1')
    await w.get('[data-testid="digit-0"]').trigger('keydown', { key: 'Enter' })
    expect(w.emitted('submit')).toBeUndefined()
    expect(w.get('[data-testid="guess-message"]').text()).toBe('Completa todos los dígitos.')
    expect(document.activeElement).toBe(w.get('[data-testid="digit-1"]').element)
    w.unmount()
  })

  it('reset limpia y cambiar de nivel redimensiona', async () => {
    const w = make(3)
    await type(w, 0, '1')
    ;(w.vm as unknown as { reset: () => void }).reset()
    await w.vm.$nextTick()
    expect(values(w)[0]).toBe('')
    await w.setProps({ level: 5 })
    expect(w.findAll('input')).toHaveLength(5)
    w.unmount()
  })
})
