<template>
  <div id="map-container"></div>
</template>

<script lang='ts'>
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Vue, { PropType } from 'vue'

import mapboxgl, {
  AnyLayer,
  LngLatBounds,
  Map,
  MapboxOptions,
  MapLayerMouseEvent,
  NavigationControl,
  Popup,
  ScaleControl,
  LngLatLike
} from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import {
  LckGeoResource,
  LckImplementedLayers,
  LckImplementedLayoutProperty,
  LckImplementedPaintProperty
} from '@/services/lck-utils/map'

import { TranslateResult } from 'vue-i18n'

interface PopupContent {
  class?: string | null;
  field?: {
    label?: string | null;
    value?: string | null;
    color?: string | null;
    backgrondColor?: string | null;
  };
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
      type: Array as PropType<LckGeoResource[]>,
      default: () => []
    },
    mode: {
      type: String as PropType<MODE>,
      default: MODE.BLOCK
    },
    isPopup: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      map: null as Map | null
    }
  },
  mounted () {
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
            maxzoom: 15
          }
        ]
      },
      minZoom: 2,
      maxZoom: 15,
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
      this.setFitBounds()
      if (this.mode === MODE.BLOCK && this.isPopup) {
        this.createPopup()
      }
    })
  },
  methods: {
    addResource (resource: LckGeoResource) {
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
    updateResource (resourceToUpdate: LckGeoResource, resourceToCompare: LckGeoResource) {
      const layersToAdd: LckImplementedLayers[] = []
      const layersToUpdate: LckImplementedLayers[] = []
      const layersToRemove: LckImplementedLayers[] = []
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

      layersToRemove.forEach(layerToRemove => {
        this.map!.removeLayer(`${resourceToUpdate.id}-${layerToRemove.id}`)
      })
      layersToAdd.forEach(layerToAdd => {
        this.map!.addLayer({
          source: resourceToUpdate.id,
          ...layerToAdd,
          id: `${resourceToUpdate.id}-${layerToAdd.id}`
        } as AnyLayer)
      })
      layersToUpdate.forEach(layerToUpdate => {
        /**
         * This code is not understandable.
         * @bal, you'll have to rewrite it / comment it for better understanding
         * And add correct TypeScript typings for avoid any regression in the future
         */
        const layerToCompare: LckImplementedLayers = resourceToCompare.layers.find(l => l.id === layerToUpdate.id)!
        const paintPropertiesToReset: string[] = []
        const layoutPropertiesToReset: string[] = []

        paintPropertiesToReset.push(
          ...Object.keys(
            layerToCompare.paint ? layerToCompare.paint : []
          ).filter(
            (layerToComparePaintProperty) => !Object.keys(layerToUpdate.paint ? layerToUpdate.paint : []).find(
              (layerPaintProperty) => layerPaintProperty === layerToComparePaintProperty)
          )
        )
        paintPropertiesToReset.forEach(
          (paintPropertyToReset) => this.map!.setPaintProperty(`${resourceToUpdate.id}-${layerToUpdate.id}`, paintPropertyToReset, null)
        )
        if (layerToUpdate.paint) {
          Object.keys(layerToUpdate.paint)
            .filter(
              (paintProperty) => (
                !Object.keys(layerToCompare.paint ? layerToCompare.paint : [])
              ) || (
                layerToCompare.paint &&
                layerToCompare.paint[paintProperty as LckImplementedPaintProperty] !== layerToUpdate.paint?.[paintProperty as LckImplementedPaintProperty]
              )
            ).forEach((paintProperty) => {
              this.map!.setPaintProperty(
                `${resourceToUpdate.id}-${layerToUpdate.id}`,
                paintProperty,
                layerToUpdate.paint?.[paintProperty as LckImplementedPaintProperty]
              )
            })
        }

        layoutPropertiesToReset.push(
          ...Object.keys(
            layerToCompare.layout ? layerToCompare.layout : []
          ).filter(
            (layerToCompareLayoutProperty) =>
              !Object.keys(layerToUpdate.layout ? layerToUpdate.layout : [])
                .find((layerLayoutProperty) => layerLayoutProperty === layerToCompareLayoutProperty)
          )
        )
        layoutPropertiesToReset.forEach(
          (layoutPropertyToReset) => this.map!.setLayoutProperty(`${resourceToUpdate.id}-${layerToUpdate.id}`, layoutPropertyToReset, null)
        )
        if (layerToUpdate.layout) {
          Object.keys(layerToUpdate.layout).filter(
            (layoutProperty) => (
              !Object.keys(layerToCompare.layout ? layerToCompare.layout : [])
            ) || (
              (layerToCompare).layout &&
              layerToCompare.layout[layoutProperty as LckImplementedLayoutProperty] !== layerToUpdate.layout?.[layoutProperty as LckImplementedLayoutProperty]
            )
          ).forEach((layoutProperty) => {
            this.map!.setLayoutProperty(
              `${resourceToUpdate.id}-${layerToUpdate.id}`,
              layoutProperty,
              layerToUpdate.layout?.[layoutProperty as LckImplementedLayoutProperty]
            )
          })
        }
      });

      (this.map!.getSource(resourceToUpdate.id) as mapboxgl.GeoJSONSource).setData(
        {
          type: 'FeatureCollection',
          features: resourceToUpdate.features
        }
      )
    },
    removeResource (resource: LckGeoResource) {
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
    setFitBounds () {
      const coordinates: LngLatLike[] = []
      /**
       * Collect all coordinates from all features of all resources
       */
      this.resources.forEach((resource: LckGeoResource) => {
        resource.features.forEach(feature => {
          switch (feature.geometry.type) {
            case 'Point':
              coordinates.push(feature.geometry.coordinates as [number, number])
              break
            case 'LineString':
              coordinates.push(...feature.geometry.coordinates as [number, number][])
              break
            case 'Polygon':
              console.log(feature.geometry.coordinates)
              coordinates.push(...feature.geometry.coordinates[0] as [number, number][])
              break
          }
          // TODO: @alc, we need to review this code together
          // if (feature.type === 'Point') {
          //   coordinates.push([feature.geometry.coordinates])
          // } else {
          // }
        })
      })
      /**
       * If we have no coordinates, we can't fitBounds
       */
      if (coordinates.length === 0) return
      /**
       * if we only have one coordinates, for a bbox, we need two, minimum
       * so we add another coordinates, with the first one
       */
      if (coordinates.length === 1) coordinates.push(coordinates[0])

      /**
       * Now we can compute bounds of all coordinates...
       */
      const bounds = coordinates.reduce((bounds, coordinate) => {
        return bounds.extend(coordinate)
      }, new LngLatBounds(coordinates[0], coordinates[1]));

      /**
       * ... and fitBounds the map !
       */
      (this.map as Map).fitBounds(bounds, {
        padding: 40,
        animate: this.mode === MODE.BLOCK
      })
    },
    sendIdToDetail (rowId: string) {
      this.$emit('open-detail', rowId)
    },
    createPopup () {
      const allResourceId: string[] = this.resources.reduce((acc, resource) => {
        const ids = resource.layers.map((layer) => (`${resource.id}-${layer.id}`))
        acc.push(...ids)
        return acc
      }, [] as string[])

      allResourceId.forEach(resourceId => {
        // Add Popup on layer on click
        this.map!.on(
          'click',
          resourceId,
          (e: MapLayerMouseEvent) => {
            if (e.features && e.features[0].properties) {
              const properties = e.features[0].properties

              let html = `<p class="popup-row-title">${properties.title}</p>`

              const line = (content: PopupContent) => `<p class=${content.class}'>${content?.field?.label}: ${content?.field?.value}</p>`

              if (properties.content) {
                const content = JSON.parse(properties?.content)
                if (content.length > 0) {
                  html += `
                  <div class="popup-row-content">
                    ${content.reduce((acc: string, content: PopupContent) => acc + line(content), '' as string)}
                  </div>
                `
                }
              }

              if (properties.rowId) {
                const textDetailPage: TranslateResult = this.$t('components.mapview.textDetailPage')

                html += `
                <div class="popup-row-toolbox">
                  <button id="row-detail-page" class="p-button p-button-sm">${textDetailPage}</button>
                </div>
              `
              }

              const popup = new Popup()
                .setLngLat(e.lngLat)
                .setHTML(html)
                .addTo(this.map!)

              if (properties.rowId) {
                const element = popup.getElement()
                const link = element.querySelector('.popup-row-toolbox #row-detail-page')
                if (link) {
                  link.addEventListener('click', () => this.sendIdToDetail(properties.rowId))

                  const { sendIdToDetail } = this
                  popup.on('close', function () {
                    link.removeEventListener('click', () => sendIdToDetail)
                  })
                }
              }
            }
          }
        )

        // Change the cursor to a pointer
        this.map!.on(
          'mouseenter',
          resourceId,
          () => {
            this.map!.getCanvas().style.cursor = 'pointer'
          }
        )

        // Change it back
        this.map!.on(
          'mouseleave',
          resourceId,
          () => {
            this.map!.getCanvas().style.cursor = ''
          }
        )
      })
    }
  },
  watch: {
    options (newOptions: MapboxOptions, oldOptions: MapboxOptions) {
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
    resources (newResources: LckGeoResource[], oldResources: LckGeoResource[]) {
      const resourcesToAdd: LckGeoResource[] = []
      const resourcesToUpdate: LckGeoResource[] = []
      const resourcesToRemove: LckGeoResource[] = []

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
        const resourceToCompare: LckGeoResource = oldResources.find((oldResource) => oldResource.id === resourceToUpdate.id)!
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

/* Styles de la modale */
/deep/ .mapboxgl-popup {
  min-width: 180px;
}

/deep/ .mapboxgl-popup-content p button{
  font-size: 0.8rem;
  font-weight: 400;
  margin-bottom: 0.2rem;
}

/deep/ .mapboxgl-popup-content p.popup-row-title {
  font-size: 0.9rem;
  font-weight: bold;
  text-align: center;
  color: var(--primary-color);
  margin-top: -10px;
  margin-left: -10px;
  margin-right: -10px;
  padding: 5px 10px 0 10px;
}

/deep/ .mapboxgl-popup-content .popup-row-toolbox {
  display: flex;
}

/deep/ .mapboxgl-popup-content .popup-row-toolbox > button {
  margin: auto;
}

/deep/ .mapboxgl-popup-close-button {
  color: var(--primary-color);
}
</style>
