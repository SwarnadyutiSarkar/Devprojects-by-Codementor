<template>
  <div class="timer">
    {{ time }}
  </div>
</template>

<script>
export default {
  props: ['time']
}
</script>

<style scoped>
.timer {
  font-size: 24px;
  font-weight: bold;
}
</style>
