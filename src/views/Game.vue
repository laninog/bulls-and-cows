<template>
  <div class="game">

    <md-input-container>

      <label>Enter your move</label>

      <md-input v-model="currentMove" maxlength="4" @keyup.enter.native="play()"></md-input>

      <md-button class="md-icon-button" :disabled="!isMoveComplete" @click="play()">
        <md-icon>play_arrow</md-icon>
      </md-button>

    </md-input-container>

    <bc-list-moves :moves="moves"></bc-list-moves>

  </div>
</template>

<script>
  import BcListMoves from '../components/BcListMoves.vue'

  import eventBus from '../events'
  import BullsAndCows from '../game'

  export default {
    components: {BcListMoves},
    name: 'game',
    data () {
      return {
        currentMove: '',
        moves: []
      }
    },
    created () {
      this.bcgame = new BullsAndCows(4)
    },
    methods: {
      play () {
        if (this.bcgame.isValidMove(this.currentMove)) {
          let currentResult = this.bcgame.play(this.currentMove)
          this.moves.unshift(currentResult)
          this.currentMove = ''
          if (currentResult.bulls === 4) {
            eventBus.$emit('messageApp', `You've won!`)
          }
        } else {
          eventBus.$emit('messageApp', `Move is not valid!`)
        }
      }
    },
    computed: {
      isMoveComplete () {
        return this.currentMove.length >= 4
      }
    }
  }
</script>

<style scoped>

  .game {
    padding: 0 1.5rem;
    height: calc(100vh - 64px);
    display: flex;
    flex-direction: column;
  }

</style>
