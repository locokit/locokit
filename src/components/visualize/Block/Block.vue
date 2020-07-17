<template>
  <div>
    <component
        :is="getComponent(block.type)"
        :block="block"
    />
  </div>
</template>

<script>
import TableView from '@/components/visualize/TableView/TableView.vue'
import Paragraph from '@/components/visualize/Paragrah/Paragraph'
import Markdown from '@/components/visualize/Markdown/Markdown'
import Error from '@/components/error/Error'

const VALIDBLOCKTYPES = ['TableView', 'Paragraph', 'Markdown']
export default {
  name: 'Block',
  components: {
    TableView,
    Paragraph,
    Markdown,
    Error
  },
  methods: {
    getComponent (blockType) {
      if (VALIDBLOCKTYPES.includes(blockType)) {
        return blockType
      }
      return 'Error'
    }
  },
  props: {
    block: {
      type: Object,
      default: () => (
        {}
      )
    }
  }
}
</script>

<style scoped>

</style>
