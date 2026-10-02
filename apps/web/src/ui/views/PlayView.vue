<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../../application/game-store'
import AttemptList from '../components/AttemptList.vue'
import GuessInput from '../components/GuessInput.vue'
import { t } from '../strings'

const router = useRouter()
const game = useGameStore()
const input = ref<InstanceType<typeof GuessInput> | null>(null)

const feedback = computed(() => {
  const o = game.lastOutcome
  if (!o) return ''
  if (o.kind === 'invalid') return t.play.invalid[o.reason] ?? ''
  return ''
})

async function onSubmit(value: string) {
  const outcome = await game.submit(value)
  if (outcome.kind === 'evaluated') input.value?.reset()
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
  <section v-if="game.current">
    <h2>{{ t.play.title }} · {{ t.play.level(game.current.level) }}</h2>

    <AttemptList :attempts="game.attemptsNewestFirst" />

    <div
      v-if="game.isWon"
      role="dialog"
      aria-modal="false"
      aria-labelledby="won-title"
      data-testid="won"
    >
      <h3 id="won-title">{{ t.play.won(game.current.attempts.length) }}</h3>
      <button type="button" autofocus @click="playAgain">{{ t.play.playAgain }}</button>
      <button type="button" @click="seeHistory">{{ t.play.seeHistory }}</button>
    </div>

    <template v-else>
      <GuessInput
        ref="input"
        :level="game.current.level"
        :disabled="game.busy"
        @submit="onSubmit"
      />
      <p v-if="feedback" role="alert">{{ feedback }}</p>
      <button type="button" @click="abandon">{{ t.play.abandon }}</button>
    </template>
  </section>
</template>
