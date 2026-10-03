import { dateTimeFormatter, mmss, pluralizer } from './format'

const TAG = 'es-ES'
const n = pluralizer(TAG)
const date = dateTimeFormatter(TAG)

/**
 * Catálogo de referencia. Su forma define el tipo `Messages`: cualquier otro
 * idioma que no tenga exactamente las mismas claves y firmas no compila.
 */
export const es = {
  meta: { tag: TAG, name: 'Español' },
  appName: 'Bulls and Cows',
  skipLink: 'Saltar al contenido',
  nav: {
    label: 'Navegación principal',
    rules: 'Reglas',
    history: 'Historial',
    settings: 'Ajustes',
  },
  titles: {
    home: 'Nueva partida',
    play: 'Partida',
    history: 'Historial',
    rules: 'Cómo se juega',
    settings: 'Ajustes',
  },
  home: {
    title: 'Nueva partida',
    intro: 'Adivina el número secreto. Todos sus dígitos son distintos.',
    howToPlay: '¿Cómo se juega?',
    levelLegend: 'Nivel',
    levels: { 3: 'Fácil', 4: 'Medio', 5: 'Avanzado', 6: 'Experto' } as Record<number, string>,
    digits: (count: number) => n(count, 'dígito', 'dígitos'),
    start: 'Empezar',
    guest: 'Jugando como invitado',
  },
  play: {
    title: 'Partida',
    level: (level: number) => `Nivel ${level}`,
    attempts: 'Intentos',
    noAttempts: 'Todavía no has hecho ningún intento.',
    attemptLabel: (ordinal: number, guess: string, bulls: number, cows: number) =>
      `Intento ${ordinal}: ${guess.split('').join(' ')} — ${n(bulls, 'bull', 'bulls')}, ${n(cows, 'cow', 'cows')}`,
    bulls: 'Bulls',
    cows: 'Cows',
    legend: {
      bulls: 'dígito y posición correctos',
      cows: 'dígito correcto en otra posición',
    },
    announce: (ordinal: number, bulls: number, cows: number) =>
      `Intento ${ordinal}: ${n(bulls, 'bull', 'bulls')} y ${n(cows, 'cow', 'cows')}.`,
    guessLegend: 'Tu intento',
    slot: (i: number, total: number, digit: string) =>
      `Dígito ${i} de ${total}: ${digit === '' ? 'vacío' : digit}`,
    composed: (digits: readonly string[]) => digits.map((d) => (d === '' ? 'vacío' : d)).join(', '),
    keypad: 'Teclado numérico',
    delete: 'Borrar',
    submit: 'Jugar',
    abandon: 'Abandonar',
    invalid: {
      length: 'Completa todos los dígitos.',
      'non-digit': 'Solo se admiten dígitos del 0 al 9.',
      repeated: 'No repitas dígitos.',
    } as Record<string, string>,
    won: (attempts: number) => `¡Has ganado en ${n(attempts, 'intento', 'intentos')}!`,
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
    attempts: (count: number) => n(count, 'intento', 'intentos'),
    duration: (ms: number | null) => (ms === null ? '—' : mmss(ms)),
    date,
  },
  rules: {
    title: 'Cómo se juega',
    goalTitle: 'Objetivo',
    goal: 'Adivina el número secreto. Según el nivel tiene entre 3 y 6 dígitos, todos distintos, y puede empezar por 0.',
    cluesTitle: 'Pistas',
    cluesIntro: 'Después de cada intento recibes dos pistas:',
    bulls: 'cuántos dígitos son correctos y están en su posición.',
    cows: 'cuántos dígitos están en el secreto, pero en otra posición.',
    exampleTitle: 'Ejemplo',
    exampleCaption: (secret: string) =>
      `Intentos de ejemplo si el secreto fuera ${secret.split('').join(' ')}`,
    exampleCols: { guess: 'Intento', result: 'Resultado', why: 'Por qué' },
    exampleWhy: [
      'El 4 está en su sitio; el 2 y el 3 no están en el secreto.',
      'Los tres dígitos están en el secreto, pero ninguno en su sitio.',
      '¡Todos en su sitio: has ganado!',
    ],
    resultLabel: (bulls: number, cows: number) =>
      `${n(bulls, 'bull', 'bulls')}, ${n(cows, 'cow', 'cows')}`,
    levelsTitle: 'Niveles',
    levels:
      'Fácil (3 dígitos), Medio (4), Avanzado (5) y Experto (6). No hay límite de intentos ni de tiempo, pero el historial guarda ambos.',
    inputTitle: 'Cómo escribir un intento',
    inputItems: [
      'Pulsa los dígitos en el teclado de la pantalla: cada uno ocupa la siguiente casilla libre.',
      'Toca una casilla para cambiar ese dígito; ⌫ borra.',
      'Los dígitos que ya están en el intento se atenúan: no se pueden repetir.',
      'Con teclado físico: escribe los dígitos, ← y → cambian de casilla, Retroceso borra y Enter juega.',
    ],
    cta: 'Empezar a jugar',
  },
  pwa: {
    updateAvailable: 'Hay una versión nueva del juego.',
    update: 'Actualizar',
    later: 'Más tarde',
  },
  settings: {
    title: 'Ajustes',
    languageLegend: 'Idioma',
    themeNote: 'El tema claro u oscuro sigue la configuración de tu dispositivo.',
  },
}

export type Messages = typeof es
