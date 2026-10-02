import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { GameDetail, GameId, GameSummary } from '../ports'
import { useServices } from './services'

export const useHistoryStore = defineStore('history', () => {
  const recent = ref<GameSummary[]>([])
  const loading = ref(false)

  async function load(limit = 10): Promise<void> {
    loading.value = true
    try {
      recent.value = await useServices().history.listRecent(limit)
    } finally {
      loading.value = false
    }
  }

  function detail(id: GameId): Promise<GameDetail | null> {
    return useServices().history.get(id)
  }

  return { recent, loading, load, detail }
})
