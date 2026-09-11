<script setup lang="ts">
import { LEVELS } from '@bnc/domain'
</script>

<template>
  <main>
    <h1>Bulls and Cows</h1>
    <p data-testid="levels">Niveles: {{ LEVELS.join(', ') }}</p>
  </main>
</template>
