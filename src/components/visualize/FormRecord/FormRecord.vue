<template>
  <lck-form
    :canSubmit="completeForm"
    :displayCancelButton="false"
    :fullWidthButton="true"
    :reset="resetForm"
    :submitting="submitting.inProgress"
    @reset-form="reset=false"
    @submit="onSubmitNewRow"
  >
    <lck-data-detail
      v-if="definition"
      v-bind="$attrs"
      :definition="definition"
      mode="creation"
      :row="newRow"
      title=""
      @update-row="onUpdateRow"
      @download-attachment="$listeners['download-attachment']"
      @update-suggestions="$listeners['update-suggestions']"
      @upload-files="onUploadFiles"
    />
  </lck-form>
</template>

<script lang="ts">
import Vue from 'vue'

import DataDetail from '@/components/store/DataDetail/DataDetail.vue'
import Form from '@/components/ui/Form/Form.vue'

import { EmittedBlockEvent, LckTableRow, LckTableRowData, LckTableView, LckTableViewColumn, Submitting } from '@/services/lck-api/definitions'
import { objectFromArray } from '@/services/lck-utils/arrays'
import { getColumnDisplayValue } from '@/services/lck-utils/columns'
import { FormRecordSettings } from '@locokit/lck-glossary'
import CommunicatingBlock from '../Block/CommunicatingBlock'
import eventHub from '@/services/lck-event-hub/eventHub'

export default Vue.extend({
  name: 'FormRecord',
  mixins: [CommunicatingBlock],
  components: {
    'lck-data-detail': DataDetail,
    'lck-form': Form
  },
  props: {
    id: {
      type: String
    },
    settings: {
      type: Object as Vue.PropType<FormRecordSettings>
    },
    definition: {
      type: Object as Vue.PropType<LckTableView>,
      default: () => ({
        columns: []
      })
    },
    submitting: {
      type: Object as Vue.PropType<Submitting>,
      default: () => ({
        inProgress: false
      })
    }
  },
  data () {
    return {
      newRow: {
        id: '',
        text: '',
        data: {}
      } as LckTableRow,
      resetForm: false
    }
  },
  computed: {
    columnsObject () {
      // Get an object containing the columns as values and their ids as keys
      if (!this.definition || !this.definition.columns) return {}
      return objectFromArray<LckTableViewColumn>(this.definition.columns, 'id')
    },
    requiredColumnsIds (): Set<string> {
      // Get the required columns ids
      const requiredColumnsIds: Set<string> = new Set()
      if (this.definition?.columns) {
        this.definition.columns.forEach(column => {
          if (column.required) requiredColumnsIds.add(column.id)
        })
      }
      return requiredColumnsIds
    },
    completeForm () {
      // Return true if all required fields are defined and not null
      for (const field of this.requiredColumnsIds) {
        if (this.newRow.data[field] === null) {
          return false
        }
      }
      return true
    }
  },
  methods: {
    onUpdateRow ({ columnId, newValue }: { columnId: string; newValue: LckTableRowData }) {
      // Update the data
      this.$set(this.newRow.data, columnId, newValue)
      // Throw updated events to other blocks if it's specified
      const triggerEvent = this.settings.triggerEvents?.find(event =>
        event.type === 'update' &&
        event.field === columnId
      )
      if (triggerEvent) {
        eventHub.$emit(triggerEvent.name, {
          originalValue: newValue,
          displayedValue: getColumnDisplayValue(this.columnsObject[columnId], newValue, true)
        } as EmittedBlockEvent)
      }
    },
    onSubmitNewRow () {
      this.$emit('create-row', this.newRow)
    },
    resetNewRow () {
      this.newRow = {
        id: '',
        text: '',
        data: {}
      }
      this.resetForm = true
    },
    onUploadFiles (event: { rowId: string; columnId: string; fileList: File[]}) {
      this.$emit('upload-files', {
        ...event,
        newRow: this.newRow
      })
    },
    onSelectBlockEvent (columnId: string | undefined, { originalValue }: EmittedBlockEvent) {
      // Catch an event coming from another block to affect the value to a specific field
      if (columnId && originalValue !== undefined) {
        const { data } = this.newRow
        data[columnId] = originalValue
        this.newRow.data = {
          ...data
        }
      }
    }
  },
  watch: {
    submitting (submittingValue: Submitting) {
      if (!submittingValue.inProgress && !submittingValue.errors) {
        // When submitting without any error
        this.resetNewRow()
        // Throw an event saying that the form has been submitting
        const triggerEvent = this.settings.triggerEvents?.find(event => event.type === 'submit')
        if (triggerEvent) {
          eventHub.$emit(triggerEvent.name, {} as EmittedBlockEvent)
        }
      }
    }
  }
})
</script>
