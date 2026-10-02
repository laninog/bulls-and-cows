import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { validateGuess } from '@bnc/domain'
import type { Level, PlayResult } from '@bnc/domain'
import type { GameId, GameView } from '../ports'
import { useServices } from './services'

const CURRENT_KEY = 'bnc:current-game'

/**
 * Partida en curso. Persiste el id de la partida activa para reanudarla tras
 * una recarga; el estado real vive en el adaptador.
 */
export const useGameStore = defineStore('game', () => {
  const current = ref<GameView | null>(null)
  const lastOutcome = ref<PlayResult | null>(null)
  const busy = ref(false)

  const isWon = computed(() => current.value?.status === 'won')
  const level = computed(() => current.value?.level ?? null)
  const attemptsNewestFirst = computed(() => [...(current.value?.attempts ?? [])].reverse())

  function readCurrentId(): string | null {
    try {
      return sessionStorage.getItem(CURRENT_KEY)
    } catch {
      return null
    }
  }

  function remember(id: GameId | null) {
    try {
      if (id) sessionStorage.setItem(CURRENT_KEY, id)
      else sessionStorage.removeItem(CURRENT_KEY)
    } catch {
      /* almacenamiento no disponible: se pierde la reanudación, nada más */
    }
  }

  async function start(lvl: Level): Promise<void> {
    busy.value = true
    try {
      current.value = await useServices().games.start(lvl)
      lastOutcome.value = null
      remember(current.value.id)
    } finally {
      busy.value = false
    }
  }

  /** Validación previa en cliente: evita un viaje al adaptador para un intento que sabemos inválido. */
  function precheck(value: string) {
    if (!current.value) return { ok: false as const, reason: 'length' as const }
    return validateGuess(value, current.value.level)
  }

  async function submit(value: string): Promise<PlayResult> {
    if (!current.value) throw new Error('No game in progress')
    const pre = precheck(value)
    if (!pre.ok) {
      lastOutcome.value = { kind: 'invalid', reason: pre.reason }
      return lastOutcome.value
    }
    busy.value = true
    try {
      const { outcome, game } = await useServices().games.guess(current.value.id, value)
      current.value = game
      lastOutcome.value = outcome
      if (game.status !== 'in_progress') remember(null)
      return outcome
    } finally {
      busy.value = false
    }
  }

  async function abandon(): Promise<void> {
    if (!current.value) return
    await useServices().games.abandon(current.value.id)
    clear()
  }

  function clear() {
    current.value = null
    lastOutcome.value = null
    remember(null)
  }

  /** Intenta reanudar la partida guardada. Devuelve true si hay una en curso. */
  async function resume(): Promise<boolean> {
    if (current.value?.status === 'in_progress') return true
    const id = readCurrentId()
    if (!id) return false
    const view = await useServices().games.resume(id)
    if (!view) {
      remember(null)
      return false
    }
    current.value = view
    return true
  }

  return {
    current,
    lastOutcome,
    busy,
    isWon,
    level,
    attemptsNewestFirst,
    start,
    submit,
    abandon,
    clear,
    resume,
    precheck,
  }
})
