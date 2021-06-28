/* eslint-disable @typescript-eslint/camelcase */
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import { shallowMount } from '@vue/test-utils'
import GeometryType from 'ol/geom/GeometryType'

import {
  GEO_STYLE
} from '@/services/lck-utils/map/transformWithOL'

import Map from './Map.vue'

// Method to make an object deep copy
function mockDeepCloneObject (object) {
  return object ? JSON.parse(JSON.stringify(object)) : {}
}

// Mock variables
const mockResources = [
  {
    id: 'resource_1',
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: GeometryType.POINT,
          coordinates: [10, 20]
        },
        id: 'f1',
        properties: {
          title: 'First feature',
          rowId: 'row1',
          columnId: 'row2',
          content: JSON.stringify([
            {
              field: {
                label: 'First field',
                value: 10
              }
            }
          ])
        }
      },
      {
        type: 'Feature',
        geometry: {
          type: GeometryType.POINT,
          coordinates: [15, 30]
        },
        id: 'f2',
        properties: {}
      }
    ],
    layers: [GEO_STYLE.Point],
    popupMode: null,
    editableGeometryTypes: new Set([GeometryType.POINT]),
    selectable: false
  },
  {
    id: 'resource_2',
    type: 'FeatureCollection',
    features: [],
    layers: [GEO_STYLE.Point],
    popupMode: null,
    editableGeometryTypes: new Set([GeometryType.POLYGON]),
    selectable: false
  },
  {
    id: 'resource_3',
    type: 'FeatureCollection',
    features: [],
    layers: [GEO_STYLE.Point],
    popupMode: 'click',
    editableGeometryTypes: new Set(),
    selectable: false
  },
  {
    id: 'resource_4',
    type: 'FeatureCollection',
    features: [],
    layers: [GEO_STYLE.Point],
    popupMode: 'click',
    editableGeometryTypes: new Set(),
    selectable: true
  },
  {
    id: 'resource_5',
    type: 'FeatureCollection',
    features: [],
    layers: [GEO_STYLE.Point],
    popupMode: 'hover',
    editableGeometryTypes: new Set(),
    selectable: false
  }
]

const mockFirstFeature = mockResources[0].features[0]
const mockSecondFeature = mockResources[0].features[1]

// Mock external libraries

jest.mock('@locokit/lck-glossary', () => ({
  BLOCK_TYPE: {
    PARAGRAPH: 'Paragraph',
    TABLE_VIEW: 'TableView',
    MAPVIEW: 'MapView'
  },
  COLUMN_TYPE: {
  }
}))

jest.mock('vue-i18n')
jest.mock('mapbox-gl', () => ({
  Map: jest.fn(() => ({
    addControl: jest.fn(),
    dragRotate: {
      disable: jest.fn()
    },
    touchZoomRotate: {
      disableRotation: jest.fn()
    },
    on: jest.fn((event, func) => {
      if (event === 'load') func()
    }),
    off: jest.fn(),
    resize: jest.fn(),
    removeControl: jest.fn(),
    addSource: jest.fn(),
    addLayer: jest.fn(),
    removeLayer: jest.fn(),
    setPaintProperty: jest.fn(),
    getSource: jest.fn(() => ({
      setData: jest.fn()
    })),
    removeSource: jest.fn(),
    fitBounds: jest.fn(),
    getCanvas: jest.fn(),
    setFeatureState: jest.fn(),
    setStyle: jest.fn(),
    setCenter: jest.fn(),
    setZoom: jest.fn()
  })),
  NavigationControl: jest.fn(),
  ScaleControl: jest.fn(),
  Popup: jest.fn(() => ({
    remove: jest.fn(),
    isOpen: jest.fn(),
    setLngLat: jest.fn(),
    addTo: jest.fn(),
    setHTML: jest.fn(),
    getElement: jest.fn(() => ({
      querySelectorAll: jest.fn(() => [])
    }))
  }))
}))

// jest.mock('@mapbox/mapbox-gl-draw/')
jest.mock('@mapbox/mapbox-gl-draw', () =>
  jest.fn(() => ({
    getMode: jest.fn(() => 'simple_select'),
    getAll: jest.fn(() => ({
      features: mockResources[0].features
    })),
    delete: jest.fn(),
    set: jest.fn(),
    getSelectedIds: jest.fn(() => [mockSecondFeature.id]),
    MapboxDraw: jest.fn()
  }))
)

// Mock internal functions
jest.mock('@/services/lck-utils/map/computeGeo', () => ({
  computeBoundingBox: () => ({
    isEmpty: () => true
  })
}))

// Tests

describe('Map component', () => {
  describe('Methods', () => {
    describe('initDrawControls', () => {
      it('Initialize the right edition controls of the map in the single edit mode', () => {
        // Initialize the component
        const wrapper = shallowMount(Map, {
          propsData: {
            singleEditMode: true,
            resources: mockResources
          }
        })
        // Choose the editable geometry types depending of the map mockResources
        expect(wrapper.vm.editableGeometryTypes.size).toBe(2)
        expect(wrapper.vm.editableGeometryTypes.has(GeometryType.POINT)).toBe(true)
        expect(wrapper.vm.editableGeometryTypes.has(GeometryType.POLYGON)).toBe(true)
        // Add the right controls
        expect(MapboxDraw).toHaveBeenLastCalledWith(expect.objectContaining({
          displayControlsDefault: false,
          controls: {
            point: true,
            line_string: false,
            polygon: true,
            trash: true
          }
        }))
      })

      it('Initialize the editable geometry types of the map in the multiple edit mode', () => {
        // Initialize the component
        const wrapper = shallowMount(Map, {
          propsData: {
            singleEditMode: false,
            resources: mockResources
          }
        })
        // No control to add a new feature must be displayed
        expect(wrapper.vm.editableGeometryTypes.size).toBe(0)
        // Add the right controls (trash button)
        expect(MapboxDraw).toHaveBeenLastCalledWith(expect.objectContaining({
          displayControlsDefault: false,
          controls: {
            point: false,
            line_string: false,
            polygon: false,
            trash: true
          }
        }))
      })

      it('Reset the controls if there is no more editable geometry types', async () => {
        // Initialize the component
        const wrapper = shallowMount(Map, {
          propsData: {
            singleEditMode: true,
            resources: mockResources
          }
        })
        // Initialize the draw controls
        wrapper.vm.map.addControl.mockClear()
        wrapper.vm.map.removeControl.mockClear()
        // Update the resources: mockResources
        await wrapper.setProps({
          resources: []
        })
        // No controls must be displayed
        expect(wrapper.vm.editableGeometryTypes.size).toBe(0)
        expect(wrapper.vm.map.addControl).not.toHaveBeenCalled()
        // Remove the old controls
        expect(wrapper.vm.map.removeControl).toHaveBeenCalledTimes(1)
      })

      it('Reset the controls if the editable geometry types have been changed', async () => {
        // Initialize the component
        const wrapper = shallowMount(Map, {
          propsData: {
            singleEditMode: true,
            resources: mockResources
          }
        })
        wrapper.vm.map.removeControl.mockClear()
        wrapper.vm.map.addControl.mockClear()
        // Update the mockResources
        await wrapper.setProps({
          resources: [
            mockResources[0]
          ]
        })
        // Choose the editable geometry types depending of the new mockResources
        expect(wrapper.vm.editableGeometryTypes.size).toBe(1)
        expect(wrapper.vm.editableGeometryTypes.has(GeometryType.POINT)).toBe(true)
        // Add the new controls
        expect(wrapper.vm.map.removeControl).toHaveBeenCalledTimes(1)
        expect(wrapper.vm.map.addControl).toHaveBeenCalledTimes(1)
        expect(MapboxDraw).toHaveBeenLastCalledWith(expect.objectContaining({
          displayControlsDefault: false,
          controls: {
            point: true,
            line_string: false,
            polygon: false,
            trash: true
          }
        }))
      })
    })

    describe('selectFeature', () => {
      const resourceId = mockResources[0].id

      it('Select a feature in a source for the first time', () => {
        // Initialize the component
        const wrapper = shallowMount(Map, {
          propsData: {
            resources: mockResources
          }
        })
        // Select a feature
        wrapper.vm.selectFeature(resourceId, mockFirstFeature.id)
        // Save this information
        expect(wrapper.vm.selectedFeatureBySource).toStrictEqual({
          [resourceId]: mockFirstFeature.id
        })
        // Customize it
        expect(wrapper.vm.map.setFeatureState).toHaveBeenNthCalledWith(1, {
          source: resourceId,
          id: mockFirstFeature.id
        }, {
          selectable: true
        })
      })

      it('Select a feature with a null id in a source', () => {
        // Initialize the component
        const wrapper = shallowMount(Map, {
          propsData: {
            resources: mockResources
          }
        })
        // Select a feature
        wrapper.vm.selectFeature(resourceId, null)
        // Save this information
        expect(wrapper.vm.selectedFeatureBySource).toStrictEqual({
          [resourceId]: null
        })
        // Don't customize it
        expect(wrapper.vm.map.setFeatureState).not.toHaveBeenCalled()
      })

      it('Select a default feature from the props', async () => {
        // Initialize the component
        const wrapper = shallowMount(Map, {
          propsData: {
            resources: mockResources,
            defaultSelectedFeatureBySource: {
              [resourceId]: mockFirstFeature.id
            }
          }
        })
        // Save this information
        expect(wrapper.vm.selectedFeatureBySource).toStrictEqual({
          [resourceId]: mockFirstFeature.id
        })
        // Select the new feature
        expect(wrapper.vm.map.setFeatureState).toHaveBeenCalledWith({
          source: resourceId,
          id: mockFirstFeature.id
        }, {
          selectable: true
        })
        wrapper.vm.map.setFeatureState.mockClear()
        // Select the same feature
        await wrapper.setProps({
          defaultSelectedFeatureBySource: {
            [resourceId]: mockFirstFeature.id
          }
        })
        expect(wrapper.vm.map.setFeatureState).not.toHaveBeenCalled()
        // Select another feature
        await wrapper.setProps({
          defaultSelectedFeatureBySource: {
            [resourceId]: mockSecondFeature.id
          }
        })
        // Save this information
        expect(wrapper.vm.selectedFeatureBySource).toStrictEqual({
          [resourceId]: mockSecondFeature.id
        })
        // Select the new feature
        expect(wrapper.vm.map.setFeatureState).toHaveBeenLastCalledWith({
          source: resourceId,
          id: mockSecondFeature.id
        }, {
          selectable: true
        })
      })

      it('Select another feature in one source', () => {
        // Initialize the component with a selected feature
        const wrapper = shallowMount(Map, {
          propsData: {
            resources: mockResources,
            defaultSelectedFeatureBySource: {
              [resourceId]: mockFirstFeature.id
            }
          }
        })
        // Select another feature in the same source
        wrapper.vm.selectFeature(resourceId, mockSecondFeature.id)
        // Save this information
        expect(wrapper.vm.selectedFeatureBySource).toStrictEqual({
          [resourceId]: mockSecondFeature.id
        })
        // Unselect the previous one
        expect(wrapper.vm.map.setFeatureState).toHaveBeenNthCalledWith(2, {
          source: resourceId,
          id: mockFirstFeature.id
        }, {
          selectable: false
        })
        // Select the new one
        expect(wrapper.vm.map.setFeatureState).toHaveBeenNthCalledWith(3, {
          source: resourceId,
          id: mockSecondFeature.id
        }, {
          selectable: true
        })
      })
      describe('selectFeatureOnClick', () => {
        let wrapper, selectFeatureOnClickFunction, spyOnEmitEvent

        beforeAll(() => {
          wrapper = shallowMount(Map, {
            propsData: {
              resources: mockResources
            }
          })
          wrapper.vm.selectFeatureOnClick('customLayerId', 'resourceId')
          selectFeatureOnClickFunction = wrapper.vm.listenersByLayer.customLayerId[0].func
          spyOnEmitEvent = jest.spyOn(wrapper.vm, '$emit')
        })

        beforeEach(async () => {
          spyOnEmitEvent.mockClear()
          wrapper.vm.selectedFeatureBySource = {}
        })

        it('Emit an event if the selected feature is not already selected', () => {
          selectFeatureOnClickFunction({
            features: [mockFirstFeature]
          })
          expect(spyOnEmitEvent).toHaveBeenCalledTimes(1)
          expect(spyOnEmitEvent).toHaveBeenCalledWith('select-feature', mockFirstFeature)
        })

        it('Do not emit an event if the selected feature has not got id', () => {
          const featureWithoutId = mockDeepCloneObject(mockFirstFeature)
          delete featureWithoutId.id
          selectFeatureOnClickFunction({
            features: [featureWithoutId]
          })
          expect(spyOnEmitEvent).not.toHaveBeenCalled()
        })

        it('Do not emit an event if the selected feature is already selected', () => {
          selectFeatureOnClickFunction({
            features: [mockFirstFeature]
          })
          selectFeatureOnClickFunction({
            features: [mockFirstFeature]
          })
          expect(spyOnEmitEvent).toHaveBeenCalledTimes(1)
        })
      })
    })

    describe('addPopupOnFeature', () => {
      let wrapper, addPopupOnFeatureFunction

      beforeEach(() => {
        wrapper = shallowMount(Map, {
          propsData: {
            resources: mockResources,
            hasPopup: true,
            mode: 'Block'
          },
          mocks: {
            t: key => key,
            $t: key => key
          }
        })
        wrapper.vm.addPopupOnFeature('customLayerId', 'hover', 'pageDetailId')
        addPopupOnFeatureFunction = wrapper.vm.listenersByLayer.customLayerId[0].func
      })

      it('Add the popup to the map only if it is not displayed yet', () => {
        wrapper.vm.popup.component.addTo.mockClear()
        wrapper.vm.popup.component.isOpen.mockImplementationOnce(() => false)
        addPopupOnFeatureFunction({
          features: [mockFirstFeature],
          type: 'mousemove'
        })
        expect(wrapper.vm.popup.component.addTo).toHaveBeenCalledWith(wrapper.vm.map)
        expect(wrapper.vm.popup.featuresIds).toBe('f1')
      })

      it('Do not add the popup to the map if it is already displayed', () => {
        wrapper.vm.popup.component.addTo.mockClear()
        wrapper.vm.popup.component.isOpen.mockImplementationOnce(() => true)
        addPopupOnFeatureFunction({
          features: [mockFirstFeature]
        })
        expect(wrapper.vm.popup.component.addTo).not.toHaveBeenCalled()
      })

      it('Do not move the popup if there is no features', () => {
        wrapper.vm.popup.component.setLngLat.mockClear()
        addPopupOnFeatureFunction({
          features: []
        })
        expect(wrapper.vm.popup.component.setLngLat).not.toHaveBeenCalled()
      })

      it('Only update the popup content if the selected features are different', () => {
        wrapper.vm.popup.component.setHTML.mockClear()
        // Display the popup the first time on one feature
        addPopupOnFeatureFunction({
          features: [mockFirstFeature],
          type: 'mousemove'
        })
        expect(wrapper.vm.popup.component.setHTML).toHaveBeenCalledTimes(1)
        wrapper.vm.popup.component.setHTML.mockClear()
        // Display the popup the second time on the same feature
        addPopupOnFeatureFunction({
          features: [mockFirstFeature],
          type: 'mousemove'
        })
        expect(wrapper.vm.popup.component.setHTML).not.toHaveBeenCalled()
      })
    })

    describe('RemovePopupOnFeature', () => {
      let wrapper, removePopupOnFeatureFunction, addPopupOnFeatureFunction

      beforeAll(() => {
        wrapper = shallowMount(Map, {
          propsData: {
            resources: [mockResources[4]],
            hasPopup: true,
            mode: 'Block'
          },
          mocks: {
            t: key => key,
            $t: key => key
          }
        })
        wrapper.vm.addPopupOnFeature('customLayerId', 'hover', 'pageDetailId')
        addPopupOnFeatureFunction = wrapper.vm.listenersByLayer.customLayerId.find(listener =>
          listener.type === 'touchstart'
        ).func
        removePopupOnFeatureFunction = wrapper.vm.listenersByLayer.customLayerId.find(listener =>
          listener.type === 'mouseleave'
        ).func
      })

      it('Remove the popup from the map', () => {
        addPopupOnFeatureFunction({
          features: [mockFirstFeature],
          type: 'mousemove'
        })
        wrapper.vm.popup.component.remove.mockClear()
        removePopupOnFeatureFunction({
          features: [mockResources[4]]
        })
        expect(wrapper.vm.popup.component.remove).toHaveBeenCalled()
        expect(wrapper.vm.popup.featuresIds).toBe('')
      })
    })

    describe('Manage listeners by layer', () => {
      const myFunction = () => 1

      describe('saveListenerByLayer', () => {
        it('Save a listener in a new layer', () => {
          // Initialize the component
          const wrapper = shallowMount(Map)
          wrapper.vm.saveListenerByLayer('click', 'myFirstLayerId', myFunction)
          expect(wrapper.vm.listenersByLayer).toStrictEqual({
            myFirstLayerId: [
              {
                type: 'click',
                func: myFunction
              }
            ]
          })
        })

        it('Save two listeners for the same layer', () => {
          // Initialize the component
          const wrapper = shallowMount(Map)
          wrapper.vm.saveListenerByLayer('click', 'myFirstLayerId', myFunction)
          wrapper.vm.saveListenerByLayer('mousedown', 'myFirstLayerId', myFunction)
          expect(wrapper.vm.listenersByLayer).toStrictEqual({
            myFirstLayerId: [
              {
                type: 'click',
                func: myFunction
              },
              {
                type: 'mousedown',
                func: myFunction
              }
            ]
          })
        })
      })

      describe('removeListenerByLayer', () => {
        it('Remove all listeners added for a specific layer', () => {
          // Initialize the component
          const wrapper = shallowMount(Map)
          // Add some listeners
          wrapper.vm.saveListenerByLayer('click', 'myFirstLayerId', myFunction)
          wrapper.vm.saveListenerByLayer('mousedown', 'myFirstLayerId', myFunction)
          wrapper.vm.saveListenerByLayer('mousedown', 'mySecondLayerId', myFunction)
          // Remove all listeners related to the first layer
          wrapper.vm.removeListenerByLayer('myFirstLayerId')
          // Check data is updated
          expect(wrapper.vm.listenersByLayer).toStrictEqual({
            mySecondLayerId: [
              {
                type: 'mousedown',
                func: myFunction
              }
            ]
          })
          // Check listeners are removed from the map
          expect(wrapper.vm.map.off).toHaveBeenCalledTimes(2)
          expect(wrapper.vm.map.off).toHaveBeenNthCalledWith(1, 'click', 'myFirstLayerId', myFunction)
          expect(wrapper.vm.map.off).toHaveBeenNthCalledWith(2, 'mousedown', 'myFirstLayerId', myFunction)
        })

        it('Do nothing if the specified layer is unknown', () => {
          // Initialize the component
          const wrapper = shallowMount(Map)
          // Add some listeners
          wrapper.vm.saveListenerByLayer('click', 'myFirstLayerId', myFunction)
          // Remove all listeners related to the first layer
          wrapper.vm.removeListenerByLayer('myUnknownLayerId')
          // Check data is updated
          expect(wrapper.vm.listenersByLayer).toStrictEqual({
            myFirstLayerId: [
              {
                type: 'click',
                func: myFunction
              }
            ]
          })
          expect(wrapper.vm.map.off).not.toHaveBeenCalled()
        })
      })
      describe('check default listeners', () => {
        it('if the features of the layer are selectable', () => {
          const wrapper = shallowMount(Map, {
            propsData: {
              resources: [mockResources[3]]
            }
          })
          const listeners = wrapper.vm.listenersByLayer[GEO_STYLE.Point.id]
          expect(listeners.length).toBe(3)
          expect(listeners).toContainEqual({
            type: 'mouseenter',
            func: wrapper.vm.setPointerCursor
          }, {
            type: 'mouseleave',
            func: wrapper.vm.resetCursor
          })
        })

        it('if the features of the layer are clickable to display popup', () => {
          const wrapper = shallowMount(Map, {
            propsData: {
              resources: [mockResources[2]],
              hasPopup: true
            }
          })
          const listeners = wrapper.vm.listenersByLayer[GEO_STYLE.Point.id]
          expect(listeners.length).toBe(3)
          expect(listeners).toContainEqual({
            type: 'mouseenter',
            func: wrapper.vm.setPointerCursor
          },
          {
            type: 'mouseleave',
            func: wrapper.vm.resetCursor
          })
        })

        it('if a popup can be displayed on feature hover', () => {
          const wrapper = shallowMount(Map, {
            propsData: {
              resources: [mockResources[4]],
              hasPopup: true
            }
          })
          const listeners = wrapper.vm.listenersByLayer[GEO_STYLE.Point.id]
          expect(listeners.length).toBe(3)
          expect(listeners).not.toContainEqual({
            type: 'mouseenter',
            func: wrapper.vm.setPointerCursor
          },
          {
            type: 'mouseleave',
            func: wrapper.vm.resetCursor
          })
        })

        it('if the features of the layer are editable', () => {
          const wrapper = shallowMount(Map, {
            propsData: {
              resources: [mockResources[0]]
            }
          })
          const listeners = wrapper.vm.listenersByLayer[GEO_STYLE.Point.id]
          expect(listeners.length).toBe(1)
        })
      })
    })

    describe('Draw events', () => {
      let wrapper, spyOnEmitEvent

      beforeAll(() => {
        wrapper = shallowMount(Map, {
          propsData: {
            singleEditMode: true,
            resources: mockResources
          }
        })
        spyOnEmitEvent = jest.spyOn(wrapper.vm, '$emit')
      })

      beforeEach(() => {
        spyOnEmitEvent.mockClear()
        wrapper.vm.mapDraw.delete.mockClear()
      })

      describe('On draw delete', () => {
        it('Emit a "remove-features" event with the specified features', () => {
          wrapper.vm.onDrawDelete({
            features: mockResources[0].features,
            type: 'draw.delete'
          })
          expect(spyOnEmitEvent).toHaveBeenCalledTimes(1)
          expect(spyOnEmitEvent).toHaveBeenCalledWith('remove-features', mockResources[0].features)
        })

        it('Do not emit a "remove-features" event if there are no feature', () => {
          wrapper.vm.onDrawDelete({
            features: [],
            type: 'draw.delete'
          })
          expect(spyOnEmitEvent).not.toHaveBeenCalled()
        })
      })

      describe('On draw mode change', () => {
        it('Emit an "update-features" event with the specified features in "simple_select" mode', () => {
          wrapper.vm.onDrawModeChange({
            mode: 'simple_select',
            type: 'draw.modechange'
          })
          expect(spyOnEmitEvent).toHaveBeenCalledTimes(1)
          expect(spyOnEmitEvent).toHaveBeenCalledWith('update-features', mockResources[0].features)
        })

        it('Do not emit an "update-features" if there is no feature', () => {
          wrapper.vm.mapDraw.getAll.mockImplementationOnce(() => ({
            features: []
          }))
          wrapper.vm.onDrawModeChange({
            mode: 'simple_select',
            type: 'draw.modechange'
          })
          expect(spyOnEmitEvent).not.toHaveBeenCalled()
        })

        it('Remove all the features except the last one when entering a drawing mode', () => {
          wrapper.vm.onDrawModeChange({
            mode: 'draw_polygon',
            type: 'draw.modechange'
          })
          expect(spyOnEmitEvent).not.toHaveBeenCalled()
          expect(wrapper.vm.mapDraw.delete).toHaveBeenCalledWith([
            mockFirstFeature.id
          ])
        })

        it('Do nothing if the current mode is not a simple select or a drawing one', () => {
          wrapper.vm.onDrawModeChange({
            mode: 'direct_select',
            type: 'draw.modechange'
          })
          expect(spyOnEmitEvent).not.toHaveBeenCalled()
          expect(wrapper.vm.mapDraw.delete).not.toHaveBeenCalled()
        })
      })

      describe('On draw update', () => {
        it('Emit an "update-features" event with the specified features when moving in simple select mode', () => {
          wrapper.vm.onDrawUpdate({
            features: mockResources[0].features,
            type: 'draw.update',
            action: 'move'
          })
          expect(spyOnEmitEvent).toHaveBeenCalledTimes(1)
          expect(spyOnEmitEvent).toHaveBeenCalledWith('update-features', mockResources[0].features)
        })

        it('Do not emit an "update-features" event if there are no feature', () => {
          wrapper.vm.onDrawUpdate({
            features: [],
            type: 'draw.update',
            action: 'move'
          })
          expect(spyOnEmitEvent).not.toHaveBeenCalled()
        })

        it('Do not emit an "update-features" event when the action is not a moving', () => {
          wrapper.vm.onDrawUpdate({
            features: [],
            type: 'draw.update',
            action: 'change_coordinates'
          })
          expect(spyOnEmitEvent).not.toHaveBeenCalled()
        })

        it('Do not emit an "update-features" when moving in direct mode', () => {
          wrapper.vm.mapDraw.getMode.mockImplementationOnce(() => 'direct_mode')
          wrapper.vm.onDrawUpdate({
            features: mockResources[0].features,
            type: 'draw.update',
            action: 'move'
          })
          expect(spyOnEmitEvent).not.toHaveBeenCalled()
        })
      })
    })

    describe('setFeatureEditableOnMouseDown', () => {
      let wrapper, setFeatureEditableFunction

      beforeAll(() => {
        wrapper = shallowMount(Map, {
          propsData: {
            resources: mockResources
          }
        })
        wrapper.vm.setFeatureEditableOnMouseDown('customLayerId')
        setFeatureEditableFunction = wrapper.vm.listenersByLayer.customLayerId[0].func
      })

      beforeEach(() => {
        wrapper.vm.mapDraw.set.mockClear()
      })

      it('Add the clicked feature to the mapbox draw source to make it editable', () => {
        setFeatureEditableFunction({
          features: [mockFirstFeature]
        })
        expect(wrapper.vm.mapDraw.set).toHaveBeenLastCalledWith({
          type: 'FeatureCollection',
          features: [mockFirstFeature]
        })
      })

      it('Do not make the selected feature editable if it has not got id', () => {
        const featureWithoutId = mockDeepCloneObject(mockFirstFeature)
        delete featureWithoutId.id
        setFeatureEditableFunction({
          features: [featureWithoutId]
        })
        expect(wrapper.vm.mapDraw.set).not.toHaveBeenCalled()
      })

      it('Do not make the selected feature editable if it is already editable', () => {
        setFeatureEditableFunction({
          features: [mockSecondFeature]
        })
        expect(wrapper.vm.mapDraw.set).not.toHaveBeenCalled()
      })

      it('Do not make the selected feature editable if is not simple_select', () => {
        wrapper.vm.mapDraw.getMode.mockImplementationOnce(() => 'direct_mode')
        setFeatureEditableFunction({
          features: [mockFirstFeature]
        })
        expect(wrapper.vm.mapDraw.set).not.toHaveBeenCalled()
      })
    })
  })
})
