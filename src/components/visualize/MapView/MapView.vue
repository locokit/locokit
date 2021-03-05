<template>
  <div
    class="lck-mapview-block-content"
    v-if="definition && content && content.data"
  >
    <lck-map
      :resources="resources"
      :options="options"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import GeoJSON from 'ol/format/GeoJSON'
import { Feature } from 'ol'

import { GEO_STYLE, transformEWKTtoFeature, computeCenterFeatures } from '@/services/lck-utils/map'

import { COLUMN_TYPE, MapViewSettings } from '@locokit/lck-glossary'

import Map from '@/components/ui/Map/Map.vue'

// Todo: Imposible de filtrer sur l'id de la table qui fait référence à la tableview

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
      type: Object as PropType<MapViewSettings>,
      default: () => ({})
    }
  },
  methods: {
    transformEWKTtoFeature,
    computeCenterFeatures,
    getOnlyGeoColumn (
      columns: { column_type_id: number; displayed: boolean }[]
    ): { column_type_id: number; id: string }[] {
      const geoType = [COLUMN_TYPE.GEOMETRY_POINT, COLUMN_TYPE.GEOMETRY_LINESTRING, COLUMN_TYPE.GEOMETRY_POLYGON]
      // eslint-disable-next-line @typescript-eslint/camelcase
      // const geoColumns = columns.filter(({ column_type_id, originalColumn }) => (geoType.includes(column_type_id) || (column_type_id === COLUMN_TYPE.LOOKED_UP_COLUMN && geoType.includes(originalColumn.column_type_id))))
      // eslint-disable-next-line @typescript-eslint/camelcase
      return columns.filter(({ displayed, column_type_id }) => (geoType.includes(column_type_id) || (column_type_id === COLUMN_TYPE.LOOKED_UP_COLUMN && displayed)))
    },
    createStyleLayers (geoColumns: { column_type_id: number }[]) {
      const geoTypes = new Set()
      const layers: {[key: string]: {}}[] = []

      geoColumns.forEach(geoColumn => {
        if (geoColumn.column_type_id !== COLUMN_TYPE.LOOKED_UP_COLUMN) {
          geoTypes.add(geoColumn.column_type_id)
        } else {
          // geoTypes.add(geoColumn.ancestorOrigins.column_type_id)
          geoTypes.add(18)
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
      rows: { data: {[key: string]: string|{ value: string }|null } }[],
      geoColumns: { id: string; column_type_id: number }[]
    ) {
      const features: Feature[] = []

      rows.forEach(row => {
        geoColumns.forEach(geoColumn => {
          if (geoColumn.column_type_id === COLUMN_TYPE.LOOKED_UP_COLUMN) {
            if (row.data[geoColumn.id]?.value) {
              const feature = this.transformEWKTtoFeature(row.data[geoColumn.id].value)
              features.push(feature)
            } else {
              // Case for column_type Point, Linestring, Polygon
              if (row.data[geoColumn.id]) {
                const feature = this.transformEWKTtoFeature(row.data[geoColumn.id])
                features.push(feature)
              }
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
      const layers = this.createStyleLayers(geoColumns)
      const features = this.createGeoJsonFeaturesCollection(this.content?.data, geoColumns)
      return [{
        id: 'features-collection-source-id',
        layers: layers,
        ...features
      }]
    },
    options () {
      const geoColumns = this.getOnlyGeoColumn(this.definition?.columns)
      const geojson = this.createGeoJsonFeaturesCollection(this.content?.data, geoColumns)
      const centerFeaturesCollection = this.computeCenterFeatures(geojson)

      return {
        center: centerFeaturesCollection?.geometry?.coordinates,
        zoom: 9,
        maxZoom: 16,
        minZoom: 1
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
