import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Session } from '../ports'
import { useServices } from './services'

export const useSessionStore = defineStore('session', () => {
  const session = ref<Session | null>(null)

  async function load(): Promise<Session> {
    session.value = await useServices().auth.current()
    return session.value
  }

  return { session, load }
})
