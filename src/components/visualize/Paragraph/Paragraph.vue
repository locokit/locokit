<template>
  <div
    class="lck-color-content"
    v-if="settings && settings.content"
  >
    {{settings.content}}
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { BlockParagraph } from '@locokit/lck-glossary'

export default Vue.extend({
  name: 'Paragraph',
  props: {
    settings: {
      type: Object as PropType<BlockParagraph>,
      default: () => ({})
    }
  }
})
</script>
