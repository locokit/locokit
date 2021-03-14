<template>
  <div
    v-if="definition && content && content.data"
  >
    <lck-data-detail
      class="detail-view centered-content-view box-with-shadow"
      :definition="definition"
      :row="content.data[0]"
      :autocompleteSuggestions="autocompleteSuggestions"
      @update-suggestions="updateLocalAutocompleteSuggestions"
      @update-row="onUpdateCell"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import DataDetail from '@/components/store/DataDetail/DataDetail.vue'

import { patchTableData } from '@/store/database'
import { lckHelpers } from '@/services/lck-api'

export default Vue.extend({
  name: 'DetailView',
  components: {
    'lck-data-detail': DataDetail
  },
  props: {
    settings: {
      type: Object,
      default: () => (
        {}
      )
    },
    definition: {
      type: Object,
      default: () => ({})
    },
    content: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      autocompleteSuggestions: null
    }
  },
  computed: {
    rowId (): string {
      return this.$route.query?.rowId
    }
  },
  methods: {
    searchItems: lckHelpers.searchItems,
    async updateLocalAutocompleteSuggestions ({ column_type_id: columnTypeId, settings }: { column_type_id: number; settings: Record<string, unknown> }, { query }: { query: string }) {
      this.autocompleteSuggestions = await this.searchItems({
        columnTypeId,
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
  }
})
</script>
