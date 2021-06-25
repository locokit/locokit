<template>
  <div :class="getBlockTypeClassname">
    <div v-if="block" :class="{ 'editable-block': editMode, 'block-container': true }">
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
      <span class="lck-color-content" v-if="isNotYetImplemented">
        {{ $t('pages.workspace.notYetImplementedBlock', { blockType: block.type }) }}
      </span>
      <component
        v-else-if="isBlockTypeValid"
        :is="block.type"
        v-on="$listeners"
        v-bind="{
          ...$attrs,
          ...block
        }"
        :workspaceId="workspaceId"
        :display-detail-button="displayDetailButton"
        :add-allowed="addAllowed"
        :export-allowed="exportAllowed"
        class="block-content"
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
import { BLOCK_TYPE, Block, BlockTableSet } from '@locokit/lck-glossary'
import Button from 'primevue/button'

import TableSet from '@/components/visualize/TableSet/TableSet.vue'
import Paragraph from '@/components/visualize/Paragraph/Paragraph.vue'
import Markdown from '@/components/visualize/Markdown/Markdown.vue'
import MapSet from '@/components/visualize/MapSet/MapSet.vue'
import HighlightField from '@/components/visualize/HighlightField/HighlightField.vue'
import Media from '@/components/visualize/Media/Media.vue'
import FormRecord from '@/components/visualize/FormRecord/FormRecord.vue'
import DataRecord from '@/components/visualize/DataRecord/DataRecord.vue'
import ActionButton from '@/components/visualize/ActionButton/ActionButton.vue'
import Error from '@/components/ui/Error/Error.vue'

export default Vue.extend({
  name: 'Block',
  components: {
    'p-button': Vue.extend(Button),
    TableSet,
    DataRecord,
    Paragraph,
    Markdown,
    Media,
    MapSet,
    MapField: MapSet,
    HighlightField,
    ActionButton,
    FormRecord,
    Error
  },
  props: {
    block: {
      type: Object as PropType<Block>
    },
    editMode: {
      type: Boolean,
      default: false
    },
    workspaceId: {
      type: String,
      required: true
    }
  },
  computed: {
    isBlockTypeValid () {
      const values = Object.values(BLOCK_TYPE) as string[]
      return values.includes(this.block.type)
    },
    isNotYetImplemented () {
      return [BLOCK_TYPE.KANBAN_SET, BLOCK_TYPE.CARD_SET, BLOCK_TYPE.MARKDOWN_FIELD].includes(this.block.type)
    },
    displayDetailButton () {
      if (this.block.type !== BLOCK_TYPE.TABLE_SET) return false
      return !!(this.block as BlockTableSet).settings?.pageDetailId
    },
    addAllowed () {
      if (this.block.type !== BLOCK_TYPE.TABLE_SET) return false
      return (this.block as BlockTableSet).settings?.addAllowed
    },
    exportAllowed () {
      if (this.block.type !== BLOCK_TYPE.TABLE_SET) return false
      return (this.block as BlockTableSet).settings?.exportAllowed
    },
    getBlockTypeClassname () {
      let className = (this.block?.elevation as boolean) ? 'lck-elevation ' : ''
      switch (this.block?.type) {
        case BLOCK_TYPE.TABLE_SET:
          className += 'lck-table-set'
          break
        case BLOCK_TYPE.KANBAN_SET:
          className += 'lck-kanban-set'
          break
        case BLOCK_TYPE.DATA_RECORD:
          className += 'lck-data-record'
          break
        case BLOCK_TYPE.PARAGRAPH:
          className += 'lck-paragraph'
          break
        case BLOCK_TYPE.MARKDOWN:
          className += 'lck-markdown'
          break
        case BLOCK_TYPE.MEDIA:
          className += 'lck-media'
          break
        case BLOCK_TYPE.ACTION_BUTTON:
          className += 'lck-action-button'
          break
        // case BLOCK_TYPE.MAP_SET:
        // case BLOCK_TYPE.MAP_FIELD:
          // className += 'lck-map-set'
        default:
          className += 'lck-block-default'
      }
      return className
    }
  }
})
</script>

<style scoped>

.block-container {
  width: 100%;
}

.lck-layout-flex .block-container {
  display: flex;
  flex-direction: column;
}

.lck-layout-flex .block-content {
  flex-grow: 2;
  max-width: initial;
  margin: initial;
}

.edit-block-line {
  display: flex;
  align-items: center;
}

.handle-block {
  cursor: move;
}

.edit-block-line .p-button {
  height: 100%;
  color: var(--primary-color-darken);
}

.edit-block-line .p-buttonset {
  margin-left: auto;
  flex-shrink: 0;
}

.editable-block {
  padding-left: 0.5rem;
  border-bottom: 1px solid var(--primary-color);
}

.editable-block .block-content {
  pointer-events: none;
  margin-bottom: 0.5rem;
}

</style>
