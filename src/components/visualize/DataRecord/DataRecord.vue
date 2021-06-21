<template>
  <lck-data-detail
    v-if="definition && rowId"
    class="detail-view centered-content-view"
    :definition="definition"
    :row="content.data[0]"
    v-on="$listeners"
    v-bind="$attrs"
    :title="content.data[0].text"
  />
</template>

<script lang="ts">
import { PropType } from 'vue'

import DataDetail from '@/components/store/DataDetail/DataDetail.vue'
import CommunicatingBlock from '@/components/visualize/Block/CommunicatingBlock'

import { LckTableRowData } from '@/services/lck-api/definitions'
import { TableViewContent, TableViewDefinition, BlockDefaultSettings } from '@locokit/lck-glossary'

export default CommunicatingBlock.extend({
  name: 'DataRecord',
  components: {
    'lck-data-detail': DataDetail
  },
  props: {
    settings: {
      type: Object as PropType<BlockDefaultSettings>,
      default: () => ({ caughtEvents: [] })
    },
    definition: {
      type: Object as PropType<TableViewDefinition>,
      default: () => ({})
    },
    content: {
      type: Object as PropType<TableViewContent>,
      default: () => ({ data: [] })
    }
  },
  computed: {
    rowId (): string {
      return this.content?.data?.[0]?.id
    }
  },
  methods: {
    onColumnSelect (columnId: string, eventData: LckTableRowData) {
      this.$emit('update-cell', {
        rowId: this.rowId,
        columnId,
        newValue: eventData
      })
    }
  }
})
</script>
