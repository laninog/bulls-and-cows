<script setup lang="ts">
import { LEVELS } from '@bnc/domain'
import type { Level } from '@bnc/domain'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../../application/game-store'
import { useSessionStore } from '../../application/session-store'
import { t } from '../strings'

const router = useRouter()
const game = useGameStore()
const session = useSessionStore()
// BF-08: nunca un nivel fuera de las opciones; por defecto, el primero.
const level = ref<Level>(LEVELS[0])

async function start() {
  await game.start(level.value)
  await router.push({ name: 'play' })
}
</script>

<template>
  <section class="home card" aria-labelledby="home-title">
    <h2 id="home-title" tabindex="-1">{{ t.home.title }}</h2>
    <p class="muted">{{ t.home.intro }}</p>

    <form class="home__form" @submit.prevent="start">
      <fieldset class="levels">
        <legend>{{ t.home.levelLegend }}</legend>
        <label v-for="l in LEVELS" :key="l" class="level">
          <input v-model="level" type="radio" name="level" :value="l" class="level__input" />
          <span class="level__body">
            <span class="level__name">{{ t.home.levels[l] }}</span>
            <span class="level__digits">{{ t.home.digits(l) }}</span>
          </span>
        </label>
      </fieldset>

      <button type="submit" class="btn btn-primary btn-block" :disabled="game.busy">
        {{ t.home.start }}
      </button>
    </form>

    <p v-if="session.session?.kind === 'guest'" class="home__guest muted">{{ t.home.guest }}</p>
  </section>
</template>

<style scoped>
.home {
  max-width: 32rem;
  margin: 0 auto;
  display: grid;
  gap: var(--space-4);
}

.home h2 {
  font-size: var(--text-xl);
}

.home__form {
  display: grid;
  gap: var(--space-5);
}

.levels {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-3);
  margin: 0;
  padding: 0;
  border: 0;
}

.levels legend {
  margin-bottom: var(--space-2);
  font-weight: 600;
}

.level {
  position: relative;
  cursor: pointer;
}

/* El radio real sigue en el árbol de accesibilidad y recibe el foco. */
.level__input {
  position: absolute;
  inset: 0;
  opacity: 0;
  margin: 0;
  cursor: pointer;
}

.level__body {
  display: grid;
  gap: var(--space-1);
  min-height: var(--target-min);
  padding: var(--space-3) var(--space-4);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  transition:
    border-color var(--transition),
    background-color var(--transition);
}

.level:hover .level__body {
  border-color: var(--color-border-strong);
}

.level__input:checked + .level__body {
  border-color: var(--color-accent);
  background: var(--color-surface-2);
}

.level__input:focus-visible + .level__body {
  outline: 3px solid var(--color-focus);
  outline-offset: 2px;
}

.level__name {
  font-weight: 600;
}

.level__digits {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.home__guest {
  font-size: var(--text-sm);
  text-align: center;
}
</style>
