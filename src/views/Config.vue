<template>

  <section class="config">

    <md-toolbar>
      <h2 class="md-title">Bulls & Cows</h2>
    </md-toolbar>

    <section class="level">

      <md-input-container>
        <label for="levelGame">Level Game</label>
        <md-select name="levelGame" id="levelGame" v-model="levelGame" md-menu-class="options">
          <md-subheader>Level Game</md-subheader>
          <md-option value="3">Easy (3)</md-option>
          <md-option value="4">Medium (4)</md-option>
          <md-option value="5">Advance (5)</md-option>
          <md-option value="6">Expert (6)</md-option>
        </md-select>
      </md-input-container>

      <md-button class="md-raised md-primary" @click="startNewGame">Start New Game</md-button>

    </section>

    <md-button @click="goScore" class="md-fab md-fab-bottom-right">
      <md-icon>book</md-icon>
    </md-button>

  </section>

</template>

<script>
  import {store} from '../store'

  export default {
    name: 'config',
    data () {
      return {
        levelGame: 0,
        savedGame: 0
      }
    },
    created () {
    },
    methods: {
      startNewGame () {
        store.createGame(this.levelGame)
        this.$router.push(`/game/${this.levelGame}`)
      },
      goScore () {
        this.$router.push('/score')
      }
    }
  }
</script>

<style>

  .config {

  }

  .config .level {
    margin: 3rem;
  }

  .options {
    width: 280px;
  }

</style>
