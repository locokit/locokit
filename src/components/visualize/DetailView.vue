<template>
  <div
    v-if="row && row.data"
    style="max-width: 600px;margin: auto;"
  >
    <p-button
      @click="$router.go(-1)"
      class="p-button-link"
    >
      {{ $t('components.detailview.goback') }}
    </p-button>
    <lck-data-detail
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
import Button from 'primevue/button'

import { retrieveRow, retrieveViewDefinition } from '@/store/visualize'
import { patchTableData } from '@/store/database'
import { lckHelpers } from '@/services/lck-api'

export default Vue.extend({
  name: 'DetailView',
  components: {
    'lck-data-detail': DataDetail,
    'p-button': Button
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
    searchItems: lckHelpers.searchItems,
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
