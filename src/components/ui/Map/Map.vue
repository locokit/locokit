<template>
  <div id="map-container"></div>
</template>

<script lang='ts'>
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Vue, { PropType } from 'vue'

import {
  AnyLayer,
  Map,
  MapboxOptions,
  NavigationControl,
  ScaleControl,
  LngLatBounds
} from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Feature } from 'geojson'

interface Resource {
  id: string;
  features: Feature[];
  layers: AnyLayer[];
}

export enum MODE {
  BLOCK = 'Block',
  DIALOG = 'Dialog'
}

export default Vue.extend({
  name: 'Map',
  props: {
    options: {
      type: Object as PropType<MapboxOptions>,
      default: () => ({})
    },
    resources: {
      type: Array as PropType<Resource[]>,
      default: () => []
    },
    mode: {
      type: String as PropType<MODE>,
      default: MODE.BLOCK
    }
  },
  data () {
    return {
      map: null as Map | null
    }
  },
  mounted: function () {
    this.map = new Map({
      container: 'map-container',
      customAttribution: '<a href="http://www.openstreetmap.org/about/" target="_blank">© OpenStreetMap</a>',
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
    })

    // Add navigation control (zoom + compass)
    this.map.addControl(new NavigationControl(), 'top-right')
    // Add scale control
    this.map.addControl(new ScaleControl(), 'bottom-left')

    // Disable map rotation
    this.map.dragRotate.disable()
    this.map.touchZoomRotate.disableRotation()

    // Force resize canvas map to avoid issue with dialog initialisation
    if (this.mode === MODE.DIALOG) {
      this.onResize()
    }

    window.addEventListener('resize', this.onResize)

    this.map.on('load', () => {
      this.loadResources()
      this.getFitBounds()
    })
  },
  methods: {
    addResource (resource: Resource) {
      this.map!.addSource(resource.id, {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: resource.features
        }
      })
      resource.layers.forEach((layer) => {
        this.map!.addLayer({ source: resource.id, ...layer, id: `${resource.id}-${layer.id}` } as AnyLayer)
      })
    },
    updateResource (resourceToUpdate: Resource, resourceToCompare: Resource) {
      const layersToAdd: AnyLayer[] = []
      const layersToUpdate: AnyLayer[] = []
      const layersToRemove: AnyLayer[] = []
      layersToAdd.push(
        ...resourceToUpdate.layers.filter(
          (resourceToUpdateLayer) => !resourceToCompare.layers.find(
            (resourceToCompareLayer) => resourceToCompareLayer.id === resourceToUpdateLayer.id
          )
        )
      )
      layersToUpdate.push(...resourceToUpdate.layers.filter(
        (resourceToUpdateLayer) => resourceToCompare.layers.find(
          (resourceToCompareLayer) => resourceToCompareLayer.id === resourceToUpdateLayer.id
        )
      )
      )
      layersToRemove.push(...resourceToCompare.layers.filter(
        (resourceToCompareLayer) => !resourceToUpdate.layers.find(
          (resourceToUpdateLayer) => resourceToUpdateLayer.id === resourceToCompareLayer.id
        )
      )
      )

      layersToRemove.forEach((layerToRemove) => {
        this.map!.removeLayer(`${resourceToUpdate.id}-${layerToRemove.id}`)
      })
      layersToAdd.forEach((layerToAdd) => {
        this.map!.addLayer({ source: resourceToUpdate.id, ...layerToAdd, id: `${resourceToUpdate.id}-${layerToAdd.id}` } as AnyLayer)
      })
      layersToUpdate.forEach((layer: any) => {
        const layerToCompare: AnyLayer = resourceToCompare.layers.find(
          (resourceToCompareLayer) => resourceToCompareLayer.id === layer.id)!
        const paintPropertiesToReset: string[] = []
        const layoutPropertiesToReset: string[] = []

        paintPropertiesToReset.push(
          ...Object.keys(
            (layerToCompare as any).paint
              ? (layerToCompare as any).paint
              : []
          ).filter(
            (layerToComparePaintProperty) => !Object.keys(layer.paint ? layer.paint : []).find(
              (layerPaintProperty) => layerPaintProperty === layerToComparePaintProperty)
          )
        )
        paintPropertiesToReset.forEach((paintPropertyToReset) => this.map!.setPaintProperty(`${resourceToUpdate.id}-${layer.id}`, paintPropertyToReset, null))
        if (layer.paint) {
          Object.keys(layer.paint).filter((paintProperty) => (!Object.keys((layerToCompare as any).paint) ? (layerToCompare as any).paint : []) || ((layerToCompare as any).paint && (layerToCompare as any).paint[paintProperty] !== layer.paint[paintProperty])).forEach((paintProperty) => {
            this.map!.setPaintProperty(`${resourceToUpdate.id}-${layer.id}`, paintProperty, layer.paint[paintProperty])
          })
        }

        layoutPropertiesToReset.push(...Object.keys((layerToCompare as any).layout ? (layerToCompare as any).layout : []).filter((layerToCompareLayoutProperty) => !Object.keys(layer.layout ? layer.layout : []).find((layerLayoutProperty) => layerLayoutProperty === layerToCompareLayoutProperty)))
        layoutPropertiesToReset.forEach((layoutPropertyToReset) => this.map!.setLayoutProperty(`${resourceToUpdate.id}-${layer.id}`, layoutPropertyToReset, null))
        if (layer.layout) {
          Object.keys(layer.layout).filter((layoutProperty) => (!Object.keys((layerToCompare as any).layout) ? (layerToCompare as any).layout : []) || ((layerToCompare as any).layout && (layerToCompare as any).layout[layoutProperty] !== layer.layout[layoutProperty])).forEach((layoutProperty) => {
            this.map!.setLayoutProperty(`${resourceToUpdate.id}-${layer.id}`, layoutProperty, layer.layout[layoutProperty])
          })
        }
      });

      (this.map!.getSource(resourceToUpdate.id) as any).setData(
        {
          type: 'FeatureCollection',
          features: resourceToUpdate.features
        }
      )
    },
    removeResource (resource: Resource) {
      resource.layers.forEach((layer) => {
        this.map!.removeLayer(`${resource.id}-${layer.id}`)
      })
      this.map!.removeSource(resource.id)
    },
    loadResources () {
      this.resources.forEach((resource) => {
        this.addResource(resource)
      })
    },
    onResize () {
      setTimeout(() => {
        this.map && this.map.resize()
      }, 300)
    },
    getFitBounds () {
      const coordinates = []
      this.resources.forEach(resource => {
        resource.features.forEach(feature => {
          if (feature.type === 'Point') {
            coordinates.push([feature.geometry.coordinates])
          } else {
            coordinates.push(feature.geometry.coordinates)
          }
        })
      })
      if (coordinates.length > 1) {
        const bounds = coordinates.reduce((bounds, coordinate) => {
          return bounds.extend(coordinate)
        }, new LngLatBounds(coordinates[0], coordinates[1]))

        this.map.fitBounds(bounds, {
          padding: 40,
          animate: this.mode === MODE.BLOCK
        })
      }
      // Case when we display only one Point
      if (coordinates.length === 1) {
        this.map.fitBounds([...coordinates, ...coordinates], {
          padding: 40,
          animate: this.mode === MODE.BLOCK
        })
      }
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
      const resourcesToAdd: Resource[] = []
      const resourcesToUpdate: Resource[] = []
      const resourcesToRemove: Resource[] = []

      resourcesToAdd.push(...newResources.filter((newResource) => !oldResources.find((oldResource) => oldResource.id === newResource.id)))
      resourcesToUpdate.push(...newResources.filter((newResource) => oldResources.find((oldResource) => oldResource.id === newResource.id)))
      resourcesToRemove.push(...oldResources.filter((oldResource) => !newResources.find((newResource) => newResource.id === oldResource.id)))

      resourcesToRemove.forEach((resourceToRemove) => {
        this.removeResource(resourceToRemove)
      })
      resourcesToAdd.forEach((resourceToAdd) => {
        this.addResource(resourceToAdd)
      })
      resourcesToUpdate.forEach((resourceToUpdate) => {
        const resourceToCompare: Resource = oldResources.find((oldResource) => oldResource.id === resourceToUpdate.id)!
        this.updateResource(resourceToUpdate, resourceToCompare)
      })
    }
  }
})
</script>

<style scoped>
#map-container {
  width: 100%;
  height: 100%;
}
/deep/ .mapboxgl-ctrl-attrib.mapboxgl-compact {
  box-sizing: content-box;
}
</style>
