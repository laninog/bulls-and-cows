<script setup lang="ts">
import { onMounted } from 'vue'
import { useHistoryStore } from '../../application/history-store'
import { useT } from '../i18n'

const history = useHistoryStore()
const t = useT()
onMounted(() => void history.load(10))
</script>

<template>
  <section class="history card" aria-labelledby="history-title">
    <h2 id="history-title" tabindex="-1">{{ t.history.title }}</h2>
    <p v-if="!history.loading && history.recent.length === 0" class="muted">
      {{ t.history.empty }}
    </p>
    <!-- Región desplazable enfocable: navegable con teclado en pantallas estrechas. -->
    <div
      v-else-if="history.recent.length > 0"
      class="table-scroll"
      role="region"
      :aria-label="t.history.tableLabel"
      tabindex="0"
    >
      <table data-testid="history">
        <thead>
          <tr>
            <th scope="col">{{ t.history.columns.date }}</th>
            <th scope="col" class="num">{{ t.history.columns.level }}</th>
            <th scope="col">{{ t.history.columns.status }}</th>
            <th scope="col" class="num">{{ t.history.columns.attempts }}</th>
            <th scope="col" class="num">{{ t.history.columns.time }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="g in history.recent" :key="g.id">
            <td>
              <time :datetime="new Date(g.startedAt).toISOString()">{{
                t.history.date(g.startedAt)
              }}</time>
            </td>
            <td class="num">{{ g.level }}</td>
            <td>
              <span class="status" :class="`status--${g.status}`">{{
                t.history.status[g.status]
              }}</span>
            </td>
            <td class="num">{{ t.history.attempts(g.attempts) }}</td>
            <td class="num">{{ t.history.duration(g.durationMs) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Móvil: una tarjeta por partida en lugar de una tabla con desplazamiento horizontal. -->
    <ul v-if="history.recent.length > 0" class="cards" data-testid="history-cards">
      <li v-for="g in history.recent" :key="g.id" class="hcard">
        <div class="hcard__top">
          <span class="status" :class="`status--${g.status}`">{{
            t.history.status[g.status]
          }}</span>
          <span class="hcard__level">{{ t.play.level(g.level) }}</span>
        </div>
        <time class="hcard__date" :datetime="new Date(g.startedAt).toISOString()">{{
          t.history.date(g.startedAt)
        }}</time>
        <dl class="hcard__stats">
          <div>
            <dt>{{ t.history.columns.attempts }}</dt>
            <dd>{{ g.attempts }}</dd>
          </div>
          <div>
            <dt>{{ t.history.columns.time }}</dt>
            <dd>{{ t.history.duration(g.durationMs) }}</dd>
          </div>
        </dl>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.history {
  display: grid;
  gap: var(--space-4);
}

.history h2 {
  font-size: var(--text-xl);
}

.table-scroll {
  overflow-x: auto;
  border-radius: var(--radius-md);
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--text-sm);
  white-space: nowrap;
}

th,
td {
  padding: var(--space-3);
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

th {
  color: var(--color-text-muted);
  font-weight: 600;
}

.num {
  text-align: right;
  font-variant-numeric: tabular-nums;
}

tbody tr:last-child td {
  border-bottom: 0;
}

.status {
  display: inline-block;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
  font-weight: 600;
  background: var(--color-surface-2);
  color: var(--color-text-muted);
}

.status--won {
  background: var(--color-bull-bg);
  color: var(--color-bull-fg);
}
.cards {
  display: none;
  gap: var(--space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}

.hcard {
  display: grid;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.hcard__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
}

.hcard__level {
  font-weight: 600;
}

.hcard__date {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.hcard__stats {
  display: flex;
  gap: var(--space-5);
  margin: 0;
}

.hcard__stats dt {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

.hcard__stats dd {
  margin: 0;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

/* display:none saca del árbol de accesibilidad la versión no visible: no hay duplicados para el lector. */
@media (max-width: 40rem) {
  .table-scroll {
    display: none;
  }

  .cards {
    display: grid;
  }
}
</style>
