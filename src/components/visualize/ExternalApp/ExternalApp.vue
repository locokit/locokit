<template>
  <iframe
    :src="src"
  />
</template>

<script>
export default {
  name: 'ExternalApp',
  props: {
    src: {
      type: String,
      required: true,
    },
  },
}
</script>

<style scoped>
iframe {
  border: unset;
  width: 100%;
  height: 100%;
}
</style>
