<template>
  <div>
    <h2>Container -> {{container.text}}</h2>
    <div v-if="container.blocks.length > 0">
      <div v-for="block in container.blocks" :key="block.id">
        <Block :block="block"></Block>
      </div>
    </div>
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
