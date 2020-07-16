<template>
  <div>
    <component
      :is="block.type"
      :block="block"
    />
  </div>
</template>

<script>
import TableView from '@/components/visualize/TableView/TableView.vue'
import Paragraph from '@/components/visualize/Paragrah/Paragraph'
import Markdown from '@/components/visualize/Markdown/Markdown'

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
