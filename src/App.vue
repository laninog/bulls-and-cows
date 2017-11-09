<template>

  <div id="app">

    <!-- Views -->
    <router-view></router-view>

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
