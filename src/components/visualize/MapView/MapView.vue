<template>
  <div
    v-if="definition && content && content.data && settings"
    class="lck-mapview-block-content"
  >
    <lck-map
      v-if="resources"
      :resources="resources"
      :options="{
        maxZoom: 16,
        minZoom: 1
      }"
      :isPopup="isPopup"
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
} from '@/services/lck-utils/map'

import { LckTableViewColumn } from '@/services/lck-api/definitions'

import { MapSettings } from '@locokit/lck-glossary'

import Map from '@/components/ui/Map/Map.vue'

export default Vue.extend({
  name: 'MapView',
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
      type: Object
    },
    settings: {
      type: Object as PropType<MapSettings>
    }
  },
  computed: {
    resources (): LckGeoResource[] {
      return getLckGeoResources(
        this.definition?.columns,
        this.content?.data,
        this.settings,
        {
          noReference: this.$t('components.mapview.noReference'),
          noData: this.$t('components.mapview.noRowData'),
          dateFormat: this.$t('date.dateFormat')
        }
      )
    },
    isPopup () {
      return (
        this.settings?.sources?.length > 0 &&
        this.settings?.sources?.some(source => source.popup)
      ) || !!(this.settings?.pageDetailId)
    }
  }
  // methods: {
  /**
     * Get Geo colunms
     *  Two scenario possible:
     *   - if source exist, only data of (geo)column will be display
     *   - otherwise all data of geocolumn
     * @param columns
     */
  /**
     * @alc, I've commented this code,
     * as it is now in the map.ts helper,
     * and that I don't really understand your reduce, as it does not have any effect
     */
  // getOnlyGeoColumn (
  //   columns: LckTableViewColumn[]
  // ): LckTableViewColumn[] {
  //   if (this.settings.sources) {
  //     this.settings.sources.reduce((acc, { field }) => {
  //       const col = columns.find(column => column.id === field)
  //       if (col?.column_type_id && (isGEOColumn(col?.column_type_id) || (col?.column_type_id === COLUMN_TYPE.LOOKED_UP_COLUMN && isGEOColumn(getColumnTypeId(col))))) {
  //         acc.push(col)
  //       }
  //       return acc
  //     }, [] as LckTableViewColumn[])
  //   }
  //   return columns.filter(column => (isGEOColumn(column.column_type_id) || (column.column_type_id === COLUMN_TYPE.LOOKED_UP_COLUMN && isGEOColumn(getColumnTypeId(column)))))
  // },
  // }
})
</script>

<style lang="scss" scoped>
.lck-mapview-block-content {
  height: 50vh;
}
</style>
