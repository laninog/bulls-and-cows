import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useGameStore } from './game-store'
import { provideServices } from './services'
import { createTestServices } from './test-services'

describe('game store', () => {
  let secretOf: (id: string) => Promise<string>

  beforeEach(() => {
    setActivePinia(createPinia())
    sessionStorage.clear()
    const t = createTestServices()
    provideServices(t.services)
    secretOf = t.secretOf
  })

  it('start crea la partida y la recuerda para reanudar', async () => {
    const g = useGameStore()
    await g.start(3)
    expect(g.current?.level).toBe(3)
    expect(g.level).toBe(3)
    expect(g.isWon).toBe(false)
    expect(sessionStorage.getItem('bnc:current-game')).toBe(g.current?.id)
  })

  it('submit rechaza en cliente un intento inválido sin tocar el adaptador', async () => {
    const g = useGameStore()
    await g.start(3)
    const r = await g.submit('11')
    expect(r).toEqual({ kind: 'invalid', reason: 'length' })
    expect(g.current?.attempts).toHaveLength(0)
  })

  it('submit evalúa, ordena intentos más reciente primero y detecta victoria', async () => {
    const g = useGameStore()
    await g.start(3)
    const secret = await secretOf(g.current!.id)
    const wrong = secret === '012' ? '345' : '012'
    await g.submit(wrong)
    await g.submit(secret)
    expect(g.isWon).toBe(true)
    expect(g.attemptsNewestFirst.map((a) => a.ordinal)).toEqual([2, 1])
    expect(sessionStorage.getItem('bnc:current-game')).toBeNull()
  })

  it('resume recupera la partida tras "recargar" (nuevo pinia)', async () => {
    const g1 = useGameStore()
    await g1.start(4)
    const id = g1.current!.id
    setActivePinia(createPinia())
    const g2 = useGameStore()
    expect(g2.current).toBeNull()
    expect(await g2.resume()).toBe(true)
    expect(g2.current?.id).toBe(id)
  })

  it('resume devuelve false sin partida guardada o si ya terminó', async () => {
    const g = useGameStore()
    expect(await g.resume()).toBe(false)
    await g.start(3)
    await g.abandon()
    expect(g.current).toBeNull()
    expect(await g.resume()).toBe(false)
  })

  it('submit sin partida lanza', async () => {
    await expect(useGameStore().submit('012')).rejects.toThrow()
  })
})
