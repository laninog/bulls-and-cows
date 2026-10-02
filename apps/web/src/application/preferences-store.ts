import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { detectLocale, isLocale } from './locale'
import type { Locale } from './locale'

export type InputMode = 'keyboard' | 'stepper'

const INPUT_KEY = 'bnc:input-mode'
const LOCALE_KEY = 'bnc:locale'

function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* sin almacenamiento: la preferencia vive solo en esta sesión */
  }
}

function initialLocale(): Locale {
  const saved = readStorage(LOCALE_KEY)
  if (isLocale(saved)) return saved
  const nav = typeof navigator === 'undefined' ? [] : (navigator.languages ?? [navigator.language])
  return detectLocale(nav)
}

/**
 * Preferencias de interfaz del jugador, persistidas en el dispositivo:
 * idioma (detectado del navegador la primera vez) y modo de entrada.
 * Solo se persiste el idioma cuando el jugador lo elige explícitamente.
 */
export const usePreferencesStore = defineStore('preferences', () => {
  const inputMode = ref<InputMode>(readStorage(INPUT_KEY) === 'stepper' ? 'stepper' : 'keyboard')
  const locale = ref<Locale>(initialLocale())

  watch(inputMode, (m) => writeStorage(INPUT_KEY, m))

  function toggleInputMode() {
    inputMode.value = inputMode.value === 'keyboard' ? 'stepper' : 'keyboard'
  }

  function setInputMode(m: InputMode) {
    inputMode.value = m
  }

  function setLocale(l: Locale) {
    locale.value = l
    writeStorage(LOCALE_KEY, l)
  }

  return { inputMode, locale, toggleInputMode, setInputMode, setLocale }
})
