<template>
  <div
    class="lck-markdown"
    v-if="settings && settings.content"
    v-html="markdownToDisplay"
  />
</template>

<script lang="ts">
import { MarkdownSettings } from '@locokit/lck-glossary'
import { PropType } from 'vue'
import marked from 'marked'

export default {
  name: 'Markdown',
  props: {
    settings: {
      type: Object as PropType<MarkdownSettings>,
      default: () => ({
        content: ''
      })
    }
  },
  computed: {
    markdownToDisplay () {
      return marked(this.settings.content || '')
    }
  }
}
</script>

<style scoped>
/deep/ table td,
/deep/ table th {
  border: 1px solid #e9ecef;
  padding: 0.5rem;
}

/deep/ table th {
  background-color: #ededed;
}

/deep/ table {
  margin: auto;
  border-collapse: collapse;
}

</style>
