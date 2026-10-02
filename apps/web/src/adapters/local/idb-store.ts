import { openDB } from 'idb'
import type { DBSchema, IDBPDatabase } from 'idb'
import type { GameId, PlayerId } from '../../ports'
import type { GameRecord, GameRecordStore } from './record-store'

interface BncDb extends DBSchema {
  games: {
    key: GameId
    value: GameRecord
    indexes: { 'by-player-started': [PlayerId, number] }
  }
}

export const DB_NAME = 'bnc'
export const DB_VERSION = 1

export function openBncDb(): Promise<IDBPDatabase<BncDb>> {
  return openDB<BncDb>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      const games = db.createObjectStore('games', { keyPath: 'id' })
      games.createIndex('by-player-started', ['playerId', 'startedAt'])
    },
  })
}

export class IdbGameRecordStore implements GameRecordStore {
  private db: Promise<IDBPDatabase<BncDb>> | null = null

  private open() {
    this.db ??= openBncDb()
    return this.db
  }

  async put(record: GameRecord): Promise<void> {
    await (await this.open()).put('games', record)
  }

  async get(id: GameId): Promise<GameRecord | null> {
    return (await (await this.open()).get('games', id)) ?? null
  }

  async listByPlayer(playerId: PlayerId, limit: number): Promise<GameRecord[]> {
    const db = await this.open()
    const range = IDBKeyRange.bound([playerId, -Infinity], [playerId, Infinity])
    const out: GameRecord[] = []
    let cursor = await db
      .transaction('games')
      .store.index('by-player-started')
      .openCursor(range, 'prev')
    while (cursor && out.length < limit) {
      out.push(cursor.value)
      cursor = await cursor.continue()
    }
    return out
  }
}
