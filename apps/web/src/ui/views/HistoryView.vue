<script setup lang="ts">
import { onMounted } from 'vue'
import { useHistoryStore } from '../../application/history-store'
import { t } from '../strings'

const history = useHistoryStore()
onMounted(() => void history.load(10))
</script>

<template>
  <section>
    <h2>{{ t.history.title }}</h2>
    <p v-if="!history.loading && history.recent.length === 0">{{ t.history.empty }}</p>
    <table v-else-if="history.recent.length > 0" data-testid="history">
      <thead>
        <tr>
          <th scope="col">Fecha</th>
          <th scope="col">Nivel</th>
          <th scope="col">Estado</th>
          <th scope="col">Intentos</th>
          <th scope="col">Tiempo</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="g in history.recent" :key="g.id">
          <td>
            <time :datetime="new Date(g.startedAt).toISOString()">{{
              new Date(g.startedAt).toLocaleString()
            }}</time>
          </td>
          <td>{{ g.level }}</td>
          <td>{{ t.history.status[g.status] }}</td>
          <td>{{ t.history.attempts(g.attempts) }}</td>
          <td>{{ t.history.duration(g.durationMs) }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
