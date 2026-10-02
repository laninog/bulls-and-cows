<script setup lang="ts">
import { validateGuess } from '@bnc/domain'
import type { GuessRejection, Level } from '@bnc/domain'
import { computed, ref, watch } from 'vue'
import { t } from '../strings'

/**
 * Entrada numérica directa (D-06): un campo por dígito, teclado físico o
 * numérico del sistema, con auto-avance, retroceso, flechas y pegado.
 * Los selectores +/- llegan en F2.2 como modo alternativo.
 */
const props = defineProps<{ level: Level; disabled?: boolean }>()
const emit = defineEmits<{ submit: [value: string] }>()

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

const value = computed(() => digits.value.join(''))
const validation = computed(() => validateGuess(value.value, props.level))
const complete = computed(() => digits.value.every((d) => d !== ''))
const rejection = computed<GuessRejection | null>(() =>
  validation.value.ok ? null : validation.value.reason,
)
// Solo se muestra un error cuando aporta algo: repetidos en cuanto ocurren,
// longitud solo tras intentar enviar.
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
      e.preventDefault()
      break
    case 'ArrowLeft':
      focusAt(i - 1)
      e.preventDefault()
      break
    case 'ArrowRight':
      focusAt(i + 1)
      e.preventDefault()
      break
    case 'Enter':
      e.preventDefault()
      submit()
      break
  }
}

function submit() {
  touched.value = true
  if (!validation.value.ok || props.disabled) {
    focusAt(digits.value.findIndex((d) => d === ''))
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
  <form @submit.prevent="submit">
    <fieldset :disabled="disabled">
      <legend>{{ t.play.guessLegend }}</legend>
      <div data-testid="digits">
        <input
          v-for="(_, i) in digits"
          :key="i"
          :ref="
            (el) => {
              if (el) inputs[i] = el as HTMLInputElement
            }
          "
          type="text"
          inputmode="numeric"
          pattern="[0-9]"
          maxlength="1"
          autocomplete="off"
          :value="digits[i]"
          :aria-label="t.play.digit(i + 1, level)"
          :aria-invalid="repeatedIdx.has(i) ? 'true' : undefined"
          :data-testid="`digit-${i}`"
          @input="onInput(i, $event)"
          @keydown="onKeydown(i, $event)"
          @focus="($event.target as HTMLInputElement).select()"
        />
      </div>
      <p role="status" aria-live="polite" data-testid="guess-message">{{ message }}</p>
      <button type="submit" :disabled="disabled || !complete || !validation.ok">
        {{ t.play.submit }}
      </button>
    </fieldset>
  </form>
</template>
