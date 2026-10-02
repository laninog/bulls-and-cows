import { ref } from 'vue'

/** Sustituto de `virtual:pwa-register/vue` en tests: estado controlable desde fuera. */
export const needRefresh = ref(false)
export const offlineReady = ref(false)
export const updateServiceWorker = async (_reload?: boolean) => {
  updateCalls.push(_reload)
}
export const updateCalls: (boolean | undefined)[] = []

export function useRegisterSW() {
  return { needRefresh, offlineReady, updateServiceWorker }
}
