<template>

  <div class="list-moves">

    <md-list>

      <transition-group name="list-complete" tag="li">

        <md-list-item v-for="move in moves" :key="move.id" class="list-complete-item">

          <bc-move :move="move"></bc-move>

        </md-list-item>

        </transition-group>

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

  .list-moves {
    flex: 1;
    overflow: auto;
    padding: 0.1rem 0;
    margin: 0.8rem 0;
    border: 1px solid rgba(0, 0, 0, .2);
  }

  .list-complete-item {
    transition: all 1s;
    display: inline-block;
    margin-right: 10px;
  }
  .list-complete-enter, .list-complete-leave-to {
    opacity: 0;
    transform: translateX(100px);
  }
  .list-complete-leave-active {
    position: absolute;
  }

</style>
