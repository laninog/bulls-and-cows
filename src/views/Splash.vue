<template>

  <section class="splash">

    Bulls & Cows

  </section>

</template>

<script>
  export default {
    name: 'splash',
    created () {
      setTimeout(() => this.$router.push('/config'), 4000)
    }
  }
</script>

<style>

  .splash {

  }

</style>
