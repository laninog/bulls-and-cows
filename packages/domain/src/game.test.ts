import { describe, expect, it } from 'vitest'
import { play, startGame } from './game'
import type { GameState } from './game'
import { createSeededRandom } from './random'

const fixed = (secret: string): GameState => ({
  level: secret.length as 3 | 4 | 5 | 6,
  secret,
  attempts: [],
  status: 'in_progress',
})

describe('startGame', () => {
  it('crea una partida en curso, sin intentos, con secreto válido y reproducible', () => {
    const g1 = startGame(4, createSeededRandom(2026))
    const g2 = startGame(4, createSeededRandom(2026))
    expect(g1).toEqual(g2)
    expect(g1.status).toBe('in_progress')
    expect(g1.attempts).toEqual([])
    expect(g1.secret).toHaveLength(4)
    expect(new Set(g1.secret).size).toBe(4)
  })
})

describe('play', () => {
  it('no muta el estado de entrada', () => {
    const before = fixed('471')
    const snapshot = structuredClone(before)
    play(before, '423')
    expect(before).toEqual(snapshot)
  })

  it('un intento inválido no consume turno ni se registra (RN-08)', () => {
    const s0 = fixed('471')
    const { state, result } = play(s0, '441')
    expect(result).toEqual({ kind: 'invalid', reason: 'repeated' })
    expect(state).toBe(s0) // misma referencia: nada cambió
    expect(state.attempts).toHaveLength(0)
  })

  it('un intento vacío no produce un ordinal duplicado (BF-04)', () => {
    const s0 = fixed('471')
    const { state: s1 } = play(s0, '423')
    const { state: s2, result } = play(s1, '')
    expect(result.kind).toBe('invalid')
    expect(s2.attempts.map((a) => a.ordinal)).toEqual([1])
  })

  it('registra intentos con ordinal creciente desde 1', () => {
    let s = fixed('471')
    for (const g of ['423', '147', '568']) s = play(s, g).state
    expect(s.attempts.map((a) => a.ordinal)).toEqual([1, 2, 3])
    expect(s.attempts[1]).toEqual({ ordinal: 2, guess: '147', bulls: 0, cows: 3 })
    expect(s.status).toBe('in_progress')
  })

  it('acertar cierra la partida', () => {
    const { state, result } = play(fixed('471'), '471')
    expect(result).toEqual({
      kind: 'evaluated',
      attempt: { ordinal: 1, guess: '471', bulls: 3, cows: 0 },
      solved: true,
    })
    expect(state.status).toBe('won')
  })

  it('sobre una partida ganada no se puede jugar', () => {
    const won = play(fixed('471'), '471').state
    const { state, result } = play(won, '423')
    expect(result).toEqual({ kind: 'finished' })
    expect(state).toBe(won)
    expect(state.attempts).toHaveLength(1)
  })

  it('nivel 6: partida completa con intentos de longitud 6', () => {
    const s0 = startGame(6, createSeededRandom(6))
    const { state, result } = play(s0, s0.secret)
    expect(result).toMatchObject({ kind: 'evaluated', solved: true })
    expect(state.status).toBe('won')
    expect(state.attempts[0]?.bulls).toBe(6)
  })

  it('una partida completa es reproducible a partir de semilla e intentos (replay)', () => {
    const guesses = ['012', '345', '678', '901']
    const run = () => {
      let s = startGame(3, createSeededRandom(31337))
      const log: string[] = []
      for (const g of guesses) {
        const r = play(s, g)
        s = r.state
        log.push(JSON.stringify(r.result))
      }
      return { s, log }
    }
    expect(run()).toEqual(run())
  })
})
