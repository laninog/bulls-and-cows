import { defineStore } from 'pinia'
import { ref } from 'vue'
import { detectLocale, isLocale } from './locale'
import type { Locale } from './locale'

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
 * idioma, detectado del navegador la primera vez y persistido solo cuando el
 * jugador lo elige explícitamente. (El modo de entrada +/− se retiró en D-30.)
 */
export const usePreferencesStore = defineStore('preferences', () => {
  const locale = ref<Locale>(initialLocale())

  function setLocale(l: Locale) {
    locale.value = l
    writeStorage(LOCALE_KEY, l)
  }

  return { locale, setLocale }
})
