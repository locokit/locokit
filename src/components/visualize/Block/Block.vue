<template>
  <div>
    <div v-if="block" :class="{ 'editable-block': editMode }">
      <div v-if="editMode" class="edit-block-line">
        <h3 class="lck-color-title">{{ block.title }}</h3>
        <span class="p-buttonset">
          <p-button
            :title="$t('pages.workspace.block.drag')"
            class="p-button-lg p-button-text handle-block"
            icon="pi pi-ellipsis-v"
          />
          <p-button
            :title="$t('pages.workspace.block.edit')"
            class="p-button-lg p-button-text edit-block-button"
            icon="pi pi-pencil"
            @click="$emit('update-block')"
          />
          <p-button
            :title="$t('pages.workspace.block.delete')"
            class="p-button-lg p-button-text remove-block-button"
            icon="pi pi-trash"
            @click="$emit('delete-block')"
          />
        </span>
      </div>
      <h3 v-else-if="block.title" class="lck-color-title">{{ block.title }}</h3>
      <component
        v-if="isBlockTypeValid"
        :is="block.type"
        v-on="$listeners"
        v-bind="{
          ...$attrs,
          ...block
        }"
        :display-detail-button="displayDetailButton"
        :add-allowed="addAllowed"
        :export-allowed="exportAllowed"
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
import Button from 'primevue/button'

import TableView from '@/components/visualize/TableView/TableView.vue'
import Paragraph from '@/components/visualize/Paragraph/Paragraph.vue'
import Markdown from '@/components/visualize/Markdown/Markdown.vue'
import Media from '@/components/visualize/Media/Media.vue'
import Error from '@/components/ui/Error/Error.vue'
import DetailView from '@/components/visualize/DetailView.vue'

export default Vue.extend({
  name: 'Block',
  components: {
    'p-button': Vue.extend(Button),
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
      return !!(this.block as BlockTableView).settings?.pageDetailId
    },
    addAllowed () {
      if (this.block.type !== BLOCK_TYPE.TABLE_VIEW) return false
      return (this.block as BlockTableView).settings?.addAllowed
    },
    exportAllowed () {
      if (this.block.type !== BLOCK_TYPE.TABLE_VIEW) return false
      return (this.block as BlockTableView).settings?.exportAllowed
    }
  },
  props: {
    block: {
      type: Object as PropType<Block>
    },
    editMode: {
      type: Boolean,
      default: false
    }
  }
})
</script>

<style scoped>
.edit-block-line {
  display: flex;
  pointer-events: all;
}

.edit-block-line .p-button {
  height: 100%;
  color: var(--primary-color);
}

.edit-block-line .p-buttonset {
  margin-left: auto;
  flex-shrink: 0;
}

.handle-block {
  cursor: move;
}

.editable-block {
  border-bottom: 1px solid var(--primary-color);
  pointer-events: none;
  padding-left: 0.5rem;
  padding-bottom: 0.5rem;
}
</style>
