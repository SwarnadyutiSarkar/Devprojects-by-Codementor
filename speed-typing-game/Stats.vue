<template>
  <div class="stats">
    <p>Words per minute: {{ wpm }}</p>
    <p>Accuracy: {{ accuracy }}%</p>
  </div>
</template>

<script>
export default {
  props: ['wpm', 'accuracy']
}
</script>

<style scoped>
.stats {
  font-size: 18px;
}
</style>
