<template>

  <div id="app">

    <!-- Views -->
    <router-view></router-view>

    <md-snackbar md-position="bottom center" md-duration="2000" ref="snackbar">
      <span>{{message}}</span>
    </md-snackbar>

    <md-dialog ref="dialog">
      <md-dialog-title>You win!</md-dialog-title>

      <md-dialog-content>Would you like to play again?</md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-default" @click="closeDialog('dialog')">No</md-button>
        <md-button class="md-primary" @click="playAgain('dialog')">Yes!</md-button>
      </md-dialog-actions>
    </md-dialog>

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
      eventBus.$on('dialogApp', (msg) => {
        this.$refs.dialog.open()
      })
    },
    methods: {
      playAgain (ref) {
        this.$refs[ref].close()
        this.$router.push('/config')
      },
      closeDialog (ref) {
        this.$refs[ref].close()
        this.$router.push('/score')
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
