<script setup lang="ts">
import { validateGuess } from '@bnc/domain'
import type { GuessRejection, Level } from '@bnc/domain'
import { computed, ref, watch } from 'vue'
import { usePreferencesStore } from '../../application/preferences-store'
import { t } from '../strings'

/**
 * Entrada del intento (D-06).
 *
 * Primaria: un campo por dígito, teclado físico o numérico del sistema, con
 * auto-avance, retroceso, flechas laterales, pegado distribuido y Enter.
 * Flechas arriba/abajo suben y bajan el dígito (paridad de teclado con los
 * selectores).
 *
 * Alternativa: selectores +/− por dígito, cíclicos como en el original. Son
 * botones fuera del orden de tabulación —el teclado ya tiene las flechas— pero
 * presentes para puntero y lectores de pantalla táctiles.
 */
const props = defineProps<{ level: Level; disabled?: boolean }>()
const emit = defineEmits<{ submit: [value: string] }>()
const prefs = usePreferencesStore()

const digits = ref<string[]>(Array.from({ length: props.level }, () => ''))
const inputs = ref<HTMLInputElement[]>([])
const touched = ref(false)

watch(
  () => props.level,
  (n) => {
    digits.value = Array.from({ length: n }, () => '')
    touched.value = false
  },
)

const stepper = computed(() => prefs.inputMode === 'stepper')
const value = computed(() => digits.value.join(''))
const validation = computed(() => validateGuess(value.value, props.level))
const complete = computed(() => digits.value.every((d) => d !== ''))
const rejection = computed<GuessRejection | null>(() =>
  validation.value.ok ? null : validation.value.reason,
)
const repeatedIdx = computed(() => {
  const seen = new Map<string, number>()
  const dup = new Set<number>()
  digits.value.forEach((d, i) => {
    if (!d) return
    const first = seen.get(d)
    if (first !== undefined) dup.add(first).add(i)
    else seen.set(d, i)
  })
  return dup
})
// Repetidos se avisan en cuanto ocurren; "incompleto" solo tras intentar enviar.
const message = computed(() => {
  if (repeatedIdx.value.size > 0) return t.play.invalid['repeated']
  if (touched.value && rejection.value) return t.play.invalid[rejection.value]
  return ''
})

function focusAt(i: number) {
  const el = inputs.value[Math.max(0, Math.min(i, props.level - 1))]
  el?.focus()
  el?.select()
}

/** Paso cíclico 0-9. Desde vacío: +1 → 0, −1 → 9 (como los selectores del original). */
function step(i: number, delta: 1 | -1) {
  const cur = digits.value[i] ?? ''
  const next = cur === '' ? (delta === 1 ? 0 : 9) : (Number(cur) + delta + 10) % 10
  digits.value[i] = String(next)
}

function onInput(i: number, e: Event) {
  const el = e.target as HTMLInputElement
  const raw = el.value.replace(/[^0-9]/g, '')
  if (raw.length > 1) {
    // Pegado o autocompletado: distribuir desde esta posición.
    raw.split('').forEach((ch, k) => {
      if (i + k < props.level) digits.value[i + k] = ch
    })
    el.value = digits.value[i] ?? ''
    focusAt(i + raw.length)
    return
  }
  digits.value[i] = raw
  el.value = raw
  if (raw) focusAt(i + 1)
}

function onKeydown(i: number, e: KeyboardEvent) {
  switch (e.key) {
    case 'Backspace':
      if (digits.value[i]) {
        digits.value[i] = ''
      } else if (i > 0) {
        digits.value[i - 1] = ''
        focusAt(i - 1)
      }
      break
    case 'ArrowLeft':
      focusAt(i - 1)
      break
    case 'ArrowRight':
      focusAt(i + 1)
      break
    case 'ArrowUp':
      step(i, 1)
      break
    case 'ArrowDown':
      step(i, -1)
      break
    case 'Enter':
      submit()
      break
    default:
      return
  }
  e.preventDefault()
}

function submit() {
  touched.value = true
  if (!validation.value.ok || props.disabled) {
    const firstEmpty = digits.value.findIndex((d) => d === '')
    focusAt(firstEmpty === -1 ? Math.min(...repeatedIdx.value) : firstEmpty)
    return
  }
  emit('submit', value.value)
}

function reset() {
  digits.value = Array.from({ length: props.level }, () => '')
  touched.value = false
  focusAt(0)
}

defineExpose({ reset, focus: () => focusAt(0) })
</script>

<template>
  <form class="guess" @submit.prevent="submit">
    <div class="guess__head">
      <!-- Título visual; el nombre accesible del grupo lo da <legend>. -->
      <span class="guess__title" aria-hidden="true">{{ t.play.guessLegend }}</span>
      <button
        type="button"
        class="btn btn-ghost guess__mode"
        :aria-pressed="stepper ? 'true' : 'false'"
        data-testid="stepper-toggle"
        @click="prefs.toggleInputMode()"
      >
        {{ t.play.stepperMode }}
      </button>
    </div>

    <fieldset :disabled="disabled" class="guess__fieldset">
      <legend class="visually-hidden">{{ t.play.guessLegend }}</legend>

      <div class="digits" data-testid="digits" :style="{ '--n': level }">
        <div v-for="(_, i) in digits" :key="i" class="digit">
          <button
            v-if="stepper"
            type="button"
            tabindex="-1"
            class="step"
            :aria-label="t.play.increment(i + 1)"
            :data-testid="`inc-${i}`"
            @click="step(i, 1)"
          >
            <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <path
                d="M8 4v8M4 8h8"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </button>
          <input
            :ref="
              (el) => {
                if (el) inputs[i] = el as HTMLInputElement
              }
            "
            class="digit__input"
            type="text"
            inputmode="numeric"
            pattern="[0-9]"
            maxlength="1"
            autocomplete="off"
            :value="digits[i]"
            :aria-label="t.play.digit(i + 1, level)"
            :aria-invalid="repeatedIdx.has(i) ? 'true' : undefined"
            :aria-describedby="message ? 'guess-message' : undefined"
            :data-testid="`digit-${i}`"
            :data-autofocus="i === 0 ? '' : undefined"
            @input="onInput(i, $event)"
            @keydown="onKeydown(i, $event)"
            @focus="($event.target as HTMLInputElement).select()"
          />
          <button
            v-if="stepper"
            type="button"
            tabindex="-1"
            class="step"
            :aria-label="t.play.decrement(i + 1)"
            :data-testid="`dec-${i}`"
            @click="step(i, -1)"
          >
            <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <path d="M4 8h8" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
          </button>
        </div>
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

      <button
        type="submit"
        class="btn btn-primary btn-block"
        :disabled="disabled || !complete || !validation.ok"
      >
        {{ t.play.submit }}
      </button>
    </fieldset>
  </form>
</template>

<style scoped>
.guess {
  display: grid;
  gap: var(--space-3);
}

.guess__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
}

.guess__title {
  font-size: var(--text-lg);
  font-weight: 700;
}

.guess__mode {
  padding-inline: var(--space-3);
  font-size: var(--text-sm);
}

.guess__fieldset {
  display: grid;
  gap: var(--space-4);
  margin: 0;
  padding: 0;
  border: 0;
  min-width: 0;
}

.guess__mode[aria-pressed='true'] {
  color: var(--color-accent);
  background: var(--color-surface-2);
}

.digits {
  display: grid;
  grid-template-columns: repeat(var(--n), minmax(0, 3.5rem));
  justify-content: center;
  gap: var(--space-2);
}

.digit {
  display: grid;
  gap: var(--space-1);
}

.digit__input {
  width: 100%;
  aspect-ratio: 4 / 5;
  min-height: 3.5rem;
  padding: 0;
  border: 2px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  font-family: var(--font-mono);
  font-size: var(--text-digit);
  font-weight: 700;
  text-align: center;
  caret-color: var(--color-accent);
  transition: border-color var(--transition);
}

.digit__input:focus-visible {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: var(--focus-ring);
}

.digit__input[aria-invalid='true'] {
  border-color: var(--color-danger);
  color: var(--color-danger);
}

.step {
  display: grid;
  place-items: center;
  min-height: var(--target-min);
  padding: 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface-2);
  color: var(--color-text);
  cursor: pointer;
}

.step:hover {
  border-color: var(--color-border-strong);
}

.step svg {
  width: 1.125rem;
  height: 1.125rem;
}

.guess__message {
  min-height: 1.5em;
  color: var(--color-danger);
  font-size: var(--text-sm);
  font-weight: 600;
  text-align: center;
}
</style>
