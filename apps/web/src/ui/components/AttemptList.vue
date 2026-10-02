<script setup lang="ts">
import type { Attempt } from '@bnc/domain'
import { t } from '../strings'

defineProps<{ attempts: readonly Attempt[] }>()
</script>

<template>
  <section :aria-label="t.play.attempts">
    <h3>{{ t.play.attempts }}</h3>
    <p v-if="attempts.length === 0">{{ t.play.noAttempts }}</p>
    <ol v-else data-testid="attempts" reversed>
      <li
        v-for="a in attempts"
        :key="a.ordinal"
        :value="a.ordinal"
        :aria-label="t.play.attemptLabel(a.ordinal, a.guess, a.bulls, a.cows)"
      >
        <span data-testid="guess">{{ a.guess.split('').join(' ') }}</span>
        <span data-testid="bulls"><abbr :title="t.play.bulls">B</abbr> {{ a.bulls }}</span>
        <span data-testid="cows"><abbr :title="t.play.cows">C</abbr> {{ a.cows }}</span>
      </li>
    </ol>
  </section>
</template>
