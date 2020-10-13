<template>
  <div>
    <div v-if="block">
      <h3 v-if="block.title" class="lck-color-title">{{ block.title }}</h3>
      <component
        v-if="isBlockTypeValid"
        :is="block.type"
        :block="block"
        v-on="$listeners"
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
import { BLOCK_TYPE, Block } from '@locokit/lck-glossary'

import TableView from '@/components/store/CrudTable/CrudTable.vue'
import Paragraph from '@/components/visualize/Paragraph/Paragraph.vue'
import Markdown from '@/components/visualize/Markdown/Markdown.vue'
import Media from '@/components/visualize/Media/Media.vue'
import Error from '@/components/ui/Error/Error.vue'

export default Vue.extend({
  name: 'Block',
  components: {
    TableView,
    Paragraph,
    Markdown,
    Media,
    Error
  },
  computed: {
    isBlockTypeValid () {
      const values = Object.values(BLOCK_TYPE) as string[]
      return values.includes(this.block.type)
    }
  },
  props: {
    block: {
      type: Object as PropType<Block>
    }
  }
})
</script>
