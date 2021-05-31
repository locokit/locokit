<template>
  <div
    v-if="definition && content && settings"
    class="lck-mapview-block-content"
  >
    <lck-map
      v-if="resources"
      :id="`block-map-view-${uuidv4()}`"
      :resources="resources"
      :hasPopup="hasPopup"
      v-on="$listeners"
    />
    <span v-else>{{ $t('components.mapview.noGeoData') }}</span>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import { v4 as uuidv4 } from 'uuid'

import {
  getLckGeoResources,
  LckGeoResource
} from '@/services/lck-utils/map'

import { LckTableRow, LckTableView } from '@/services/lck-api/definitions'

import { MapSettings } from '@locokit/lck-glossary'

import Map from '@/components/ui/ColumnType/Geometry/Map.vue'

export default Vue.extend({
  name: 'MapView',
  components: {
    'lck-map': Map
  },
  props: {
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
    uuidv4
  }
})
</script>

<style lang="scss" scoped>
.lck-mapview-block-content {
  height: 50vh;
}
</style>
