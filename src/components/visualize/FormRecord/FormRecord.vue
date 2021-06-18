<template>
  <lck-form
    :submitting="submitting.inProgress"
    :displayCancelButton="false"
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
      @upload-files="$listeners['upload-files']"
    />
  </lck-form>
</template>

<script lang="ts">
import Vue from 'vue'

import DataDetail from '@/components/store/DataDetail/DataDetail.vue'
import Form from '@/components/ui/Form/Form.vue'

import { LckTableRow, LckTableRowData, LckTableView, Submitting } from '@/services/lck-api/definitions'
import { BlockDefaultSettings } from '@locokit/lck-glossary'
// import CommunicatingBlock from '../Block/CommunicatingBlock'

export default Vue.extend({
  name: 'FormRecord',
  components: {
    'lck-data-detail': DataDetail,
    'lck-form': Form
  },
  props: {
    settings: {
      type: Object as Vue.PropType<BlockDefaultSettings>,
      default: () => ({ caughtEvents: [] })
    },
    definition: {
      type: Object as Vue.PropType<LckTableView>
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
      } as LckTableRow
    }
  },
  methods: {
    async onUpdateRow ({ columnId, newValue }: { columnId: string; newValue: LckTableRowData }) {
      this.$set(this.newRow.data, columnId, newValue)
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
    },
    onColumnSelect (columnId: string, eventData: LckTableRowData) {
      const { data } = this.newRow
      data[columnId] = eventData
      this.newRow.data = {
        ...data
      }
    }
  },
  watch: {
    submitting (submittingValue: Submitting) {
      if (!submittingValue.inProgress && !submittingValue.errors) {
        this.resetNewRow()
      }
    }
  }
})
</script>
