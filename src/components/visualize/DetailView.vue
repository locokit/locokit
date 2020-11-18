<template>
  <div
    v-if="row && row.data"
  >
    <p-button
      @click="$router.go(-1)"
      class="p-button-link"
      icon="pi pi-arrow-circle-left"
      iconPos="left"
      style="padding-left: 0"
      :label="$t('components.detailview.goback')"
    />

    <lck-data-detail
      class="detail-view"
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
    'p-button': Vue.extend(Button)
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

<style scoped>
.detail-view {
  max-width: 600px;
  margin: auto;
  border: 1px solid gray;
  padding: 0 1rem;
  border-radius: 2px;
}
</style>
