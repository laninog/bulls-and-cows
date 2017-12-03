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
    margin-top: 0.1rem;
    margin-bottom: 0.1rem;
  }

  span {
    font-size: 2.0rem;
    color: #2c3e50;
    margin-right: 0.8rem;
    user-select: none;
  }

</style>
