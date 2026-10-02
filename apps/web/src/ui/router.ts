import { createRouter, createWebHistory } from 'vue-router'
import { useGameStore } from '../application/game-store'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('./views/HomeView.vue') },
    {
      path: '/play',
      name: 'play',
      component: () => import('./views/PlayView.vue'),
      // DT-09: no se entra a jugar sin partida. Se intenta reanudar; si no, a inicio.
      beforeEnter: async () => ((await useGameStore().resume()) ? true : { name: 'home' }),
    },
    { path: '/history', name: 'history', component: () => import('./views/HistoryView.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})
