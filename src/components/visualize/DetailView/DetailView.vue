<template>
  <div
    v-if="definition && content && content.data && rowId"
  >
    <lck-data-detail
      class="detail-view centered-content-view box-with-shadow"
      :definition="definition"
      :row="content.data[0]"
      :autocompleteSuggestions="autocompleteSuggestions"
      v-on="$listeners"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import DataDetail from '@/components/store/DataDetail/DataDetail.vue'

// import { patchTableData } from '@/store/database'
import { lckHelpers } from '@/services/lck-api'
// import { LckTableRowData, LckTableViewColumn } from '@/services/lck-api/definitions'

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
    },
    autocompleteSuggestions: {
      type: null as { value: number | string; label: string }[]|null
    }
  },
  computed: {
    rowId (): string {
      return this.$route.query?.rowId as string
    }
  },
  methods: {
    searchItems: lckHelpers.searchItems
  }
})
</script>
