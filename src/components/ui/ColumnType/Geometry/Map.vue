<template>
    <div
      :id="id"
      class="map-container"
    />
</template>

<script lang='ts'>
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Vue, { PropType } from 'vue'

import { TranslateResult } from 'vue-i18n'
import mapboxgl, {
  AnyLayer,
  Map,
  MapboxOptions,
  MapLayerMouseEvent,
  NavigationControl,
  Popup,
  ScaleControl
} from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import MapboxDraw, { MapboxDrawControls } from '@mapbox/mapbox-gl-draw'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import GeometryType from 'ol/geom/GeometryType'

import {
  computeBoundingBox,
  LckGeoResource,
  LckImplementedLayers,
  LckImplementedLayoutProperty,
  LckImplementedPaintProperty,
  PopupContent
} from '@/services/lck-utils/map'

export enum MODE {
  BLOCK = 'Block',
  DIALOG = 'Dialog'
}

export default Vue.extend({
  name: 'Map',
  props: {
    id: {
      type: String,
      default: 'map-container'
    },
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
    hasPopup: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      map: null as Map | null,
      mapDraw: null as MapboxDraw | null,
      mapDrawControls: {} as MapboxDraw.MapboxDrawControls,
      selectedFigureBySource: {} as Record<string, string | number>
    }
  },
  mounted () {
    this.map = new Map({
      container: this.id,
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
            id: 'tiles-background-layer',
            type: 'raster',
            source: 'tiles-background',
            minzoom: 0,
            maxzoom: 20
          }
        ]
      },
      minZoom: 1,
      maxZoom: 16,
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
      this.makeFeatureInteractive()

      // Add draw control
      this.initDrawControls(this.resources)
      // Add the specific events to allow to edit the features
      this.map!.on('draw.create', this.createFeatures)
      this.map!.on('draw.delete', this.deleteFeatures)
      this.map!.on('draw.update', this.updateFeaturesOnMove)
      this.map!.on('draw.modechange', this.onChangeMode)
    })
  },
  methods: {
    onChangeMode (event: MapboxDraw.DrawModeChageEvent) {
      if (event.mode === 'simple_select') {
        const allFeatures = this.mapDraw!.getAll().features
        if (allFeatures.length > 0) this.$emit('update-features', allFeatures)
      }
    },
    createFeatures (event: MapboxDraw.DrawCreateEvent) {
      this.$emit('update-features', event.features)
    },
    updateFeaturesOnMove (event: MapboxDraw.DrawUpdateEvent) {
      if (event.action === 'move' && this.mapDraw?.getMode() === 'simple_select') {
        this.$emit('update-features', event.features)
      }
    },
    deleteFeatures (event: MapboxDraw.DrawDeleteEvent) {
      this.$emit('remove-features', event.features)
    },
    initDrawControls (resources: LckGeoResource[]) {
      // We just allow to have one editable resource by map
      const editableResource = resources.find(resource => resource.editableGeometryTypes.size === 1)

      if (!editableResource) return

      const newMapDrawControls: MapboxDrawControls = {
        point: editableResource.editableGeometryTypes.has(GeometryType.POINT),
        line_string: editableResource.editableGeometryTypes.has(GeometryType.LINE_STRING), // eslint-disable-line @typescript-eslint/camelcase
        polygon: editableResource.editableGeometryTypes.has(GeometryType.POLYGON),
        trash: true
      }

      // Reset the draw data
      if (this.mapDraw) {
        this.mapDraw!.deleteAll()
      }

      let control: keyof MapboxDrawControls
      for (control in newMapDrawControls) {
        // Reset the draw control if it is already defined and different from the previous one
        if (newMapDrawControls[control] !== this.mapDrawControls[control]) {
          this.mapDrawControls = newMapDrawControls
          if (this.mapDraw) {
            this.map!.removeControl(this.mapDraw)
          }
          // Define the new draw control and add it to the map
          this.mapDraw = new MapboxDraw({
            displayControlsDefault: false,
            controls: this.mapDrawControls
          })
          this.map!.addControl(this.mapDraw)
          break
        }
      }
    },
    addResource (resource: LckGeoResource) {
      this.map!.addSource(resource.id, {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: resource.features
        },
        promoteId: 'id'
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
      const bounds = computeBoundingBox(this.resources)
      if (!bounds.isEmpty()) {
        this.map!.fitBounds(bounds, {
          padding: 40,
          animate: this.mode === MODE.BLOCK
        })
      }
    },
    sendIdToDetail (rowId: string, pageDetailId?: string) {
      this.$emit('open-detail', { rowId, pageDetailId })
    },
    changeCursorOnLayerHover (layerId: string) {
      // Change the cursor to a pointer
      this.map!.on('mouseenter', layerId, () => {
          this.map!.getCanvas().style.cursor = 'pointer'
      })
      // Change it back
      this.map!.on('mouseleave', layerId, () => {
          this.map!.getCanvas().style.cursor = ''
      })
    },
    onSelectFeature (resourceId: string, resourceIndex: number, layerId: string) {
      this.map!.on('click', layerId, (e: MapLayerMouseEvent) => {
        const selectedFeature = e.features?.[0]
        if (selectedFeature?.id && selectedFeature.id !== this.selectedFigureBySource[resourceId]) {
          // Unselect the previous selected feature
          if (this.selectedFigureBySource[resourceId]) {
            this.map!.setFeatureState({
              source: resourceId,
              id: this.selectedFigureBySource[resourceId]
            }, {
              selectable: false
            })
          }
          // Save the selected feature and customize it
          this.selectedFigureBySource[resourceId] = selectedFeature.id
          this.map!.setFeatureState({
            source: resourceId,
            id: selectedFeature.id
          }, {
            selectable: true
          })
          this.$emit('select-feature', selectedFeature, resourceIndex)
        }
      })
    },
    setFeatureEditableOnMouseDown (layerId: string) {
      // Add the clicked feature to the MapboxDraw source
      this.map!.on('mousedown', layerId, (e: MapLayerMouseEvent) => {
        if (e.features && e.features[0]) {
          const currentFeature = e.features[0]
          if (currentFeature.id && this.mapDraw && this.mapDraw.get(currentFeature.id as string) === undefined) {
            this.mapDraw.add(currentFeature)
          }
        }
      })
    },
    addPopupOnClick (layerId: string, pageDetailId?: string) {
      // Add Popup on layer on click
      this.map!.on('click', layerId, (e: MapLayerMouseEvent) => {
        if (e.features && e.features[0].properties) {
          const properties = e.features[0].properties

          let html = `<p class="popup-row-title">${properties.title}</p>`

          const line = (content: PopupContent) => `
            <p class=${content.class}'>
              <b>${content?.field?.label}</b><br/>
              ${content?.field?.value}
            </p>`

          if (properties.content) {
            const content = JSON.parse(properties?.content)
            if (content.length > 0) {
              html += `
              <div class="popup-row-content">
                ${content.map((content: PopupContent) => line(content)).join('')}
              </div>
            `
            }
          }

          if (properties.rowId && pageDetailId) {
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

          if (properties.rowId && pageDetailId) {
            const element = popup.getElement()
            const link = element.querySelector('.popup-row-toolbox #row-detail-page')
            if (link) {
              link.addEventListener('click', () => this.sendIdToDetail(properties.rowId, pageDetailId))
              const { sendIdToDetail } = this
              popup.on('close', function () {
                link.removeEventListener('click', () => sendIdToDetail)
              })
            }
          }
        }
      })
    },
    makeFeatureInteractive () {
      const mapHasPopUp = this.mode === MODE.BLOCK && this.hasPopup
      this.resources.forEach((resource, index) => {
        const hasPopUp = mapHasPopUp && resource.displayPopup
        const hasEditableFeatures = resource.editableGeometryTypes.size === 1
        if (hasPopUp || hasEditableFeatures || resource.selectable) {
          resource.layers.forEach(layer => {
            const currentLayerId = `${resource.id}-${layer.id}`
            if (resource.selectable) {
              // Make the current feature selectable
              this.changeCursorOnLayerHover(currentLayerId)
              this.onSelectFeature(resource.id, index, currentLayerId)
            }
            if (hasEditableFeatures) {
              // Make the current feature editable
              this.setFeatureEditableOnMouseDown(currentLayerId)
            }
            if (hasPopUp) {
              // Display a pop up on click on the current feature
              this.changeCursorOnLayerHover(currentLayerId)
              this.addPopupOnClick(currentLayerId, resource.pageDetailId)
            }
          })
        }
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
      // Reinitialize the draw controls depending of the new resources
      this.initDrawControls(newResources)
    }
  }
})
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  min-height: 300px;
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
