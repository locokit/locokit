/* eslint-disable @typescript-eslint/camelcase */
import { COLUMN_TYPE } from '@locokit/lck-glossary'
import { shallowMount } from '@vue/test-utils'

import FormRecord from '@/components/visualize/FormRecord/FormRecord.vue'

const mockDefinitionsWithRequiredColumns = {
  id: 'table_view_1',
  columns: [
    {
      text: 'Description',
      id: 'string_1_column',
      settings: {},
      table_id: 'table_1',
      column_type_id: COLUMN_TYPE.STRING,
      editable: false,
      position: 1,
      transmitted: false,
      default: null,
      displayed: true,
      required: true,
      sort: 'DESC',
      table_column_id: '',
      table_view_id: 'table_view_1',
      style: {},
    },
    {
      text: 'Number',
      id: 'number_1_column',
      settings: {},
      table_id: 'table_1',
      column_type_id: COLUMN_TYPE.NUMBER,
      editable: false,
      position: 1,
      transmitted: false,
      default: null,
      displayed: true,
      required: true,
      sort: 'DESC',
      table_column_id: '',
      table_view_id: 'table_view_1',
      style: {},
    },
    {
      text: 'Boolean',
      id: 'boolean_1_column',
      settings: {},
      table_id: 'table_1',
      column_type_id: COLUMN_TYPE.BOOLEAN,
      editable: false,
      position: 1,
      transmitted: false,
      default: null,
      displayed: true,
      required: true,
      sort: 'DESC',
      table_column_id: '',
      table_view_id: 'table_view_1',
      style: {},
    },
  ],
}

const mockDefinitionsWithoutRequiredColumns = {
  id: 'table_view_2',
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
      text: 'Number',
      id: 'number_2_column',
      settings: {},
      table_id: 'table_1',
      column_type_id: COLUMN_TYPE.NUMBER,
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
  ],
}

const mockDefinitionsWithDefaultColumns = {
  id: 'table_view_3',
  columns: [
    {
      text: 'Description',
      id: 'string_3_column',
      settings: {},
      table_id: 'table_3',
      column_type_id: COLUMN_TYPE.STRING,
      editable: false,
      position: 1,
      transmitted: false,
      default: {
        value: 'Default string value',
      },
      displayed: true,
      required: true,
      sort: 'DESC',
      table_column_id: '',
      table_view_id: 'table_view_3',
      style: {},
    },
    {
      text: 'Number',
      id: 'number_3_column',
      settings: {},
      table_id: 'table_3',
      column_type_id: COLUMN_TYPE.NUMBER,
      editable: false,
      position: 1,
      transmitted: false,
      default: {
        value: 0,
      },
      displayed: true,
      required: true,
      sort: 'DESC',
      table_column_id: '',
      table_view_id: 'table_view_3',
      style: {},
    },
    {
      text: 'Boolean',
      id: 'boolean_3_column',
      settings: {},
      table_id: 'table_3',
      column_type_id: COLUMN_TYPE.BOOLEAN,
      editable: false,
      position: 1,
      transmitted: false,
      default: {
        value: true,
      },
      displayed: true,
      required: true,
      sort: 'DESC',
      table_column_id: '',
      table_view_id: 'table_view_3',
      style: {},
    },
    {
      text: 'String related 1',
      id: 'string_4_column',
      settings: {},
      table_id: 'table_3',
      column_type_id: COLUMN_TYPE.STRING,
      editable: false,
      position: 1,
      transmitted: false,
      default: {
        fieldId: 'string_3_column',
      },
      displayed: true,
      required: true,
      sort: 'DESC',
      table_column_id: '',
      table_view_id: 'table_view_3',
      style: {},
    },
    {
      text: 'String related 2',
      id: 'string_5_column',
      settings: {},
      table_id: 'table_3',
      column_type_id: COLUMN_TYPE.STRING,
      editable: false,
      position: 1,
      transmitted: false,
      default: null,
      displayed: true,
      required: true,
      sort: 'DESC',
      table_column_id: '',
      table_view_id: 'table_view_3',
      style: {},
    },
    {
      text: 'String related 3',
      id: 'string_6_column',
      settings: {},
      table_id: 'table_3',
      column_type_id: COLUMN_TYPE.STRING,
      editable: false,
      position: 1,
      transmitted: false,
      default: {
        fieldId: 'string_5_column',
      },
      displayed: true,
      required: true,
      sort: 'DESC',
      table_column_id: '',
      table_view_id: 'table_view_3',
      style: {},
    },
  ],
}

describe('FormRecord', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(FormRecord, {
      attrs: {
        workspaceId: 'workspace_1',
      },
      listeners: {
        'download-attachment': () => ({}),
        'update-suggestions': () => ({}),
        'upload-files': () => ({}),
      },
    })
    expect(wrapper.vm.requiredColumnsIds.size).toBe(0)
  })

  describe('Computed properties', () => {
    describe('requiredColumnsIds', () => {
      it('Returns a set of the required columns ids if there are several ones', async () => {
        await wrapper.setProps({
          definition: mockDefinitionsWithRequiredColumns,
          settings: {
            id: mockDefinitionsWithRequiredColumns.id,
          },
        })
        expect(wrapper.vm.requiredColumnsIds.size).toBe(3)
        expect(wrapper.vm.requiredColumnsIds.has('string_1_column')).toBe(true)
        expect(wrapper.vm.requiredColumnsIds.has('boolean_1_column')).toBe(true)
        expect(wrapper.vm.requiredColumnsIds.has('number_1_column')).toBe(true)
      })
      it('Returns an empty set if there is no required column', async () => {
        await wrapper.setProps({
          definition: mockDefinitionsWithoutRequiredColumns,
          settings: {
            id: mockDefinitionsWithoutRequiredColumns.id,
          },
        })
        expect(wrapper.vm.requiredColumnsIds.size).toBe(0)
      })
      it('Returns an empty set if there is no definition', async () => {
        await wrapper.setProps({
          definition: null,
        })
        expect(wrapper.vm.requiredColumnsIds.size).toBe(0)
      })
    })
    describe('completeForm', () => {
      it('Return false if at least one required field is complete', async () => {
        await wrapper.setProps({
          definition: mockDefinitionsWithRequiredColumns,
        })
        await wrapper.setData({
          newRow: {
            data: {
              string_1_column: 'Data',
              number_1_column: 10,
            },
          },
        })
        expect(wrapper.vm.completeForm).toBe(false)
      })

      it('Return false if a previous string field was set but reset', async () => {
        await wrapper.setProps({
          definition: mockDefinitionsWithRequiredColumns,
        })
        await wrapper.setData({
          newRow: {
            data: {
              string_1_column: '',
              number_1_column: 10,
              boolean_1_column: false,
            },
          },
        })
        expect(wrapper.vm.completeForm).toBe(false)
      })

      it('Return true if all required fields are complete', async () => {
        await wrapper.setProps({
          definition: mockDefinitionsWithRequiredColumns,
        })
        await wrapper.setData({
          newRow: {
            data: {
              string_1_column: 'Data',
              number_1_column: 10,
              boolean_1_column: false,
            },
          },
        })
        expect(wrapper.vm.completeForm).toBe(true)
      })
    })

    describe('default values', () => {
      it('Set initial values with default ones', async () => {
        await wrapper.setProps({
          definition: mockDefinitionsWithDefaultColumns,
        })
        expect(wrapper.vm.newRow).toMatchObject({
          data: {
            string_3_column: 'Default string value',
            number_3_column: 0,
            boolean_3_column: true,
            string_4_column: 'Default string value',
          },
        })
        await wrapper.vm.onUpdateRow({
          columnId: 'string_5_column',
          newValue: 'This is a test to be duplicated',
        })
        expect(wrapper.vm.newRow).toMatchObject({
          data: {
            string_3_column: 'Default string value',
            number_3_column: 0,
            boolean_3_column: true,
            string_4_column: 'Default string value',
            string_5_column: 'This is a test to be duplicated',
            string_6_column: 'This is a test to be duplicated',
          },
        })
      })
    })
  })
})
