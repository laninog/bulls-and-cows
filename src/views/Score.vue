<template>

  <section class="score">

    <md-toolbar>
      <h2 class="md-title">Bulls & Cows</h2>
    </md-toolbar>

    <section class="last-game">
      <div class="level-date">
        <div>Level {{lastGame.level}}</div>
        <div>{{lastGame.date}}</div>
      </div>
      <div class="moves-time">
        <div>
          {{lastGame.moves}} / {{lastGame.time}}<md-icon class="md-size-3x">alarm</md-icon>
        </div>
      </div>
    </section>

    <section class="last-games">

      <md-list>

        <md-list-item v-for="game in lastGames" :key="game.id">

          {{game.level}}<md-icon>thumb_up</md-icon>
          {{game.date}}<md-icon>date_range</md-icon>
          {{game.moves}} / {{game.time}}<md-icon>alarm</md-icon>

        </md-list-item>

      </md-list>

    </section>

    <md-button @click="goConfig" class="md-fab md-fab-bottom-right">
      <md-icon>arrow_back</md-icon>
    </md-button>

  </section>

</template>

<script>
  import {store} from '../store'

  export default {
    name: 'score',
    data () {
      return {
        lastGame: store.state.lastGame
      }
    },
    created () {
      store.getLastGame()
      store.getLastGames()
    },
    computed: {
      lastGames () {
        return store.state.lastGames.reverse()
      }
    },
    methods: {
      goConfig () {
        this.$router.push('/config')
      }
    }
  }
</script>

<style>

  .score .last-game {
    display: flex;
    margin: 3rem 1rem;
    padding: 1rem;
    box-shadow: 1px 1px 6px #888;
    border-radius: 5px;
  }

  .level-date {
    flex: 1;
  }

  .level-date div:nth-child(1) {
    font-size: 1.5rem;
    line-height: 3rem;
  }

  .level-date div:nth-child(2) {
    opacity: .5;
  }

  .moves-time {
    font-size: 2rem;
  }

  .score .last-games {
    margin: 1.8rem;
  }

</style>
