<template>

  <div id="app">

    <md-toolbar>
      <md-button class="md-icon-button" @click="toggleLeftSidenav()">
        <md-icon>menu</md-icon>
      </md-button>

      <h2 class="md-title">Bulls and Cows</h2>
    </md-toolbar>

    <!-- Views -->
    <router-view></router-view>

    <md-sidenav class="md-left" ref="leftSidenav" @open="openSidenav()" @close="closeSidenav()">

      <md-toolbar class="md-medium">

        <div class="md-toolbar-container">

          <h3 class="md-title">Menu</h3>

        </div>

      </md-toolbar>

      <md-list>

        <md-list-item @click="toggleLeftSidenav()" class="md-primary">
          <md-icon>home</md-icon> <span>Game</span>
        </md-list-item>

      </md-list>

    </md-sidenav>

    <md-snackbar md-position="bottom center" md-duration="2000" ref="snackbar">
      <span>{{message}}</span>
    </md-snackbar>

  </div>

</template>

<script>
  import eventBus from './events'

  export default {
    name: 'app',
    data () {
      return {
        message: ''
      }
    },
    created () {
      eventBus.$on('messageApp', (msg) => {
        this.message = msg
        this.$refs.snackbar.open()
      })
    },
    methods: {
      toggleLeftSidenav () {
        this.$refs.leftSidenav.toggle()
      },
      openSidenav () {
      },
      closeSidenv () {
      }
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    height: 100vh;
    overflow: hidden;
  }
</style>
