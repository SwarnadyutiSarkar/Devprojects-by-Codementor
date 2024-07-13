<template>
  <input type="text" v-model="input" @input="handleInput" ref="input" />
</template>

<script>
export default {
  data() {
    return {
      input: ''
    }
  },
  methods: {
    handleInput() {
      this.$emit('input', this.input)
    }
  },
  mounted() {
    this.$refs.input.focus()
  }
}
</script>

<style scoped>
input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
}
</style>
