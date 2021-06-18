<template>
  <lck-markdown
    :settings="textToDisplayed"
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import { MarkdownFieldSettings, MarkdownSettings } from '@locokit/lck-glossary'
import { LckTableRow } from '@/services/lck-api/definitions'

import Markdown from '@/components/visualize/Markdown/Markdown.vue'

export default Vue.extend({
  name: 'MarkdownField',
  components: {
    'lck-markdown': Markdown
  },
  props: {
    content: {
      type: Object as PropType<{ data: LckTableRow[] }>
    },
    settings: {
      type: Object as PropType<MarkdownFieldSettings>,
      required: true
    }
  },
  computed: {
    textToDisplayed (): MarkdownSettings {
      if (this.settings?.displayFieldId && this.content?.data.length > 0 && this.content.data[0]) {
        return {
          textColor: this.settings?.textColor,
          textAlign: this.settings?.textAlign,
          content: this.content.data[0].data[this.settings.displayFieldId] as string
        }
      }
      return {
        textColor: this.settings?.textColor,
        textAlign: this.settings?.textAlign,
        content: ''
      }
    }
  }
})
</script>

<style scoped>

</style>
