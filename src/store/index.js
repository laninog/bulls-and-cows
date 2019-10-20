// import * as firebase from 'firebase'

/* let config = {
  authDomain: 'bulls-and-cows-a23ac.firebaseapp.com',
  databaseURL: 'https://bulls-and-cows-a23ac.firebaseio.com',
} */

// firebase.initializeApp(config)

export const store = {
  debug: true,
  state: {
    user: null,
    currentKey: '',
    lastGame: {},
    lastGames: []
    /* auth: firebase.auth,
    db: firebase.database() */
  },
  createGame (level = 3) {
    /* if (!this.state.user) {
      return
    }
    this.state.currentKey = this.state.db.ref(this.state.user.uid).child('games').push().key
    this.state.db.ref(this.state.user.uid).child('games').child(this.state.currentKey).set({
      level,
      initDate: new Date().getTime()
    }) */
  },
  addMove (move = null) {
    /* if (!move) {
      return
    }
    this.state.db.ref(this.state.user.uid).child('games').child(this.state.currentKey).child('moves').child(move.id).set({
      value: move.value,
      bulls: move.bulls,
      cows: move.cows
    }) */
  },
  finishGame () {
    /* this.state.db.ref(this.state.user.uid).child('games').child(this.state.currentKey).update({
      endDate: new Date().getTime()
    }) */
  },
  getLastGames () {
    /* this.state.lastGames = []
    this.state.db.ref(this.state.user.uid).child('games').orderByChild('initDate')
      .limitToLast(5).on('child_added', snapshot => {
        this.state.lastGames.push(this._getSnapshotValue(snapshot))
      }) */
  },
  getLastGame () {
    /* this.state.db.ref(this.state.user.uid).child('games').orderByChild('initDate')
      .limitToLast(1).on('child_added', snapshot => {
        this.state.lastGame = this._getSnapshotValue(snapshot)
      }) */
  },
  _getSnapshotValue (snapshot) {
    /* let v = snapshot.val()
    let min = Math.floor(((v.endDate - v.initDate) / 1000) / 60)
    let sec = Math.floor(((v.endDate - v.initDate) / 1000) % 60)
    return {
      level: v.level,
      moves: v.moves.length,
      date: new Date(v.initDate).toLocaleDateString(),
      time: `${min}:${sec}`
    } */
  }
}
