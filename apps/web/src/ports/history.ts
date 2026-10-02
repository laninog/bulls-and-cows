import type { GameDetail, GameId, GameSummary } from './types'

export interface HistoryRepository {
  listRecent(limit: number): Promise<GameSummary[]>
  get(id: GameId): Promise<GameDetail | null>
}
