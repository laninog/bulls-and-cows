/**
 * Cadenas de la UI, centralizadas. F2.3 las sustituye por vue-i18n; hasta
 * entonces, ninguna vista lleva texto embebido.
 */
export const t = {
  appName: 'Bulls and Cows',
  nav: { home: 'Inicio', history: 'Historial' },
  home: {
    title: 'Nueva partida',
    levelLabel: 'Nivel (número de dígitos)',
    levels: { 3: 'Fácil (3)', 4: 'Medio (4)', 5: 'Avanzado (5)', 6: 'Experto (6)' } as Record<
      number,
      string
    >,
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
    guessLegend: 'Tu intento',
    digit: (i: number, n: number) => `Dígito ${i} de ${n}`,
    submit: 'Jugar',
    abandon: 'Abandonar partida',
    invalid: {
      length: 'Completa todos los dígitos.',
      'non-digit': 'Solo se admiten dígitos del 0 al 9.',
      repeated: 'No repitas dígitos.',
    } as Record<string, string>,
    won: (attempts: number) =>
      `¡Has ganado en ${attempts} ${attempts === 1 ? 'intento' : 'intentos'}!`,
    playAgain: 'Jugar otra vez',
    seeHistory: 'Ver historial',
  },
  history: {
    title: 'Historial',
    empty: 'Aún no hay partidas.',
    status: { in_progress: 'En curso', won: 'Ganada', abandoned: 'Abandonada' } as Record<
      string,
      string
    >,
    attempts: (n: number) => `${n} ${n === 1 ? 'intento' : 'intentos'}`,
    duration: (ms: number | null) => {
      if (ms === null) return '—'
      const s = Math.round(ms / 1000)
      return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
    },
  },
}
