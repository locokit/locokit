<template>
  <div class="lck-color-content" v-if="block.settings && block.settings.content">
    {{block.settings.content}}
  </div>
</template>

<script>
export default {
  name: 'Markdown',
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
