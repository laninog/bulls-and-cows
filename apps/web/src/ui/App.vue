<script setup lang="ts">
import { nextTick, onMounted, watchEffect } from 'vue'
import { START_LOCATION, useRoute, useRouter } from 'vue-router'
import { usePreferencesStore } from '../application/preferences-store'
import { useSessionStore } from '../application/session-store'
import { focusView } from './focus'
import { useT } from './i18n'

const session = useSessionStore()
const prefs = usePreferencesStore()
const router = useRouter()
const route = useRoute()
const t = useT()

onMounted(() => void session.load())

// Idioma del documento (WCAG 3.1.1) y título de la vista (2.4.2), siempre en el idioma activo.
watchEffect(() => {
  document.documentElement.lang = prefs.locale
  const key = route.meta.titleKey
  document.title = key ? `${t.value.titles[key]} · ${t.value.appName}` : t.value.appName
})

// En la carga inicial el foco se deja donde lo pone el navegador; en cada
// navegación posterior, se mueve a la nueva vista.
router.afterEach(async (_to, from, failure) => {
  if (failure || from === START_LOCATION) return
  await nextTick()
  focusView()
})
</script>

<template>
  <a class="skip-link" href="#main">{{ t.skipLink }}</a>
  <header class="app-header">
    <div class="app-header__inner">
      <h1 class="brand">
        <RouterLink :to="{ name: 'home' }" class="brand__link">
          <img src="/icons/bullsandcows-icon-64x64.png" alt="" width="36" height="36" />
          <span class="brand__name">{{ t.appName }}</span>
        </RouterLink>
      </h1>
      <nav :aria-label="t.nav.label" class="app-nav">
        <RouterLink :to="{ name: 'rules' }" class="app-nav__link">{{ t.nav.rules }}</RouterLink>
        <RouterLink :to="{ name: 'history' }" class="app-nav__link">{{ t.nav.history }}</RouterLink>
        <RouterLink :to="{ name: 'settings' }" class="app-nav__link">{{
          t.nav.settings
        }}</RouterLink>
      </nav>
    </div>
  </header>
  <main id="main" class="app-main" tabindex="-1">
    <RouterView />
  </main>
</template>

<style scoped>
.skip-link {
  position: absolute;
  left: var(--space-4);
  top: -100px;
  z-index: 10;
  padding: var(--space-2) var(--space-4);
  background: var(--color-accent);
  color: var(--color-accent-contrast);
  border-radius: var(--radius-md);
  font-weight: 600;
}

.skip-link:focus {
  top: var(--space-2);
}

.app-header {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}

.app-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  max-width: var(--content-max);
  margin: 0 auto;
  padding: var(--space-2) var(--space-4);
}

.brand {
  font-size: var(--text-lg);
  font-weight: 700;
}

.brand__link {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-height: var(--target-min);
  color: var(--color-text);
  text-decoration: none;
}

.app-nav {
  display: flex;
  gap: var(--space-1);
}

.app-nav__link {
  display: inline-flex;
  align-items: center;
  min-height: var(--target-min);
  padding: 0 var(--space-3);
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  font-weight: 500;
  text-decoration: none;
}

.app-nav__link:hover {
  color: var(--color-text);
  background: var(--color-surface-2);
}

.app-nav__link[aria-current='page'] {
  color: var(--color-accent);
  background: var(--color-surface-2);
}

.app-main {
  max-width: var(--content-max);
  margin: 0 auto;
  padding: var(--space-5) var(--space-4) var(--space-8);
}

.app-main:focus {
  outline: none;
}

@media (max-width: 30rem) {
  .app-nav__link {
    padding: 0 var(--space-2);
  }

  /* Sin espacio para el nombre: se oculta visualmente, pero sigue nombrando el enlace. */
  .brand__name {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }
}
</style>
