import Vue from 'vue'
import Router from 'vue-router'

import Splash from '@/views/Splash'
import Game from '@/views/Game'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Splash',
      component: Splash
    },
    {
      path: '/game',
      name: 'Game',
      component: Game
    }
  ]
})
