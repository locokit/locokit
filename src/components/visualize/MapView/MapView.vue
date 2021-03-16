<template>
  <div
    v-if="definition && content && content.data"
    class="lck-mapview-block-content"
  >
    <lck-map
      v-if="resources && options"
      :resources="resources"
      :options="options"
    />
    <span v-else>{{ $t('components.mapview.noData') }}</span>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import GeoJSON from 'ol/format/GeoJSON'
import { Feature } from 'ol'

import {
  computeCenterFeatures,
  GEO_STYLE,
  isGEOColumn,
  transformEWKTtoFeature
} from '@/services/lck-utils/map'
import { columnAncestor } from '@/services/lck-utils/columns'
import { LckTableViewColumn } from '@/services/lck-api/definitions'

import {
  COLUMN_TYPE,
  MapSettings
} from '@locokit/lck-glossary'

import Map from '@/components/ui/Map/Map.vue'

export default Vue.extend({
  name: 'MapView',
  components: {
    'lck-map': Map
  },
  props: {
    definition: {
      type: Object
    },
    content: {
      type: Object
    },
    settings: {
      type: Object as PropType<MapSettings>,
      default: () => ({})
    }
  },
  methods: {
    transformEWKTtoFeature,
    computeCenterFeatures,
    getOnlyGeoColumn (
      columns: LckTableViewColumn[]
    ): LckTableViewColumn[] {
      // eslint-disable-next-line @typescript-eslint/camelcase
      return columns.filter(column => (isGEOColumn(column.column_type_id) || (column.column_type_id === COLUMN_TYPE.LOOKED_UP_COLUMN && isGEOColumn(columnAncestor(column)))))
    },
    createStyleLayers (geoColumns: LckTableViewColumn[]) {
      const geoTypes = new Set()
      const layers: { [key: string]: {} }[] = []

      geoColumns.forEach(geoColumn => {
        if (geoColumn.column_type_id !== COLUMN_TYPE.LOOKED_UP_COLUMN) {
          geoTypes.add(geoColumn.column_type_id)
        } else {
          geoTypes.add(columnAncestor(geoColumn))
        }
      })
      geoTypes.forEach(geoType => {
        switch (geoType) {
          case COLUMN_TYPE.GEOMETRY_POINT:
            layers.push(GEO_STYLE.Point)
            break
          case COLUMN_TYPE.GEOMETRY_LINESTRING:
            layers.push(GEO_STYLE.Linestring)
            break
          case COLUMN_TYPE.GEOMETRY_POLYGON:
            layers.push(GEO_STYLE.Polygon)
            break
          default:
            console.error('Column type unknown')
        }
      })
      return layers
    },
    createGeoJsonFeaturesCollection (
      rows: { data: { [key: string]: string | { value: string } | null } }[],
      geoColumns: LckTableViewColumn[]
    ) {
      const features: Feature[] = []

      rows.forEach(row => {
        geoColumns.forEach(geoColumn => {
          if (geoColumn.column_type_id === COLUMN_TYPE.LOOKED_UP_COLUMN) {
            if (row.data[geoColumn.id]?.value) {
              const feature = this.transformEWKTtoFeature(row.data[geoColumn.id]?.value)
              features.push(feature)
            }
          } else {
            // Case for column_type Point, Linestring, Polygon
            if (row.data[geoColumn.id]) {
              const feature = this.transformEWKTtoFeature(row.data[geoColumn.id])
              features.push(feature)
            }
          }
        })
      })

      // Transform OL Feature in Geojson
      const geojsonFormat = new GeoJSON()
      return geojsonFormat.writeFeaturesObject(features)
    }
  },
  computed: {
    resources () {
      const geoColumns = this.getOnlyGeoColumn(this.definition?.columns)
      const features = this.createGeoJsonFeaturesCollection(this.content?.data, geoColumns)
      const layers = this.createStyleLayers(geoColumns)

      return [
        {
          id: 'features-collection-source-id',
          layers: layers,
          ...features
        }
      ]
    },
    options () {
      const geoColumns = this.getOnlyGeoColumn(this.definition?.columns)
      const features = this.createGeoJsonFeaturesCollection(this.content?.data, geoColumns)
      if (features?.features.length > 0) {
        const centerFeaturesCollection = this.computeCenterFeatures(features)
        return {
          center: centerFeaturesCollection?.geometry?.coordinates,
          zoom: 9,
          maxZoom: 16,
          minZoom: 1
        }
      }
      return null
    }
  }
})
</script>

<style lang="scss" scoped>
.lck-mapview-block-content {
  height: 50vh;
}
</style>
