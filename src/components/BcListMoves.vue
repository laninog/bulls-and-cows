<template>

  <div class="listMoves">

    <md-list>

      <md-list-item v-for="move in moves" :key="move.id">

        <bc-move :move="move"></bc-move>

      </md-list-item>

    </md-list>

  </div>

</template>

<script>
  import BcMove from './BcMove.vue'

  export default {
    components: {BcMove},
    name: 'bc-list-moves',
    props: [
      'moves'
    ]
  }

</script>

<style scoped>

</style>
