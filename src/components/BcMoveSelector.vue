<template>

  <section class="move-selector">

    <div @click="add"><i class="material-icons">add</i></div>
    <div><span>{{num}}</span></div>
    <div @click="sub"><i class="material-icons">remove</i></div>

  </section>

</template>

<script>
  export default {
    name: 'bc-move-selector',
    props: {
      index: {
        type: Number
      },
      value: {
        type: Number
      }
    },
    data () {
      return {
        num: this.$props.value ? this.$props.value : 0
      }
    },
    methods: {
      add () {
        if (this.num < 9) {
          this.num++
        } else {
          this.num = 0
        }
        this.$emit('change', {index: this.index, value: this.num})
      },
      sub () {
        if (this.num > 0) {
          this.num--
        } else {
          this.num = 9
        }
        this.$emit('change', {index: this.index, value: this.num})
      }
    }
  }

</script>

<style scoped>

  .move-selector {
    display: flex;
    flex-direction: column;
    margin-left: 0.15rem;
    margin-right: 0.15rem;
    color: rgba(255, 255, 255, .87);
  }

  .move-selector div {
    text-align: center;
    vertical-align: baseline;
    background-color: #3f51b5;
    width: 3rem;
    user-select: none;
  }

  .move-selector div:nth-child(2) {
    background-color: #fff;
    color: rgba(0, 0, 0, .54);
    border: 1px #3f51b5 solid;
    width: 3rem;
    height: 2rem;
  }

  span {
    display: block;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1rem;
  }

  i {
    display: block;
    position: relative;
    font-size: 1.5rem;
  }

</style>
