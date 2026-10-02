/**
 * Idiomas soportados y detección. Vive en la capa de aplicación porque el idioma
 * es una preferencia del jugador; los catálogos de texto viven en ui/i18n.
 */
export const LOCALES = ['es', 'en'] as const
export type Locale = (typeof LOCALES)[number]

/** Idioma por defecto si el navegador no pide ninguno soportado: el juego es público e internacional. */
export const FALLBACK_LOCALE: Locale = 'en'

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value)
}

/** Primer idioma soportado de la lista del navegador (`es-AR` → `es`). */
export function detectLocale(languages: readonly string[]): Locale {
  for (const tag of languages) {
    const base = tag.toLowerCase().split('-')[0]
    if (isLocale(base)) return base
  }
  return FALLBACK_LOCALE
}
