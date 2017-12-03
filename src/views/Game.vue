<template>

  <section class="game">

    <md-toolbar>
      <h2 class="md-title">Bulls & Cows</h2>
    </md-toolbar>

    <section class="game-layout">

      <bc-list-moves :moves="moves"></bc-list-moves>

      <label>Select your move</label>

      <bc-move-box :digits="digits" @play="play"></bc-move-box>

    </section>

  </section>

</template>

<script>
  import BcListMoves from '../components/BcListMoves.vue'
  import BcMoveBox from '../components/BcMoveBox.vue'

  import eventBus from '../events'
  import {store} from '../store'

  import BullsAndCows from '../game'

  export default {
    components: {BcListMoves, BcMoveBox},
    name: 'game',
    data () {
      return {
        digits: Number(this.$route.params.level),
        currentMove: '',
        moves: []
      }
    },
    created () {
      this.bcgame = new BullsAndCows(this.digits)
    },
    methods: {
      play (e) {
        this.currentMove = e.move
        if (this.bcgame.isValidMove(this.currentMove)) {
          let currentResult = this.bcgame.play(this.currentMove)
          this.moves.unshift(currentResult)
          store.addMove(currentResult)
          this.currentMove = ''
          if (currentResult.bulls === this.digits) {
            store.finishGame()
            this.$router.push('/config')
            eventBus.$emit('messageApp', `You've won!`)
          }
        } else {
          eventBus.$emit('messageApp', `Move is not valid!`)
        }
      }
    },
    computed: {
      isMoveComplete () {
        return this.currentMove.length >= this.digits
      }
    }
  }
</script>

<style scoped>

  .game .game-layout {
    padding: 0 1.5rem;
    height: calc(100vh - 64px);
    display: flex;
    flex-direction: column;
  }

</style>
