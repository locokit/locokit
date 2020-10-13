<template>
  <div
    class="lck-color-content"
    v-if="isValid"
  >
    {{block.settings.content}}
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { BlockParagraph } from '@locokit/lck-glossary'

export default Vue.extend({
  name: 'Paragraph',
  props: {
    block: {
      type: Object as PropType<BlockParagraph>,
      required: true
    }
  },
  computed: {
    isValid () {
      return (this.block as BlockParagraph).settings?.content
    }
  }
})
</script>
