<script setup lang="ts">
import type { Attempt } from '@bnc/domain'
import { useT } from '../i18n'
import DigitChips from './DigitChips.vue'
import ScoreBadge from './ScoreBadge.vue'

defineProps<{ attempts: readonly Attempt[] }>()
const t = useT()
</script>

<template>
  <section class="attempts" :aria-label="t.play.attempts">
    <div class="attempts__head">
      <h3>{{ t.play.attempts }}</h3>
      <dl class="legend">
        <div>
          <dt>
            <ScoreBadge kind="bull">{{ t.play.bulls }}</ScoreBadge>
          </dt>
          <dd>{{ t.play.legend.bulls }}</dd>
        </div>
        <div>
          <dt>
            <ScoreBadge kind="cow">{{ t.play.cows }}</ScoreBadge>
          </dt>
          <dd>{{ t.play.legend.cows }}</dd>
        </div>
      </dl>
    </div>

    <p v-if="attempts.length === 0" class="muted">{{ t.play.noAttempts }}</p>
    <ol v-else data-testid="attempts" reversed class="attempts__list">
      <li
        v-for="(a, i) in attempts"
        :key="a.ordinal"
        :value="a.ordinal"
        class="attempt"
        :class="{ 'attempt--latest': i === 0 }"
      >
        <span class="visually-hidden" data-testid="attempt-label">{{
          t.play.attemptLabel(a.ordinal, a.guess, a.bulls, a.cows)
        }}</span>
        <span class="attempt__ordinal" aria-hidden="true">{{ a.ordinal }}</span>
        <span data-testid="guess" class="attempt__guess" aria-hidden="true">
          <DigitChips :value="a.guess" />
        </span>
        <span class="attempt__score" aria-hidden="true">
          <ScoreBadge kind="bull" :title="t.play.bulls" data-testid="bulls">{{
            a.bulls
          }}</ScoreBadge>
          <ScoreBadge kind="cow" :title="t.play.cows" data-testid="cows">{{ a.cows }}</ScoreBadge>
        </span>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.attempts {
  display: grid;
  gap: var(--space-4);
}

.attempts__head {
  display: grid;
  gap: var(--space-2);
}

.attempts h3 {
  font-size: var(--text-lg);
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2) var(--space-4);
  margin: 0;
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

.legend > div {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.legend dd {
  margin: 0;
}

.attempts__list {
  display: grid;
  gap: var(--space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}

.attempt {
  display: grid;
  grid-template-columns: 2rem 1fr auto;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  animation: enter var(--transition) ease-out;
}

.attempt--latest {
  border-color: var(--color-border-strong);
  background: var(--color-surface-2);
}

.attempt__ordinal {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  font-variant-numeric: tabular-nums;
  text-align: right;
}

.attempt__score {
  display: flex;
  gap: var(--space-2);
}

@keyframes enter {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .attempt {
    animation: none;
  }
}
</style>
