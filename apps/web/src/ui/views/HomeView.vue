<script setup lang="ts">
import { LEVELS } from '@bnc/domain'
import type { Level } from '@bnc/domain'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../../application/game-store'
import { useSessionStore } from '../../application/session-store'
import { useT } from '../i18n'

const router = useRouter()
const game = useGameStore()
const session = useSessionStore()
const t = useT()
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
    <p class="muted">
      {{ t.home.intro }}
      <RouterLink :to="{ name: 'rules' }">{{ t.home.howToPlay }}</RouterLink>
    </p>

    <form class="home__form" @submit.prevent="start">
      <fieldset class="choices choices--2col">
        <legend>{{ t.home.levelLegend }}</legend>
        <label v-for="l in LEVELS" :key="l" class="choice">
          <input v-model="level" type="radio" name="level" :value="l" class="choice__input" />
          <span class="choice__body">
            <span class="choice__title">{{ t.home.levels[l] }}</span>
            <span class="choice__hint">{{ t.home.digits(l) }}</span>
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

.home__guest {
  font-size: var(--text-sm);
  text-align: center;
}
</style>
