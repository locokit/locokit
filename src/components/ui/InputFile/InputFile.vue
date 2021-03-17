<template>
  <input
    type="file"
    ref="input-file"
    @input="$emit('input', $refs['input-file'].files)"
    :multiple="true"
  />
</template>

<script>
export default {
  name: 'LckInputURL'
}
</script>

<style scoped>
.input-url-valid {
  text-decoration: underline;
}
.pi-external-link {
  cursor: pointer;
}
</style>
