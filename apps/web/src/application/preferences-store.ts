import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type InputMode = 'keyboard' | 'stepper'

const KEY = 'bnc:input-mode'

function read(): InputMode {
  try {
    return localStorage.getItem(KEY) === 'stepper' ? 'stepper' : 'keyboard'
  } catch {
    return 'keyboard'
  }
}

/**
 * Preferencias de interfaz del jugador, persistidas en el dispositivo.
 * F2.3 añade aquí idioma; la pantalla de ajustes las edita.
 */
export const usePreferencesStore = defineStore('preferences', () => {
  const inputMode = ref<InputMode>(read())

  watch(inputMode, (m) => {
    try {
      localStorage.setItem(KEY, m)
    } catch {
      /* sin almacenamiento: la preferencia vive solo en esta sesión */
    }
  })

  function toggleInputMode() {
    inputMode.value = inputMode.value === 'keyboard' ? 'stepper' : 'keyboard'
  }

  return { inputMode, toggleInputMode }
})
