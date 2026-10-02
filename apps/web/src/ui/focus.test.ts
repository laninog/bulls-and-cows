import { describe, expect, it } from 'vitest'
import { focusView } from './focus'

const html = (s: string) => {
  const root = document.createElement('div')
  root.innerHTML = s
  document.body.replaceChildren(root)
  return root
}

describe('focusView', () => {
  it('prioriza [data-autofocus] dentro de main', () => {
    const root = html('<main><h2>Título</h2><input data-autofocus /></main>')
    expect(focusView(root)).toBe(root.querySelector('input'))
    expect(document.activeElement).toBe(root.querySelector('input'))
  })

  it('si no hay, enfoca el h2 y lo hace enfocable', () => {
    const root = html('<main><h2>Título</h2></main>')
    const h2 = root.querySelector('h2')!
    expect(focusView(root)).toBe(h2)
    expect(h2.getAttribute('tabindex')).toBe('-1')
    expect(document.activeElement).toBe(h2)
  })

  it('no toca un tabindex ya presente', () => {
    const root = html('<main><h2 tabindex="0">Título</h2></main>')
    focusView(root)
    expect(root.querySelector('h2')!.getAttribute('tabindex')).toBe('0')
  })

  it('devuelve null sin main o sin destino', () => {
    expect(focusView(html('<div></div>'))).toBeNull()
    expect(focusView(html('<main><p>x</p></main>'))).toBeNull()
  })
})
