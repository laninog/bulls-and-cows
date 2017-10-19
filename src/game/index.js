
class BullsAndCows {

  constructor (digits = 2) {
    this.digits = digits
    this.secret = ''
    this.attempts = 0
    this.initGame()
  }

  initGame () {
    for (let i = 0; i < this.digits; i++) {
      let digit = Math.floor(Math.random() * 10)
      if (!this.secret.includes(digit.toString())) {
        this.secret += digit
      } else {
        i--
      }
    }
    console.log(this.secret)
  }

  isValidMove (move = '') {
    if (move === '') {
      return false
    }

    for (let i = 1; i < move.length; i++) {
      if (move.substring(i).includes(move.charAt(i - 1))) {
        return false
      }
    }

    return true
  }

  play (move = '') {
    let bulls = 0
    let cows = 0

    if (move.length <= 0) {
      return {id: this.attempts,
        value: move,
        bulls,
        cows}
    }

    this.attempts++

    if (move === this.secret) {
      bulls = this.digits
      return {id: this.attempts,
        value: move,
        bulls,
        cows}
    }

    for (let i = 0; i < this.digits; i++) {
      for (let j = 0; j < this.digits; j++) {
        if (move.charAt(i) === this.secret.charAt(j)) {
          if (i === j) {
            bulls++
          } else {
            cows++
          }
        }
      }
    }

    return {
      id: this.attempts,
      value: move,
      bulls,
      cows
    }
  }

}

export {BullsAndCows as default}
