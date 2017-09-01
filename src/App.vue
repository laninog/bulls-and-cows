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

    <md-sidenav class="md-left" ref="leftSidenav" @open="open('Left')" @close="close('Left')">

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

  </div>

</template>

<script>
  export default {
    name: 'app',
    methods: {
      toggleLeftSidenav () {
        this.$refs.leftSidenav.toggle()
      },
      open (ref) {
        console.log('Opened: ' + ref)
      },
      close (ref) {
        console.log('Closed: ' + ref)
      }
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
</style>
