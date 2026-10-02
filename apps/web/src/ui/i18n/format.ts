/** Utilidades de formato basadas en Intl: sin dependencias, correctas por idioma. */

/** "1 intento" / "3 intentos", con las reglas de plural del idioma. */
export function pluralizer(tag: string) {
  const rules = new Intl.PluralRules(tag)
  return (n: number, one: string, other: string) =>
    `${n} ${rules.select(n) === 'one' ? one : other}`
}

export function dateTimeFormatter(tag: string) {
  const f = new Intl.DateTimeFormat(tag, { dateStyle: 'medium', timeStyle: 'short' })
  return (ms: number) => f.format(ms)
}

/** Duración m:ss, independiente del idioma. */
export function mmss(ms: number): string {
  const s = Math.round(ms / 1000)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}
