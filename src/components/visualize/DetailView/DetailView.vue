<template>
  <div
    v-if="definition && content && content.data && rowId"
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
import { LckTableViewColumn } from '@/services/lck-api/definitions'

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
      autocompleteSuggestions: null as { value: number; label: string }[]|null
    }
  },
  computed: {
    rowId (): string {
      return this.$route.query?.rowId as string
    }
  },
  methods: {
    searchItems: lckHelpers.searchItems,
    async updateLocalAutocompleteSuggestions ({ columnTypeId, settings }: LckTableViewColumn, { query }: { query: string }) {
      this.autocompleteSuggestions = await this.searchItems({
        columnTypeId,
        tableId: settings?.tableId as string,
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
