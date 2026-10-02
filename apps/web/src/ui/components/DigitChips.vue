<script setup lang="ts">
/** Dígitos de un intento como fichas. Decorativo: el texto accesible lo aporta quien lo usa. */
defineProps<{ value: string }>()
</script>

<template>
  <span class="chips" aria-hidden="true">
    <span v-for="(d, k) in value.split('')" :key="k" class="chip">{{ d }}</span>
  </span>
</template>

<style scoped>
.chips {
  display: inline-flex;
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
</style>
