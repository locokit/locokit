<template>
  <div v-if="row && row.data">
    <lck-dataDetail
      :crudMode="true"
      :definition="definition"
      :row="row"
      :autocompleteItems="autocompleteItems"
      @update-suggestions="updateLocalAutocompleteSuggestions"
      @update-row="onUpdateCell"
    />
  </div>
</template>

<script>
import Vue from 'vue'

import DataDetail from '@/components/store/DataDetail/DataDetail.vue'

import { retrieveRow, retrieveViewDefinition } from '@/store/visualize'
import { patchTableData } from '@/store/database'
import { searchItems } from '@/utils/columns'

export default Vue.extend({
  name: 'DetailView',
  components: {
    'lck-dataDetail': DataDetail
  },
  props: {
    settings: {
      type: Object,
      default: () => (
        {}
      )
    }
  },
  data () {
    return {
      definition: {},
      autocompleteItems: null,
      row: {},
      rowId: this.$route.query?.rowId
    }
  },
  methods: {
    searchItems,
    // eslint-disable-next-line @typescript-eslint/camelcase
    async updateLocalAutocompleteSuggestions ({ column_type_id, settings }, { query }) {
      this.autocompleteItems = await this.searchItems({
        // eslint-disable-next-line @typescript-eslint/camelcase
        columnTypeId: column_type_id,
        tableId: settings?.tableId,
        query
      })
    },
    async onUpdateCell ({ columnId, newValue }) {
      const data = {
        data: {
          [columnId]: newValue
        }
      }
      await patchTableData(this.rowId, data)
    }
  },
  async mounted () {
    this.definition = await retrieveViewDefinition(this.settings?.id)
    this.row = await retrieveRow(this.rowId)
  }
})
</script>
