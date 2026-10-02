<script setup lang="ts">
import { evaluate } from '@bnc/domain'
import { useT } from '../i18n'
import DigitChips from '../components/DigitChips.vue'
import ScoreBadge from '../components/ScoreBadge.vue'

const t = useT()

// El ejemplo se evalúa con el motor real: la pantalla de reglas no puede mentir.
const SECRET = '471'
const examples = ['423', '147', '471'].map((guess) => ({ guess, ...evaluate(guess, SECRET) }))
</script>

<template>
  <article class="rules card" aria-labelledby="rules-title">
    <h2 id="rules-title" tabindex="-1">{{ t.rules.title }}</h2>

    <section aria-labelledby="rules-goal">
      <h3 id="rules-goal">{{ t.rules.goalTitle }}</h3>
      <p>{{ t.rules.goal }}</p>
    </section>

    <section aria-labelledby="rules-clues">
      <h3 id="rules-clues">{{ t.rules.cluesTitle }}</h3>
      <p>{{ t.rules.cluesIntro }}</p>
      <dl class="clues">
        <div>
          <dt>
            <ScoreBadge kind="bull">{{ t.play.bulls }}</ScoreBadge>
          </dt>
          <dd>{{ t.rules.bulls }}</dd>
        </div>
        <div>
          <dt>
            <ScoreBadge kind="cow">{{ t.play.cows }}</ScoreBadge>
          </dt>
          <dd>{{ t.rules.cows }}</dd>
        </div>
      </dl>
    </section>

    <section aria-labelledby="rules-example">
      <h3 id="rules-example">{{ t.rules.exampleTitle }}</h3>
      <p class="muted">{{ t.rules.exampleCaption(SECRET) }}</p>
      <ol class="examples" data-testid="rules-example">
        <li v-for="(ex, i) in examples" :key="ex.guess" class="example">
          <span class="visually-hidden" data-testid="example-label"
            >{{ t.rules.exampleCols.guess }} {{ ex.guess.split('').join(' ') }}:
            {{ t.rules.resultLabel(ex.bulls, ex.cows) }}.</span
          >
          <span class="example__row" aria-hidden="true">
            <DigitChips :value="ex.guess" />
            <span class="example__score">
              <ScoreBadge kind="bull">{{ ex.bulls }}</ScoreBadge>
              <ScoreBadge kind="cow">{{ ex.cows }}</ScoreBadge>
            </span>
          </span>
          <span class="example__why">{{ t.rules.exampleWhy[i] }}</span>
        </li>
      </ol>
    </section>

    <section aria-labelledby="rules-levels">
      <h3 id="rules-levels">{{ t.rules.levelsTitle }}</h3>
      <p>{{ t.rules.levels }}</p>
    </section>

    <section aria-labelledby="rules-input">
      <h3 id="rules-input">{{ t.rules.inputTitle }}</h3>
      <ul>
        <li v-for="item in t.rules.inputItems" :key="item">{{ item }}</li>
      </ul>
    </section>

    <RouterLink :to="{ name: 'home' }" class="btn btn-primary">{{ t.rules.cta }}</RouterLink>
  </article>
</template>

<style scoped>
.rules {
  max-width: 44rem;
  margin: 0 auto;
  display: grid;
  gap: var(--space-5);
}

.rules h2 {
  font-size: var(--text-xl);
}

.rules h3 {
  font-size: var(--text-lg);
  margin-bottom: var(--space-2);
}

.rules ul {
  margin: 0;
  padding-left: var(--space-5);
  display: grid;
  gap: var(--space-1);
}

.clues {
  display: grid;
  gap: var(--space-2);
  margin: var(--space-3) 0 0;
}

.clues > div {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.clues dd {
  margin: 0;
}

.examples {
  display: grid;
  gap: var(--space-2);
  margin: var(--space-3) 0 0;
  padding: 0;
  list-style: none;
}

.example {
  display: grid;
  gap: var(--space-2);
  padding: var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.example__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.example__score {
  display: inline-flex;
  gap: var(--space-2);
}

.example__why {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.rules > .btn {
  justify-self: start;
}
</style>
