<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../../application/game-store'
import AttemptList from '../components/AttemptList.vue'
import GuessInput from '../components/GuessInput.vue'
import { t } from '../strings'

const router = useRouter()
const game = useGameStore()
const input = ref<InstanceType<typeof GuessInput> | null>(null)
const playAgainBtn = ref<HTMLButtonElement | null>(null)

/** Texto para la región viva: el lector de pantalla anuncia el resultado de cada intento. */
const announcement = ref('')

const feedback = computed(() => {
  const o = game.lastOutcome
  return o?.kind === 'invalid' ? (t.play.invalid[o.reason] ?? '') : ''
})

const elapsed = computed(() => {
  const g = game.current
  return g?.finishedAt ? g.finishedAt - g.startedAt : null
})

// Al ganar, el foco va a la acción principal del panel de victoria.
watch(
  () => game.isWon,
  async (won) => {
    if (!won) return
    await nextTick()
    playAgainBtn.value?.focus()
  },
)

async function onSubmit(value: string) {
  const outcome = await game.submit(value)
  if (outcome.kind !== 'evaluated') return
  const { ordinal, bulls, cows } = outcome.attempt
  announcement.value = outcome.solved ? t.play.won(ordinal) : t.play.announce(ordinal, bulls, cows)
  if (!outcome.solved) input.value?.reset()
}

async function abandon() {
  await game.abandon()
  await router.push({ name: 'home' })
}

async function playAgain() {
  game.clear()
  await router.push({ name: 'home' })
}

async function seeHistory() {
  game.clear()
  await router.push({ name: 'history' })
}
</script>

<template>
  <section v-if="game.current" class="play" aria-labelledby="play-title">
    <header class="play__header">
      <h2 id="play-title" tabindex="-1">
        {{ t.play.title }} <span class="play__level">{{ t.play.level(game.current.level) }}</span>
      </h2>
      <button v-if="!game.isWon" type="button" class="btn btn-ghost" @click="abandon">
        {{ t.play.abandon }}
      </button>
    </header>

    <div class="play__grid">
      <div class="play__panel card">
        <section v-if="game.isWon" class="won" aria-labelledby="won-title" data-testid="won">
          <h3 id="won-title">{{ t.play.won(game.current.attempts.length) }}</h3>
          <p v-if="elapsed !== null" class="muted">{{ t.play.wonTime(elapsed) }}</p>
          <div class="won__actions">
            <button ref="playAgainBtn" type="button" class="btn btn-primary" @click="playAgain">
              {{ t.play.playAgain }}
            </button>
            <button type="button" class="btn btn-secondary" @click="seeHistory">
              {{ t.play.seeHistory }}
            </button>
          </div>
        </section>

        <template v-else>
          <GuessInput
            ref="input"
            :level="game.current.level"
            :disabled="game.busy"
            @submit="onSubmit"
          />
          <p v-if="feedback" role="alert" class="play__feedback">{{ feedback }}</p>
        </template>
      </div>

      <div class="play__attempts card">
        <AttemptList :attempts="game.attemptsNewestFirst" />
      </div>
    </div>

    <p class="visually-hidden" role="status" aria-live="polite" data-testid="announcer">
      {{ announcement }}
    </p>
  </section>
</template>

<style scoped>
.play {
  display: grid;
  gap: var(--space-4);
}

.play__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.play__header h2 {
  font-size: var(--text-xl);
}

.play__level {
  margin-left: var(--space-2);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  background: var(--color-surface-2);
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  font-weight: 600;
  vertical-align: middle;
}

.play__grid {
  display: grid;
  gap: var(--space-4);
  align-items: start;
}

/* Escritorio: entrada a la izquierda, fija; intentos a la derecha. */
@media (min-width: 48rem) {
  .play__grid {
    grid-template-columns: minmax(18rem, 2fr) 3fr;
  }

  .play__panel {
    position: sticky;
    top: var(--space-4);
  }
}

.play__feedback {
  margin-top: var(--space-3);
  color: var(--color-danger);
  font-weight: 600;
}

.won {
  display: grid;
  gap: var(--space-3);
  text-align: center;
}

.won h3 {
  font-size: var(--text-xl);
  color: var(--color-accent);
}

.won__actions {
  display: grid;
  gap: var(--space-2);
  margin-top: var(--space-2);
}
</style>
