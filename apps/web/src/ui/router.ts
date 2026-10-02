import { createRouter, createWebHistory } from 'vue-router'
import { useGameStore } from '../application/game-store'
import type { Messages } from './i18n'

export type TitleKey = keyof Messages['titles']

declare module 'vue-router' {
  interface RouteMeta {
    /** Clave del título de la vista (WCAG 2.4.2); App lo aplica en el idioma activo. */
    titleKey?: TitleKey
  }
}

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./views/HomeView.vue'),
      meta: { titleKey: 'home' },
    },
    {
      path: '/play',
      name: 'play',
      component: () => import('./views/PlayView.vue'),
      meta: { titleKey: 'play' },
      // DT-09: no se entra a jugar sin partida. Se intenta reanudar; si no, a inicio.
      beforeEnter: async () => ((await useGameStore().resume()) ? true : { name: 'home' }),
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('./views/HistoryView.vue'),
      meta: { titleKey: 'history' },
    },
    {
      path: '/rules',
      name: 'rules',
      component: () => import('./views/RulesView.vue'),
      meta: { titleKey: 'rules' },
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('./views/SettingsView.vue'),
      meta: { titleKey: 'settings' },
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})
