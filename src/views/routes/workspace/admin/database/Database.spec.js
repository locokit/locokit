/* eslint-disable @typescript-eslint/camelcase */

import { shallowMount } from '@vue/test-utils'

import {
  retrieveTableRowsWithSkipAndLimit,
} from '@/services/lck-helpers/database'
import { ACTIONS } from '@/services/lck-utils/filter'
import { lckServices, lckHelpers } from '@/services/lck-api'

import Database from './Database.vue'
import DataTable from '@/components/store/DataTable/DataTable.vue'
import ColumnForm from '@/components/store/ColumnForm/ColumnForm.vue'

import Vue from 'vue'

import { mockDatabase } from '@/services/lck-helpers/__mocks__/database'

// Mock external libraries

jest.mock('@locokit/lck-glossary', () => ({
  COLUMN_TYPE: {
    STRING: 2,
    DATE: 5,
    USER: 6,
    LOOKED_UP_COLUMN: 9,
    SINGLE_SELECT: 10,
    MULTI_SELECT: 11,
    TEXT: 16,
  },
}))

jest.mock('date-fns')
jest.mock('file-saver')

// Mock primevue component
jest.mock('primevue/tabview', () => ({
  name: 'p-tab-view',
  render: h => h('p-tab-view'),
}))
jest.mock('primevue/tabpanel', () => ({
  name: 'p-tab-panel',
  render: h => h('p-tab-panel'),
}))
jest.mock('primevue/button', () => ({
  name: 'p-button',
  render: h => h('p-button'),
}))
jest.mock('primevue/sidebar', () => ({
  name: 'p-sidebar',
  render: h => h('p-sidebar'),
}))

// Mock error
class MockError extends Error {
  constructor (code, ...args) {
    super(args)
    this.code = code
  }
}

// Mock variables
// Shortcuts
const mockFirstTable = mockDatabase.tables[0]
const mockFirstTableView = mockFirstTable.views[0]
const mockSecondTableView = mockFirstTable.views[1]

// Table view filters
const mockFilters = [
  {
    operator: '$or',
    column: {
      label: mockFirstTable.columns[0].text,
      originalType: mockFirstTable.columns[0].column_type_id,
      type: mockFirstTable.columns[0].column_type_id,
      value: mockFirstTable.columns[0].id,
    },
    action: ACTIONS.EQUAL,
    pattern: 'John',
  },
  {
    operator: '$or',
    column: {
      label: mockFirstTable.columns[0].text,
      originalType: mockFirstTable.columns[0].column_type_id,
      type: mockFirstTable.columns[0].column_type_id,
      value: mockFirstTable.columns[0].id,
    },
    action: ACTIONS.EMPTY,
    pattern: true,
  },
]

// Method to make an object deep copy
function mockDeepCloneObject (object) {
  return object ? JSON.parse(JSON.stringify(object)) : {}
}

// Mock lck functions
jest.mock('@/services/lck-api', () => ({
  lckServices: {
    tableViewColumn: {
      patch: jest.fn((id, data) => {
        const [viewId, columnId] = id.split(',')
        const tableView = mockFirstTable.views.find(view => view.id === viewId)
        return mockDeepCloneObject({ ...tableView.columns.find(column => column.id === columnId), ...data })
      }),
    },
    tableView: {
      patch: jest.fn((id, data) => {
        const tableView = mockFirstTable.views.find(view => view.id === id)
        return mockDeepCloneObject({ ...tableView.columns, ...data })
      }),
    },
    tableColumn: {
      patch: jest.fn((id, data) =>
        (mockDeepCloneObject({ ...mockFirstTable.columns.find(column => column.id === id), ...data }))),
    },
    tableRow: {
      create: jest.fn(({ data, table_id }) => ({
        id: 'TABLE_ROW_ID', ...data, table_id,
      })),
    },
  },
  lckHelpers: {
    searchItems: jest.fn(() => ([
      { label: 'A', value: 1 },
      { label: 'B', value: 2 },
      { label: 'C', value: 3 },
    ])),
    exportTableRowData: jest.fn(() => 'CSV_EXPORT'),
    convertDateInRecords: jest.fn(() => []),
    retrieveViewDefinition: jest.fn((mockTableViewIds) => mockFirstTable.views.filter(view => mockTableViewIds.includes(view.id))),
    retrieveViewData: jest.fn(() => []),
  },
}))

jest.mock('@/services/lck-helpers/database', () => {
  return ({
    retrieveDatabaseTableAndViewsDefinitions: () => (mockDatabase),
    retrieveTableColumns: jest.fn((tableId) => mockDeepCloneObject(mockDatabase.tables.find(table => table.id === tableId).columns)),
    retrieveTableRowsWithSkipAndLimit: jest.fn(() => ({})),
    retrieveTableViews: jest.fn((tableId) => mockDeepCloneObject(mockDatabase.tables.find(table => table.id === tableId).views)),
  })
})

/*
  createProcessRun,
  patchProcess,
  retrieveManualProcessWithRuns,
  retrieveProcessesByRow
*/

jest.mock('@/services/lck-helpers/process', () => ({
  retrieveManualProcessWithRuns: jest.fn(() => ([])),
}))

// Tests

describe('Database', () => {
  // Default database component configuration
  function globalComponentParams (databaseId = 'D1', workspaceId = 'W1', groupId = 'G1') {
    return {
      propsData: { databaseId, workspaceId, groupId },
      mocks: {
        t: key => key,
        $t: key => key,
        $toast: {
          add: jest.fn(),
        },
      },
    }
  }

  describe('Column editing', () => {
    let wrapper
    let datatableWrapper
    let columnFormWrapper

    beforeEach(async () => {
      wrapper = await shallowMount(Database, globalComponentParams())
      await Vue.nextTick()
      datatableWrapper = wrapper.findComponent(DataTable)
    })

    describe('Column sidebar', () => {
      let sidebarWrapper

      beforeEach(async () => {
        sidebarWrapper = wrapper.findComponent({ name: 'p-sidebar' })
      })

      it('Display it from the datatable', async () => {
        expect(sidebarWrapper.attributes('visible')).toBeFalsy()
        await datatableWrapper.vm.$emit('display-column-sidebar')
        expect(sidebarWrapper.attributes('visible')).toBeTruthy()
      })
      it('Hide it when selecting a new column', async () => {
        // Display it
        await datatableWrapper.vm.$emit('display-column-sidebar')
        expect(sidebarWrapper.attributes('visible')).toBeTruthy()
        // Select a column
        await datatableWrapper.vm.$emit('column-select', wrapper.vm.displayColumnsView.columns[0])
        expect(sidebarWrapper.attributes('visible')).toBeFalsy()
      })
    })

    describe('On column edit', () => {
      const updatedColumnData = { text: 'newColumnName' }

      beforeEach(() => {
        lckServices.tableColumn.patch.mockClear()
      })

      it('From the sidebar', async () => {
        // Select a column
        await datatableWrapper.vm.$emit('column-select', wrapper.vm.displayColumnsView.columns[0])
        // Edit the column
        columnFormWrapper = wrapper.findComponent(ColumnForm)
        await columnFormWrapper.vm.$emit('column-edit', updatedColumnData)
        // Send api request
        expect(lckServices.tableColumn.patch).toHaveBeenCalledWith(
          mockFirstTable.columns[0].id,
          updatedColumnData,
        )
        // Update local data
        expect(wrapper.vm.views[0].columns[0].text).toBe(updatedColumnData.text)
        expect(wrapper.vm.views[1].columns[0].text).toBe(updatedColumnData.text)
        expect(wrapper.vm.block.definition.columns[0].text).toBe(updatedColumnData.text)
      })

      it('Don\'t create a form if no column is selected', async () => {
        // Edit the column
        columnFormWrapper = wrapper.findComponent(ColumnForm)
        expect(columnFormWrapper).not.toBe(undefined)
      })

      it('Display a toast if an error is occurred', async () => {
        const spyOnToast = jest.spyOn(wrapper.vm.$toast, 'add')
        lckServices.tableColumn.patch.mockImplementationOnce(() => { throw new Error() })
        // Select a column
        await datatableWrapper.vm.$emit('column-select', wrapper.vm.displayColumnsView.columns[0])
        // Edit the column
        columnFormWrapper = wrapper.findComponent(ColumnForm)
        await columnFormWrapper.vm.$emit('column-edit', updatedColumnData)
        expect(spyOnToast).toHaveBeenCalledTimes(1)
        expect(spyOnToast).toHaveBeenCalledWith(
          expect.objectContaining({
            summary: mockFirstTable.columns[0].text,
            detail: 'error.basic',
          }),
        )
      })

      it('Display a toast with a specific message if a known error is occurred', async () => {
        const spyOnToast = jest.spyOn(wrapper.vm.$toast, 'add')
        lckServices.tableColumn.patch.mockImplementationOnce(() => { throw new MockError(404) })
        // Select a column
        await datatableWrapper.vm.$emit('column-select', wrapper.vm.displayColumnsView.columns[0])
        // Edit the column
        columnFormWrapper = wrapper.findComponent(ColumnForm)
        await columnFormWrapper.vm.$emit('column-edit', updatedColumnData)
        expect(spyOnToast).toHaveBeenCalledTimes(1)
        expect(spyOnToast).toHaveBeenCalledWith(
          expect.objectContaining({
            summary: mockFirstTable.columns[0].text,
            detail: 'error.http.404',
          }),
        )
      })
    })

    describe('On table view column edit', () => {
      const updatedTableColumnData = { displayed: true }

      beforeEach(() => {
        lckServices.tableViewColumn.patch.mockClear()
      })

      it('From the sidebar', async () => {
        // Select a column
        await datatableWrapper.vm.$emit('column-select', wrapper.vm.displayColumnsView.columns[0])
        // Edit the column
        columnFormWrapper = wrapper.findComponent(ColumnForm)
        await columnFormWrapper.vm.$emit('table-view-column-edit', updatedTableColumnData)
        // Send api request
        expect(lckServices.tableViewColumn.patch).toHaveBeenCalledWith(
          `${mockFirstTableView.id},${mockFirstTableView.columns[0].id}`,
          updatedTableColumnData,
        )
        // Update local data
        expect(wrapper.vm.views[0].columns[0].displayed).toBe(updatedTableColumnData.displayed)
      })

      it('From the datatable', async () => {
        // Select a column
        await datatableWrapper.vm.$emit('column-select', wrapper.vm.displayColumnsView.columns[0])
        // Edit the column
        await datatableWrapper.vm.$emit('table-view-column-edit', updatedTableColumnData)
        // Send api request
        expect(lckServices.tableViewColumn.patch).toHaveBeenCalledWith(
          `${mockFirstTableView.id},${mockFirstTableView.columns[0].id}`,
          updatedTableColumnData,
        )
        // Update local data
        expect(wrapper.vm.views[0].columns[0].displayed).toBe(updatedTableColumnData.displayed)
      })

      it('Don\'t update the data if no column is selected', async () => {
        // Edit the column
        columnFormWrapper = wrapper.findComponent(ColumnForm)
        expect(columnFormWrapper).not.toBe(undefined)
      })

      it('Display a toast with a generic message if an unknown error is occurred', async () => {
        const spyOnToast = jest.spyOn(wrapper.vm.$toast, 'add')
        lckServices.tableViewColumn.patch.mockImplementationOnce(() => { throw new Error() })
        // Select a column
        await datatableWrapper.vm.$emit('column-select', wrapper.vm.displayColumnsView.columns[0])
        // Edit the column
        await datatableWrapper.vm.$emit('table-view-column-edit', updatedTableColumnData)
        expect(spyOnToast).toHaveBeenCalledTimes(1)
        expect(spyOnToast).toHaveBeenCalledWith(
          expect.objectContaining({
            summary: mockFirstTable.columns[0].text,
            detail: 'error.basic',
          }),
        )
      })

      it('Display a toast with a specific message if a known error is occurred', async () => {
        const spyOnToast = jest.spyOn(wrapper.vm.$toast, 'add')
        lckServices.tableViewColumn.patch.mockImplementationOnce(() => { throw new MockError(404) })
        // Select a column
        await datatableWrapper.vm.$emit('column-select', wrapper.vm.displayColumnsView.columns[0])
        // Edit the column
        await datatableWrapper.vm.$emit('table-view-column-edit', updatedTableColumnData)
        expect(spyOnToast).toHaveBeenCalledTimes(1)
        expect(spyOnToast).toHaveBeenCalledWith(
          expect.objectContaining({
            summary: mockFirstTable.columns[0].text,
            detail: 'error.http.404',
          }),
        )
      })
    })
  })

  describe('Manage the table view filters', () => {
    let wrapper

    describe('Filters the rows', () => {
      it('If some filters are specified on loading', async () => {
        retrieveTableRowsWithSkipAndLimit.mockClear()
        // Load the component
        wrapper = await shallowMount(Database, {
          ...globalComponentParams(),
        })
        await Vue.nextTick()
        await Vue.nextTick()
        // Check that we use the table view filters
        expect(retrieveTableRowsWithSkipAndLimit).toHaveBeenCalledWith('T1', 'G1', expect.objectContaining(
          {
            filters: {
              '$and[0][data][C11][$eq]': 'John',
            },
          },
        ))
      })
      it('If some filters are specified in the current view', async () => {
        retrieveTableRowsWithSkipAndLimit.mockClear()
        // Load the component
        wrapper = await shallowMount(Database, {
          ...globalComponentParams(),
        })
        await Vue.nextTick()
        await Vue.nextTick()
        wrapper.vm.onSelectView()
        // Check that we use the table view filters
        expect(retrieveTableRowsWithSkipAndLimit).toHaveBeenCalledWith('T1', 'G1', expect.objectContaining(
          {
            filters: {
              '$and[0][data][C11][$eq]': 'John',
            },
          },
        ))
      })
    })

    it('Get all rows from the API if the previous selected table view has filter and the current one has not got any one', async () => {
      retrieveTableRowsWithSkipAndLimit.mockClear()
      // Load the component
      wrapper = await shallowMount(Database, {
        ...globalComponentParams(),
      })
      await Vue.nextTick()
      await Vue.nextTick()
      // Simulate a table view selection
      await wrapper.setData({
        selectedViewId: wrapper.vm.views[1].id,
      })
      wrapper.vm.onSelectView()
      // Check that we get all rows
      expect(retrieveTableRowsWithSkipAndLimit).toHaveBeenCalledWith('T1', 'G1', expect.objectContaining(
        {
          filters: {},
        },
      ))
    })

    it('Do not get rows from the API if the current table view has not got any filter and we do not have it before', async () => {
      // Load the component
      wrapper = await shallowMount(Database, {
        ...globalComponentParams(),
      })
      await Vue.nextTick()
      await Vue.nextTick()
      // Reset the filters
      await wrapper.setData({
        currentDatatableFilters: [],
      })
      retrieveTableRowsWithSkipAndLimit.mockClear()
      // Simulate a table view selection
      await wrapper.setData({
        selectedViewId: wrapper.vm.views[1].id,
      })
      wrapper.vm.onSelectView()
      // Check that we do not get the rows
      expect(retrieveTableRowsWithSkipAndLimit).not.toHaveBeenCalled()
    })

    describe('Save the filters', () => {
      let spyOnToast
      beforeAll(async () => {
        wrapper = await shallowMount(Database, {
          ...globalComponentParams(),
        })
        await Vue.nextTick()
        await Vue.nextTick()
        spyOnToast = jest.spyOn(wrapper.vm.$toast, 'add')
      })

      beforeEach(() => {
        spyOnToast.mockClear()
      })

      it('Update the table view filter if some filters are specified', async () => {
        // Set the filters
        await wrapper.setData({
          currentDatatableFilters: mockFilters,
        })
        // Save the filters
        await wrapper.vm.onSaveFilter()
        expect(wrapper.vm.currentView.filter).toEqual({
          operator: '$or',
          values: [
            {
              action: 'isEqualTo',
              column: 'C11',
              dbAction: '$eq',
              pattern: 'John',
            },
            {
              action: 'isEmpty',
              column: 'C11',
              dbAction: '$null',
              pattern: true,
            },
          ],
        })
        // Display a sucessful message
        expect(spyOnToast).toHaveBeenCalledTimes(1)
        expect(spyOnToast).toHaveBeenCalledWith(
          expect.objectContaining({
            summary: 'success.save',
            detail: 'components.datatable.toolbar.filters.updateSuccess',
          }),
        )
      })

      it('Reset the table view filter if no filter is specified', async () => {
        // Reset the filters
        await wrapper.setData({
          currentDatatableFilters: [],
        })
        // Save the filters
        await wrapper.vm.onSaveFilter()
        expect(wrapper.vm.currentView.filter).toBeNull()
        // Display a sucessful message
        expect(spyOnToast).toHaveBeenCalledTimes(1)
        expect(spyOnToast).toHaveBeenCalledWith(
          expect.objectContaining({
            summary: 'success.save',
            detail: 'components.datatable.toolbar.filters.resetSuccess',
          }),
        )
      })

      it('Display an error message if an API error is encountered', async () => {
        // Simulate an API error
        lckServices.tableView.patch.mockImplementationOnce(() => { throw new Error() })
        // Save the filters
        await wrapper.vm.onSaveFilter()
        // Display an error message
        expect(spyOnToast).toHaveBeenCalledTimes(1)
        expect(spyOnToast).toHaveBeenCalledWith(
          expect.objectContaining({
            summary: 'error.basic',
            detail: 'components.datatable.toolbar.filters.updateError',
          }),
        )
      })
    })
  })
  describe('Manage secondary sources', () => {
    let wrapper
    beforeEach(async () => {
      wrapper = await shallowMount(Database, {
        ...globalComponentParams(),
        data: () => ({
          displayNewDialog: true,
        }),
      })
      await Vue.nextTick()
    })
    it('load the specified secondary sources', async () => {
      // Initialization
      expect(wrapper.vm.secondarySources).toEqual({})
      lckHelpers.retrieveViewDefinition.mockClear()
      // Get the secondary sources the first time
      await wrapper.vm.getSecondarySources([
        mockFirstTableView.id,
      ])
      // Database calls
      expect(lckHelpers.retrieveViewDefinition).toHaveBeenCalledTimes(1)
      expect(lckHelpers.retrieveViewDefinition).toHaveBeenCalledWith([
        mockFirstTableView.id,
      ])
      // Result
      expect(wrapper.vm.secondarySources).toEqual({
        [mockFirstTableView.id]: {
          definition: mockFirstTableView,
          content: [],
        },
      })
      lckHelpers.retrieveViewDefinition.mockClear()
      // Get the secondary sources the second time
      await wrapper.vm.getSecondarySources([
        mockFirstTableView.id,
        mockSecondTableView.id,
      ])
      // Database calls
      expect(lckHelpers.retrieveViewDefinition).toHaveBeenCalledTimes(1)
      expect(lckHelpers.retrieveViewDefinition).toHaveBeenCalledWith([
        mockSecondTableView.id,
      ])
      // Result
      expect(wrapper.vm.secondarySources).toEqual({
        [mockFirstTableView.id]: {
          definition: mockFirstTableView,
          content: [],
        },
        [mockSecondTableView.id]: {
          definition: mockSecondTableView,
          content: [],
        },
      })
    })
    describe('reset the secondary sources', () => {
      it('reset all if no table view id is specified', async () => {
        // Get the secondary sources the second time
        await wrapper.vm.getSecondarySources([
          mockFirstTableView.id,
          mockSecondTableView.id,
        ])
        wrapper.vm.resetSecondarySources()
        expect(wrapper.vm.secondarySources).toEqual({})
      })
      it('only reset the ones linked to the specified table view id', async () => {
        // Get the secondary sources the second time
        await wrapper.vm.getSecondarySources([
          mockFirstTableView.id,
          mockSecondTableView.id,
        ])
        wrapper.vm.resetSecondarySources(mockFirstTableView.id)
        expect(wrapper.vm.secondarySources).toEqual(expect.not.objectContaining({
          [mockFirstTableView.id]: {
            definition: mockFirstTableView,
            content: [],
          },
        }))
      })
      it('do nothing id the specified table view id was not load', async () => {
        // Get the secondary sources the second time
        await wrapper.vm.getSecondarySources([
          mockFirstTableView.id,
        ])
        wrapper.vm.resetSecondarySources(mockSecondTableView.id)
        expect(wrapper.vm.secondarySources).toEqual({
          [mockFirstTableView.id]: {
            definition: mockFirstTableView,
            content: [],
          },
        })
      })
    })
  })
})
