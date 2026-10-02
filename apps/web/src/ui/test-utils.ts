import { createPinia, setActivePinia } from 'pinia'
import { defineComponent, h } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import { provideServices } from '../application/services'
import { createTestServices } from '../application/test-services'

const Stub = defineComponent({ render: () => h('h2', 'stub') })

/** Entorno de test para vistas: pinia limpio, servicios en memoria y router en memoria. */
export function setupView() {
  setActivePinia(createPinia())
  sessionStorage.clear()
  const t = createTestServices()
  provideServices(t.services)
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: Stub, meta: { titleKey: 'home' } },
      { path: '/play', name: 'play', component: Stub, meta: { titleKey: 'play' } },
      { path: '/history', name: 'history', component: Stub, meta: { titleKey: 'history' } },
      { path: '/rules', name: 'rules', component: Stub, meta: { titleKey: 'rules' } },
      { path: '/settings', name: 'settings', component: Stub, meta: { titleKey: 'settings' } },
    ],
  })
  return { ...t, router }
}
