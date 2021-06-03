<template>
  <lck-data-detail
    v-if="definition && content && content.data && rowId"
    class="detail-view centered-content-view box-with-shadow"
    :definition="definition"
    :row="content.data[0]"
    v-on="$listeners"
    v-bind="$attrs"
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import DataDetail from '@/components/store/DataDetail/DataDetail.vue'

import { LckTableRow } from '@/services/lck-api/definitions'

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
      type: Object as PropType<{ data: LckTableRow[] }>,
      default: () => ({ data: [] })
    }
  },
  computed: {
    rowId (): string {
      // return this.$route.query?.rowId as string
      return this.content?.data?.[0]?.id
    }
  }
})
</script>
