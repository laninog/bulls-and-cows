import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createLocalServices } from './application/local-services'
import { provideServices } from './application/services'
import App from './ui/App.vue'
import { router } from './ui/router'
import './ui/styles/tokens.css'
import './ui/styles/base.css'

provideServices(createLocalServices())

createApp(App).use(createPinia()).use(router).mount('#app')
