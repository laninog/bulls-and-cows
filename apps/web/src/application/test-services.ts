import { createSeededRandom } from '@bnc/domain'
import { GuestAuth } from '../adapters/local/guest-auth'
import { LocalGameSession } from '../adapters/local/local-game-session'
import { LocalHistory } from '../adapters/local/local-history'
import { MemoryGameRecordStore, MemoryStorage } from '../adapters/memory/memory-store'
import type { Services } from './services'

/** Servicios en memoria para tests de aplicación y componentes. */
export function createTestServices(seed = 1) {
  const store = new MemoryGameRecordStore()
  const auth = new GuestAuth(new MemoryStorage(), () => 'guest-1')
  const clock = { now: 10_000 }
  let seq = 0
  const playerId = async () => (await auth.current()).playerId
  const services: Services = {
    auth,
    games: new LocalGameSession({
      store,
      random: createSeededRandom(seed),
      clock: () => clock.now,
      playerId,
      newId: () => `g${++seq}`,
    }),
    history: new LocalHistory(store, playerId),
  }
  return { services, store, clock, secretOf: async (id: string) => (await store.get(id))!.secret }
}
