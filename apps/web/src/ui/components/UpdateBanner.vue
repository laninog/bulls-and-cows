<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { useT } from '../i18n'

/**
 * Aviso de nueva versión (registerType: 'prompt'). El service worker nuevo
 * espera hasta que el jugador acepta; así nunca se recarga a mitad de un intento.
 */
const t = useT()
const { needRefresh, updateServiceWorker } = useRegisterSW()

function later() {
  needRefresh.value = false
}
</script>

<template>
  <div v-if="needRefresh" class="update" role="status" data-testid="update-banner">
    <p>{{ t.pwa.updateAvailable }}</p>
    <div class="update__actions">
      <button type="button" class="btn btn-primary" @click="updateServiceWorker(true)">
        {{ t.pwa.update }}
      </button>
      <button type="button" class="btn btn-ghost" @click="later">{{ t.pwa.later }}</button>
    </div>
  </div>
</template>

<style scoped>
.update {
  position: fixed;
  inset: auto var(--space-4) var(--space-4);
  z-index: 20;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  max-width: 32rem;
  margin: 0 auto;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow: var(--shadow-1);
}

.update__actions {
  display: flex;
  gap: var(--space-2);
}
</style>
