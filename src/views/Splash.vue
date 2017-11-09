<template>

  <section class="splash">

    <section class="logoBox">

      <section>
        <md-spinner :md-size="150" class="md-warn" md-indeterminate></md-spinner>
      </section>

      <span class="md-display-2">Bulls & Cows</span>

    </section>

  </section>

</template>

<script>
  export default {
    name: 'splash',
    created () {
      // Simulate login process
      setTimeout(() => this.$router.push('/config'), 4000)
    }
  }
</script>

<style>

  .splash {
    background-color: #3f51b5;
    color: rgba(255, 255, 255, .87);
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    height: 100vh;
  }

  .splash .logoBox {
    flex: none;
    justify-content: center;
    max-width: 80%;
  }

  .logoBox section {
    text-align: center;
  }

</style>
