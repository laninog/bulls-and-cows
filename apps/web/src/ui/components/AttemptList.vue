<script setup lang="ts">
import type { Attempt } from '@bnc/domain'
import { t } from '../strings'
import PegIcon from './PegIcon.vue'

defineProps<{ attempts: readonly Attempt[] }>()
</script>

<template>
  <section class="attempts" :aria-label="t.play.attempts">
    <div class="attempts__head">
      <h3>{{ t.play.attempts }}</h3>
      <dl class="legend">
        <div>
          <dt class="badge badge--bull"><PegIcon kind="bull" /> {{ t.play.bulls }}</dt>
          <dd>{{ t.play.legend.bulls }}</dd>
        </div>
        <div>
          <dt class="badge badge--cow"><PegIcon kind="cow" /> {{ t.play.cows }}</dt>
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
          <span v-for="(d, k) in a.guess.split('')" :key="k" class="chip">{{ d }}</span>
        </span>
        <span class="attempt__score" aria-hidden="true">
          <span data-testid="bulls" class="badge badge--bull" :title="t.play.bulls">
            <PegIcon kind="bull" /> {{ a.bulls }}
          </span>
          <span data-testid="cows" class="badge badge--cow" :title="t.play.cows">
            <PegIcon kind="cow" /> {{ a.cows }}
          </span>
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

.attempt__guess {
  display: flex;
  gap: var(--space-1);
}

.chip {
  display: inline-grid;
  place-items: center;
  width: 2rem;
  height: 2.25rem;
  border-radius: var(--radius-sm);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  font-family: var(--font-mono);
  font-size: var(--text-lg);
  font-weight: 600;
}

.attempt__score {
  display: flex;
  gap: var(--space-2);
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.badge--bull {
  background: var(--color-bull-bg);
  color: var(--color-bull-fg);
}

.badge--cow {
  background: var(--color-cow-bg);
  color: var(--color-cow-fg);
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
