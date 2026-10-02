import { computed } from 'vue'
import type { ComputedRef } from 'vue'
import type { Locale } from '../../application/locale'
import { usePreferencesStore } from '../../application/preferences-store'
import { en } from './en'
import { es } from './es'
import type { Messages } from './es'

export type { Messages } from './es'

/** Un catálogo por idioma soportado: añadir un idioma a LOCALES sin catálogo no compila. */
export const MESSAGES: Record<Locale, Messages> = { es, en }

/** Mensajes del idioma activo, reactivos al cambio de idioma (sin recarga). */
export function useT(): ComputedRef<Messages> {
  const prefs = usePreferencesStore()
  return computed(() => MESSAGES[prefs.locale])
}
