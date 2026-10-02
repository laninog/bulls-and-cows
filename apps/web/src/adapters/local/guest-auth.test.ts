import { describe, expect, it } from 'vitest'
import { MemoryStorage } from '../memory/memory-store'
import { GuestAuth } from './guest-auth'

describe('GuestAuth', () => {
  it('genera un id una vez y lo reutiliza', async () => {
    let n = 0
    const auth = new GuestAuth(new MemoryStorage(), () => `id-${++n}`)
    const a = await auth.current()
    const b = await auth.current()
    expect(a).toEqual({ kind: 'guest', playerId: 'id-1' })
    expect(b).toEqual(a)
    expect(n).toBe(1)
  })
  it('signIn / signOut no hacen nada en modo local', async () => {
    const auth = new GuestAuth(new MemoryStorage(), () => 'x')
    await expect(auth.signIn()).resolves.toBeUndefined()
    await expect(auth.signOut()).resolves.toBeUndefined()
  })
})
