<script setup lang="ts">
import { onMounted } from 'vue'
import { useSessionStore } from '../application/session-store'
import { t } from './strings'

const session = useSessionStore()
onMounted(() => void session.load())
</script>

<template>
  <header>
    <h1>{{ t.appName }}</h1>
    <nav :aria-label="t.appName">
      <RouterLink :to="{ name: 'home' }">{{ t.nav.home }}</RouterLink>
      <RouterLink :to="{ name: 'history' }">{{ t.nav.history }}</RouterLink>
    </nav>
  </header>
  <main>
    <RouterView />
  </main>
</template>
