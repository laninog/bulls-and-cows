import type { GameDetail, GameId, GameSummary, HistoryRepository, PlayerId } from '../../ports'
import { toView } from './local-game-session'
import type { GameRecord, GameRecordStore } from './record-store'

export function toSummary(r: GameRecord): GameSummary {
  return {
    id: r.id,
    mode: r.mode,
    level: r.level,
    attempts: r.attempts.length,
    status: r.status,
    startedAt: r.startedAt,
    finishedAt: r.finishedAt,
    durationMs: r.status === 'won' && r.finishedAt !== null ? r.finishedAt - r.startedAt : null,
  }
}

export class LocalHistory implements HistoryRepository {
  constructor(
    private readonly store: GameRecordStore,
    private readonly playerId: () => Promise<PlayerId>,
  ) {}

  async listRecent(limit: number): Promise<GameSummary[]> {
    const records = await this.store.listByPlayer(await this.playerId(), limit)
    return records.map(toSummary)
  }

  async get(id: GameId): Promise<GameDetail | null> {
    const r = await this.store.get(id)
    if (!r) return null
    // El secreto solo se revela cuando la partida ha terminado (BF-01 / SEC-03).
    return { ...toView(r), secret: r.status === 'in_progress' ? null : r.secret }
  }
}
