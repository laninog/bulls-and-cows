<template>

  <div class="move">

    <span>{{moveSpaces}}</span>
    <span><md-icon>done_all</md-icon>{{move.bulls}}</span>
    <span><md-icon>done</md-icon>{{move.cows}}</span>

  </div>

</template>

<script>
  export default {
    name: 'bc-move',
    props: {
      move: {
        type: Object
      }
    },
    computed: {
      moveSpaces () {
        return this.move.value.split('').join(' ')
      }
    }
  }

</script>

<style scoped>

  .move{
    margin-bottom: 1.8rem;
  }

  span {
    font-size: 2.5rem;
    color: #2c3e50;
    margin-right: 1rem;
  }

</style>
