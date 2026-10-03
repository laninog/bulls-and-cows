import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import GuessInput from './GuessInput.vue'

type W = ReturnType<typeof mount>

const make = (level: 3 | 4 | 5 | 6, disabled = false) =>
  mount(GuessInput, { props: { level, disabled }, attachTo: document.body })

const slots = (w: W) => w.findAll('[data-testid^="digit-"]').map((s) => s.text())
const current = (w: W) =>
  w.findAll('[data-testid^="digit-"]').findIndex((s) => s.attributes('aria-current') === 'true')
const tap = async (w: W, keys: string) => {
  for (const k of keys) await w.get(`[data-testid="key-${k}"]`).trigger('click')
}
/** Pulsación de teclado físico: el componente escucha en `window`. */
const key = async (
  k: string,
  target: EventTarget = document.body,
  init: KeyboardEventInit = {},
) => {
  const ev = new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true, ...init })
  target.dispatchEvent(ev)
  await nextTick()
  return ev
}

describe('GuessInput', () => {
  let w: W
  beforeEach(() => setActivePinia(createPinia()))
  afterEach(() => w?.unmount())

  it('no hay campos de texto: el teclado del sistema no puede aparecer', () => {
    w = make(4)
    expect(w.findAll('input, textarea')).toHaveLength(0)
    expect(w.findAll('[data-testid^="digit-"]')).toHaveLength(4)
    expect(w.get('[data-testid="digit-0"]').attributes('aria-label')).toBe('Dígito 1 de 4: vacío')
    expect(w.get('[data-testid="digit-0"]').attributes('tabindex')).toBe('-1')
    expect(w.get('[data-testid="digits"]').attributes('aria-labelledby')).toBe('guess-title')
    expect(w.get('[data-testid="keypad"]').attributes('aria-label')).toBe('Teclado numérico')
    expect(w.findAll('[data-testid="keypad"] button')).toHaveLength(12)
    expect(current(w)).toBe(0)
  })

  it('el teclado propio compone el intento, anuncia cada cambio y envía', async () => {
    w = make(3)
    expect(w.get('[data-testid="submit"]').attributes('aria-disabled')).toBe('true')
    await tap(w, '47')
    expect(slots(w)).toEqual(['4', '7', ''])
    expect(w.get('[data-testid="digit-1"]').attributes('aria-label')).toBe('Dígito 2 de 3: 7')
    expect(w.get('[data-testid="guess-spoken"]').text()).toBe('4, 7, vacío')
    await tap(w, '1')
    expect(current(w)).toBe(-1)
    expect(w.get('[data-testid="submit"]').attributes('aria-disabled')).toBeUndefined()
    expect(w.get('[data-testid="submit"]').attributes('aria-label')).toBe('Jugar')
    await w.get('[data-testid="submit"]').trigger('click')
    expect(w.emitted('submit')).toEqual([['471']])
  })

  it('los dígitos usados se atenúan y no se aceptan', async () => {
    w = make(3)
    await tap(w, '4')
    expect(w.get('[data-testid="key-4"]').attributes('aria-disabled')).toBe('true')
    expect(w.get('[data-testid="key-4"]').attributes('disabled')).toBeUndefined()
    await tap(w, '4')
    expect(slots(w)).toEqual(['4', '', ''])
    expect(w.get('[data-testid="guess-message"]').text()).toBe('No repitas dígitos.')
    await tap(w, '5')
    expect(w.get('[data-testid="guess-message"]').text()).toBe('')
  })

  it('tocar una casilla la selecciona para cambiar ese dígito', async () => {
    w = make(3)
    await tap(w, '123')
    await w.get('[data-testid="digit-1"]').trigger('click')
    expect(current(w)).toBe(1)
    await tap(w, '9')
    expect(slots(w)).toEqual(['1', '9', '3'])
    expect(current(w)).toBe(-1)
    // Pulsar el mismo dígito que ya ocupa la casilla no es un repetido
    await w.get('[data-testid="digit-0"]').trigger('click')
    await tap(w, '1')
    expect(w.get('[data-testid="guess-message"]').text()).toBe('')
  })

  it('borrar vacía la casilla activa o, si está vacía, la anterior', async () => {
    w = make(3)
    await tap(w, '56')
    await w.get('[data-testid="key-delete"]').trigger('click')
    expect(slots(w)).toEqual(['5', '', ''])
    expect(current(w)).toBe(1)
    await w.get('[data-testid="digit-0"]').trigger('click')
    await w.get('[data-testid="key-delete"]').trigger('click')
    expect(slots(w)).toEqual(['', '', ''])
    await w.get('[data-testid="key-delete"]').trigger('click')
    expect(slots(w)).toEqual(['', '', ''])
    expect(w.get('[data-testid="key-delete"]').attributes('aria-label')).toBe('Borrar')
  })

  it('tras rellenar una casilla intermedia, el cursor salta a la siguiente vacía', async () => {
    w = make(4)
    await w.get('[data-testid="digit-2"]').trigger('click')
    await tap(w, '8')
    expect(current(w)).toBe(3)
    await tap(w, '9')
    expect(current(w)).toBe(0)
  })

  it('teclado físico: dígitos, Retroceso, flechas, Enter y Supr', async () => {
    w = make(3)
    await key('1')
    await key('2')
    expect(slots(w)).toEqual(['1', '2', ''])
    await key('Backspace')
    expect(slots(w)).toEqual(['1', '', ''])
    await key('Enter')
    expect(w.emitted('submit')).toBeUndefined()
    expect(w.get('[data-testid="guess-message"]').text()).toBe('Completa todos los dígitos.')
    await key('ArrowLeft')
    await key('ArrowLeft')
    expect(current(w)).toBe(0)
    await key('ArrowRight')
    await key('ArrowRight')
    await key('ArrowRight')
    expect(current(w)).toBe(2)
    await key('2')
    expect(current(w)).toBe(1)
    await key('3')
    expect(slots(w)).toEqual(['1', '3', '2'])
    await key('Enter')
    expect(w.emitted('submit')).toEqual([['132']])
    await key('Delete')
    expect(slots(w)).toEqual(['1', '3', ''])
  })

  it('no interfiere con campos de texto, atajos ni Enter sobre botones', async () => {
    w = make(3)
    const field = document.createElement('input')
    document.body.append(field)
    expect((await key('1', field)).defaultPrevented).toBe(false)
    expect((await key('2', document.body, { ctrlKey: true })).defaultPrevented).toBe(false)
    expect((await key('Tab')).defaultPrevented).toBe(false)
    expect(slots(w)).toEqual(['', '', ''])
    field.remove()

    await tap(w, '123')
    const keyBtn = w.get('[data-testid="key-5"]').element
    expect((await key('Enter', keyBtn)).defaultPrevented).toBe(false)
    expect(w.emitted('submit')).toBeUndefined()

    // Las casillas no son controles para Enter: con una enfocada, Enter juega
    expect((await key('Enter', w.get('[data-testid="digit-0"]').element)).defaultPrevented).toBe(
      true,
    )
    expect(w.emitted('submit')).toEqual([['123']])
  })

  it('tocar el teclado o una casilla no mueve el foco', () => {
    w = make(3)
    for (const id of ['key-1', 'key-delete', 'submit', 'digit-0']) {
      const ev = new MouseEvent('mousedown', { bubbles: true, cancelable: true })
      w.get(`[data-testid="${id}"]`).element.dispatchEvent(ev)
      expect(ev.defaultPrevented).toBe(true)
    }
  })

  it('pegar distribuye los dígitos desde la casilla activa', async () => {
    w = make(4)
    const ev = new Event('paste', { bubbles: true, cancelable: true }) as ClipboardEvent
    Object.defineProperty(ev, 'clipboardData', { value: { getData: () => '12-34' } })
    document.body.dispatchEvent(ev)
    await nextTick()
    expect(slots(w)).toEqual(['1', '2', '3', '4'])
    expect(ev.defaultPrevented).toBe(true)

    const empty = new Event('paste', { bubbles: true, cancelable: true }) as ClipboardEvent
    Object.defineProperty(empty, 'clipboardData', { value: { getData: () => 'abc' } })
    document.body.dispatchEvent(empty)
    expect(empty.defaultPrevented).toBe(false)
  })

  it('deshabilitado (enviando), ignora la entrada', async () => {
    w = make(3, true)
    await tap(w, '12')
    await key('3')
    await w.get('[data-testid="key-delete"]').trigger('click')
    await w.get('[data-testid="submit"]').trigger('click')
    expect(slots(w)).toEqual(['', '', ''])
    expect(w.emitted('submit')).toBeUndefined()
  })

  it('reset limpia y cambiar de nivel redimensiona', async () => {
    w = make(3)
    await tap(w, '1')
    ;(w.vm as unknown as { reset: () => void }).reset()
    await nextTick()
    expect(slots(w)).toEqual(['', '', ''])
    expect(w.get('[data-testid="guess-spoken"]').text()).toBe('')
    await w.setProps({ level: 5 })
    expect(slots(w)).toHaveLength(5)
  })

  it('al desmontarse deja de escuchar el teclado', async () => {
    const other = make(3)
    other.unmount()
    expect((await key('1')).defaultPrevented).toBe(false)
  })
})
