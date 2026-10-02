<script setup lang="ts">
/** Marcador clásico de Mastermind: lleno para bull, hueco para cow. Decorativo. */
defineProps<{ kind: 'bull' | 'cow' }>()
</script>

<template>
  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
    <circle v-if="kind === 'bull'" cx="8" cy="8" r="6.5" fill="currentColor" />
    <circle v-else cx="8" cy="8" r="5.25" fill="none" stroke="currentColor" stroke-width="2.5" />
  </svg>
</template>
