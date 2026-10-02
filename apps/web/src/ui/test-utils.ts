import { createPinia, setActivePinia } from 'pinia'
import { defineComponent } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import { provideServices } from '../application/services'
import { createTestServices } from '../application/test-services'

const Stub = defineComponent({ template: '<div />' })

/** Entorno de test para vistas: pinia limpio, servicios en memoria y router en memoria. */
export function setupView() {
  setActivePinia(createPinia())
  sessionStorage.clear()
  const t = createTestServices()
  provideServices(t.services)
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: Stub },
      { path: '/play', name: 'play', component: Stub },
      { path: '/history', name: 'history', component: Stub },
    ],
  })
  return { ...t, router }
}
