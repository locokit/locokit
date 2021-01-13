<template>
  <div id="map-view"></div>
</template>

<script lang='ts'>
import Vue, { PropType } from 'vue'
import { AnyLayer, Map, MapboxOptions } from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Feature } from 'geojson'

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
  data () {
    return {
      map: null as Map | null
    }
  },
  mounted () {
    this.map = new Map({
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
      ...this.options
    });
    this.map.on('load', () => {
      this.loadResources()
    })
  },
  methods: {
    loadResources () {
      this.resources.forEach((resource) => {
        this.map!.addSource(resource.id, {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: resource.features
          }
        })
        resource.layers.forEach((layer) => {
          this.map!.addLayer({ source: resource.id, ...layer } as AnyLayer)
        })
      })
    }
  },
  watch: {
    options: function (newOptions: MapboxOptions, oldOptions: MapboxOptions) {
      if (newOptions.style && JSON.stringify(newOptions.style) !== JSON.stringify(oldOptions.style)) {
        this.map!.setStyle(newOptions.style)
        this.loadResources()
      }

      if (newOptions.center && newOptions.center.toString() !== (oldOptions.center ? oldOptions.center : []).toString()) {
        this.map!.setCenter(newOptions.center)
      }

      if (newOptions.zoom && newOptions.zoom !== oldOptions.zoom) {
        this.map!.setZoom(newOptions.zoom)
      }
    },
    resources: function (newResources: Resource[], oldResources: Resource[]) {
      console.log(newResources, oldResources)
    }
  }
})
</script>
<style scoped>
#map-view {
  width: 100%;
  height: 100%;
}
</style>