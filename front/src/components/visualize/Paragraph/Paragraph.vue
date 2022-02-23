<template>
  <div class="lck-paragraph" v-if="content" >
    {{content}}
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { ParagraphSettings } from '@locokit/lck-glossary/src'
import CommunicatingBlock from '../Block/CommunicatingBlock'
import { EmittedBlockEvent } from '@/services/lck-api/definitions'

export default Vue.extend({
  name: 'Paragraph',
  props: {
    settings: {
      type: Object as PropType<ParagraphSettings>,
    },
  },
  mixins: [CommunicatingBlock],
  data () {
    return {
      content: '',
    }
  },
  methods: {
    onSelectBlockEvent (_: string, eventData: EmittedBlockEvent) {
      if (eventData.displayedValue) this.content = eventData.displayedValue.toString()
    },
    onResetBlockEvent () {
      this.content = this.settings?.content
    },
  },
  watch: {
    'settings.content': {
      immediate: true,
      handler (newContent: string) {
        this.content = newContent
      },
    },
  },
})
</script>

<style scoped>
.lck-paragraph {
  margin: 0.25rem;
}
</style>
