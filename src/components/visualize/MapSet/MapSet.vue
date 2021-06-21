<template>
  <div
    v-if="definition && content && settings"
    class="lck-mapview-block-content"
  >
    <lck-map
      v-if="resources"
      :id="`block-map-view-${id}`"
      :resources="resources"
      :hasPopup="hasPopup"
      @select-feature="onSelectFeature"
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

import { LckTableRow, LckTableView } from '@/services/lck-api/definitions'

import { MapSettings } from '@locokit/lck-glossary'
import { GeoJSONFeature } from 'ol/format/GeoJSON'

// Dynamic import
const Map = () => import(/* webpackChunkName: "lck-map-with-mapbox" */'@/components/ui/ColumnType/Geometry/Map.vue')

export default Vue.extend({
  name: 'MapSet',
  components: {
    'lck-map': Map
  },
  props: {
    id: {
      type: String
    },
    definition: {
      type: Object as PropType<Record<string, LckTableView>>
    },
    content: {
      type: Object as PropType<Record<string, LckTableRow[]>>
    },
    settings: {
      type: Object as PropType<MapSettings>
    }
  },
  computed: {
    resources (): LckGeoResource[] {
      return getLckGeoResources(
        this.definition,
        this.content,
        this.settings,
        {
          noReference: this.$t('components.mapview.noReference'),
          noData: this.$t('components.mapview.noRowData'),
          dateFormat: this.$t('date.dateFormat')
        }
      )
    },
    hasPopup (): boolean {
      return (
        this.resources.some(resource => resource.displayPopup)
      )
    }
  },
  methods: {
    onSelectFeature (selectedFeature: GeoJSONFeature, resourceIndex: number) {
      if (this.resources[resourceIndex].triggerEvents?.has('click') && selectedFeature.properties) {
        window.eventHub.$emit(
          `${this.id}:click`, {
            reference: selectedFeature.properties?.rowId,
            value: selectedFeature.properties?.title
          }
        )
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.lck-mapview-block-content {
  height: 50vh;
}
</style>
