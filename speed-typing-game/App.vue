<template>
  <div id="app">
    <h1>Speed Typing Game</h1>
    <button @click="startGame">Start</button>
    <Timer v-if="gameStarted" :time="timeLeft" />
    <TextDisplay :text="text" :typedText="typedText" />
    <TypingInput v-if="gameStarted" @input="handleTyping" />
    <Stats v-if="gameEnded" :wpm="wpm" :accuracy="accuracy" />
  </div>
</template>

<script>
import TextDisplay from './components/TextDisplay.vue'
import TypingInput from './components/TypingInput.vue'
import Timer from './components/Timer.vue'
import Stats from './components/Stats.vue'

export default {
  components: {
    TextDisplay,
    TypingInput,
    Timer,
    Stats
  },
  data() {
    return {
      text: "The quick brown fox jumps over the lazy dog",
      typedText: '',
      gameStarted: false,
      gameEnded: false,
      timeLeft: 60,
      interval: null
    }
  },
  computed: {
    wpm() {
      const wordsTyped = this.typedText.split(' ').length
      return Math.round((wordsTyped / (60 - this.timeLeft)) * 60)
    },
    accuracy() {
      let correctChars = 0
      for (let i = 0; i < this.typedText.length; i++) {
        if (this.typedText[i] === this.text[i]) {
          correctChars++
        }
      }
      return Math.round((correctChars / this.typedText.length) * 100)
    }
  },
  methods: {
    startGame() {
      this.gameStarted = true
      this.gameEnded = false
      this.typedText = ''
      this.timeLeft = 60
      this.interval = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--
        } else {
          this.endGame()
        }
      }, 1000)
    },
    endGame() {
      clearInterval(this.interval)
      this.gameStarted = false
      this.gameEnded = true
    },
    handleTyping(input) {
      this.typedText = input
    }
  }
}
</script>

<style>
#app {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}
</style>
