<template>
  <div
    class="lck-color-content"
    v-if="settings && settings.content"
  >
    {{settings.content}}
  </div>
</template>

<script lang="ts">
import { MarkdownSettings } from '@locokit/lck-glossary'
import { PropType } from 'vue'

export default {
  name: 'Markdown',
  props: {
    settings: {
      type: Object as PropType<MarkdownSettings>,
      default: () => ({})
    }
  }
}
</script>
