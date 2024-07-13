<template>
  <div class="text-display">
    <span
      v-for="(char, index) in text"
      :key="index"
      :class="{
        correct: index < typedText.length && char === typedText[index],
        incorrect: index < typedText.length && char !== typedText[index],
      }"
    >
      {{ char }}
    </span>
  </div>
</template>

<script>
export default {
  props: ['text', 'typedText']
}
</script>

<style scoped>
.correct {
  color: green;
}
.incorrect {
  color: red;
}
</style>
