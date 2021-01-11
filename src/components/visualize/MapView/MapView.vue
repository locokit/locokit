<template>
  <div id="map-view"></div>
</template>

<script lang='ts'>
import Vue, { PropType } from 'vue'
import { AnyLayer, Map, MapboxOptions } from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Feature } from 'geojson';

interface Resource {
  id: string,
  features: Feature[],
  layers: AnyLayer[]
}

export default Vue.extend({
  name: 'MapView',
  props: {
    options: {
      type: Object as PropType<MapboxOptions>,
      default: () => ({})
    },
    resources: {
      type: Array as PropType<Resource[]>,
      default: () => []
    }
  },
  mounted () {
    const map = new Map({
      container: 'map-view',
      style: {
        version: 8,
        sources: {
          'tiles-background': {
            type: 'raster',
            tiles: [
              'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
            ],
            tileSize: 256
          }
        },
        glyphs: '/assets/map/font/{fontstack}/{range}.pbf',
        layers: [
          {
            id: 'tiles-background',
            type: 'raster',
            source: 'tiles-background',
            minzoom: 0,
            maxzoom: 17
          }
        ]
      },
      center: [2.6, 46.9],
      zoom: 0,
      ...this.options
    });
    map.on('load', () => {
      this.resources.forEach((resource) => {
        map.addSource(resource.id, {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: resource.features
          }
        })
        resource.layers.forEach((layer) => {
          map.addLayer({ source: resource.id, ...layer } as AnyLayer)
        })
      })
    })
  }
})
</script>
<style scoped>
#map-view {
  width: 100%;
  height: 100%;
}
</style>