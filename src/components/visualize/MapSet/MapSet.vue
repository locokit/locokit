<template>
  <div
    v-if="definition && content && settings"
    class="lck-mapview-block-content"
  >
    <lck-map
      v-if="resources"
      :id="'block-map-view-' + definition.id"
      :resources="resources"
      :hasPopup="hasPopup"
      v-on="$listeners"
    />
    <span v-else>{{ $t('components.mapview.noGeoData') }}</span>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import {
  getLckGeoResources,
  LckGeoResource
} from '@/services/lck-utils/map/transformWithOL'

import { LckTableRow, LckTableViewColumn } from '@/services/lck-api/definitions'

import { MapSettings } from '@locokit/lck-glossary'

// Dynamic import
const Map = () => import(/* webpackChunkName: "lck-map-with-mapbox" */'@/components/ui/ColumnType/Geometry/Map.vue')

export default Vue.extend({
  name: 'MapSet',
  components: {
    'lck-map': Map
  },
  props: {
    definition: {
      type: Object as PropType<{
        columns: LckTableViewColumn[];
      }>
    },
    content: {
      type: Array as PropType<LckTableRow[]>
    },
    settings: {
      type: Object as PropType<MapSettings>
    }
  },
  computed: {
    resources (): LckGeoResource[] {
      return getLckGeoResources(
        this.definition?.columns,
        this.content,
        this.settings,
        {
          noReference: this.$t('components.mapview.noReference'),
          noData: this.$t('components.mapview.noRowData'),
          dateFormat: this.$t('date.dateFormat')
        }
      )
    },
    hasPopup () {
      return (
        this.settings?.sources?.length > 0 &&
        this.settings?.sources?.some(source => source.popup)
      ) || !!(this.settings?.pageDetailId)
    }
  }
})
</script>

<style lang="scss" scoped>
.lck-mapview-block-content {
  height: 50vh;
}
</style>
