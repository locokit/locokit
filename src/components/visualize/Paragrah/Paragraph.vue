<template>
  <div class="text-gray-600">
    {{block.text}}
  </div>
</template>

<script>
export default {
  name: 'Text',
  props: {
    block: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style scoped>

</style>
