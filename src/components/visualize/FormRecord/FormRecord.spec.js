/* eslint-disable @typescript-eslint/camelcase */
import { COLUMN_TYPE } from '@locokit/lck-glossary'
import { shallowMount, mount } from '../../../../tests/unit/local-test-utils'
import flushPromises from 'flush-promises'
import FormRecord from '@/components/visualize/FormRecord/FormRecord.vue'

async function flushAll () {
  // get rid of any pending validations on the leading edge
  await flushPromises()
  // any delayed or debounced state computations
  jest.runAllTimers()
  // get rid of the pending rendering tick
  await flushPromises()
}

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
      validation: {
        required: true,
      },
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
      validation: {
        required: true,
      },
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
      validation: {
        required: true,
      },
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
      sort: 'DESC',
      table_column_id: '',
      table_view_id: 'table_view_3',
      style: {},
    },
  ],
}

describe('FormRecord', () => {
  jest.useFakeTimers()
  describe('could have required columns', () => {
    it('and disable the submit button if they are not set', async () => {
      expect.assertions(6)
      const wrapper = await mount(FormRecord, {
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
          $toast: {
            add: jest.fn(),
          },
        },
        propsData: {
          definition: mockDefinitionsWithRequiredColumns,
          settings: {
            id: mockDefinitionsWithRequiredColumns.id,
          },
          crudMode: true,
        },
      })
      await flushAll()
      expect(wrapper.vm.newRow.data.string_1_column).toBe(undefined)
      expect(wrapper.vm.newRow.data.boolean_1_column).toBe(undefined)
      expect(wrapper.vm.newRow.data.number_1_column).toBe(undefined)
      const inputs = wrapper.findAll('input')
      expect(inputs.length).toBe(3)
      const submitButton = wrapper.find('.p-button[type=submit]')
      expect(submitButton.attributes('disabled')).toBe('disabled')
      expect(wrapper).toMatchSnapshot()
    })
    it('enable the submit button if all fields are set', async () => {
      expect.assertions(10)
      const wrapper = await mount(FormRecord, {
        attachTo: document.body,
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
          $toast: {
            add: jest.fn(),
          },
        },
        propsData: {
          definition: mockDefinitionsWithRequiredColumns,
          settings: {
            id: mockDefinitionsWithRequiredColumns.id,
          },
          crudMode: true,
        },
      })
      expect(wrapper.vm.newRow.data.string_1_column).toBe(undefined)
      expect(wrapper.vm.newRow.data.boolean_1_column).toBe(undefined)
      expect(wrapper.vm.newRow.data.number_1_column).toBe(undefined)
      await wrapper.setData({
        newRow: {
          data: {
            string_1_column: 'set',
            boolean_1_column: true,
            number_1_column: 1,
          },
        },
      })
      expect(wrapper.vm.newRow.data.string_1_column).toBe('set')
      expect(wrapper.vm.newRow.data.boolean_1_column).toBe(true)
      expect(wrapper.vm.newRow.data.number_1_column).toBe(1)
      await flushAll()
      const submitButton = wrapper.find('.p-button[type=submit]')
      expect(submitButton.attributes().disabled).toBeUndefined()
      const spyOnEmitEvent = jest.spyOn(wrapper.vm, '$emit')
      await submitButton.trigger('click')
      await flushAll()
      expect(spyOnEmitEvent).toHaveBeenCalledTimes(1)
      expect(spyOnEmitEvent).toHaveBeenCalledWith('create-row', {
        id: '',
        text: '',
        data: {
          string_1_column: 'set',
          boolean_1_column: true,
          number_1_column: 1,
        },
      })
      expect(wrapper).toMatchSnapshot()
      await spyOnEmitEvent.mockClear()
      await wrapper.destroy()
    })

    it('enable the submit button if no required fields are defined', async () => {
      expect.assertions(6)
      const wrapper = await mount(FormRecord, {
        attachTo: document.body,
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
          $toast: {
            add: jest.fn(),
          },
        },
        propsData: {
          definition: mockDefinitionsWithoutRequiredColumns,
          settings: {
            id: mockDefinitionsWithoutRequiredColumns.id,
          },
          crudMode: true,
        },
      })
      expect(wrapper.vm.newRow.data.string_2_column).toBe(undefined)
      expect(wrapper.vm.newRow.data.number_2_column).toBe(undefined)
      await flushAll()
      const submitButton = wrapper.find('.p-button[type=submit]')
      expect(submitButton.attributes().disabled).toBeUndefined()
      const spyOnEmitEvent = jest.spyOn(wrapper.vm, '$emit')
      await submitButton.trigger('click')
      await flushAll()
      // if no user interaction, submission is not trigerred
      expect(spyOnEmitEvent).toHaveBeenCalledTimes(0)
      wrapper.vm.newRow.data.string_2_column = 'pouet'
      wrapper.vm.newRow.data.number_2_column = 1
      await flushAll()

      expect(wrapper.vm.newRow.data.string_2_column).toBe('pouet')
      expect(wrapper.vm.newRow.data.number_2_column).toBe(1)
      // const input = wrapper.find('#string_2_column')
      // expect(input.attributes().value).toBe('pouet')
      // await submitButton.trigger('click')
      // await flushAll()
      // expect(spyOnEmitEvent).toHaveBeenCalledTimes(1)
      // expect(spyOnEmitEvent).toHaveBeenCalledWith('create-row', {
      //   id: '',
      //   text: '',
      //   data: {
      //   },
      // })
      // expect(wrapper.html()).toMatchSnapshot()
      spyOnEmitEvent.mockClear()
      await wrapper.destroy()
    })
  })
  describe('default values', () => {
    it('Set initial values with default ones', async () => {
      const wrapper = await shallowMount(FormRecord, {
        attrs: {
          workspaceId: 'workspace_1',
        },
        listeners: {
          'download-attachment': () => ({}),
          'update-suggestions': () => ({}),
          'upload-files': () => ({}),
        },
        propsData: {
          definition: mockDefinitionsWithDefaultColumns,
        },
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
