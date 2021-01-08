<template>
  <div id="map-view"></div>
</template>

<script>
import Vue from 'vue'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

export default Vue.extend({
  name: 'MapView',
  props: {
    options: {
      type: Object,
      default: () => ({})
    },
    resources: {
      type: Array,
      default: () => []
    }
  },
  mounted () {
    const map = new mapboxgl.Map({
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
          map.addLayer({ source: resource.id, ...layer })
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