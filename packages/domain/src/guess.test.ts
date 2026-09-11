import { describe, expect, it } from 'vitest'
import { validateGuess } from './guess'

describe('validateGuess', () => {
  it('acepta un intento correcto', () => {
    expect(validateGuess('471', 3)).toEqual({ ok: true })
    expect(validateGuess('012345', 6)).toEqual({ ok: true })
  })
  it('rechaza vacío y longitudes incorrectas (BF-03)', () => {
    expect(validateGuess('', 3)).toEqual({ ok: false, reason: 'length' })
    expect(validateGuess('47', 3)).toEqual({ ok: false, reason: 'length' })
    expect(validateGuess('4712', 3)).toEqual({ ok: false, reason: 'length' })
  })
  it('rechaza caracteres que no son dígitos', () => {
    expect(validateGuess('4a1', 3)).toEqual({ ok: false, reason: 'non-digit' })
    expect(validateGuess('4 1', 3)).toEqual({ ok: false, reason: 'non-digit' })
    expect(validateGuess('٤٧١', 3)).toEqual({ ok: false, reason: 'non-digit' }) // dígitos árabes-índicos
  })
  it('rechaza dígitos repetidos (RN-04)', () => {
    expect(validateGuess('441', 3)).toEqual({ ok: false, reason: 'repeated' })
    expect(validateGuess('111', 3)).toEqual({ ok: false, reason: 'repeated' })
  })
  it('prioriza longitud sobre alfabeto sobre repetición', () => {
    expect(validateGuess('aa', 3)).toEqual({ ok: false, reason: 'length' })
    expect(validateGuess('a11', 3)).toEqual({ ok: false, reason: 'non-digit' })
  })
})
