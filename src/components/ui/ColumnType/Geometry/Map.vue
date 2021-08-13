<template>
  <div
    ref="map-container"
    :id="id"
    class="map-container"
  />
</template>

<script lang='ts'>
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Vue, { PropType } from 'vue'

import { TranslateResult } from 'vue-i18n'
import {
  AnyLayer,
  EventData,
  FitBoundsOptions,
  GeoJSONSource,
  Map,
  MapboxOptions,
  MapLayerEventType,
  MapLayerMouseEvent,
  MapLayerTouchEvent,
  NavigationControl,
  Popup,
  ScaleControl,
} from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import { GeoJSONFeature } from 'ol/format/GeoJSON'

import { COLUMN_TYPE } from '@locokit/lck-glossary'

import { MapPopupMode } from '@/services/lck-api/definitions'

import { setsAreEqual, mergeSets, setHasValues } from '@/services/lck-utils/set'

import {
  computeBoundingBox,
  LckImplementedLayoutProperty,
  LckImplementedPaintProperty,
} from '@/services/lck-utils/map/computeGeo'

import {
  LckGeoResource,
  LckImplementedLayers,
  PopupContent,
} from '@/services/lck-utils/map/transformWithOL'

import MapboxCustomControls from './MapboxCustomControl'

export enum MODE {
  BLOCK = 'Block',
  DIALOG = 'Dialog'
}

type MapLayerListenerFunction = (ev: (MapLayerMouseEvent | MapLayerTouchEvent) & EventData) => void;
type MapLayerMouseListenerFunction = (ev: (MapLayerMouseEvent) & EventData) => void;

export default Vue.extend({
  name: 'Map',
  props: {
    id: {
      type: String,
      default: 'map-container',
    },
    options: {
      type: Object as PropType<MapboxOptions>,
      default: () => ({}),
    },
    resources: {
      type: Array as PropType<LckGeoResource[]>,
      default: () => [],
    },
    mode: {
      type: String as PropType<MODE>,
      default: MODE.BLOCK,
    },
    singleEditMode: {
      type: Boolean,
      default: false,
    },
    defaultSelectedFeatureBySource: {
      type: Object as PropType<Record<string, {
        feature: GeoJSONFeature;
        centerToFeature?: boolean;
        zoomLevel?: number;
      } | null>>,
      default: () => ({}),
    },
  },
  data () {
    return {
      map: null as Map | null,
      mapDraw: null as MapboxDraw | null,
      dataManageControl: { visible: false, control: null } as { visible: boolean; control: MapboxCustomControls | null },
      editableGeometryTypes: new Set() as Set<COLUMN_TYPE>,
      selectedFeatureBySource: {} as Record<string, string | number | null>,
      listenersByLayer: {} as Record<string, {
        type: keyof MapLayerEventType;
        func: MapLayerMouseListenerFunction;
      }[]>,
      popup: {
        component: null as Popup | null,
        featuresIds: '',
      },
      mapIsLoaded: false,
    }
  },
  mounted () {
    const mapOptions: MapboxOptions = {
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
              'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
          },
        },
        glyphs: '/assets/map/font/{fontstack}/{range}.pbf',
        layers: [
          {
            id: 'tiles-background',
            type: 'raster',
            source: 'tiles-background',
            minzoom: 0,
            maxzoom: 20,
          },
        ],
      },
      minZoom: 1,
      maxZoom: 16,
      ...this.options,
    }
    // Directly focus on a specific area in dialog mode
    if (this.mode === MODE.DIALOG) {
      const computedBounds = computeBoundingBox(this.resources.filter(r => !r.excludeFromBounds))
      if (!computedBounds.isEmpty()) {
        mapOptions.bounds = computedBounds
        mapOptions.fitBoundsOptions = {
          padding: 20,
        }
      }
    }
    this.map = new Map(mapOptions)

    // Add navigation control (zoom + compass)
    this.map.addControl(new NavigationControl(), 'top-right')
    // Add scale control
    this.map.addControl(new ScaleControl(), 'bottom-left')
    // Create data manage control
    this.dataManageControl.control = new MapboxCustomControls([
      {
        label: this.$t('form.save'),
        event: 'click',
        listener: this.saveEditingFeatures,
        classes: ['pi', 'pi-save'],
      },
      {
        label: this.$t('form.reset'),
        event: 'click',
        listener: this.removeEditingFeatures,
        classes: ['pi', 'pi-refresh'],
      },
    ])

    // Disable map rotation
    this.map.dragRotate.disable()
    this.map.touchZoomRotate.disableRotation()

    // Force resize canvas map to avoid issue with dialog initialisation
    this.onResize()

    new ResizeObserver(this.onResize).observe(this.$refs['map-container'] as HTMLElement)

    this.map.on('load', () => {
      this.mapIsLoaded = true
      this.loadResources()
      this.initDrawControls()
      if (this.mode === MODE.BLOCK) this.setFitBounds(this.resources.filter(r => !r.excludeFromBounds))
      this.makeFeaturesInteractive()
      this.selectDefaultFeatures()
    })
  },
  methods: {
    manageEditingFeatures (type: 'save' | 'remove') {
      // We manage the editable and selected feature if we only have one
      let featuresToManage = this.mapDraw!.getSelected().features
      // We manage the editable feature if there is only one which is not selected
      if (featuresToManage.length === 0) {
        featuresToManage = this.mapDraw!.getAll().features
      }
      // Display an error if we don't have one feature to manage
      if (featuresToManage.length !== 1) {
        this.$toast.add({
          severity: 'warn',
          detail: featuresToManage.length === 0
            ? this.$t('components.mapview.noSelectedFeature')
            : this.$t('components.mapview.onlyOneSelectedFeature'),
          summary: this.$t('error.impossibleOperation'),
          life: 3000,
        })
        return
      }
      // Throw the desired event with the feature
      this.$emit(type === 'save' ? 'update-features' : 'remove-features', featuresToManage)
      this.mapDraw!.deleteAll()
    },
    saveEditingFeatures () {
      // Save the editable (and possibly selected) feature
      this.manageEditingFeatures('save')
    },
    removeEditingFeatures () {
      // Remove the editable (and possibly selected) feature
      this.manageEditingFeatures('remove')
    },
    saveListenerByLayer (eventType: keyof MapLayerEventType, layerId: string, func: MapLayerMouseListenerFunction) {
      // Save a listener to unregister it later
      if (!Array.isArray(this.listenersByLayer[layerId])) this.listenersByLayer[layerId] = []
      this.listenersByLayer[layerId].push({
        type: eventType,
        func,
      })
    },
    removeListenerByLayer (layerId: string) {
      // Remove the listeners related to a specific layer
      if (Array.isArray(this.listenersByLayer[layerId])) {
        for (const { type, func } of this.listenersByLayer[layerId]) {
          this.map!.off(type, layerId, func as MapLayerListenerFunction)
        }
      }
      delete this.listenersByLayer[layerId]
    },
    initDrawControls () {
      const allEditableGeometryTypes: Set<COLUMN_TYPE> = new Set()

      // Get all editable geographic types
      this.resources.forEach(resource => {
        mergeSets(resource.editableGeometryTypes, allEditableGeometryTypes)
      })

      // Create or update the draw controls if the editable geometry types have been changed
      if (!setsAreEqual(allEditableGeometryTypes, this.editableGeometryTypes)) {
        this.editableGeometryTypes = allEditableGeometryTypes

        // Remove previous controls
        if (this.mapDraw) this.map!.removeControl(this.mapDraw)

        // Define the new draw controls and add them to the map if necessary
        if (allEditableGeometryTypes.size > 0) {
          const hasEditableMultiGeometry = setHasValues(
            this.editableGeometryTypes,
            [COLUMN_TYPE.GEOMETRY_MULTIPOINT, COLUMN_TYPE.GEOMETRY_MULTILINESTRING, COLUMN_TYPE.GEOMETRY_MULTIPOLYGON],
          )

          // For now, we can only add a feature in the single edit mode
          if (this.singleEditMode) {
            /* eslint-disable @typescript-eslint/camelcase */
            this.mapDraw = new MapboxDraw({
              displayControlsDefault: false,
              controls: {
                point: setHasValues(this.editableGeometryTypes, [COLUMN_TYPE.GEOMETRY_POINT, COLUMN_TYPE.GEOMETRY_MULTIPOINT]),
                line_string: setHasValues(this.editableGeometryTypes, [COLUMN_TYPE.GEOMETRY_LINESTRING, COLUMN_TYPE.GEOMETRY_MULTILINESTRING]),
                polygon: setHasValues(this.editableGeometryTypes, [COLUMN_TYPE.GEOMETRY_POLYGON, COLUMN_TYPE.GEOMETRY_MULTIPOLYGON]),
                trash: true,
                combine_features: hasEditableMultiGeometry,
              },
            })
            /* eslint-enable @typescript-eslint/camelcase */
          } else {
            this.mapDraw = new MapboxDraw({
              displayControlsDefault: false,
              controls: {
                trash: true,
              },
            })
          }
          this.map!.addControl(this.mapDraw)

          if (!this.dataManageControl.visible) {
            this.map!.addControl(this.dataManageControl.control!)
            this.dataManageControl.visible = true
          }
        } else {
          if (this.dataManageControl.visible) {
            this.map!.removeControl(this.dataManageControl.control!)
            this.dataManageControl.visible = false
          }
        }
      }
    },
    addResource (resource: LckGeoResource) {
      this.map!.addSource(resource.id, {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: resource.features,
        },
        promoteId: 'id',
      })
      // Add the related layers
      for (const layer of resource.layers) {
        this.map!.addLayer({ source: resource.id, ...layer } as AnyLayer)
        // Load the images if needed
        for (const image of layer.imagesToLoad || []) {
          if (!this.map!.hasImage(image)) {
            this.map!.loadImage(image, (error: Error, loadedImage: HTMLImageElement) => {
              if (!error) {
                this.map!.addImage(image, loadedImage)
              }
            })
          }
        }
      }
    },
    updateResource (resourceToUpdate: LckGeoResource, resourceToCompare: LckGeoResource) {
      const layersToAdd: LckImplementedLayers[] = []
      const layersToUpdate: LckImplementedLayers[] = []
      const layersToRemove: LckImplementedLayers[] = []
      layersToAdd.push(
        ...resourceToUpdate.layers.filter(
          (resourceToUpdateLayer) => !resourceToCompare.layers.find(
            (resourceToCompareLayer) => resourceToCompareLayer.id === resourceToUpdateLayer.id,
          ),
        ),
      )
      layersToUpdate.push(...resourceToUpdate.layers.filter(
        (resourceToUpdateLayer) => resourceToCompare.layers.find(
          (resourceToCompareLayer) =>
            resourceToCompareLayer.id === resourceToUpdateLayer.id,
        ),
      ),
      )
      layersToRemove.push(...resourceToCompare.layers.filter(
        (resourceToCompareLayer) => !resourceToUpdate.layers.find(
          (resourceToUpdateLayer) => resourceToUpdateLayer.id === resourceToCompareLayer.id,
        ),
      ),
      )

      layersToRemove.forEach(layerToRemove => {
        this.map!.removeLayer(layerToRemove.id)
      })
      layersToAdd.forEach(layerToAdd => {
        this.map!.addLayer({
          source: resourceToUpdate.id,
          ...layerToAdd,
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
            layerToCompare.paint ? layerToCompare.paint : [],
          ).filter(
            (layerToComparePaintProperty) => !Object.keys(layerToUpdate.paint ? layerToUpdate.paint : []).find(
              (layerPaintProperty) => layerPaintProperty === layerToComparePaintProperty),
          ),
        )
        paintPropertiesToReset.forEach(
          (paintPropertyToReset) => this.map!.setPaintProperty(layerToUpdate.id, paintPropertyToReset, null),
        )
        if (layerToUpdate.paint) {
          Object.keys(layerToUpdate.paint)
            .filter(
              (paintProperty) => (
                !Object.keys(layerToCompare.paint ? layerToCompare.paint : [])
              ) || (
                layerToCompare.paint &&
                layerToCompare.paint[paintProperty as LckImplementedPaintProperty] !== layerToUpdate.paint?.[paintProperty as LckImplementedPaintProperty]
              ),
            ).forEach((paintProperty) => {
              this.map!.setPaintProperty(
                layerToUpdate.id,
                paintProperty,
                layerToUpdate.paint?.[paintProperty as LckImplementedPaintProperty],
              )
            })
        }

        layoutPropertiesToReset.push(
          ...Object.keys(
            layerToCompare.layout ? layerToCompare.layout : [],
          ).filter(
            (layerToCompareLayoutProperty) =>
              !Object.keys(layerToUpdate.layout ? layerToUpdate.layout : [])
                .find((layerLayoutProperty) => layerLayoutProperty === layerToCompareLayoutProperty),
          ),
        )
        layoutPropertiesToReset.forEach(
          (layoutPropertyToReset) => this.map!.setLayoutProperty(layerToUpdate.id, layoutPropertyToReset, null),
        )
        if (layerToUpdate.layout) {
          Object.keys(layerToUpdate.layout).filter(
            (layoutProperty) => (
              !Object.keys(layerToCompare.layout ? layerToCompare.layout : [])
            ) || (
              (layerToCompare).layout &&
              layerToCompare.layout[layoutProperty as LckImplementedLayoutProperty] !== layerToUpdate.layout?.[layoutProperty as LckImplementedLayoutProperty]
            ),
          ).forEach((layoutProperty) => {
            this.map!.setLayoutProperty(
              layerToUpdate.id,
              layoutProperty,
              layerToUpdate.layout?.[layoutProperty as LckImplementedLayoutProperty],
            )
          })
        }
      });

      (this.map!.getSource(resourceToUpdate.id) as GeoJSONSource).setData(
        {
          type: 'FeatureCollection',
          features: resourceToUpdate.features,
        },
      )
    },
    removeResource (resource: LckGeoResource) {
      resource.layers.forEach((layer) => {
        this.map!.removeLayer(layer.id)
        this.removeListenerByLayer(layer.id)
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
    setFitBounds (resources: { features: GeoJSONFeature[] }[], levelZoom?: number) {
      const bounds = computeBoundingBox(resources)
      if (!bounds.isEmpty()) {
        const boundsOptions: FitBoundsOptions = {
          padding: 40,
          animate: this.mode === MODE.BLOCK,
        }
        if (levelZoom) boundsOptions.zoom = levelZoom
        this.map!.fitBounds(bounds, boundsOptions)
      }
    },
    sendIdToDetail (rowId: string, pageDetailId?: string) {
      this.$emit('open-detail', { rowId, pageDetailId })
    },
    setPointerCursor () {
      this.map!.getCanvas().style.cursor = 'pointer'
    },
    resetCursor () {
      this.map!.getCanvas().style.cursor = ''
    },
    changeCursorOnLayerHover (layerId: string) {
      // Change the cursor to a pointer
      this.map!.on('mouseenter', layerId, this.setPointerCursor)
      this.saveListenerByLayer('mouseenter', layerId, this.setPointerCursor)
      // Change it back
      this.map!.on('mouseleave', layerId, this.resetCursor)
      this.saveListenerByLayer('mouseleave', layerId, this.resetCursor)
    },
    setFeatureEditableOnMouseDown (resourceId: string, layerId: string) {
      // Add the clicked feature to the MapboxDraw source
      const wrapperFunction = (e: MapLayerMouseEvent) => {
        const currentFeature = e.features?.[0]
        if (this.mapDraw!.getMode() === 'simple_select' && currentFeature?.id &&
          !this.mapDraw!.getAll().features.some(f => f.id === currentFeature.id)
        ) {
          // We get the original feature because the clicked feature has not the right coordinates
          // if some of them are outside the current screen
          const featureToAdd = this.resources.find(resource => resource.id === resourceId)?.features.find(
            feature => feature.id === currentFeature.id
          )
          if (featureToAdd) this.mapDraw!.add(featureToAdd)
        }
      }
      this.map!.on('mousedown', layerId, wrapperFunction)
      this.saveListenerByLayer('mousedown', layerId, wrapperFunction)
    },
    selectFeature (resourceId: string, featureId: string | number | null) {
      // Select a specified feature belonging to a resource
      if (!this.map!.getSource(resourceId)) return

      // Unselect the previous selected feature
      if (this.selectedFeatureBySource[resourceId]) {
        this.map!.setFeatureState({
          source: resourceId,
          id: this.selectedFeatureBySource[resourceId]!,
        }, {
          selectable: false,
        })
      }
      // Save the selected feature
      this.selectedFeatureBySource[resourceId] = featureId
      if (featureId) {
        // Customize it
        this.map!.setFeatureState({
          source: resourceId,
          id: featureId,
        }, {
          selectable: true,
        })
      }
    },
    selectFeatureOnClick (layerId: string, resourceId: string) {
      // Make a feature selectable on click
      const wrapperFunction = (e: MapLayerMouseEvent) => {
        const selectedFeature = e.features?.[0]
        if (selectedFeature?.id && selectedFeature.id !== this.selectedFeatureBySource[resourceId]) {
          this.selectFeature(resourceId, selectedFeature.id)
          this.$emit('select-feature', selectedFeature)
        }
      }
      // Add right listener
      this.map!.on('click', layerId, wrapperFunction)
      this.saveListenerByLayer('click', layerId, wrapperFunction)
    },
    selectDefaultFeatures () {
      // Highlight some features specified in the props and eventually center the map on them
      if (!this.map) return
      const targetFeatures: GeoJSONFeature[] = []
      let finalZoomLevel: number | undefined
      for (const sourceId in this.defaultSelectedFeatureBySource) {
        const { feature, centerToFeature, zoomLevel } = this.defaultSelectedFeatureBySource[sourceId] || {}
        const featureId = feature?.id || null
        if (featureId !== this.selectedFeatureBySource[sourceId]) {
          // Highlight the feature
          this.selectFeature(sourceId, featureId)
          // Fit to the bounds of this feature with the desired zoom level
          if (featureId && centerToFeature) {
            targetFeatures.push(feature!)
            if (zoomLevel) {
              finalZoomLevel = finalZoomLevel ? Math.min(finalZoomLevel, zoomLevel) : zoomLevel
            }
          }
        }
      }
      if (targetFeatures.length) {
        // Fit to the bounds of all selected features
        this.setFitBounds([{ features: targetFeatures }], finalZoomLevel)
      }
    },
    addPopupOnFeature (layerId: string, popupMode: MapPopupMode, pageDetailId?: string) {
      // Add Popup on layer on click
      const wrapperFunction = (e: MapLayerMouseEvent | MapLayerTouchEvent) => {
        if (e.features?.length && this.popup.component) {
          // Display the popup if necessary
          if (!this.popup.component.isOpen()) {
            this.popup.component.addTo(this.map!)
          }

          // Display the popup at the cursor position
          this.popup.component.setLngLat(e.lngLat)

          if (e.type === 'mousemove') {
            // Update the popup content only if the current features are different
            const hoveredFeatures = e.features.map(feature => feature.id).join('-')
            if (this.popup.featuresIds !== hoveredFeatures) {
              this.popup.featuresIds = hoveredFeatures
            } else {
              return
            }
          }

          let html = ''
          e.features.forEach(currentFeature => {
            if (currentFeature && currentFeature.properties) {
              const properties = currentFeature.properties

              html += `<p class="popup-row-title">${properties.title}</p>`

              const line = (content: PopupContent) => `
                <p class=${content.class}>
                  <span class="popup-field-label">${content?.field?.label}</span><br/>
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
                  <button class="row-detail-page" class="p-button p-button-sm">${textDetailPage}</button>
                </div>
              `
              }
            }
          })

          // Set content
          this.popup.component.setHTML(html)

          // Add the event on click on the page detail button
          if (!pageDetailId) return
          const element = this.popup.component.getElement()
          const links = element.querySelectorAll('.popup-row-toolbox .row-detail-page');

          (e.features || []).forEach(({ properties }, index) => {
            if (properties?.rowId && links[index]) {
              links[index].addEventListener('click', () => this.sendIdToDetail(properties.rowId, pageDetailId))
              const { sendIdToDetail, popup } = this
              if (popup.component) {
                popup.component.on('close', function () {
                  links[index].removeEventListener('click', () => sendIdToDetail)
                })
              }
            }
          })
        }
      }
      const wrapperFunctionOnLeave = () => {
        if (this.popup.component) {
          this.popup.component.remove()
        }
        this.popup.featuresIds = ''
      }
      if (popupMode === 'hover') {
        // Manage the popup position and the popup content if necessary
        this.map!.on('mousemove', layerId, wrapperFunction)
        this.saveListenerByLayer('mousemove', layerId, wrapperFunction)
        // Hide the popup
        this.map!.on('mouseleave', layerId, wrapperFunctionOnLeave)
        this.saveListenerByLayer('mouseleave', layerId, wrapperFunctionOnLeave)
        // Alternative event for mobile devices
        this.map!.on('touchstart', layerId, wrapperFunction)
        this.saveListenerByLayer('touchstart', layerId, wrapperFunction)
      } else {
        // Click mode by default
        this.map!.on('click', layerId, wrapperFunction)
        this.saveListenerByLayer('click', layerId, wrapperFunction)
      }
    },
    makeFeaturesInteractive () {
      if (!this.popup.component) this.popup.component = new Popup({ offset: 10, closeOnClick: false })
      this.resources.forEach(resource => {
        const hasEditableFeatures = resource.editableGeometryTypes.size > 0
        if (resource.popupMode || hasEditableFeatures || resource.selectable) {
          resource.layers.forEach(layer => {
            if (hasEditableFeatures) {
              // Make the current feature editable
              this.changeCursorOnLayerHover(layer.id)
              this.setFeatureEditableOnMouseDown(resource.id, layer.id)
            } else {
              if (resource.selectable || resource.popupMode === 'click') {
                // Change cursor
                this.changeCursorOnLayerHover(layer.id)
              }
              if (resource.selectable) {
                // Make the current feature selectable
                this.selectFeatureOnClick(layer.id, resource.id)
              }
              if (resource.popupMode) {
                // Display a pop up on click on the current feature
                this.addPopupOnFeature(layer.id, resource.popupMode, resource.pageDetailId)
              }
            }
          })
        }
      })
    },
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
      if (!this.mapIsLoaded) { return }

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
      this.initDrawControls()
    },
    defaultSelectedFeatureBySource: {
      deep: true,
      handler () {
        this.selectDefaultFeatures()
      },
    },
  },
})
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  min-height: 400px;
}
::v-deep .mapboxgl-ctrl-attrib.mapboxgl-compact {
  box-sizing: content-box;
}

/* Styles de la modale */
::v-deep .mapboxgl-popup {
  min-width: 180px;
  opacity: 0.93;
}

::v-deep .mapboxgl-popup-content p {
  font-size: 0.8rem;
  color: var(--primary-color-text);
  margin-bottom: 0;
}

::v-deep .mapboxgl-popup-content p button{
  font-size: 0.8rem;
  font-weight: 400;
  margin-bottom: 0.2rem;
}

::v-deep .mapboxgl-popup-content p.popup-row-title:first-child {
  margin-top: -10px;
}

::v-deep .mapboxgl-popup-content p.popup-row-title {
  font-size: 0.9rem;
  font-weight: bold;
  text-align: center;
  color: var(--primary-color);
  margin-left: -10px;
  margin-right: -10px;
  padding: 5px 10px 0 10px;
}

::v-deep .mapboxgl-popup-content .popup-field-label {
  font-weight: bold;
}

::v-deep .mapboxgl-popup-content .popup-row-toolbox {
  display: flex;
}

::v-deep .mapboxgl-popup-content .popup-row-toolbox > button {
  margin: auto;
}

::v-deep .mapboxgl-popup-content .popup-row-content > p.primary {
  color: var(--primary-color);
}

::v-deep .mapboxgl-popup-content .popup-row-content > p.secondary {
  color: var(--secondary-color);
}

::v-deep .mapboxgl-popup-content .popup-row-content > p.success {
  color: var(--color-success);
}

::v-deep .mapboxgl-popup-content .popup-row-content > p.warning {
  color: var(--color-warning);
}

::v-deep .mapboxgl-popup-content .popup-row-content > p.danger {
  color: var(--color-error);
}

::v-deep .mapboxgl-popup-content .popup-row-content > p.black {
  color: black;
}

::v-deep .mapboxgl-popup-close-button {
  color: var(--primary-color);
}
</style>
