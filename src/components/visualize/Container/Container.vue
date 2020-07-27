<template>
  <div v-if="container.blocks && container.blocks.length > 0">
    <Block
      v-for="block in container.blocks"
      :key="block.id"
      :block="block"
      class="p-mb-4"
    ></Block>
  </div>
</template>

<script>
import Block from '@/components/visualize/Block/Block'

export default {
  name: 'Container',
  components: { Block },
  props: {
    container: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style scoped>

</style>
