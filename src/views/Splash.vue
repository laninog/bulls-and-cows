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
  import {store} from '../store'

  export default {
    name: 'splash',
    created () {
      store.state.auth().onAuthStateChanged((user) => {
        if (user) {
          store.state.user = {
            uid: user.uid,
            userName: user.email.substring(0, user.email.indexOf('@')),
            name: user.displayName
          }
          this.$router.push('/config')
        }
      })
    },
    mounted () {
      let provider = new store.state.auth.GoogleAuthProvider()
      provider.addScope('profile')
      provider.addScope('email')
      store.state.auth().signInWithPopup(provider).then((result) => {
        // User info will be loaded onAuthStateChanged
      }).catch((err) => {
        console.error('Login method:', err)
      })
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
