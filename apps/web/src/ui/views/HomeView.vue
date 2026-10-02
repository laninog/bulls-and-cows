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
  <section>
    <h2>{{ t.home.title }}</h2>
    <p v-if="session.session?.kind === 'guest'">{{ t.home.guest }}</p>
    <form @submit.prevent="start">
      <label for="level">{{ t.home.levelLabel }}</label>
      <select id="level" v-model.number="level" name="level">
        <option v-for="l in LEVELS" :key="l" :value="l">{{ t.home.levels[l] }}</option>
      </select>
      <button type="submit" :disabled="game.busy">{{ t.home.start }}</button>
    </form>
  </section>
</template>
