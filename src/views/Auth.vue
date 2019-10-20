<template>

  <section class="auth">

    <section class="logoBox">

      <section>
        <!-- md-spinner :md-size="150" class="md-warn" md-indeterminate></md-spinner-->
        <img src="/static/img/icons/bullsandcows-icon-256x256.png" alt="logo">
      </section>

      <span class="md-display-2">Bulls & Cows</span>

      <md-button class="md-raised md-secondary btn-margin" @click="login">Sign in with Google</md-button>

    </section>

  </section>

</template>

<script>
  import firebase from 'firebase'

  export default {
    name: 'auth',
    data () {
      return {
        ui: null
      }
    },
    methods: {
      login () {
        let provider = new firebase.auth.GoogleAuthProvider()
        provider.addScope('profile')
        provider.addScope('email')
        firebase.auth().signInWithPopup(provider).then((result) => {
          // User info will be loaded onAuthStateChanged
        }).catch((err) => {
          console.error('Login method:', err)
        })
      }
    }
  }
</script>

<style>
  .auth {
    background-color: #3f51b5;
    color: rgba(255, 255, 255, .87);
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    height: 100vh;
  }

  .auth .logoBox {
    flex: none;
    justify-content: center;
    max-width: 80%;
    text-align: center;
  }

  .btn-margin {
    margin: 2rem;
  }
</style>
