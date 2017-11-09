<template>

  <div id="app">

    <!-- Views -->
    <router-view></router-view>

  </div>

</template>

<script>
  export default {
    name: 'app',
    data () {
      return {}
    },
    created () {
    },
    methods: {
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
