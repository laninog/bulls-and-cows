import { GuestAuth } from '../adapters/local/guest-auth'
import { IdbGameRecordStore } from '../adapters/local/idb-store'
import { LocalGameSession } from '../adapters/local/local-game-session'
import { LocalHistory } from '../adapters/local/local-history'
import { cryptoRandom, newUuid, systemClock } from '../adapters/local/platform'
import type { Services } from './services'

/** Composición de producción para el modo invitado: todo local, sin red. */
export function createLocalServices(): Services {
  const auth = new GuestAuth(localStorage, newUuid)
  const store = new IdbGameRecordStore()
  const playerId = async () => (await auth.current()).playerId
  return {
    auth,
    games: new LocalGameSession({
      store,
      random: cryptoRandom,
      clock: systemClock,
      playerId,
      newId: newUuid,
    }),
    history: new LocalHistory(store, playerId),
  }
}
