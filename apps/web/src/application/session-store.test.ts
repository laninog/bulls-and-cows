import { createPinia, setActivePinia } from 'pinia'
import { describe, expect, it } from 'vitest'
import { provideServices } from './services'
import { useSessionStore } from './session-store'
import { createTestServices } from './test-services'

describe('session store', () => {
  it('carga la sesión de invitado', async () => {
    setActivePinia(createPinia())
    provideServices(createTestServices().services)
    const s = useSessionStore()
    await s.load()
    expect(s.session).toEqual({ kind: 'guest', playerId: 'guest-1' })
  })
})
