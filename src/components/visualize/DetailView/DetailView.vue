<template>
  <div
    v-if="definition && content && content.data && rowId"
  >
    <lck-data-detail
      class="detail-view centered-content-view box-with-shadow"
      :definition="definition"
      :workspaceId="workspaceId"
      :row="content.data[0]"
      :cellState="cellState"
      :autocompleteSuggestions="autocompleteSuggestions"
      v-on="$listeners"
    />
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue'

import DataDetail from '@/components/store/DataDetail/DataDetail.vue'
import CommunicatingBlock from '@/components/visualize/Block/CommunicatingBlock'

import { lckHelpers } from '@/services/lck-api'
import { LckTableRowData } from '@/services/lck-api/definitions'
import { TableViewContent, TableViewDefinition, BlockDefaultSettings } from '@locokit/lck-glossary'

export default CommunicatingBlock.extend({
  name: 'DetailView',
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
      default: () => ({
        data: []
      })
    },
    autocompleteSuggestions: {
      type: Object as PropType<{ value: number | string; label: string }[]|null>
    },
    cellState: {
      type: Object,
      default: function () {
        return {
          rowId: null,
          columnId: null,
          waiting: false,
          isValid: null
        }
      }
    },
    /**
     * We need the workspace id for displaying images from attachments
     */
    workspaceId: {
      type: String,
      required: true
    }
  },
  computed: {
    rowId (): string {
      return this.$route.query?.rowId as string
    }
  },
  methods: {
    searchItems: lckHelpers.searchItems,
    onColumnSelect (columnId: string, eventData: LckTableRowData) {
      if (this.content.data?.[0]) {
        this.$emit('update-cell', {
          rowId: this.content.data[0].id,
          columnId,
          newValue: eventData
        })
      }
    }
  }
})
</script>
