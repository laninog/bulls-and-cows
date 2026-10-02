/**
 * Cadenas de la UI, centralizadas. F2.3 las sustituye por vue-i18n; hasta
 * entonces, ninguna vista lleva texto embebido.
 */
const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`

const mmss = (ms: number) => {
  const s = Math.round(ms / 1000)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export const t = {
  appName: 'Bulls and Cows',
  skipLink: 'Saltar al contenido',
  nav: { label: 'Navegación principal', home: 'Inicio', history: 'Historial' },
  titles: { home: 'Nueva partida', play: 'Partida', history: 'Historial' } as Record<
    string,
    string
  >,
  home: {
    title: 'Nueva partida',
    intro: 'Adivina el número secreto. Todos sus dígitos son distintos.',
    levelLegend: 'Nivel',
    levels: { 3: 'Fácil', 4: 'Medio', 5: 'Avanzado', 6: 'Experto' } as Record<number, string>,
    digits: (n: number) => `${n} dígitos`,
    start: 'Empezar',
    guest: 'Jugando como invitado',
  },
  play: {
    title: 'Partida',
    level: (n: number) => `Nivel ${n}`,
    attempts: 'Intentos',
    noAttempts: 'Todavía no has hecho ningún intento.',
    attemptLabel: (ordinal: number, guess: string, bulls: number, cows: number) =>
      `Intento ${ordinal}: ${guess.split('').join(' ')} — ${bulls} bulls, ${cows} cows`,
    bulls: 'Bulls',
    cows: 'Cows',
    legend: {
      bulls: 'dígito y posición correctos',
      cows: 'dígito correcto en otra posición',
    },
    announce: (ordinal: number, bulls: number, cows: number) =>
      `Intento ${ordinal}: ${plural(bulls, 'bull', 'bulls')} y ${plural(cows, 'cow', 'cows')}.`,
    guessLegend: 'Tu intento',
    digit: (i: number, n: number) => `Dígito ${i} de ${n}`,
    increment: (i: number) => `Aumentar dígito ${i}`,
    decrement: (i: number) => `Disminuir dígito ${i}`,
    stepperMode: 'Selectores + / −',
    submit: 'Jugar',
    abandon: 'Abandonar',
    invalid: {
      length: 'Completa todos los dígitos.',
      'non-digit': 'Solo se admiten dígitos del 0 al 9.',
      repeated: 'No repitas dígitos.',
    } as Record<string, string>,
    won: (attempts: number) => `¡Has ganado en ${plural(attempts, 'intento', 'intentos')}!`,
    wonTime: (ms: number) => `Tiempo: ${mmss(ms)}`,
    playAgain: 'Jugar otra vez',
    seeHistory: 'Ver historial',
  },
  history: {
    title: 'Historial',
    empty: 'Aún no hay partidas.',
    tableLabel: 'Partidas recientes',
    columns: {
      date: 'Fecha',
      level: 'Nivel',
      status: 'Estado',
      attempts: 'Intentos',
      time: 'Tiempo',
    },
    status: { in_progress: 'En curso', won: 'Ganada', abandoned: 'Abandonada' } as Record<
      string,
      string
    >,
    attempts: (n: number) => plural(n, 'intento', 'intentos'),
    duration: (ms: number | null) => (ms === null ? '—' : mmss(ms)),
    // F2.3: el locale saldrá del idioma activo de vue-i18n.
    date: (ms: number) =>
      new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium', timeStyle: 'short' }).format(ms),
  },
}
