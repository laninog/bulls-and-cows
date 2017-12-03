<template>

  <section class="move-box">

    <div class="selectors">

      <bc-move-selector v-for="(s, i) in selectors" :key="i"
                        :index="i"
                        :value="s"
                        @change="selectorChange">
      </bc-move-selector>

    </div>

    <md-button class="md-dense md-primary play" @click="play">P L A Y</md-button>

  </section>

</template>

<script>
  import BcMoveSelector from './BcMoveSelector.vue'

  export default {
    name: 'bc-move-box',
    components: {BcMoveSelector},
    props: {
      digits: {
        type: Number
      }
    },
    data () {
      return {
        selectors: []
      }
    },
    created () {
      for (let i = 0; i < this.$props.digits; i++) {
        this.selectors.push(i)
      }
    },
    methods: {
      selectorChange (e) {
        this.selectors[e.index] = e.value
      },
      play () {
        this.$emit('play', {move: this.selectors.join('')})
      }
    }
  }

</script>

<style scoped>

  .move-box {
    text-align: center;
  }

  .move-box .selectors {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    margin-top: 0.2rem;
    margin-bottom: 0.2rem;
  }

  .move-box .play {
    width: 18rem;
  }

</style>
