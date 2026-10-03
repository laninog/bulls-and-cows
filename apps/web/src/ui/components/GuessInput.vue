<script setup lang="ts">
import { validateGuess } from '@bnc/domain'
import type { GuessRejection, Level } from '@bnc/domain'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useT } from '../i18n'

/**
 * Entrada del intento (D-06, revisada en D-30).
 *
 * Teclado numérico propio en todos los dispositivos: no hay ningún campo de
 * texto, así que el teclado del sistema no aparece nunca en el móvil. Las
 * casillas solo muestran el intento; tocar una la selecciona para cambiarla.
 *
 * Con teclado físico, desde cualquier punto de la partida: 0-9 escriben,
 * Retroceso borra, ← → cambian de casilla, Enter juega y pegar distribuye.
 *
 * Los dígitos ya usados se atenúan y no se aceptan: un intento con repetidos
 * no puede llegar a componerse. Se usa `aria-disabled` y no `disabled` para
 * que el foco no se pierda al pulsar una tecla que pasa a estar usada.
 *
 * Tocar o hacer clic en el teclado no mueve el foco (`mousedown.prevent`), como
 * en cualquier teclado en pantalla: así Enter en el teclado físico sigue jugando
 * el intento. Con Tab sí se llega a cada tecla.
 */
const props = defineProps<{ level: Level; disabled?: boolean }>()
const emit = defineEmits<{ submit: [value: string] }>()
const t = useT()

const KEY_ROWS = [
  ['1', '2', '3', '4', '5'],
  ['6', '7', '8', '9', '0'],
] as const

const empty = (n: number) => Array.from({ length: n }, () => '')
const digits = ref<string[]>(empty(props.level))
/** Casilla que ocupará el siguiente dígito; `level` = intento completo, sin casilla activa. */
const cursor = ref(0)
const rejection = ref<GuessRejection | null>(null)
/** Texto para lectores de pantalla: el intento tal como queda tras cada pulsación. */
const spoken = ref('')

const value = computed(() => digits.value.join(''))
const complete = computed(() => digits.value.every((d) => d !== ''))
const used = computed(() => new Set(digits.value.filter(Boolean)))
const message = computed(() => (rejection.value ? t.value.play.invalid[rejection.value] : ''))

watch(
  () => props.level,
  (n) => {
    digits.value = empty(n)
    cursor.value = 0
    rejection.value = null
    spoken.value = ''
  },
)

function speak() {
  spoken.value = t.value.play.composed(digits.value)
}

/** Siguiente casilla vacía tras `from`, dando la vuelta; `level` si no queda ninguna. */
function nextEmpty(from: number): number {
  const n = props.level
  for (let k = 1; k <= n; k++) {
    const i = (from + k) % n
    if (!digits.value[i]) return i
  }
  return n
}

function press(d: string) {
  if (props.disabled || cursor.value >= props.level) return
  if (digits.value[cursor.value] === d) {
    cursor.value = nextEmpty(cursor.value)
    return
  }
  if (used.value.has(d)) {
    rejection.value = 'repeated'
    return
  }
  digits.value[cursor.value] = d
  rejection.value = null
  cursor.value = nextEmpty(cursor.value)
  speak()
}

function erase() {
  if (props.disabled) return
  const i =
    cursor.value < props.level && digits.value[cursor.value] ? cursor.value : cursor.value - 1
  if (i < 0) return
  digits.value[i] = ''
  cursor.value = i
  rejection.value = null
  speak()
}

function move(delta: -1 | 1) {
  cursor.value = Math.max(0, Math.min(cursor.value + delta, props.level - 1))
}

function select(i: number) {
  cursor.value = i
}

function submit() {
  if (props.disabled) return
  const v = validateGuess(value.value, props.level)
  if (!v.ok) {
    rejection.value = v.reason
    return
  }
  emit('submit', value.value)
}

/** No interfiere con campos de texto ni con atajos del navegador o del sistema. */
function ignorable(e: KeyboardEvent | ClipboardEvent): boolean {
  if ('ctrlKey' in e && (e.ctrlKey || e.metaKey || e.altKey || e.isComposing)) return true
  const target = e.target instanceof Element ? e.target : null
  return !!target?.closest(
    'input, textarea, select, [contenteditable]:not([contenteditable="false"])',
  )
}

function onKeydown(e: KeyboardEvent) {
  if (e.defaultPrevented || ignorable(e)) return
  if (/^[0-9]$/.test(e.key)) {
    press(e.key)
  } else if (e.key === 'Backspace' || e.key === 'Delete') {
    erase()
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    move(e.key === 'ArrowLeft' ? -1 : 1)
  } else if (e.key === 'Enter') {
    // Enter sobre un botón o un enlace es su activación nativa (p. ej. una tecla enfocada con
    // Tab), salvo en las casillas, que solo muestran el intento.
    const target = e.target instanceof Element ? e.target : null
    const control = target?.closest('button, a, summary, [role="button"]')
    if (control && !control.hasAttribute('data-slot')) return
    submit()
  } else {
    return
  }
  e.preventDefault()
}

function onPaste(e: ClipboardEvent) {
  if (ignorable(e)) return
  const pasted = (e.clipboardData?.getData('text') ?? '').replace(/[^0-9]/g, '')
  if (!pasted) return
  e.preventDefault()
  for (const d of pasted) press(d)
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('paste', onPaste)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('paste', onPaste)
})

function reset() {
  digits.value = empty(props.level)
  cursor.value = 0
  rejection.value = null
  spoken.value = ''
}

defineExpose({ reset })
</script>

<template>
  <div class="guess">
    <h3 id="guess-title" class="guess__title">{{ t.play.guessLegend }}</h3>

    <!-- Casillas: fuera del orden de tabulación (con teclado, ← y →); tocar una la selecciona. -->
    <div
      class="slots"
      role="group"
      aria-labelledby="guess-title"
      data-testid="digits"
      :style="{ '--n': level }"
    >
      <button
        v-for="(d, i) in digits"
        :key="i"
        type="button"
        tabindex="-1"
        class="slot"
        data-slot
        :aria-label="t.play.slot(i + 1, level, d)"
        :aria-current="cursor === i ? 'true' : undefined"
        :data-testid="`digit-${i}`"
        @mousedown.prevent
        @click="select(i)"
      >
        {{ d }}
      </button>
    </div>

    <p
      id="guess-message"
      class="guess__message"
      role="status"
      aria-live="polite"
      data-testid="guess-message"
    >
      {{ message }}
    </p>
    <p class="visually-hidden" aria-live="polite" data-testid="guess-spoken">{{ spoken }}</p>

    <div class="keypad" role="group" :aria-label="t.play.keypad" data-testid="keypad">
      <template v-for="(row, r) in KEY_ROWS" :key="r">
        <button
          v-for="k in row"
          :key="k"
          type="button"
          class="key"
          :aria-disabled="used.has(k) ? 'true' : undefined"
          :data-testid="`key-${k}`"
          @mousedown.prevent
          @click="press(k)"
        >
          {{ k }}
        </button>
        <button
          v-if="r === 0"
          type="button"
          class="key key--action"
          :aria-label="t.play.delete"
          data-testid="key-delete"
          @mousedown.prevent
          @click="erase"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
              d="M9 5h11a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H9l-6-7 6-7Z M12 9.5l5 5 M17 9.5l-5 5"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
        <button
          v-else
          type="button"
          class="key key--submit"
          :aria-label="t.play.submit"
          :aria-disabled="!complete || disabled ? 'true' : undefined"
          data-testid="submit"
          @mousedown.prevent
          @click="submit"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
              d="M5 12.5l4.5 4.5L19 7.5"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.guess {
  display: grid;
  gap: var(--space-3);
}

.guess__title {
  font-size: var(--text-lg);
  font-weight: 700;
}

.slots {
  display: grid;
  grid-template-columns: repeat(var(--n), minmax(0, 3.5rem));
  justify-content: center;
  gap: var(--space-2);
}

.slot {
  display: grid;
  place-items: center;
  width: 100%;
  aspect-ratio: 4 / 5;
  min-height: 3.5rem;
  padding: 0;
  border: 2px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-text);
  font-family: var(--font-mono);
  font-size: var(--text-digit);
  font-weight: 700;
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition: border-color var(--transition);
}

.slot[aria-current='true'] {
  border-color: var(--color-accent);
  box-shadow: inset 0 -4px 0 var(--color-accent);
}

.guess__message {
  min-height: 1.5em;
  color: var(--color-danger);
  font-size: var(--text-sm);
  font-weight: 600;
  text-align: center;
}

/* Dos filas: 1-5 y borrar; 6-0 y jugar. La columna de acción es algo más ancha. */
.keypad {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr)) minmax(0, 1.4fr);
  gap: var(--space-2);
}

.key {
  display: grid;
  place-items: center;
  min-width: var(--target-min);
  min-height: 3.25rem;
  padding: 0;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  background: var(--color-surface-2);
  color: var(--color-text);
  font-family: var(--font-mono);
  font-size: var(--text-lg);
  font-weight: 700;
  cursor: pointer;
  touch-action: manipulation;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition:
    border-color var(--transition),
    background-color var(--transition);
}

.key svg {
  width: 1.5rem;
  height: 1.5rem;
}

.key:hover:not([aria-disabled='true']) {
  border-color: var(--color-accent);
}

.key:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}

/* Componente inactivo: exento del requisito de contraste (WCAG 1.4.3 y 1.4.11). */
.key[aria-disabled='true'] {
  opacity: 0.4;
  cursor: not-allowed;
}

.key--submit {
  border-color: var(--color-accent);
  background: var(--color-accent);
  color: var(--color-accent-contrast);
}

.key--submit:hover:not([aria-disabled='true']) {
  border-color: var(--color-accent-hover);
  background: var(--color-accent-hover);
}

@media (prefers-reduced-motion: no-preference) {
  .key:active:not([aria-disabled='true']) {
    transform: scale(0.95);
  }
}
</style>
