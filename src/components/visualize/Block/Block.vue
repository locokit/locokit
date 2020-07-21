<template>
  <div>
    <header class="text-gray-600 font-medium mb-2">
      {{ block.title }}
    </header>
    <component
      v-if="isBlockTypeValid"
      v-loading="block.loading"
      :is="block.type"
      :block="block"
    />
    <span class="text-gray-600" v-else-if="block.type">
      {{ $t('pages.workspaces.errorTypeBlock', { blockType: block.type }) }}</span>
    <span class="text-gray-600" v-else>
      {{ $t('pages.workspaces.errorUnknownTypeBlock') }}
    </span>
  </div>
</template>

<script>
import TableView from '@/components/visualize/TableView/TableView.vue'
import Paragraph from '@/components/visualize/Paragraph/Paragraph'
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
  computed: {
    isBlockTypeValid () {
      return VALIDBLOCKTYPES.includes(this.block.type)
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
  /deep/ .el-loading-spinner > svg {
    display: inline-block;
    vertical-align: middle;
  }
</style>
