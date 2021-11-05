/* eslint-disable @typescript-eslint/camelcase */
import { mount } from '@vue/test-utils'

import { COLUMN_TYPE } from '@locokit/lck-glossary'

import DataDetail from '@/components/store/DataDetail/DataDetail.vue'

const defaultWrapperParams = {
  mocks: {
    t: key => key,
    $t: key => key,
    $toast: {
      add: jest.fn(),
    },
  },
}

// Mock variables
const mockTableView2Definition = {
  id: 'table_view_2',
  table_id: 'table_1',
  columns: [
    {
      text: 'Description',
      id: 'string_2_column',
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
      table_view_id: 'table_view_2',
      style: {},
    },
    {
      text: 'Point',
      id: 'geo_point_column',
      settings: {},
      table_id: 'table_1',
      column_type_id: COLUMN_TYPE.GEOMETRY_POINT,
      editable: false,
      position: 2,
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
}

const mockTableView1Definition = {
  id: 'table_view_1',
  table_id: 'table_1',
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
      text: 'Polygon',
      id: 'geo_polygon_column',
      settings: {
        map_sources: [{
          id: mockTableView2Definition.id,
          field: 'geo_point_column',
          popup: true,
          selectable: true,
        }],
      },
      table_id: 'table_1',
      column_type_id: COLUMN_TYPE.GEOMETRY_POLYGON,
      editable: true,
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
    // {
    //   text: 'Line string',
    //   id: 'geo_linestring_column',
    //   settings: {},
    //   table_id: 'table_1',
    //   column_type_id: COLUMN_TYPE.GEOMETRY_LINESTRING,
    //   editable: true,
    //   position: 3,
    //   transmitted: false,
    //   default: '',
    //   displayed: true,
    //   required: false,
    //   sort: 'DESC',
    //   table_column_id: '',
    //   table_view_id: 'table_view_1',
    //   style: {},
    // },
  ],
}

const mockTableView1Content = {
  data: [
    {
      id: 't1r1',
      text: 'Table 1 - Row 1',
      table_id: 'table_1',
      data: {
        string_1_column: 'My first row',
        geo_polygon_column: 'SRID=4326;POLYGON((1.4 45.75,2 45.6,1.9 45.3,1.4 45.75))',
      },
    },
    {
      id: 't1r2',
      text: 'Table 1 - Row 2',
      table_id: 'table_1',
      data: {
        string_1_column: 'My second row',
        geo_polygon_column: 'SRID=4326;POLYGON((1.2 45.75,2 45.6,1.9 45.3,1.4 45.75))',
      },
    },
  ],
}

const mockTableView2Content = {
  data: [
    {
      id: 't1r1',
      text: 'Table 1 - Row 1',
      table_id: 'table_1',
      data: {
        string_2_column: 'My first row bis',
        geo_point_column: 'SRID=4326;POINT(10.2 48.75)',
      },
    },
    {
      id: 't1r3',
      text: 'Table 1 - Row 3',
      table_id: 'table_1',
      data: {
        string_2_column: 'My third row bis',
        geo_point_column: 'SRID=4326;POINT(10.2 48.75)',
      },
    },
  ],
}

const definitionWithConditionalDisplay = {
  text: 'Testing conditional display',
  table_id: '0076b18b-5c85-4587-bff7-bba95f7361ca',
  columns: [
    {
      text: 'Text',
      id: 'e065323c-1151-447f-be0f-6d2728117b38',
      table_id: '0076b18b-5c85-4587-bff7-bba95f7361ca',
      column_type_id: COLUMN_TYPE.STRING,
      order: null,
      filter: null,
      displayed: true,
      editable: true,
    },
    {
      text: 'Boolean / Checkbox',
      id: 'e165323c-1151-447f-be0f-6d2728117b38',
      table_id: '0076b18b-5c85-4587-bff7-bba95f7361ca',
      column_type_id: COLUMN_TYPE.BOOLEAN,
      order: null,
      filter: null,
      displayed: true,
      editable: true,
    },
    {
      text: 'Conditional text if previous boolean is checked',
      id: '882326b8-b634-4ebb-aeb3-a2a2aa082c11',
      table_id: '0076b18b-5c85-4587-bff7-bba95f7361ca',
      column_type_id: COLUMN_TYPE.TEXT,
      order: null,
      filter: null,
      displayed: true,
      editable: true,
      display_conditions: [{
        field_id: 'e165323c-1151-447f-be0f-6d2728117b38',
        operator: '$eq',
        value: true,
      }],
    },
    {
      text: 'Conditional text if previous boolean is not checked',
      id: 'cf1ad5b7-54d0-46a2-9bd2-8b1ecf059c42',
      table_id: '0076b18b-5c85-4587-bff7-bba95f7361ca',
      column_type_id: COLUMN_TYPE.TEXT,
      order: null,
      filter: null,
      displayed: true,
      editable: true,
      display_conditions: [{
        field_id: 'e165323c-1151-447f-be0f-6d2728117b38',
        operator: '$ne', // here we use $ne, because if field is pristine, it could be null
        value: true,
      }],
    },
    {
      text: 'Status',
      id: 'b15bfe13-b18b-40ca-9637-1611c789b7c2',
      settings: {
        values: {
          first: {
            label: 'Done',
          },
          second: {
            label: 'Out of order',

          },
          third: {
            label: 'For other case (third), please specify in next field.',
          },
          fourth: {
            label: 'For other case (fourth), please specify in next field.',
          },
        },
      },
      table_id: '0076b18b-5c85-4587-bff7-bba95f7361ca',
      column_type_id: COLUMN_TYPE.SINGLE_SELECT,
      order: null,
      filter: null,
      displayed: true,
      editable: true,
    },
    {
      text: 'Conditional text if previous single select is third / fourth value',
      id: '87e6fd3e-d016-4509-bfe5-89796812cc17',
      table_id: '0076b18b-5c85-4587-bff7-bba95f7361ca',
      column_type_id: COLUMN_TYPE.TEXT,
      order: null,
      filter: null,
      displayed: true,
      editable: true,
      display_conditions: [{
        field_id: 'b15bfe13-b18b-40ca-9637-1611c789b7c2',
        operator: '$in',
        value: ['third', 'fourth'],
      }],
    },
  ],
}

jest.mock('@/components/ui/ColumnType/Geometry/Map.vue', () => ({
  render: () => '<lck-stub-map />',
}))

describe('DataDetail', () => {
  describe('Manage the geographic columns', () => {
    describe('Manage the secondary sources', () => {
      let wrapper, spyOnEmit

      beforeEach(() => {
        // Component initialization
        wrapper = mount(DataDetail, {
          propsData: {
            workspaceId: '1',
          },
          ...defaultWrapperParams,
          stubs: ['lck-map'],
        })
        spyOnEmit = jest.spyOn(wrapper.vm, '$emit')
      })

      it('Initialization with an editable field that needs secondary sources', async () => {
        // Define a new definition
        await wrapper.setProps({
          definition: mockTableView1Definition,
          row: mockTableView1Content.data[0],
        })
        // An event is emitted to ask the secondary sources
        expect(spyOnEmit).toHaveBeenCalledTimes(1)
        expect(spyOnEmit).toHaveBeenCalledWith('get-secondary-sources', [mockTableView2Definition.id])
        // The map column field isn't displayed as the secondary sources are not yet available
        expect(wrapper.find('lck-map-stub').exists()).toBe(false)

        // The secondary sources are now received
        await wrapper.setProps({
          secondarySources: {
            [mockTableView2Definition.id]: {
              definition: mockTableView2Definition,
              content: mockTableView2Content.data,
            },
          },
        })
        // The map column field is now displayed as the secondary sources are available
        expect(wrapper.find('lck-map-stub').exists()).toBe(true)
      })

      it('Initialization with a read only field that do not need secondary source', async () => {
        // Define a new definition
        await wrapper.setProps({
          definition: mockTableView2Definition,
          row: mockTableView2Content.data[0],
        })
        // No event is emitted to ask the secondary sources
        expect(spyOnEmit).not.toHaveBeenCalled()
        // The map column field is displayed
        expect(wrapper.find('lck-map-stub').exists()).toBe(true)
      })
    })
    describe('Get the valid geo resources for a column', () => {
      let wrapper

      beforeEach(() => {
        // Component initialization
        wrapper = mount(DataDetail, {
          propsData: {
            workspaceId: '1',
          },
          ...defaultWrapperParams,
          stubs: ['lck-map'],
        })
      })

      it('Which is editable and whose the needed secondary sources are available', async () => {
        await wrapper.setProps({
          secondarySources: {
            [mockTableView2Definition.id]: {
              definition: mockTableView2Definition,
              content: mockTableView2Content.data,
            },
          },
          definition: mockTableView1Definition,
          row: mockTableView1Content.data[0],
        })
        // Check map component resources
        const geoResources = wrapper.vm.getLckGeoResources(mockTableView1Definition.columns[1])
        expect(geoResources.length).toBe(2)
        const [secondaryResource, columnResource] = geoResources
        // Check column resource
        // Editable resource
        expect(columnResource.editableGeometryTypes.has(COLUMN_TYPE.GEOMETRY_POLYGON)).toBe(true)
        // Focus on this resource
        expect(columnResource.excludeFromBounds).toBe(false)
        // Customize it
        expect(columnResource.layers[0]).toMatchObject({
          paint: {
            'fill-color': '#01426B',
          },
        })
        // Check secondary resources
        // Not editable resources
        expect(secondaryResource.editableGeometryTypes.size).toBe(0)
        // Don't focus on these resources
        expect(secondaryResource.excludeFromBounds).toBe(true)
        // Some map settings can be passed
        expect(secondaryResource.popupMode).toBe('click')
        expect(secondaryResource.selectable).toBe(true)
        // Only keep the features related to a different row
        expect(secondaryResource.features.length).toBe(1)
        expect(secondaryResource.features[0].id).toBe('t1r3:geo_point_column')
      })
      it('Which is editable and whose the needed secondary sources are not available', async () => {
        await wrapper.setProps({
          definition: mockTableView1Definition,
          row: mockTableView1Content.data[0],
        })
        // Check map component resources
        const geoResources = wrapper.vm.getLckGeoResources(mockTableView1Definition.columns[1])
        expect(geoResources.length).toBe(1)
        const columnResource = geoResources[0]
        // Check column resource
        // Editable resource
        expect(columnResource.editableGeometryTypes.has(COLUMN_TYPE.GEOMETRY_POLYGON)).toBe(true)
        // Focus on this resource
        expect(columnResource.excludeFromBounds).toBe(false)
        // Customize it
        expect(columnResource.layers[0]).toMatchObject({
          paint: {
            'fill-color': '#01426B',
          },
        })
      })
      it('Which is not editable and which has not any secondary source', async () => {
        await wrapper.setProps({
          definition: mockTableView2Definition,
          row: mockTableView2Content.data[0],
        })
        // Check map component resources
        const geoResources = wrapper.vm.getLckGeoResources(mockTableView2Definition.columns[1])
        expect(geoResources.length).toBe(1)
        const columnResource = geoResources[0]
        // Check column resource
        // Read only resource
        expect(columnResource.editableGeometryTypes.size).toBe(0)
        // Focus on this resource
        expect(columnResource.excludeFromBounds).toBe(false)
        // Customize it
        expect(columnResource.layers[0]).toMatchObject({
          paint: {
            'circle-color': '#01426B',
          },
        })
      })
    })
  })

  describe('Manage conditional fields ($eq, $ne, $in)', () => {
    it('display / hide fields if an initial condition is respected', () => {
      expect.assertions(4)
      const wrapper = mount(DataDetail, {
        propsData: {
          workspaceId: '1',
          definition: definitionWithConditionalDisplay,
          row: {
            data: {},
          },
        },
        ...defaultWrapperParams,
      })

      expect(wrapper.html()).toMatchSnapshot()

      const wrapperText = wrapper.text()

      expect(wrapperText.indexOf('Conditional text if previous boolean is checked')).toBe(-1)
      expect(wrapperText.indexOf('Conditional text if previous boolean is not checked') > -1).toBe(true)
      expect(wrapperText.indexOf('Conditional text if previous single select is third / fourth value')).toBe(-1)
    })
    it('display / hide fields if a condition change in time', async () => {
      expect.assertions(11)
      const wrapper = mount(DataDetail, {
        propsData: {
          workspaceId: '1',
        },
        ...defaultWrapperParams,
      })
      await wrapper.setProps({
        definition: definitionWithConditionalDisplay,
        row: {
          data: {},
        },
      })

      let wrapperText = wrapper.text()

      expect(wrapperText.indexOf('Conditional text if previous boolean is checked')).toBe(-1)
      expect(wrapperText.indexOf('Conditional text if previous boolean is not checked') > -1).toBe(true)
      expect(wrapperText.indexOf('Conditional text if previous single select is third / fourth value')).toBe(-1)

      expect(wrapper.html()).toMatchSnapshot()

      await wrapper.find('input[type=checkbox]').trigger('click')

      expect(wrapper.vm.$props.row.data['e165323c-1151-447f-be0f-6d2728117b38']).toBe(true)

      expect(wrapper.html()).toMatchSnapshot()

      wrapperText = wrapper.text()

      expect(wrapperText.indexOf('Conditional text if previous boolean is checked') > -1).toBe(true)
      expect(wrapperText.indexOf('Conditional text if previous boolean is not checked')).toBe(-1)

      await wrapper.find('.p-dropdown.p-component.p-inputwrapper.p-dropdown-clearable').trigger('click')
      await wrapper.find('li:nth-of-type(3)').trigger('click')
      expect(wrapper.vm.$props.row.data['b15bfe13-b18b-40ca-9637-1611c789b7c2']).toBe('third')

      wrapperText = wrapper.text()
      expect(wrapperText.indexOf('Conditional text if previous single select is third / fourth value') > -1).toBe(true)

      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})
