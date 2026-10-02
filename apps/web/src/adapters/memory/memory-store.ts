import type { GameId, PlayerId } from '../../ports'
import type { GameRecord, GameRecordStore } from '../local/record-store'

export class MemoryGameRecordStore implements GameRecordStore {
  private readonly rows = new Map<GameId, GameRecord>()

  async put(record: GameRecord): Promise<void> {
    this.rows.set(record.id, structuredClone(record))
  }

  async get(id: GameId): Promise<GameRecord | null> {
    const r = this.rows.get(id)
    return r ? structuredClone(r) : null
  }

  async listByPlayer(playerId: PlayerId, limit: number): Promise<GameRecord[]> {
    return [...this.rows.values()]
      .filter((r) => r.playerId === playerId)
      .sort((a, b) => b.startedAt - a.startedAt)
      .slice(0, limit)
      .map((r) => structuredClone(r))
  }
}

export class MemoryStorage implements Pick<Storage, 'getItem' | 'setItem'> {
  private readonly m = new Map<string, string>()
  getItem(k: string) {
    return this.m.get(k) ?? null
  }
  setItem(k: string, v: string) {
    this.m.set(k, v)
  }
}
