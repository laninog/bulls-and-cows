<template>

  <section class="game">

    <md-toolbar>
      <h2 class="md-title">Bulls & Cows</h2>
    </md-toolbar>

    <section class="gameLayout">

      <md-input-container>
        <label for="currentMove">Enter your move</label>
        <md-input id="currentMove" v-model="currentMove" :maxlength="digits" @keyup.enter.native="play()"></md-input>

        <md-button class="md-icon-button" :disabled="!isMoveComplete" @click="play()">
          <md-icon>play_arrow</md-icon>
        </md-button>
      </md-input-container>

      <bc-list-moves :moves="moves"></bc-list-moves>

    </section>

  </section>

</template>

<script>
  import BcListMoves from '../components/BcListMoves.vue'

  import eventBus from '../events'
  import {store} from '../store'

  import BullsAndCows from '../game'

  export default {
    components: {BcListMoves},
    name: 'game',
    data () {
      return {
        digits: this.$route.params.level,
        currentMove: '',
        moves: []
      }
    },
    created () {
      this.bcgame = new BullsAndCows(this.digits)
    },
    methods: {
      play () {
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

  .game .gameLayout {
    padding: 0 1.5rem;
    height: calc(100vh - 64px);
    display: flex;
    flex-direction: column;
  }

</style>
