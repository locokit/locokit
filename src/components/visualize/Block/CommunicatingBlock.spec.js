/* eslint-disable @typescript-eslint/camelcase */

import { shallowMount } from '@vue/test-utils'

import { BLOCK_TYPE, COLUMN_TYPE } from '@locokit/lck-glossary'

import eventHub from '@/services/lck-event-hub/eventHub'

import CommunicatingBlock from './CommunicatingBlock'
import MapSet from '@/components/visualize/MapSet/MapSet.vue'
import FormRecord from '@/components/visualize/FormRecord/FormRecord.vue'
import DataRecord from '@/components/visualize/DataRecord/DataRecord.vue'
import Paragraph from '@/components/visualize/Paragraph/Paragraph.vue'

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
  LngLatBounds: jest.fn(() => ({
    isEmpty: jest.fn(),
    extend: jest.fn(),
  })),
}))
// Mock internal functions
jest.mock('@/services/lck-utils/map/computeGeo', () => ({
  computeBoundingBox: () => ({
    isEmpty: () => true,
  }),
}))
// jest.mock('@/components/ui/ColumnType/Geometry/Map.vue')

// Mock variables
const mockMapSetBlock = {
  id: '0001',
  createdAt: '2020-11-02T16:11:03.109Z',
  updatedAt: '2020-11-02T16:11:03.109Z',
  settings: {
    sources: [
      {
        id: 'table_view_1',
        caughtEvents: [
          'form-record-update-field',
          'form-record-submit',
        ],
        triggerEvents: [
          {
            name: 'map-select-row',
            type: 'selectRow',
          },
          {
            name: 'map-select-row-field',
            type: 'selectField',
            field: 'string_1_column',
          },
          {
            name: 'unknown event',
            type: 'undefinedType',
          },
        ],
      },
      {
        id: 'table_view_1',
      },
    ],
    caughtEvents: {
      'form-record-submit': [
        {
          type: 'reset',
        },
      ],
      'form-record-update-field': [
        {
          type: 'select',
          targetField: 'geo_column',
        },
        {
          type: 'select',
        },
      ],
    },
  },
  title: 'My map block',
  type: BLOCK_TYPE.MAP_SET,
  position: 1,
  container_id: '11',
}

const mockFormRecordBlock = {
  id: '0002',
  createdAt: '2020-11-02T16:11:03.109Z',
  updatedAt: '2020-11-02T16:11:03.109Z',
  settings: {
    id: 'table_view_2',
    caughtEvents: {
      'map-select-row': [
        {
          type: 'select',
          targetField: 'rbt_column',
        },
      ],
      'map-select-row-field': [
        {
          type: 'select',
          targetField: 'string_2_column',
        },
      ],
    },
    triggerEvents: [
      {
        name: 'form-record-update-field',
        type: 'update',
        field: 'rbt_column',
      },
      {
        name: 'form-record-submit',
        type: 'submit',
      },
      {
        name: 'form-record-unknown-field',
        type: 'update',
        field: 'unknown_column',
      },
    ],
  },
  title: 'My map block',
  type: BLOCK_TYPE.FORM_RECORD,
  position: 2,
  container_id: '11',
}

const mockDataRecordBlock = {
  id: '0003',
  createdAt: '2020-11-02T16:11:03.109Z',
  updatedAt: '2020-11-02T16:11:03.109Z',
  settings: {
    id: 'table_view_2',
    caughtEvents: {
      'map-select-row': [
        {
          type: 'select',
          targetField: 'rbt_column',
        },
      ],
      'map-select-row-field': [
        {
          type: 'select',
          targetField: 'string_2_column',
        },
      ],
    },
    triggerEvents: [
      {
        name: 'form-record-update-field',
        type: 'update',
        field: 'rbt_column',
        raiseOnLoad: true,
      },
    ],
  },
  title: 'My map block',
  type: BLOCK_TYPE.FORM_RECORD,
  position: 3,
  container_id: '11',
}

const mockDefinitions = {
  table_view_1: {
    id: 'table_view_1',
    columns: [
      {
        text: 'Name',
        id: 'string_1_column',
        settings: {},
        table_id: 'table_1',
        column_type_id: COLUMN_TYPE.STRING,
        editable: false,
        position: 1,
        transmitted: false,
        default: '',
        displayed: true,
        required: false,
        sort: 'DESC',
        table_column_id: '',
        table_view_id: 'table_view_1',
        style: {},
      },
      {
        text: 'Point',
        id: 'geo_column',
        settings: {},
        table_id: 'table_1',
        column_type_id: COLUMN_TYPE.GEOMETRY_POLYGON,
        editable: false,
        position: 2,
        transmitted: false,
        default: '',
        displayed: true,
        required: false,
        sort: 'DESC',
        table_column_id: '',
        table_view_id: 'table_view_1',
        style: {},
      },
    ],
  },
  table_view_2: {
    id: 'table_view_2',
    columns: [
      {
        text: 'Description',
        id: 'string_2_column',
        settings: {},
        table_id: 'table_2',
        column_type_id: COLUMN_TYPE.STRING,
        editable: false,
        position: 1,
        transmitted: false,
        default: '',
        displayed: true,
        required: false,
        sort: 'DESC',
        table_column_id: '',
        table_view_id: 'table_view_2',
        style: {},
      },
      {
        text: 'Relation between tables',
        id: 'rbt_column',
        settings: {
          table_id: 'table_2',
        },
        table_id: 'table_2',
        column_type_id: COLUMN_TYPE.RELATION_BETWEEN_TABLES,
        editable: false,
        position: 3,
        transmitted: false,
        default: '',
        displayed: true,
        required: false,
        sort: 'DESC',
        table_column_id: '',
        table_view_id: 'table_view_2',
        style: {},
      },
    ],
  },
}

const mockTable1GeoContent = {
  table_view_1: [
    {
      id: 't1r1',
      text: 'Table 1 - Row 1',
      table_id: 't1',
      data: {
        string_1_column: 'My first row',
        geo_column: 'SRID=4326;POLYGON((1.4 45.75,2 45.6,1.9 45.3,1.4 45.75))',
      },
    },
    {
      id: 't1r2',
      text: 'Table 1 - Row 2',
      table_id: 't1',
      data: {
        string_1_column: 'My second row',
        geo_column: 'SRID=4326;POLYGON((1.2 45.75,2 45.6,1.9 45.3,1.4 45.75))',
      },
    },
  ],
}

const mockTable2Content = {
  data: [
    {
      id: 't2r1',
      text: 'Table 2 - Row 1',
      table_id: 't2',
      data: {
        string_2_column: 'My table 2 row 1',
        rbt_column: {
          reference: 't1r2',
          value: 'Table 1 - Row 2',
        },
      },
    },
  ],
}

describe('Communicating block', () => {
  describe('Mixin', () => {
    const spyOnEventHub = jest.spyOn(eventHub, '$on')

    beforeEach(() => {
      spyOnEventHub.mockClear()
    })
    describe('Check that the event caught events are well initialized', () => {
      it('With several caught events', () => {
        const spyOnEventHub = jest.spyOn(eventHub, '$on')
        const wrapper = new CommunicatingBlock({
          propsData: {
            settings: {
              caughtEvents: {
                trigger1: [
                  {
                    type: 'select',
                    targetField: 'firstField',
                  },
                ],
                trigger2: [
                  {
                    type: 'select',
                    targetField: 'firstField',
                  },
                ],
              },
            },
          },
        })
        expect(wrapper.$data.eventListeners.length).toBe(2)
        const firstListener = wrapper.$data.eventListeners[0]
        const secondListener = wrapper.$data.eventListeners[1]
        // Check that the listeners are saved in the component data
        expect(firstListener.id).toBe('trigger1')
        expect(secondListener.id).toBe('trigger2')
        // Check that the component will listen these events
        expect(spyOnEventHub).toHaveBeenCalledTimes(2)
        expect(spyOnEventHub).toHaveBeenNthCalledWith(1, 'trigger1', firstListener.relatedFunction)
        expect(spyOnEventHub).toHaveBeenNthCalledWith(2, 'trigger2', secondListener.relatedFunction)
      })
      it('With no catch event', () => {
        const wrapper = new CommunicatingBlock({
          propsData: {
            settings: {
              caughtEvents: {},
            },
          },
        })
        // Check that the listeners are saved in the component data
        expect(wrapper.$data.eventListeners.length).toBe(0)
        // Check that the component will listen these events
        expect(spyOnEventHub).not.toHaveBeenCalled()
      })
      it('With no catch event setting', () => {
        const wrapper = new CommunicatingBlock({
          propsData: {
            settings: {},
          },
        })
        // Check that the listeners are saved in the component data
        expect(wrapper.$data.eventListeners.length).toBe(0)
        // Check that the component will listen these events
        expect(spyOnEventHub).not.toHaveBeenCalled()
      })
    })
    describe('Check that the event caught events are well destroyed when the component is destroyed', () => {
      it('With several caught events', () => {
        const spyOnEventHub = jest.spyOn(eventHub, '$off')
        const wrapper = new CommunicatingBlock({
          propsData: {
            settings: {
              caughtEvents: {
                trigger1: [
                  {
                    type: 'select',
                    targetField: 'firstField',
                  },
                ],
                trigger2: [
                  {
                    type: 'select',
                    targetField: 'firstField',
                  },
                ],
              },
            },
          },
        })
        const firstListener = wrapper.$data.eventListeners[0]
        const secondListener = wrapper.$data.eventListeners[1]
        wrapper.$destroy()
        // Check that the listeners are reset in the component data
        expect(wrapper.$data.eventListeners.length).toBe(0)
        // Check that the component will not listen these events anymore
        expect(spyOnEventHub).toHaveBeenCalledTimes(2)
        expect(spyOnEventHub).toHaveBeenNthCalledWith(1, 'trigger1', firstListener.relatedFunction)
        expect(spyOnEventHub).toHaveBeenNthCalledWith(2, 'trigger2', secondListener.relatedFunction)
      })
      it('With no catch event', () => {
        const wrapper = new CommunicatingBlock({
          propsData: {
            settings: {
              caughtEvents: {},
            },
          },
        })
        wrapper.$destroy()
        // Check that the listeners are saved in the component data
        expect(wrapper.$data.eventListeners.length).toBe(0)
        // Check that the component will listen these events
        expect(spyOnEventHub).not.toHaveBeenCalled()
      })
      it('With no catch event setting', () => {
        const wrapper = new CommunicatingBlock({
          propsData: {
            settings: {},
          },
        })
        wrapper.$destroy()
        // Check that the listeners are saved in the component data
        expect(wrapper.$data.eventListeners.length).toBe(0)
        // Check that the component will listen these events
        expect(spyOnEventHub).not.toHaveBeenCalled()
      })
    })
  })
  describe('MapSet', () => {
    let mapSetWrapper
    const spyOnEmitEventHub = jest.spyOn(eventHub, '$emit')

    beforeEach(() => {
      // MapSet initialization
      mapSetWrapper = shallowMount(MapSet, {
        propsData: {
          settings: mockMapSetBlock.settings,
          definition: mockDefinitions,
          content: mockTable1GeoContent,
          id: 'b1',
        },
        mocks: {
          t: key => key,
          $t: key => key,
        },
      })
      spyOnEmitEventHub.mockClear()
    })
    describe('To other blocks', () => {
      it('Do nothing if no trigger event is specified', () => {
        const mockSelectedFeature = mapSetWrapper.vm.resources[0].features[0]
        // These attributes are automatically updated when using the map
        mockSelectedFeature.source = mapSetWrapper.vm.resources[1].id
        mockSelectedFeature.properties.originalData = JSON.stringify(mockSelectedFeature.properties.originalData)
        mockSelectedFeature.properties.displayedData = JSON.stringify(mockSelectedFeature.properties.displayedData)
        // On feature select
        mapSetWrapper.vm.onSelectFeature(mockSelectedFeature)
        // Check that the event is emitted from the MapSet block
        expect(spyOnEmitEventHub).not.toHaveBeenCalled()
      })
      it('Do nothing if the selected feature has no property', () => {
        const mockSelectedFeature = mapSetWrapper.vm.resources[0].features[0]
        // These attributes are automatically updated when using the map
        mockSelectedFeature.source = mapSetWrapper.vm.resources[0].id
        mockSelectedFeature.properties = null
        // On feature select
        mapSetWrapper.vm.onSelectFeature(mockSelectedFeature)
        // Check that the event is emitted from the MapSet block
        expect(spyOnEmitEventHub).not.toHaveBeenCalled()
      })
      it('Check that the events are emitted from the MapSet block', () => {
        const mockSelectedFeature = mapSetWrapper.vm.resources[0].features[0]
        // These attributes are automatically updated when using the map
        mockSelectedFeature.source = mapSetWrapper.vm.resources[0].id
        mockSelectedFeature.properties.originalData = JSON.stringify(mockSelectedFeature.properties.originalData)
        mockSelectedFeature.properties.displayedData = JSON.stringify(mockSelectedFeature.properties.displayedData)
        // On feature select
        mapSetWrapper.vm.onSelectFeature(mockSelectedFeature)
        // Check that the selectRow event is emitted from the MapSet block
        expect(spyOnEmitEventHub).toHaveBeenCalledWith('map-select-row', {
          originalValue: {
            reference: 't1r1',
            value: 'Table 1 - Row 1',
          },
          displayedValue: 'Table 1 - Row 1',
        })
        // Check that the selectField event is emitted from the MapSet block
        expect(spyOnEmitEventHub).toHaveBeenCalledWith('map-select-row-field', {
          originalValue: 'My first row',
          displayedValue: 'My first row',
        })
      })
    })
    describe('With FormRecord', () => {
      let formRecordWrapper
      beforeEach(() => {
        // FormRecord initialization
        formRecordWrapper = shallowMount(FormRecord, {
          propsData: {
            settings: mockFormRecordBlock.settings,
            definition: mockDefinitions.table_view_2,
          },
          attrs: {
            workspaceId: 'workspace_1',
          },
          listeners: {
            'download-attachment': () => ({}),
            'update-suggestions': () => ({}),
            'upload-files': () => ({}),
          },
          mocks: {
            t: key => key,
            $t: key => key,
          },
        })
      })
      it('Check that we can send the selected row from MapSet', () => {
        const mockSelectedFeature = mapSetWrapper.vm.resources[0].features[0]
        // These attributes are automatically updated when using the map
        mockSelectedFeature.source = mapSetWrapper.vm.resources[0].id
        mockSelectedFeature.properties.originalData = JSON.stringify(mockSelectedFeature.properties.originalData)
        mockSelectedFeature.properties.displayedData = JSON.stringify(mockSelectedFeature.properties.displayedData)
        // On feature select
        mapSetWrapper.vm.onSelectFeature(mockSelectedFeature)
        // Check that the event is received inside the FormRecord block
        expect(formRecordWrapper.vm.newRow.data.rbt_column).toStrictEqual({
          reference: 't1r1',
          value: 'Table 1 - Row 1',
        })
      })
      it('Check that we can send one field of the selected row from MapSet', () => {
        const mockSelectedFeature = mapSetWrapper.vm.resources[0].features[0]
        // These attributes are automatically updated when using the map
        mockSelectedFeature.source = mapSetWrapper.vm.resources[0].id
        mockSelectedFeature.properties.originalData = JSON.stringify(mockSelectedFeature.properties.originalData)
        mockSelectedFeature.properties.displayedData = JSON.stringify(mockSelectedFeature.properties.displayedData)
        // On feature select
        mapSetWrapper.vm.onSelectFeature(mockSelectedFeature)
        // Check that the event is received inside the FormRecord block
        expect(formRecordWrapper.vm.newRow.data.string_2_column).toStrictEqual('My first row')
      })
      it('Check that we can send the updated field with only the reference to MapSet', () => {
        formRecordWrapper.vm.onUpdateRow({
          columnId: 'rbt_column',
          newValue: 't1r1',
        })
        // Check that the event is emitted from the FormRecord block
        expect(spyOnEmitEventHub).toHaveBeenCalledWith('form-record-update-field', {
          originalValue: 't1r1',
          displayedValue: undefined,
        })
        // Check that the event is received inside the MapSet block
        expect(mapSetWrapper.vm.selectedFeatureBySource[mapSetWrapper.vm.resources[0].id])
          .toBe('t1r1:geo_column')
      })
      it('Check that we can reset the selected field if a null reference is specified', () => {
        formRecordWrapper.vm.onUpdateRow({
          columnId: 'rbt_column',
          newValue: null,
        })
        // Check that the event is emitted from the FormRecord block
        expect(spyOnEmitEventHub).toHaveBeenCalledWith('form-record-update-field', {
          originalValue: null,
          displayedValue: '',
        })
        // Check that the event is received inside the MapSet block
        expect(mapSetWrapper.vm.selectedFeatureBySource[mapSetWrapper.vm.resources[0].id])
          .toBeNull()
      })
      it('Check that we can reset the selected field if an undefined reference is specified', () => {
        formRecordWrapper.vm.onUpdateRow({
          columnId: 'rbt_column',
          newValue: undefined,
        })
        // Check that the event is emitted from the FormRecord block
        expect(spyOnEmitEventHub).toHaveBeenCalledWith('form-record-update-field', {
          originalValue: undefined,
          displayedValue: '',
        })
        // Check that the event is received inside the MapSet block
        expect(mapSetWrapper.vm.selectedFeatureBySource[mapSetWrapper.vm.resources[0].id])
          .toBeNull()
      })
      it('Check that we can send an event to Mapset when the form is submitted', async () => {
        // Simulate a form submit
        await formRecordWrapper.setProps({
          submitting: {
            inProgress: false,
          },
        })
        await formRecordWrapper.setProps({
          submitting: {
            inProgress: true,
          },
        })
        // Check that the event is emitted from the MapSet block
        expect(spyOnEmitEventHub).toHaveBeenCalledWith('form-record-submit', {})
        // Check that the event is received inside the FormRecord block
        expect(mapSetWrapper.vm.selectedFeatureBySource[mapSetWrapper.vm.resources[0].id])
          .toBeNull()
      })
    })
    describe('With DataRecord', () => {
      let dataRecordWrapper, spyOnEmitDataRecord
      beforeEach(() => {
        // DataRecord initialization
        dataRecordWrapper = shallowMount(DataRecord, {
          propsData: {
            settings: mockDataRecordBlock.settings,
            definition: mockDefinitions.table_view_2,
            content: mockTable2Content,
          },
          attrs: {
            workspaceId: 'workspace_1',
          },
        })
        spyOnEmitDataRecord = jest.spyOn(dataRecordWrapper.vm, '$emit')
      })
      it('Check that we can send the selected row', () => {
        const mockSelectedFeature = mapSetWrapper.vm.resources[0].features[0]
        // These attributes are automatically updated when using the map
        mockSelectedFeature.source = mapSetWrapper.vm.resources[0].id
        mockSelectedFeature.properties.originalData = JSON.stringify(mockSelectedFeature.properties.originalData)
        mockSelectedFeature.properties.displayedData = JSON.stringify(mockSelectedFeature.properties.displayedData)
        // On feature select
        mapSetWrapper.vm.onSelectFeature(mockSelectedFeature)
        // Check that the event is received inside the DataRecord block
        expect(spyOnEmitDataRecord).toHaveBeenCalledWith('update-row', {
          columnId: 'rbt_column',
          newValue: {
            reference: 't1r1',
            value: 'Table 1 - Row 1',
          },
          rowId: 't2r1',
        })
      })
      it('Check that we can send one field of the selected row', () => {
        const mockSelectedFeature = mapSetWrapper.vm.resources[0].features[0]
        // These attributes are automatically updated when using the map
        mockSelectedFeature.source = mapSetWrapper.vm.resources[0].id
        mockSelectedFeature.properties.originalData = JSON.stringify(mockSelectedFeature.properties.originalData)
        mockSelectedFeature.properties.displayedData = JSON.stringify(mockSelectedFeature.properties.displayedData)
        mapSetWrapper.vm.onSelectFeature(mockSelectedFeature)
        // Check that the event is received inside the DataRecord block
        expect(spyOnEmitDataRecord).toHaveBeenCalledWith('update-row', {
          columnId: 'string_2_column',
          newValue: 'My first row',
          rowId: 't2r1',
        })
      })
      it('Check that we can send the updated field with an object { reference, value } to MapSet', () => {
        dataRecordWrapper.vm.onUpdateRow({
          columnId: 'rbt_column',
          newValue: {
            reference: 't1r1',
            value: 'Table 1 - Row 1',
          },
        })
        // Check that the event is emitted from the DataRecord block
        expect(spyOnEmitEventHub).toHaveBeenCalledWith('form-record-update-field', {
          originalValue: {
            reference: 't1r1',
            value: 'Table 1 - Row 1',
          },
          displayedValue: 'Table 1 - Row 1',
        })
        // Check that the event is received inside the MapSet block
        expect(mapSetWrapper.vm.selectedFeatureBySource[mapSetWrapper.vm.resources[0].id])
          .toBe('t1r1:geo_column')
      })
      it('Check that we can send the updated field with only the reference to MapSet', () => {
        dataRecordWrapper.vm.onUpdateRow({
          columnId: 'rbt_column',
          newValue: 't1r1',
        })
        // Check that the event is emitted from the DataRecord block
        expect(spyOnEmitEventHub).toHaveBeenCalledWith('form-record-update-field', {
          originalValue: 't1r1',
          displayedValue: undefined,
        })
        // Check that the event is received inside the MapSet block
        expect(mapSetWrapper.vm.selectedFeatureBySource[mapSetWrapper.vm.resources[0].id])
          .toBe('t1r1:geo_column')
      })
      it('Check that we can send the updated field with only the reference to MapSet at loading', async () => {
        // Simulate that all the blocs are loaded in the page
        await dataRecordWrapper.setProps({
          pageLoaded: true,
        })
        // Check that the event is emitted from the DataRecord block
        expect(spyOnEmitEventHub).toHaveBeenCalledWith('form-record-update-field', {
          originalValue: {
            reference: 't1r2',
            value: 'Table 1 - Row 2',
          },
          displayedValue: 'Table 1 - Row 2',
        })
        // Check that the event is received inside the MapSet block
        expect(mapSetWrapper.vm.selectedFeatureBySource[mapSetWrapper.vm.resources[0].id])
          .toBe('t1r2:geo_column')
      })
    })
    describe('With Paragraph', () => {
      it('Check that we can send one field of the selected row from MapSet', () => {
        // Paragraph initialization with a selected event
        const paragraphWrapper = shallowMount(Paragraph, {
          propsData: {
            settings: {
              content: 'default paragraph',
              caughtEvents: {
                'map-select-row-field': [
                  {
                    type: 'select',
                  },
                ],
              },
            },
          },
          attrs: {
            workspaceId: 'workspace_1',
          },
        })
        const mockSelectedFeature = mapSetWrapper.vm.resources[0].features[0]
        // These attributes are automatically updated when using the map
        mockSelectedFeature.source = mapSetWrapper.vm.resources[0].id
        mockSelectedFeature.properties.originalData = JSON.stringify(mockSelectedFeature.properties.originalData)
        mockSelectedFeature.properties.displayedData = JSON.stringify(mockSelectedFeature.properties.displayedData)
        // On feature select
        mapSetWrapper.vm.onSelectFeature(mockSelectedFeature)
        // Check that the event is received inside the FormRecord block
        expect(paragraphWrapper.vm.content).toBe('My first row')
      })
      it('Check that we can reset the paragraph content', () => {
        // Paragraph initialization with a reset event
        const paragraphWrapper = shallowMount(Paragraph, {
          propsData: {
            settings: {
              content: 'default content',
              caughtEvents: {
                'map-select-row-field': [
                  {
                    type: 'reset',
                  },
                ],
              },
            },
          },
          attrs: {
            workspaceId: 'workspace_1',
          },
        })
        paragraphWrapper.setData({
          content: 'New content',
        })
        const mockSelectedFeature = mapSetWrapper.vm.resources[0].features[0]
        // These attributes are automatically updated when using the map
        mockSelectedFeature.source = mapSetWrapper.vm.resources[0].id
        mockSelectedFeature.properties.originalData = JSON.stringify(mockSelectedFeature.properties.originalData)
        mockSelectedFeature.properties.displayedData = JSON.stringify(mockSelectedFeature.properties.displayedData)
        // On feature select
        mapSetWrapper.vm.onSelectFeature(mockSelectedFeature)
        // Check that the event is received inside the FormRecord block
        expect(paragraphWrapper.vm.content).toBe('default content')
      })
    })
  })
})
// Map to Form record

// Form record to Map

// Map to detail record

// Detail record to map

// Map to paragraph
