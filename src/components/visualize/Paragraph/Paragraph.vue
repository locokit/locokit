<template>
  <div class="lck-paragraph" v-if="settings && settings.content" >
    {{settings.content}}
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { ParagraphSettings } from '@locokit/lck-glossary'

export default Vue.extend({
  name: 'Paragraph',
  props: {
    settings: {
      type: Object as PropType<ParagraphSettings>,
      default: () => ({})
    }
  }
})
</script>

<style scoped>
.lck-paragraph {
  margin: 0.25rem;
}
</style>
