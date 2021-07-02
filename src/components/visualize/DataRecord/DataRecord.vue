<template>
  <lck-data-detail
    v-if="definition && rowId"
    class="detail-view centered-content-view"
    :definition="definition"
    :row="content.data[0]"
    v-on="$listeners"
    v-bind="$attrs"
    :title="content.data[0].text"
    @update-row="onUpdateRow"
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import DataDetail from '@/components/store/DataDetail/DataDetail.vue'
import CommunicatingBlock from '@/components/visualize/Block/CommunicatingBlock'

import { EmittedBlockEvent, LckTableRow, LckTableRowData, LckTableView, LckTableViewColumn } from '@/services/lck-api/definitions'
import { DataRecordSettings } from '@locokit/lck-glossary'
import { objectFromArray } from '@/services/lck-utils/arrays'
import { getColumnDisplayValue } from '@/services/lck-utils/columns'
import eventHub from '@/services/lck-event-hub/eventHub'

export default Vue.extend({
  name: 'DataRecord',
  components: {
    'lck-data-detail': DataDetail,
  },
  mixins: [CommunicatingBlock],
  props: {
    settings: {
      type: Object as PropType<DataRecordSettings>,
    },
    definition: {
      type: Object as PropType<LckTableView>,
      default: () => ({
        columns: [],
      }),
    },
    content: {
      type: Object as PropType<Record<string, LckTableRow[]>>,
      default: () => ({ data: [] }),
    },
    pageLoaded: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    rowId (): string {
      return this.content?.data?.[0]?.id
    },
    columnsObject () {
      // Get an object containing the columns as values and their ids as keys
      if (!this.definition.columns) return {}
      return objectFromArray<LckTableViewColumn>(this.definition.columns, 'id')
    },
  },
  methods: {
    onSelectBlockEvent (columnId: string | undefined, eventData: EmittedBlockEvent) {
      // Catch an event coming from another block to affect the value to a specific field
      if (columnId && eventData.originalValue !== undefined) {
        this.$emit('update-row', {
          columnId,
          newValue: eventData.originalValue,
          rowId: this.rowId,
        })
      }
    },
    onUpdateRow (updatedData: { columnId: string; newValue: LckTableRowData; rowId: string }) {
      // Throw updated events to other blocks if it's specified
      const triggerEvent = this.settings.triggerEvents?.find(event =>
        event.type === 'update' &&
        event.field === updatedData.columnId
      )
      if (triggerEvent) {
        eventHub.$emit(triggerEvent.name, {
          originalValue: updatedData.newValue,
          displayedValue: getColumnDisplayValue(this.columnsObject[updatedData.columnId], updatedData.newValue, true),
        } as EmittedBlockEvent)
      }
    },
  },
  watch: {
    pageLoaded (newValue) {
      if (newValue && this.settings.triggerEvents && this.rowId) {
        // Throw updated events to other blocks when the component is mounting if it's specified
        this.settings.triggerEvents.forEach(event => {
          if (event.raiseOnLoad && event.field && event.type === 'update') {
            const currentData = this.content.data[0]?.data[event.field]
            eventHub.$emit(event.name, {
              originalValue: currentData,
              displayedValue: getColumnDisplayValue(this.columnsObject[event.field], currentData, true),
            } as EmittedBlockEvent)
          }
        })
      }
    },
  },
})
</script>
