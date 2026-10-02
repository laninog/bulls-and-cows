import { play, startGame } from '@bnc/domain'
import type { GameState, Level, PlayResult, RandomSource } from '@bnc/domain'
import type { Clock, GameId, GameSession, GameView, PlayerId } from '../../ports'
import type { GameRecord, GameRecordStore } from './record-store'

export interface LocalGameSessionDeps {
  readonly store: GameRecordStore
  readonly random: RandomSource
  readonly clock: Clock
  readonly playerId: () => Promise<PlayerId>
  readonly newId: () => GameId
}

/** Proyección hacia la UI: sin secreto. */
export function toView(r: GameRecord): GameView {
  return {
    id: r.id,
    mode: r.mode,
    level: r.level,
    attempts: r.attempts,
    status: r.status,
    startedAt: r.startedAt,
    finishedAt: r.finishedAt,
  }
}

/**
 * Partida casual evaluada en el navegador. El secreto vive en el almacén local;
 * la evaluación la hace el dominio. Es exactamente lo que el Worker hará en
 * modo clasificatorio, con el mismo paquete.
 */
export class LocalGameSession implements GameSession {
  constructor(private readonly deps: LocalGameSessionDeps) {}

  async start(level: Level): Promise<GameView> {
    const state = startGame(level, this.deps.random)
    const record: GameRecord = {
      id: this.deps.newId(),
      playerId: await this.deps.playerId(),
      mode: 'casual',
      level,
      secret: state.secret,
      attempts: [],
      status: 'in_progress',
      startedAt: this.deps.clock(),
      finishedAt: null,
    }
    await this.deps.store.put(record)
    return toView(record)
  }

  async guess(id: GameId, value: string): Promise<{ outcome: PlayResult; game: GameView }> {
    const record = await this.mustGet(id)
    if (record.status === 'abandoned') {
      return { outcome: { kind: 'finished' }, game: toView(record) }
    }
    const state: GameState = {
      level: record.level,
      secret: record.secret,
      attempts: record.attempts,
      status: record.status,
    }
    const { state: next, result } = play(state, value)
    if (result.kind !== 'evaluated') return { outcome: result, game: toView(record) }

    const updated: GameRecord = {
      ...record,
      attempts: next.attempts,
      status: next.status,
      finishedAt: next.status === 'won' ? this.deps.clock() : null,
    }
    await this.deps.store.put(updated)
    return { outcome: result, game: toView(updated) }
  }

  async abandon(id: GameId): Promise<void> {
    const record = await this.mustGet(id)
    if (record.status !== 'in_progress') return
    await this.deps.store.put({ ...record, status: 'abandoned', finishedAt: this.deps.clock() })
  }

  async resume(id: GameId): Promise<GameView | null> {
    const record = await this.deps.store.get(id)
    if (!record || record.status !== 'in_progress') return null
    return toView(record)
  }

  private async mustGet(id: GameId): Promise<GameRecord> {
    const record = await this.deps.store.get(id)
    if (!record) throw new Error(`Game not found: ${id}`)
    return record
  }
}
