/* eslint-disable @typescript-eslint/camelcase */
import { COLUMN_TYPE } from '@locokit/lck-glossary'

import MapboxDraw from '@mapbox/mapbox-gl-draw'
import { shallowMount } from '@vue/test-utils'
import GeometryType from 'ol/geom/GeometryType'

import {
  GEO_STYLE,
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
          coordinates: [10, 20],
        },
        id: 'f1',
        properties: {
          title: 'First feature',
          rowId: 'row1',
          columnId: 'column1',
          content: JSON.stringify([
            {
              field: {
                label: 'First field',
                value: 10,
              },
            },
          ]),
        },
      },
      {
        type: 'Feature',
        geometry: {
          type: GeometryType.POINT,
          coordinates: [15, 30],
        },
        id: 'f2',
        properties: {},
      },
      {
        type: 'Feature',
        geometry: {
          type: GeometryType.POINT,
          coordinates: [10, 20],
        },
        id: 'f3',
        properties: {
          title: 'Third feature',
          rowId: 'row2',
          columnId: 'column1',
          content: JSON.stringify([
            {
              field: {
                label: 'First field',
                value: 100,
              },
            },
          ]),
        },
      },
    ],
    layers: [GEO_STYLE.Point],
    popupMode: null,
    editableGeometryTypes: new Set([COLUMN_TYPE.GEOMETRY_POINT]),
    selectable: false,
  },
  {
    id: 'resource_2',
    type: 'FeatureCollection',
    features: [],
    layers: [GEO_STYLE.Point],
    popupMode: null,
    editableGeometryTypes: new Set([COLUMN_TYPE.GEOMETRY_POLYGON]),
    selectable: false,
  },
  {
    id: 'resource_3',
    type: 'FeatureCollection',
    features: [],
    layers: [GEO_STYLE.Point],
    popupMode: 'click',
    editableGeometryTypes: new Set(),
    selectable: false,
  },
  {
    id: 'resource_4',
    type: 'FeatureCollection',
    features: [],
    layers: [GEO_STYLE.Point],
    popupMode: 'click',
    editableGeometryTypes: new Set(),
    selectable: true,
  },
  {
    id: 'resource_5',
    type: 'FeatureCollection',
    features: [],
    layers: [GEO_STYLE.Point],
    popupMode: 'hover',
    editableGeometryTypes: new Set(),
    selectable: false,
  },
]

const mockFirstFeature = mockResources[0].features[0]
const mockSecondFeature = mockResources[0].features[1]
const mockThirdFeature = mockResources[0].features[2]
const mockOrphanFeature = {
  type: 'Feature',
  geometry: {
    type: GeometryType.POINT,
    coordinates: [10, 20],
  },
  id: 'f4',
  properties: {
    title: 'Orphan feature',
    rowId: 'row1',
    columnId: 'column1',
    content: JSON.stringify([
      {
        field: {
          label: 'First field',
          value: 1200,
        },
      },
    ]),
  },
}
// Mock external libraries

class ResizeObserver {
  observe () {
    // do nothing
  }

  unobserve () {
    // do nothing
  }
}

window.ResizeObserver = ResizeObserver

jest.mock('vue-i18n')
jest.mock('mapbox-gl', () => ({
  Map: jest.fn(() => ({
    addControl: jest.fn(),
    dragRotate: {
      disable: jest.fn(),
    },
    touchZoomRotate: {
      disableRotation: jest.fn(),
    },
    on: jest.fn((event, func) => {
      if (event === 'load') func()
    }),
    getLayer: jest.fn(),
    off: jest.fn(),
    resize: jest.fn(),
    removeControl: jest.fn(),
    addSource: jest.fn(),
    addLayer: jest.fn(),
    removeLayer: jest.fn(),
    setPaintProperty: jest.fn(),
    getSource: jest.fn(() => ({
      setData: jest.fn(),
    })),
    removeSource: jest.fn(),
    fitBounds: jest.fn(),
    getCanvas: jest.fn(),
    setFeatureState: jest.fn(),
    setStyle: jest.fn(),
    setCenter: jest.fn(),
    setZoom: jest.fn(),
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
      querySelectorAll: jest.fn(() => []),
    })),
  })),
}))

jest.mock('@mapbox/mapbox-gl-draw', () =>
  jest.fn(() => ({
    getMode: jest.fn(() => 'simple_select'),
    getAll: jest.fn(() => ({
      features: [mockFirstFeature, mockSecondFeature],
    })),
    getSelected: jest.fn(() => ({
      features: [mockFirstFeature],
    })),
    delete: jest.fn(),
    set: jest.fn(),
    getSelectedIds: jest.fn(() => [mockSecondFeature.id]),
    MapboxDraw: jest.fn(),
    deleteAll: jest.fn(),
    add: jest.fn(),
  })),
)

const defaultWrapperParams = {
  mocks: {
    t: key => key,
    $t: key => key,
    $toast: {
      add: jest.fn(),
    },
  },
}

// Mock internal functions
jest.mock('@/services/lck-utils/map/computeGeo', () => ({
  computeBoundingBox: (resources) => ({
    sw: resources[0]?.features[0]?.geometry.coordinates[0],
    ne: resources[0]?.features[0]?.geometry.coordinates[1],
    isEmpty: () => resources[0]?.features[0]?.geometry.coordinates[0] == null,
  }),
}))

// Tests

describe('Map component', () => {
  describe('Map initialization', () => {
    it('Pass some default bounds in dialog mode so we do not need to fit bounds later', () => {
      const wrapper = shallowMount(Map, {
        propsData: {
          resources: mockResources,
          mode: 'Dialog',
        },
        ...defaultWrapperParams,
      })
      expect(wrapper.vm.map.fitBounds).not.toHaveBeenCalled()
    })
    it('Do not pass some default bounds in block mode so we need to fit bounds later', () => {
      const wrapper = shallowMount(Map, {
        propsData: {
          resources: mockResources,
          mode: 'Block',
        },
        ...defaultWrapperParams,
      })
      expect(wrapper.vm.map.fitBounds).toHaveBeenCalled()
    })
  })
  describe('Methods', () => {
    describe('initDrawControls', () => {
      it('Initialize the right edition controls of the map in the single edit mode', () => {
        // Initialize the component
        const wrapper = shallowMount(Map, {
          propsData: {
            singleEditMode: true,
            resources: mockResources,
          },
          ...defaultWrapperParams,
        })
        // Choose the editable geometry types depending of the map mockResources
        // expect(wrapper.vm.editableGeometryTypes.size)
        expect(wrapper.vm.editableGeometryTypes.has(COLUMN_TYPE.GEOMETRY_POINT)).toBe(true)
        expect(wrapper.vm.editableGeometryTypes.has(COLUMN_TYPE.GEOMETRY_POLYGON)).toBe(true)
        // Add the right controls
        expect(MapboxDraw).toHaveBeenCalledWith(expect.objectContaining({
          displayControlsDefault: false,
          controls: {
            point: true,
            line_string: false,
            polygon: true,
            trash: true,
            combine_features: false,
          },
        }))
        expect(wrapper.vm.dataManageControl.visible).toBe(true)
        expect(wrapper.vm.map.addControl).toHaveBeenCalledWith(wrapper.vm.dataManageControl.control)
      })

      it('Initialize the editable geometry types of the map in the multiple edit mode', () => {
        // Initialize the component
        const wrapper = shallowMount(Map, {
          propsData: {
            singleEditMode: false,
            resources: mockResources,
          },
          ...defaultWrapperParams,
        })
        // No control to add a new feature must be displayed
        expect(wrapper.vm.editableGeometryTypes.size).toBe(2)
        // Add the right controls (trash button)
        expect(MapboxDraw).toHaveBeenLastCalledWith(expect.objectContaining({
          displayControlsDefault: false,
          controls: {
            trash: true,
          },
        }))
        expect(wrapper.vm.dataManageControl.visible).toBe(true)
        expect(wrapper.vm.map.addControl).toHaveBeenCalledWith(wrapper.vm.dataManageControl.control)
      })

      it('Reset the controls if there is no more editable geometry types', async () => {
        // Initialize the component
        const wrapper = shallowMount(Map, {
          propsData: {
            singleEditMode: true,
            resources: mockResources,
          },
          ...defaultWrapperParams,
        })
        // Initialize the draw controls
        wrapper.vm.map.addControl.mockClear()
        wrapper.vm.map.removeControl.mockClear()
        // Update the resources: mockResources
        await wrapper.setProps({
          resources: [],
        })
        // No controls must be displayed
        expect(wrapper.vm.editableGeometryTypes.size).toBe(0)
        expect(wrapper.vm.map.addControl).not.toHaveBeenCalled()
        expect(wrapper.vm.dataManageControl.visible).toBe(false)
        // Remove the old controls
        expect(wrapper.vm.map.removeControl).toHaveBeenNthCalledWith(1, wrapper.vm.mapDraw)
        expect(wrapper.vm.map.removeControl).toHaveBeenNthCalledWith(2, wrapper.vm.dataManageControl.control)
      })

      it('Reset the controls if the editable geometry types have been changed', async () => {
        // Initialize the component
        const wrapper = shallowMount(Map, {
          propsData: {
            singleEditMode: true,
            resources: mockResources,
          },
          ...defaultWrapperParams,
        })
        wrapper.vm.map.removeControl.mockClear()
        wrapper.vm.map.addControl.mockClear()
        // Update the mockResources
        await wrapper.setProps({
          resources: [
            mockResources[0],
          ],
        })
        // Choose the editable geometry types depending of the new mockResources
        expect(wrapper.vm.editableGeometryTypes.size).toBe(1)
        expect(wrapper.vm.editableGeometryTypes.has(COLUMN_TYPE.GEOMETRY_POINT)).toBe(true)
        // Add the new controls
        expect(wrapper.vm.map.removeControl).toHaveBeenCalledTimes(1)
        expect(wrapper.vm.map.addControl).toHaveBeenCalledTimes(1)
        expect(MapboxDraw).toHaveBeenLastCalledWith(expect.objectContaining({
          displayControlsDefault: false,
          controls: {
            point: true,
            line_string: false,
            polygon: false,
            trash: true,
            combine_features: false,
          },
        }))
      })
    })

    describe('selectFeature', () => {
      const resourceId = mockResources[0].id

      it('Select a feature in a source for the first time', () => {
        // Initialize the component
        const wrapper = shallowMount(Map, {
          propsData: {
            resources: mockResources,
          },
          ...defaultWrapperParams,
        })
        // Select a feature
        wrapper.vm.selectFeature(resourceId, mockFirstFeature.id)
        // Save this information
        expect(wrapper.vm.selectedFeatureBySource).toStrictEqual({
          [resourceId]: mockFirstFeature.id,
        })
        // Customize it
        expect(wrapper.vm.map.setFeatureState).toHaveBeenNthCalledWith(1, {
          source: resourceId,
          id: mockFirstFeature.id,
        }, {
          selectable: true,
        })
      })

      it('Select a feature with a null id in a source', () => {
        // Initialize the component
        const wrapper = shallowMount(Map, {
          propsData: {
            resources: mockResources,
          },
          ...defaultWrapperParams,
        })
        // Select a feature
        wrapper.vm.selectFeature(resourceId, null)
        // Save this information
        expect(wrapper.vm.selectedFeatureBySource).toStrictEqual({
          [resourceId]: null,
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
              [resourceId]: {
                feature: mockFirstFeature,
                centerToFeature: true,
                zoomLevel: 10,
              },
            },
          },
          ...defaultWrapperParams,
        })
        // Save this information
        expect(wrapper.vm.selectedFeatureBySource).toStrictEqual({
          [resourceId]: mockFirstFeature.id,
        })
        // Select the new feature
        expect(wrapper.vm.map.setFeatureState).toHaveBeenCalledWith({
          source: resourceId,
          id: mockFirstFeature.id,
        }, {
          selectable: true,
        })
        // Fit to the bounds of the selected feature with the right zoom level
        expect(wrapper.vm.map.fitBounds).toHaveBeenLastCalledWith(
          expect.objectContaining({
            sw: mockFirstFeature.geometry.coordinates[0],
            ne: mockFirstFeature.geometry.coordinates[1],
          }),
          expect.objectContaining({
            zoom: 10,
          }),
        )
        wrapper.vm.map.setFeatureState.mockClear()
        wrapper.vm.map.fitBounds.mockClear()
        // Select the same feature
        await wrapper.setProps({
          defaultSelectedFeatureBySource: {
            [resourceId]: {
              feature: mockFirstFeature,
              centerToFeature: true,
            },
          },
        })
        expect(wrapper.vm.map.setFeatureState).not.toHaveBeenCalled()
        wrapper.vm.map.setFeatureState.mockClear()
        // Select another feature
        await wrapper.setProps({
          defaultSelectedFeatureBySource: {
            [resourceId]: {
              feature: mockSecondFeature,
              centerToFeature: false,
            },
          },
        })
        // Save this information
        expect(wrapper.vm.selectedFeatureBySource).toStrictEqual({
          [resourceId]: mockSecondFeature.id,
        })
        expect(wrapper.vm.map.setFeatureState).toHaveBeenCalledTimes(2)
        // Unselect the previous feature
        expect(wrapper.vm.map.setFeatureState).toHaveBeenNthCalledWith(1, {
          source: resourceId,
          id: mockFirstFeature.id,
        }, {
          selectable: false,
        })
        // Select the new feature
        expect(wrapper.vm.map.setFeatureState).toHaveBeenNthCalledWith(2, {
          source: resourceId,
          id: mockSecondFeature.id,
        }, {
          selectable: true,
        })
        // Don't fit to the bounds of the selected feature (as specified)
        expect(wrapper.vm.map.fitBounds).not.toHaveBeenCalled()
        wrapper.vm.map.setFeatureState.mockClear()
        // Unselect the feature
        await wrapper.setProps({
          defaultSelectedFeatureBySource: {
            [resourceId]: null,
          },
        })
        // Unselect the previous feature
        expect(wrapper.vm.map.setFeatureState).toHaveBeenCalledTimes(1)
        expect(wrapper.vm.map.setFeatureState).toHaveBeenCalledWith({
          source: resourceId,
          id: mockSecondFeature.id,
        }, {
          selectable: false,
        })
        // Don't fit to the bounds of a feature
        expect(wrapper.vm.map.fitBounds).not.toHaveBeenCalled()
      })

      it('Select another feature in one source', () => {
        // Initialize the component with a selected feature
        const wrapper = shallowMount(Map, {
          propsData: {
            resources: mockResources,
            defaultSelectedFeatureBySource: {
              [resourceId]: {
                feature: mockFirstFeature,
              },
            },
          },
          ...defaultWrapperParams,
        })
        // Select another feature in the same source
        wrapper.vm.selectFeature(resourceId, mockSecondFeature.id)
        // Save this information
        expect(wrapper.vm.selectedFeatureBySource).toStrictEqual({
          [resourceId]: mockSecondFeature.id,
        })
        // Unselect the previous one
        expect(wrapper.vm.map.setFeatureState).toHaveBeenNthCalledWith(2, {
          source: resourceId,
          id: mockFirstFeature.id,
        }, {
          selectable: false,
        })
        // Select the new one
        expect(wrapper.vm.map.setFeatureState).toHaveBeenNthCalledWith(3, {
          source: resourceId,
          id: mockSecondFeature.id,
        }, {
          selectable: true,
        })
      })
      describe('selectFeatureOnClick', () => {
        let wrapper, selectFeatureOnClickFunction, spyOnEmitEvent

        beforeAll(() => {
          wrapper = shallowMount(Map, {
            propsData: {
              resources: mockResources,
            },
            ...defaultWrapperParams,
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
            features: [mockFirstFeature],
          })
          expect(spyOnEmitEvent).toHaveBeenCalledTimes(1)
          expect(spyOnEmitEvent).toHaveBeenCalledWith('select-feature', mockFirstFeature)
        })

        it('Do not emit an event if the selected feature has not got id', () => {
          const featureWithoutId = mockDeepCloneObject(mockFirstFeature)
          delete featureWithoutId.id
          selectFeatureOnClickFunction({
            features: [featureWithoutId],
          })
          expect(spyOnEmitEvent).not.toHaveBeenCalled()
        })

        it('Do not emit an event if the selected feature is already selected', () => {
          selectFeatureOnClickFunction({
            features: [mockFirstFeature],
          })
          selectFeatureOnClickFunction({
            features: [mockFirstFeature],
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
            mode: 'Block',
          },
          ...defaultWrapperParams,
        })
        wrapper.vm.addPopupOnFeature('customLayerId', 'hover', 'pageDetailId')
        addPopupOnFeatureFunction = wrapper.vm.listenersByLayer.customLayerId[0].func
      })

      it('Add the popup to the map only if it is not displayed yet', () => {
        wrapper.vm.popup.component.addTo.mockClear()
        wrapper.vm.popup.component.isOpen.mockImplementationOnce(() => false)
        addPopupOnFeatureFunction({
          features: [mockFirstFeature],
          type: 'mousemove',
        })
        expect(wrapper.vm.popup.component.addTo).toHaveBeenCalledWith(wrapper.vm.map)
        expect(wrapper.vm.popup.featuresIds).toBe('f1')
      })

      it('Do not add the popup to the map if it is already displayed', () => {
        wrapper.vm.popup.component.addTo.mockClear()
        wrapper.vm.popup.component.isOpen.mockImplementationOnce(() => true)
        addPopupOnFeatureFunction({
          features: [mockFirstFeature],
        })
        expect(wrapper.vm.popup.component.addTo).not.toHaveBeenCalled()
      })

      it('Do not move the popup if there is no features', () => {
        wrapper.vm.popup.component.setLngLat.mockClear()
        addPopupOnFeatureFunction({
          features: [],
        })
        expect(wrapper.vm.popup.component.setLngLat).not.toHaveBeenCalled()
      })

      it('Only update the popup content if the selected features are different', () => {
        wrapper.vm.popup.component.setHTML.mockClear()
        // Display the popup the first time on one feature
        addPopupOnFeatureFunction({
          features: [mockFirstFeature],
          type: 'mousemove',
        })
        expect(wrapper.vm.popup.component.setHTML).toHaveBeenCalledTimes(1)
        wrapper.vm.popup.component.setHTML.mockClear()
        // Display the popup the second time on the same feature
        addPopupOnFeatureFunction({
          features: [mockFirstFeature],
          type: 'mousemove',
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
            mode: 'Block',
          },
          ...defaultWrapperParams,
        })
        wrapper.vm.addPopupOnFeature('customLayerId', 'hover', 'pageDetailId')
        addPopupOnFeatureFunction = wrapper.vm.listenersByLayer.customLayerId.find(listener =>
          listener.type === 'touchstart',
        ).func
        removePopupOnFeatureFunction = wrapper.vm.listenersByLayer.customLayerId.find(listener =>
          listener.type === 'mouseleave',
        ).func
      })

      it('Remove the popup from the map', () => {
        addPopupOnFeatureFunction({
          features: [mockFirstFeature],
          type: 'mousemove',
        })
        wrapper.vm.popup.component.remove.mockClear()
        removePopupOnFeatureFunction({
          features: [mockResources[4]],
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
          const wrapper = shallowMount(Map, defaultWrapperParams)
          wrapper.vm.saveListenerByLayer('click', 'myFirstLayerId', myFunction)
          expect(wrapper.vm.listenersByLayer).toStrictEqual({
            myFirstLayerId: [
              {
                type: 'click',
                func: myFunction,
              },
            ],
          })
        })

        it('Save two listeners for the same layer', () => {
          // Initialize the component
          const wrapper = shallowMount(Map, defaultWrapperParams)
          wrapper.vm.saveListenerByLayer('click', 'myFirstLayerId', myFunction)
          wrapper.vm.saveListenerByLayer('mousedown', 'myFirstLayerId', myFunction)
          expect(wrapper.vm.listenersByLayer).toStrictEqual({
            myFirstLayerId: [
              {
                type: 'click',
                func: myFunction,
              },
              {
                type: 'mousedown',
                func: myFunction,
              },
            ],
          })
        })
      })

      describe('removeListenerByLayer', () => {
        it('Remove all listeners added for a specific layer', () => {
          // Initialize the component
          const wrapper = shallowMount(Map, defaultWrapperParams)
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
                func: myFunction,
              },
            ],
          })
          // Check listeners are removed from the map
          expect(wrapper.vm.map.off).toHaveBeenCalledTimes(2)
          expect(wrapper.vm.map.off).toHaveBeenNthCalledWith(1, 'click', 'myFirstLayerId', myFunction)
          expect(wrapper.vm.map.off).toHaveBeenNthCalledWith(2, 'mousedown', 'myFirstLayerId', myFunction)
        })

        it('Do nothing if the specified layer is unknown', () => {
          // Initialize the component
          const wrapper = shallowMount(Map, defaultWrapperParams)
          // Add some listeners
          wrapper.vm.saveListenerByLayer('click', 'myFirstLayerId', myFunction)
          // Remove all listeners related to the first layer
          wrapper.vm.removeListenerByLayer('myUnknownLayerId')
          // Check data is updated
          expect(wrapper.vm.listenersByLayer).toStrictEqual({
            myFirstLayerId: [
              {
                type: 'click',
                func: myFunction,
              },
            ],
          })
          expect(wrapper.vm.map.off).not.toHaveBeenCalled()
        })
      })
      describe('check default listeners', () => {
        it('if the features of the layer are selectable', () => {
          const wrapper = shallowMount(Map, {
            propsData: {
              resources: [mockResources[3]],
            },
            ...defaultWrapperParams,
          })
          const listeners = wrapper.vm.listenersByLayer[GEO_STYLE.Point.id]
          expect(listeners.length).toBe(3)
          expect(listeners).toContainEqual({
            type: 'mouseenter',
            func: wrapper.vm.setPointerCursor,
          }, {
            type: 'mouseleave',
            func: wrapper.vm.resetCursor,
          })
        })

        it('if the features of the layer are clickable to display popup', () => {
          const wrapper = shallowMount(Map, {
            propsData: {
              resources: [mockResources[2]],
              hasPopup: true,
            },
            ...defaultWrapperParams,
          })
          const listeners = wrapper.vm.listenersByLayer[GEO_STYLE.Point.id]
          expect(listeners.length).toBe(3)
          expect(listeners).toContainEqual({
            type: 'mouseenter',
            func: wrapper.vm.setPointerCursor,
          },
          {
            type: 'mouseleave',
            func: wrapper.vm.resetCursor,
          })
        })

        it('if a popup can be displayed on feature hover', () => {
          const wrapper = shallowMount(Map, {
            propsData: {
              resources: [mockResources[4]],
              hasPopup: true,
            },
            ...defaultWrapperParams,
          })
          const listeners = wrapper.vm.listenersByLayer[GEO_STYLE.Point.id]
          expect(listeners.length).toBe(3)
          expect(listeners).not.toContainEqual({
            type: 'mouseenter',
            func: wrapper.vm.setPointerCursor,
          },
          {
            type: 'mouseleave',
            func: wrapper.vm.resetCursor,
          })
        })

        it('if the features of the layer are editable', () => {
          const wrapper = shallowMount(Map, {
            propsData: {
              resources: [mockResources[0]],
            },
            ...defaultWrapperParams,
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
            resources: mockResources,
          },
          ...defaultWrapperParams,
        })
        spyOnEmitEvent = jest.spyOn(wrapper.vm, '$emit')
      })

      beforeEach(() => {
        spyOnEmitEvent.mockClear()
        wrapper.vm.mapDraw.delete.mockClear()
      })

      describe('On remove features', () => {
        it('Emit a "remove-features" event with the selected feature', () => {
          wrapper.vm.removeEditingFeatures()
          expect(spyOnEmitEvent).toHaveBeenCalledTimes(1)
          expect(spyOnEmitEvent).toHaveBeenCalledWith('remove-features', [mockFirstFeature])
        })

        it('Emit a "remove-features" event with the selected feature if there is no selected feature but only one editable feature', () => {
          wrapper.vm.mapDraw.getSelected.mockImplementationOnce(() => ({
            features: [],
          }))
          wrapper.vm.mapDraw.getAll.mockImplementationOnce(() => ({
            features: [mockFirstFeature],
          }))
          wrapper.vm.removeEditingFeatures()
          expect(spyOnEmitEvent).toHaveBeenCalledTimes(1)
          expect(spyOnEmitEvent).toHaveBeenCalledWith('remove-features', [mockFirstFeature])
        })

        it('Do not emit a "remove-features" event if there is no selected feature and not one editable feature', () => {
          wrapper.vm.mapDraw.getSelected.mockImplementationOnce(() => ({
            features: [],
          }))
          wrapper.vm.removeEditingFeatures()
          expect(spyOnEmitEvent).not.toHaveBeenCalled()
        })

        it('Do not emit a "remove-features" event if there are more than two selected features', () => {
          wrapper.vm.mapDraw.getSelected.mockImplementationOnce(() => ({
            features: [mockFirstFeature, mockSecondFeature],
          }))
          wrapper.vm.removeEditingFeatures()
          expect(spyOnEmitEvent).not.toHaveBeenCalled()
        })
      })

      describe('On update update', () => {
        it('Emit an "update-features" event with the selected feature', () => {
          wrapper.vm.saveEditingFeatures()
          expect(spyOnEmitEvent).toHaveBeenCalledTimes(1)
          expect(spyOnEmitEvent).toHaveBeenCalledWith('update-features', [mockResources[0].features[0]])
        })

        it('Emit an "update-features" event with the selected feature if there is no selected feature but only one editable feature', () => {
          wrapper.vm.mapDraw.getSelected.mockImplementationOnce(() => ({
            features: [],
          }))
          wrapper.vm.mapDraw.getAll.mockImplementationOnce(() => ({
            features: [mockFirstFeature],
          }))
          wrapper.vm.saveEditingFeatures()
          expect(spyOnEmitEvent).toHaveBeenCalledTimes(1)
          expect(spyOnEmitEvent).toHaveBeenCalledWith('update-features', [mockResources[0].features[0]])
        })

        it('Do not emit an "update-features" event if there is no selected feature', () => {
          wrapper.vm.mapDraw.getSelected.mockImplementationOnce(() => ({
            features: [],
          }))
          wrapper.vm.saveEditingFeatures()
          expect(spyOnEmitEvent).not.toHaveBeenCalled()
        })

        it('Do not emit an "update-features" event if there are more than two selected features', () => {
          wrapper.vm.mapDraw.getSelected.mockImplementationOnce(() => ({
            features: [mockFirstFeature, mockSecondFeature],
          }))
          wrapper.vm.saveEditingFeatures()
          expect(spyOnEmitEvent).not.toHaveBeenCalled()
        })
      })
    })

    describe('setFeatureEditableOnMouseDown', () => {
      let wrapper, setFeatureEditableFunction

      beforeAll(() => {
        wrapper = shallowMount(Map, {
          propsData: {
            resources: mockResources,
          },
          ...defaultWrapperParams,
        })
        wrapper.vm.setFeatureEditableOnMouseDown('resource_1', 'customLayerId')
        setFeatureEditableFunction = wrapper.vm.listenersByLayer.customLayerId[0].func
      })

      beforeEach(() => {
        wrapper.vm.mapDraw.add.mockClear()
      })

      it('Add the clicked feature to the mapbox draw source to make it editable', () => {
        setFeatureEditableFunction({
          features: [mockThirdFeature],
        })
        expect(wrapper.vm.mapDraw.add).toHaveBeenLastCalledWith(mockThirdFeature)
      })

      it('Do not make the selected feature editable if it has not got id', () => {
        const featureWithoutId = mockDeepCloneObject(mockFirstFeature)
        delete featureWithoutId.id
        setFeatureEditableFunction({
          features: [featureWithoutId],
        })
        expect(wrapper.vm.mapDraw.add).not.toHaveBeenCalled()
      })

      it('Do not make the selected feature editable if it does not belong to a resource', () => {
        setFeatureEditableFunction({
          features: [mockOrphanFeature],
        })
        expect(wrapper.vm.mapDraw.add).not.toHaveBeenCalled()
      })

      it('Do not make the selected feature editable if it is already editable', () => {
        setFeatureEditableFunction({
          features: [mockSecondFeature],
        })
        expect(wrapper.vm.mapDraw.add).not.toHaveBeenCalled()
      })

      it('Do not make the selected feature editable if is not simple_select', () => {
        wrapper.vm.mapDraw.getMode.mockImplementationOnce(() => 'direct_mode')
        setFeatureEditableFunction({
          features: [mockFirstFeature],
        })
        expect(wrapper.vm.mapDraw.add).not.toHaveBeenCalled()
      })
    })
  })
})
