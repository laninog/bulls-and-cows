import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useGameStore } from './game-store'
import { useHistoryStore } from './history-store'
import { provideServices } from './services'
import { createTestServices } from './test-services'

describe('history store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    sessionStorage.clear()
    provideServices(createTestServices().services)
  })

  it('carga las partidas recientes y el detalle', async () => {
    const g = useGameStore()
    await g.start(3)
    const id = g.current!.id
    await g.abandon()
    const h = useHistoryStore()
    await h.load(5)
    expect(h.recent).toHaveLength(1)
    expect(h.recent[0]).toMatchObject({ id, status: 'abandoned' })
    expect((await h.detail(id))?.secret).toHaveLength(3)
    expect(h.loading).toBe(false)
  })
})
