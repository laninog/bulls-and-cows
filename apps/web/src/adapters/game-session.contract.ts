import { createSeededRandom } from '@bnc/domain'
import { beforeEach, describe, expect, it } from 'vitest'
import type { GameSession, HistoryRepository } from '../ports'
import { LocalGameSession } from './local/local-game-session'
import { LocalHistory } from './local/local-history'
import type { GameRecordStore } from './local/record-store'

export interface ContractSubject {
  session: GameSession
  history: HistoryRepository
  /** Acceso privilegiado SOLO para el test: el secreto de una partida. */
  secretOf(id: string): Promise<string>
  clock: { now: number }
}

export function buildLocalSubject(store: GameRecordStore): ContractSubject {
  const clock = { now: 1_000_000 }
  const playerId = async () => 'player-1'
  let seq = 0
  const session = new LocalGameSession({
    store,
    random: createSeededRandom(7),
    clock: () => clock.now,
    playerId,
    newId: () => `g${++seq}`,
  })
  return {
    session,
    history: new LocalHistory(store, playerId),
    secretOf: async (id) => (await store.get(id))!.secret,
    clock,
  }
}

/**
 * Contrato de GameSession + HistoryRepository. Se ejecuta contra CADA
 * adaptador (memoria, IndexedDB y, en F3, el remoto). Si todos lo pasan, son
 * intercambiables.
 */
export function gameSessionContract(name: string, make: () => Promise<ContractSubject>) {
  describe(`GameSession contract: ${name}`, () => {
    let s: ContractSubject
    beforeEach(async () => {
      s = await make()
    })

    it('start crea una partida en curso sin exponer el secreto', async () => {
      const g = await s.session.start(3)
      expect(g.level).toBe(3)
      expect(g.status).toBe('in_progress')
      expect(g.attempts).toEqual([])
      expect(g.mode).toBe('casual')
      expect(g.startedAt).toBe(s.clock.now)
      expect(g.finishedAt).toBeNull()
      expect(Object.keys(g)).not.toContain('secret')
    })

    it('guess devuelve la evaluación y acumula intentos con ordinal creciente', async () => {
      const g = await s.session.start(3)
      const secret = await s.secretOf(g.id)
      const wrong = secret === '012' ? '345' : '012'
      const r1 = await s.session.guess(g.id, wrong)
      expect(r1.outcome.kind).toBe('evaluated')
      expect(r1.game.attempts).toHaveLength(1)
      expect(r1.game.attempts[0]?.ordinal).toBe(1)
      const r2 = await s.session.guess(g.id, secret)
      expect(r2.outcome).toMatchObject({ kind: 'evaluated', solved: true })
      expect(r2.game.status).toBe('won')
      expect(r2.game.attempts).toHaveLength(2)
      expect(r2.game.attempts[1]?.ordinal).toBe(2)
    })

    it('un intento inválido no se registra ni cambia la partida (RN-08)', async () => {
      const g = await s.session.start(3)
      const r = await s.session.guess(g.id, '112')
      expect(r.outcome).toEqual({ kind: 'invalid', reason: 'repeated' })
      expect(r.game.attempts).toHaveLength(0)
      expect((await s.session.resume(g.id))?.attempts).toHaveLength(0)
    })

    it('al ganar se fija finishedAt con el reloj inyectado', async () => {
      const g = await s.session.start(3)
      s.clock.now += 42_000
      const r = await s.session.guess(g.id, await s.secretOf(g.id))
      expect(r.game.finishedAt).toBe(1_042_000)
    })

    it('sobre una partida ganada no se puede seguir jugando', async () => {
      const g = await s.session.start(3)
      await s.session.guess(g.id, await s.secretOf(g.id))
      const r = await s.session.guess(g.id, '012')
      expect(r.outcome).toEqual({ kind: 'finished' })
      expect(r.game.attempts).toHaveLength(1)
    })

    it('abandon cierra la partida; no se reanuda ni se puede jugar', async () => {
      const g = await s.session.start(4)
      await s.session.abandon(g.id)
      expect(await s.session.resume(g.id)).toBeNull()
      const r = await s.session.guess(g.id, '0123')
      expect(r.outcome).toEqual({ kind: 'finished' })
      expect(r.game.status).toBe('abandoned')
    })

    it('resume devuelve la partida en curso y null para inexistentes o terminadas', async () => {
      const g = await s.session.start(3)
      expect(await s.session.resume(g.id)).toEqual(g)
      expect(await s.session.resume('nope')).toBeNull()
      await s.session.guess(g.id, await s.secretOf(g.id))
      expect(await s.session.resume(g.id)).toBeNull()
    })

    it('guess sobre una partida inexistente falla explícitamente', async () => {
      await expect(s.session.guess('nope', '012')).rejects.toThrow(/not found/i)
    })

    it('el histórico lista las partidas del jugador, más reciente primero, con duración solo si ganó', async () => {
      const a = await s.session.start(3)
      s.clock.now += 1000
      const b = await s.session.start(4)
      s.clock.now += 5000
      await s.session.guess(b.id, await s.secretOf(b.id))
      await s.session.abandon(a.id)

      const list = await s.history.listRecent(10)
      expect(list.map((x) => x.id)).toEqual([b.id, a.id])
      expect(list[0]).toMatchObject({ status: 'won', attempts: 1, durationMs: 5000 })
      expect(list[1]).toMatchObject({ status: 'abandoned', attempts: 0, durationMs: null })
    })

    it('el histórico respeta el límite', async () => {
      for (let i = 0; i < 5; i++) {
        s.clock.now += 1
        await s.session.start(3)
      }
      expect(await s.history.listRecent(2)).toHaveLength(2)
    })

    it('el detalle solo revela el secreto cuando la partida ha terminado (SEC-03)', async () => {
      const g = await s.session.start(3)
      expect((await s.history.get(g.id))?.secret).toBeNull()
      await s.session.abandon(g.id)
      expect((await s.history.get(g.id))?.secret).toBe(await s.secretOf(g.id))
      expect(await s.history.get('nope')).toBeNull()
    })
  })
}
