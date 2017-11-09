import Vue from 'vue'
import Router from 'vue-router'

import Splash from '@/views/Splash'
import Config from '@/views/Config'
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
      path: '/config',
      name: 'Config',
      component: Config
    },
    {
      path: '/game/:level',
      name: 'Game',
      component: Game
    }
  ]
})
