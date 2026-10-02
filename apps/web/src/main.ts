import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createLocalServices } from './application/local-services'
import { provideServices } from './application/services'
import App from './ui/App.vue'
import { router } from './ui/router'

provideServices(createLocalServices())

createApp(App).use(createPinia()).use(router).mount('#app')
