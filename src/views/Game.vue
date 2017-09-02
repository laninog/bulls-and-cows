<template>
  <div class="game">

    <md-input-container>

      <label>Enter your move</label>

      <md-input v-model="currentMove" maxlength="4"></md-input>

      <md-button class="md-icon-button" @click="play()">
        <md-icon>play_arrow</md-icon>
      </md-button>

    </md-input-container>

    <bc-list-moves :moves="moves"></bc-list-moves>

  </div>
</template>

<script>
  import BcListMoves from '../components/BcListMoves.vue'

  export default {
    components: {BcListMoves},
    name: 'game',
    data () {
      return {
        currentMove: '',
        moves: [
          {
            value: '1234',
            bulls: 2,
            cows: 1
          },
          {
            value: '5678',
            bulls: 2,
            cows: 1
          }
        ]
      }
    },
    created () {
    },
    methods: {
      play () {
      }
    }
  }
</script>

<style scoped>
  .game {
    margin: 1rem;
  }
</style>
