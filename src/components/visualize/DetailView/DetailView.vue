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
import Vue from 'vue'

import DataDetail from '@/components/store/DataDetail/DataDetail.vue'

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
    },
    autocompleteSuggestions: {
      type: null as { value: number | string; label: string }[]|null
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
    searchItems: lckHelpers.searchItems
  }
})
</script>
