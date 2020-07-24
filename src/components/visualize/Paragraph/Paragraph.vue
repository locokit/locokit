<template>
  <div class="text-gray-600" v-if="block.settings && block.settings.content">
    {{block.settings.content}}
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { BlockParagraph } from '@/types/block'

export default Vue.extend({
  name: 'Paragraph',
  props: {
    block: {
      type: Object as PropType<BlockParagraph>,
      default: () => ({})
    }
  }
})
</script>

<style scoped>

</style>
