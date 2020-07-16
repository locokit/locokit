<template>
  <div>
    <component
      :is="block.type"
      :block="block"
    />
  </div>
</template>

<script>
import TableView from '../TableView/TableView.vue'
import Markdown from '@/components/visualize/Markdown/Markdown'
import Paragraph from '@/components/visualize/Paragrah/Paragraph'

export default {
  name: 'Block',
  components: { TableView, Paragraph, Markdown },
  props: {
    block: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style scoped>

</style>
