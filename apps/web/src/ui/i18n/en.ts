import type { Messages } from './es'
import { dateTimeFormatter, mmss, pluralizer } from './format'

const TAG = 'en'
const n = pluralizer(TAG)
const date = dateTimeFormatter(TAG)

/** Tipado contra `Messages`: si falta una clave o cambia una firma, no compila. */
export const en: Messages = {
  meta: { tag: TAG, name: 'English' },
  appName: 'Bulls and Cows',
  skipLink: 'Skip to content',
  nav: {
    label: 'Main navigation',
    rules: 'Rules',
    history: 'History',
    settings: 'Settings',
  },
  titles: {
    home: 'New game',
    play: 'Game',
    history: 'History',
    rules: 'How to play',
    settings: 'Settings',
  },
  home: {
    title: 'New game',
    intro: 'Guess the secret number. All its digits are different.',
    howToPlay: 'How to play',
    levelLegend: 'Level',
    levels: { 3: 'Easy', 4: 'Medium', 5: 'Advanced', 6: 'Expert' },
    digits: (count) => n(count, 'digit', 'digits'),
    start: 'Start',
    guest: 'Playing as a guest',
  },
  play: {
    title: 'Game',
    level: (level) => `Level ${level}`,
    attempts: 'Guesses',
    noAttempts: "You haven't made any guesses yet.",
    attemptLabel: (ordinal, guess, bulls, cows) =>
      `Guess ${ordinal}: ${guess.split('').join(' ')} — ${n(bulls, 'bull', 'bulls')}, ${n(cows, 'cow', 'cows')}`,
    bulls: 'Bulls',
    cows: 'Cows',
    legend: {
      bulls: 'right digit, right place',
      cows: 'right digit, wrong place',
    },
    announce: (ordinal, bulls, cows) =>
      `Guess ${ordinal}: ${n(bulls, 'bull', 'bulls')} and ${n(cows, 'cow', 'cows')}.`,
    guessLegend: 'Your guess',
    digit: (i, total) => `Digit ${i} of ${total}`,
    increment: (i) => `Increase digit ${i}`,
    decrement: (i) => `Decrease digit ${i}`,
    stepperMode: '+ / − buttons',
    submit: 'Play',
    abandon: 'Give up',
    invalid: {
      length: 'Fill in every digit.',
      'non-digit': 'Only digits 0 to 9 are allowed.',
      repeated: "Don't repeat digits.",
    },
    won: (attempts) => `You won in ${n(attempts, 'guess', 'guesses')}!`,
    wonTime: (ms) => `Time: ${mmss(ms)}`,
    playAgain: 'Play again',
    seeHistory: 'See history',
  },
  history: {
    title: 'History',
    empty: 'No games yet.',
    tableLabel: 'Recent games',
    columns: {
      date: 'Date',
      level: 'Level',
      status: 'Status',
      attempts: 'Guesses',
      time: 'Time',
    },
    status: { in_progress: 'In progress', won: 'Won', abandoned: 'Given up' },
    attempts: (count) => n(count, 'guess', 'guesses'),
    duration: (ms) => (ms === null ? '—' : mmss(ms)),
    date,
  },
  rules: {
    title: 'How to play',
    goalTitle: 'Goal',
    goal: 'Guess the secret number. Depending on the level it has 3 to 6 digits, all different, and it may start with 0.',
    cluesTitle: 'Clues',
    cluesIntro: 'After every guess you get two clues:',
    bulls: 'how many digits are right and in the right place.',
    cows: 'how many digits are in the secret, but in a different place.',
    exampleTitle: 'Example',
    exampleCaption: (secret) => `Sample guesses if the secret were ${secret.split('').join(' ')}`,
    exampleCols: { guess: 'Guess', result: 'Result', why: 'Why' },
    exampleWhy: [
      "The 4 is in place; 2 and 3 aren't in the secret.",
      'All three digits are in the secret, but none in its place.',
      'All in place: you win!',
    ],
    resultLabel: (bulls, cows) => `${n(bulls, 'bull', 'bulls')}, ${n(cows, 'cow', 'cows')}`,
    levelsTitle: 'Levels',
    levels:
      'Easy (3 digits), Medium (4), Advanced (5) and Expert (6). There is no limit on guesses or time, but your history keeps both.',
    inputTitle: 'Entering a guess',
    inputItems: [
      'Type the digits: the cursor moves to the next box by itself.',
      'Arrow keys ↑ and ↓ change the digit; ← and → move between boxes.',
      'Enter plays your guess.',
      'Prefer tapping? Turn on the + / − buttons in the game or in Settings.',
    ],
    cta: 'Start playing',
  },
  pwa: {
    updateAvailable: 'A new version of the game is available.',
    update: 'Update',
    later: 'Later',
  },
  settings: {
    title: 'Settings',
    languageLegend: 'Language',
    inputLegend: 'Input mode',
    inputKeyboard: 'Keyboard',
    inputKeyboardHint: 'Type the digits directly.',
    inputStepper: '+ / − buttons',
    inputStepperHint: 'Tap to step each digit up or down.',
    themeNote: 'Light or dark theme follows your device settings.',
  },
}
