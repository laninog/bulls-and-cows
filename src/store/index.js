import * as firebase from 'firebase'

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
    auth: firebase.auth,
    db: firebase.database()
  },
  createGame (level = 3) {
    if (!this.state.user) {
      return
    }
    this.state.currentGame = this.state.db.ref(this.state.user.uid).child('games').push().key
    this.state.db.ref(this.state.user.uid).child('games').child(this.state.currentGame).set({
      level,
      initDate: new Date().getTime()
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
  },
  finishGame () {
    this.state.db.ref(this.state.user.uid).child('games').child(this.state.currentGame).update({
      endDate: new Date().getTime()
    })
  }
}
