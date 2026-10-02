import { createRouter, createWebHistory } from 'vue-router'
import { useGameStore } from '../application/game-store'
import { t } from './strings'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./views/HomeView.vue'),
      meta: { title: t.titles['home'] },
    },
    {
      path: '/play',
      name: 'play',
      component: () => import('./views/PlayView.vue'),
      meta: { title: t.titles['play'] },
      // DT-09: no se entra a jugar sin partida. Se intenta reanudar; si no, a inicio.
      beforeEnter: async () => ((await useGameStore().resume()) ? true : { name: 'home' }),
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('./views/HistoryView.vue'),
      meta: { title: t.titles['history'] },
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

// WCAG 2.4.2: cada vista tiene un título propio.
router.afterEach((to) => {
  const title = typeof to.meta['title'] === 'string' ? to.meta['title'] : null
  document.title = title ? `${title} · ${t.appName}` : t.appName
})
