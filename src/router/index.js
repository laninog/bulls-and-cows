import Vue from 'vue'
import Router from 'vue-router'

import Auth from '@/views/Auth'
// import Splash from '@/views/Splash'
import Config from '@/views/Config'
import Game from '@/views/Game'
import Score from '@/views/Score'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '*',
      redirect: '/auth'
    },
    {
      path: '/',
      redirect: '/auth'
    },
    {
      path: '/auth',
      name: 'Auth',
      component: Auth
    },
    {
      path: '/config',
      name: 'Config',
      component: Config
    },
    {
      path: '/game/:level',
      name: 'Game',
      component: Game
    },
    {
      path: '/score',
      name: 'Score',
      component: Score
    }
  ]
})

router.beforeEach((to, from, next) => {
  next()
})

export default router
