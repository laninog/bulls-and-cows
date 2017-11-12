import * as firebase from 'firebase'
import eventBus from '../events'

let config = {
  apiKey: 'AIzaSyD_QvyLTPjaSX687vvOs2TF-Kolx7UeBW4',
  authDomain: 'bulls-and-cows-a23ac.firebaseapp.com',
  databaseURL: 'https://bulls-and-cows-a23ac.firebaseio.com',
  projectId: 'bulls-and-cows-a23ac',
  storageBucket: 'bulls-and-cows-a23ac.appspot.com',
  messagingSenderId: '893718312790'
}

firebase.initializeApp(config)

export const store = {
  debug: true,
  state: {
    user: null,
    currentGame: '',
    db: firebase.database()
  },
  addAuthListener () {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.state.user = {
          uid: user.uid,
          userName: user.email.substring(0, user.email.indexOf('@')),
          name: user.displayName
        }
        eventBus.$emit('loggedApp')
      }
    })
  },
  tryLogin () {
    let provider = new firebase.auth.GoogleAuthProvider()
    provider.addScope('profile')
    provider.addScope('email')
    firebase.auth().signInWithPopup(provider).then((result) => {
      // User info will be loaded onAuthStateChanged
    }).catch((err) => {
      console.error('Login method:', err)
    })
  },
  createGame (level = 3) {
    if (!this.state.user) {
      return
    }
    this.state.currentGame = this.state.db.ref(this.state.user.email).child('games').push().key
    this.state.db.ref(this.state.user.uid).child('games').child(this.state.currentGame).set({
      level
    })
    console.log('createGame %s', level)
  },
  addMove (move = null) {
    if (!move) {
      return
    }
    this.state.db.ref(this.state.user.uid).child('games').child(this.state.currentGame).child('moves').child(move.id).set({
      value: move.value,
      bulls: move.bulls,
      cows: move.cows
    })
    console.log('addMove ', move)
  }
}
