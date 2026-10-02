<script setup lang="ts">
import PegIcon from './PegIcon.vue'

/** Insignia de bulls o cows: icono (lleno/hueco) + número o etiqueta. */
defineProps<{ kind: 'bull' | 'cow'; title?: string }>()
</script>

<template>
  <span class="badge" :class="`badge--${kind}`" :title="title">
    <PegIcon :kind="kind" />
    <slot />
  </span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.badge--bull {
  background: var(--color-bull-bg);
  color: var(--color-bull-fg);
}

.badge--cow {
  background: var(--color-cow-bg);
  color: var(--color-cow-fg);
}
</style>
