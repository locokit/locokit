<template>
  <div>
    <div v-if="block">
      <h3 v-if="block.title" class="lck-color-title">{{ block.title }}</h3>
      <component
        v-if="isBlockTypeValid"
        :is="block.type"
        v-on="$listeners"
        v-bind="{
          ...$attrs,
          ...block
        }"
        :display-detail-button="displayDetailButton"
      />
      <span class="lck-color-content" v-else-if="block.type">
        {{ $t('pages.workspace.errorTypeBlock', { blockType: block.type }) }}
      </span>
    </div>
    <span class="lck-color-content" v-else>
      {{ $t('pages.workspace.errorUnknownTypeBlock') }}
    </span>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { BLOCK_TYPE, Block, BlockTableView } from '@locokit/lck-glossary'

import TableView from '@/components/store/DataTable/DataTable.vue'
import Paragraph from '@/components/visualize/Paragraph/Paragraph.vue'
import Markdown from '@/components/visualize/Markdown/Markdown.vue'
import Media from '@/components/visualize/Media/Media.vue'
import Error from '@/components/ui/Error/Error.vue'
import DetailView from '@/components/visualize/DetailView.vue'

export default Vue.extend({
  name: 'Block',
  components: {
    TableView,
    DetailView,
    Paragraph,
    Markdown,
    Media,
    Error
  },
  computed: {
    isBlockTypeValid () {
      const values = Object.values(BLOCK_TYPE) as string[]
      return values.includes(this.block.type)
    },
    displayDetailButton () {
      if (this.block.type !== BLOCK_TYPE.TABLE_VIEW) return false
      return (this.block as BlockTableView).settings?.pageDetailId
    }
  },
  props: {
    block: {
      type: Object as PropType<Block>
    }
  }
})
</script>
