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

  .listMoves {
    flex: 1;
    overflow: auto;
    padding: 0.8rem 0;
    margin: 0.8rem 0;
    border: 1px solid rgba(0, 0, 0, .2);
  }

</style>
