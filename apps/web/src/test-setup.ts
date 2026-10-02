import { createPinia, setActivePinia } from 'pinia'
import { beforeEach } from 'vitest'

// jsdom arranca en en-US. La batería de tests asume el español salvo que un
// test pida otro idioma explícitamente.
Object.defineProperty(window.navigator, 'languages', {
  value: ['es-ES', 'es'],
  configurable: true,
})

// Los componentes leen el idioma del store de preferencias: siempre hay un pinia activo.
beforeEach(() => {
  setActivePinia(createPinia())
})
