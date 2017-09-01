<template>
  <div class="game">

    <md-input-container>

      <label>Enter your move</label>

      <md-input v-model="currentMove" maxlength="4"></md-input>

      <md-button class="md-icon-button" @click="play()">
        <md-icon>play_arrow</md-icon>
      </md-button>

    </md-input-container>

  </div>
</template>

<script>
  export default {
    name: 'game',
    data () {
      return {
        currentMove: '',
        moves: []
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
