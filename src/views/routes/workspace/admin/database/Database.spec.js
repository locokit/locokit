/* eslint-disable @typescript-eslint/camelcase */

import { mount, shallowMount } from '@vue/test-utils'
import { flushAll } from '@/../tests/unit/local-test-utils'

import {
  retrieveTableRowsWithSkipAndLimit,
} from '@/services/lck-helpers/database'
import { ACTIONS } from '@/services/lck-utils/filter'
import { lckServices, lckHelpers } from '@/services/lck-api'

import Database from './Database.vue'
import DataDetail from '@/components/store/DataDetail/DataDetail.vue'
import DataTable from '@/components/store/DataTable/DataTable.vue'
import ColumnForm from '@/components/store/ColumnForm/ColumnForm.vue'

import Vue from 'vue'

import {
  mockDatabase,
  mockFile1,
  mockFile2,
  mockRowsByTable,
} from '@/services/lck-helpers/__mocks__/database'

const {
  formatRowData: mockFormatRowData,
  convertDateInRecords: mockConvertDateInRecords,
} = jest.requireActual('@/services/lck-api/helpers')

// Mock external libraries
jest.mock('file-saver')

// Mock primevue component
jest.mock('primevue/tabview', () => ({
  name: 'p-tab-view',
  render: h => h(),
}))
jest.mock('primevue/tabpanel', () => ({
  name: 'p-tab-panel',
  render: h => h(),
}))
jest.mock('primevue/sidebar', () => ({
  name: 'p-sidebar',
  render: h => h(),
}))
jest.mock('primevue/dropdown', () => ({
  name: 'p-dropdown',
  render: h => h(),
}))
jest.mock('primevue/inputnumber', () => ({
  name: 'p-input-number',
  render: h => h(),
}))
jest.mock('primevue/splitbutton', () => ({
  name: 'p-split-button',
  render: h => h(),
}))
jest.mock('primevue/inputtext', () => ({
  name: 'p-input-text',
  render: h => h(),
}))
jest.mock('primevue/textarea', () => ({
  name: 'p-textarea',
  render: h => h(),
}))
jest.mock('primevue/inputswitch', () => ({
  name: 'p-input-switch',
  render: h => h(),
}))
jest.mock('primevue/calendar', () => ({
  name: 'p-calendar',
  render: h => h(),
}))
jest.mock('primevue/contextmenu', () => ({
  name: 'p-context-menu',
  render: h => h(),
}))
jest.mock('primevue/button', () => ({
  name: 'p-button',
  render: h => h(),
}))
jest.mock('primevue/menu', () => ({
  name: 'p-menu',
  render: h => h(),
}))
jest.mock('primevue/checkbox', () => ({
  name: 'p-checkbox',
  render: h => h(),
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
const mockTables = mockDatabase.tables
const mockFirstTable = mockTables[0]
const mockFirstTableView = mockFirstTable.views[0]
const mockSecondTableView = mockFirstTable.views[1]
const mockColumns = mockTables[0].columns.concat(mockTables[1].columns)
const mockTableViews = mockTables[0].views.concat(mockTables[1].views)
const mockTableViewColumns = mockTableViews[0].columns.concat(mockTableViews[1].columns)
const mockRows = mockRowsByTable.T1

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
function mockDeepCloneObject (object, defaultValue = {}) {
  return object ? JSON.parse(JSON.stringify(object)) : defaultValue
}

// Mock lck functions
jest.mock('@/services/lck-api', () => ({
  lckServices: {
    tableViewColumn: {
      patch: jest.fn((id, data) => {
        const tableViewColumn = mockTableViewColumns.find(column => column.id === id)
        return mockDeepCloneObject({ ...tableViewColumn, ...data })
      }),
      create: jest.fn(),
      remove: jest.fn(),
    },
    tableView: {
      patch: jest.fn((id, data) => {
        const tableView = mockTableViews.find(view => view.id === id)
        return mockDeepCloneObject({ ...tableView, ...data })
      }),
      get: jest.fn(id => {
        const tableView = mockTableViews.find(view => view.id === id)
        return mockDeepCloneObject(tableView)
      }),
    },
    tableColumn: {
      patch: jest.fn((id, data) => {
        const tableColumn = mockColumns.find(c => c.id === id)
        return mockDeepCloneObject({ ...tableColumn, ...data })
      }),
    },
    tableRow: {
      create: jest.fn(({ data, table_id }) => ({
        id: 'TABLE_ROW_ID', ...data, table_id,
      })),
      patch: jest.fn((rowId, { data }) => {
        const row = mockRows.find(row => row.id === rowId)
        const finalData = {
          ...row.data,
          data,
        }
        if (row) {
          return mockDeepCloneObject({
            ...row,
            data: finalData,
          })
        }
      }),
    },
  },
  lckHelpers: {
    searchItems: jest.fn(() => ([
      { label: 'A', value: 1 },
      { label: 'B', value: 2 },
      { label: 'C', value: 3 },
    ])),
    exportTableRowData: jest.fn(() => 'CSV_EXPORT'),
    convertDateInRecords: jest.fn((...params) => mockConvertDateInRecords(...params)),
    retrieveViewDefinition: jest.fn(
      (mockTableViewIds) => mockDeepCloneObject(mockTableViews.filter(view => mockTableViewIds.includes(view.id))),
    ),
    retrieveViewData: jest.fn(() => []),
    searchBooleanColumnsFromTableView: jest.fn(),
    searchPageWithChapter: jest.fn(),
    formatRowData: jest.fn((...params) => mockFormatRowData(...params)),
    uploadMultipleFiles: jest.fn((fileList, workspaceId) => {
      return fileList.map((file, index) => {
        return {
          id: index,
          filepath: `${index}/${file.name}`,
          filename: file.name,
          mime: file.type,
          ext: file.name.split('.').pop(),
          size: 10,
          createdAt: '2021-09-27T08:44:22.102Z',
          updatedAt: '2021-09-27T08:44:22.102Z',
          workspace_id: workspaceId,
          thumbnail: false,
        }
      })
    }),
  },
}))

jest.mock('@/services/lck-helpers/database', () => {
  return ({
    retrieveDatabaseTableAndViewsDefinitions: jest.fn(() => mockDeepCloneObject(mockDatabase)),
    retrieveTableColumns: jest.fn(
      (tableId) => mockDeepCloneObject(
        mockTables.find(table => table.id === tableId)?.columns?.sort((c1, c2) => c1.position - c2.position),
        [],
      ),
    ),
    retrieveTableRowsWithSkipAndLimit: jest.fn((tableId, groupId, filters) => {
      const rowsToGet = mockDeepCloneObject(mockRowsByTable[tableId])
      return {
        data: rowsToGet,
        total: rowsToGet.length,
        limit: filters.limit,
        skip: filters.skip,
      }
    }),
    retrieveTableViews: jest.fn(tableId =>
      mockDeepCloneObject(mockDatabase.tables.find(table => table.id === tableId).views, []),
    ),
  })
})

jest.mock('@/services/lck-helpers/process', () => ({
  retrieveManualProcessWithRuns: jest.fn(() => ([])),
  retrieveProcessesByRow: jest.fn(() => ([])),
}))

// Mock lck components
jest.mock('@/components/ui/ColumnType/Geometry/Map.vue', () => ({
  name: 'lck-map',
  render: h => h(),
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
        $tc: key => key,
        $toast: {
          add: jest.fn(),
        },
      },
    }
  }

  describe('Column editing', () => {
    let wrapper
    let lckDatatableWrapper
    let columnFormWrapper

    beforeEach(async () => {
      wrapper = await shallowMount(Database, globalComponentParams())
      await Vue.nextTick()
      lckDatatableWrapper = wrapper.findComponent(DataTable)
    })

    describe('Column sidebar', () => {
      let sidebarWrapper

      beforeEach(async () => {
        sidebarWrapper = wrapper.findComponent({ name: 'p-sidebar' })
      })

      it('Display it from the datatable', async () => {
        expect(sidebarWrapper.attributes('visible')).toBeFalsy()
        await lckDatatableWrapper.vm.$emit('display-column-sidebar')
        expect(sidebarWrapper.attributes('visible')).toBeTruthy()
      })
      it('Hide it when selecting a new column', async () => {
        // Display it
        await lckDatatableWrapper.vm.$emit('display-column-sidebar')
        expect(sidebarWrapper.attributes('visible')).toBeTruthy()
        // Select a column
        await lckDatatableWrapper.vm.$emit('column-select', wrapper.vm.displayColumnsView.columns[0])
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
        await lckDatatableWrapper.vm.$emit('column-select', wrapper.vm.displayColumnsView.columns[0])
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
        await lckDatatableWrapper.vm.$emit('column-select', wrapper.vm.displayColumnsView.columns[0])
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
        await lckDatatableWrapper.vm.$emit('column-select', wrapper.vm.displayColumnsView.columns[0])
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
        await lckDatatableWrapper.vm.$emit('column-select', wrapper.vm.displayColumnsView.columns[0])
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
        await lckDatatableWrapper.vm.$emit('column-select', wrapper.vm.displayColumnsView.columns[0])
        // Edit the column
        await lckDatatableWrapper.vm.$emit('table-view-column-edit', updatedTableColumnData)
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
        await lckDatatableWrapper.vm.$emit('column-select', wrapper.vm.displayColumnsView.columns[0])
        // Edit the column
        await lckDatatableWrapper.vm.$emit('table-view-column-edit', updatedTableColumnData)
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
        await lckDatatableWrapper.vm.$emit('column-select', wrapper.vm.displayColumnsView.columns[0])
        // Edit the column
        await lckDatatableWrapper.vm.$emit('table-view-column-edit', updatedTableColumnData)
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

  describe('Table view editing', () => {
    let wrapper

    beforeAll(async () => {
      wrapper = await shallowMount(Database, globalComponentParams())
      await Vue.nextTick()
      lckServices.tableViewColumn.patch.mockClear()
      lckServices.tableViewColumn.create.mockClear()
      lckServices.tableViewColumn.remove.mockClear()
    })

    describe('Manage the columns', () => {
      it('onChangeViewColumns', async () => {
        await wrapper.vm.onChangeViewColumns({ value: ['C120', 'C13'] })
        // Send api requests
        // To remove some columns from the view
        expect(lckServices.tableViewColumn.remove).toHaveBeenCalledTimes(18)
        expect(lckServices.tableViewColumn.remove).toHaveBeenCalledWith(`${mockFirstTableView.id},C11`)
        expect(lckServices.tableViewColumn.remove).toHaveBeenCalledWith(`${mockFirstTableView.id},C12`)
        // To add the new columns to the view
        expect(lckServices.tableViewColumn.create).toHaveBeenCalledTimes(1)
        expect(lckServices.tableViewColumn.create).toHaveBeenCalledWith(expect.objectContaining({
          table_column_id: 'C120',
          table_view_id: mockFirstTableView.id,
          position: 1,
        }))
        // To update the positions of the columns which are already used before
        expect(lckServices.tableViewColumn.patch).toHaveBeenCalledTimes(1)
        expect(lckServices.tableViewColumn.patch).toHaveBeenCalledWith(`${mockFirstTableView.id},C13`, {
          position: 0,
        })
      })
    })
  })

  describe('Row duplication', () => {
    beforeAll(async () => {
      // Mount the wrapper
      const wrapper = await mount(Database, globalComponentParams())
      jest.useFakeTimers()
      await flushAll()
      const lckDatatableWrapper = wrapper.findComponent(DataTable)

      // Duplicate the second row
      await lckDatatableWrapper.vm.$emit('row-duplicate', lckDatatableWrapper.props('content').data[1])
      await flushAll()
    })

    it('Of a string column', async () => {
      expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          [mockFirstTableView.columns[0].id]: 'Jane',
        }),
      }))
    })

    it('Of a user column', async () => {
      expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          [mockFirstTableView.columns[4].id]: 'user-2',
        }),
      }))
    })

    it('Of a boolean column', async () => {
      expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          [mockFirstTableView.columns[5].id]: false,
        }),
      }))
    })

    it('Of an integer column', async () => {
      expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          [mockFirstTableView.columns[6].id]: 2,
        }),
      }))
    })

    it('Of a decimal number column', async () => {
      expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          [mockFirstTableView.columns[7].id]: 2.5,
        }),
      }))
    })

    it('Of a date column', async () => {
      expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          [mockFirstTableView.columns[8].id]: '2021-09-02',
        }),
      }))
    })

    it('Of a group column', async () => {
      expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          [mockFirstTableView.columns[9].id]: 'group-1',
        }),
      }))
    })

    it('Of a relation between tables column', async () => {
      expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          [mockFirstTableView.columns[10].id]: 'row-1b',
        }),
      }))
    })

    it('Of a single select column', async () => {
      expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          [mockFirstTableView.columns[11].id]: 'option2',
        }),
      }))
    })

    it('Of a multi select column', async () => {
      expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          [mockFirstTableView.columns[12].id]: ['option1', 'option2'],
        }),
      }))
    })

    it('Of a file column', async () => {
      expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          [mockFirstTableView.columns[13].id]: [1],
        }),
      }))
    })

    it('Of a multi user column (when selecting an item)', async () => {
      expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          [mockFirstTableView.columns[14].id]: ['user-2', 'user-4'],
        }),
      }))
    })

    it('Of a text column', async () => {
      expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          [mockFirstTableView.columns[15].id]: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        }),
      }))
    })

    it('Of a URL column', async () => {
      expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          [mockFirstTableView.columns[16].id]: 'https://www.locokit.io',
        }),
      }))
    })

    it('Of a geographic column', async () => {
      expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          [mockFirstTableView.columns[17].id]: 'SRID=4326;POINT(1.2 45)',
        }),
      }))
    })

    it('Of a datetime column', async () => {
      expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          [mockFirstTableView.columns[18].id]: '2021-09-02T12:00:00Z',
        }),
      }))
    })
  })

  describe('Row creation from the data detail form', () => {
    beforeAll(async () => {
      // Mount the wrapper
      const wrapper = await mount(Database, globalComponentParams())
      jest.useFakeTimers()
      await flushAll()

      // Display the creation form
      await wrapper.vm.onClickAddButton()
      await flushAll()

      const lckDataDetailWrapper = wrapper.findComponent(DataDetail)
      const lckFormWrapper = wrapper.find('.newRowDialogForm')

      // Get the right inputs
      const textInput = lckDataDetailWrapper.findComponent({ name: 'p-input-text' })
      const autocompleteInputs = lckDataDetailWrapper.findAllComponents({ name: 'LckAutoComplete' })
      const checkboxInput = lckDataDetailWrapper.findComponent({ name: 'p-checkbox' })
      const numberInputs = lckDataDetailWrapper.findAllComponents({ name: 'p-input-number' })
      const dateInputs = lckDataDetailWrapper.findAllComponents({ name: 'p-calendar' })
      const dropdownInput = lckDataDetailWrapper.findComponent({ name: 'p-dropdown' })
      const multiSelectInput = lckDataDetailWrapper.findComponent({ name: 'LckMultiSelect' })
      const fileInput = lckDataDetailWrapper.findComponent({ name: 'LckFileInput' })
      const multiAutocompleteInput = lckDataDetailWrapper.findComponent({ name: 'MultiLckAutoComplete' })
      const textareaInput = lckDataDetailWrapper.findComponent({ name: 'p-textarea' })
      const URLInput = lckDataDetailWrapper.findComponent({ name: 'LckURLInput' })
      // Mock the HTML validity API which seems to not be implemented in jest
      URLInput.vm.$refs.URLInput.$el.validity = {
        valid: true,
      }
      const geoInput = lckDataDetailWrapper.findComponent({ name: 'lck-map' })

      // Initialize the row data
      // String column
      await textInput.vm.$emit('input', 'JOHN')
      await textInput.vm.$emit('blur')
      // User column
      await autocompleteInputs.at(0).vm.$emit('item-select',
        {
          value: {
            label: 'Jack Noe',
            value: 'user-4',
          },
        },
      )
      // Boolean column
      await checkboxInput.vm.$emit('input', true)
      // Integer column
      await numberInputs.at(0).vm.$emit('input', 10)
      await numberInputs.at(0).vm.$emit('blur')
      // Decimal column
      await numberInputs.at(1).vm.$emit('input', 10.5)
      await numberInputs.at(1).vm.$emit('blur')
      // Date column
      await dateInputs.at(0).vm.$emit('input', new Date(2021, 9, 1))
      await dateInputs.at(0).vm.$emit('hide')
      // Group column
      await autocompleteInputs.at(1).vm.$emit('item-select',
        {
          value: {
            label: 'Group 3',
            value: 'group-3',
          },
        },
      )
      // Relation between tables column
      await autocompleteInputs.at(2).vm.$emit('item-select',
        {
          value: {
            label: 'Supplier 1',
            value: 'row-1b',
          },
        },
      )
      // Single select column
      await dropdownInput.vm.$emit('input', 'option1')
      // Multi select column
      await multiSelectInput.vm.$emit('input', ['option1', 'option2'])
      // File column
      const uploadedFiles = [
        new File([], 'myFile1.jpeg'),
        new File([], 'myFile2.jpeg'),
      ]
      await fileInput.vm.$emit('input', uploadedFiles) // Two files (id: 0, id: 1) are added
      await fileInput.vm.$emit('remove-attachment', 0)
      // Multi user column
      multiAutocompleteInput.vm.$emit('input', [
        {
          label: 'Jane Poe',
          value: 'user-2',
        },
      ])
      await multiAutocompleteInput.vm.$emit('item-select')
      // Text column
      textareaInput.vm.$emit('input', 'Tempora excepturi voluptates dolorem sunt doloremque quia quae.')
      await textareaInput.vm.$emit('blur')
      // URL column
      await URLInput.vm.$emit('input', 'https://www.locokit.io/img/train.png')
      await URLInput.vm.$emit('blur')
      // Geographic column
      const geoColumn = mockFirstTableView.columns[16]
      await geoInput.vm.$emit('update-features', [
        {
          id: `row-1:${geoColumn.id}`,
          type: 'Feature',
          properties: {
            id: `row-1:${geoColumn.id}`,
            columnId: geoColumn.id,
            rowId: 'row-1',
            sourceId: mockFirstTableView.id,
          },
          geometry: {
            coordinates: [-2.85, 46.49],
            type: 'Point',
          },
        },
      ])
      // Datetime column
      await dateInputs.at(1).vm.$emit('input', new Date(2021, 9, 1, 12, 0, 0))
      await dateInputs.at(1).vm.$emit('hide')

      // Submit the form
      await lckFormWrapper.vm.$emit('input')
    })

    it('Of a string column', async () => {
      expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          [mockFirstTableView.columns[0].id]: 'JOHN',
        }),
      }))
    })

    it('Of a user column', async () => {
      expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          [mockFirstTableView.columns[4].id]: 'user-4',
        }),
      }))
    })

    it('Of a boolean column', async () => {
      expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          [mockFirstTableView.columns[5].id]: true,
        }),
      }))
    })

    it('Of an integer column', async () => {
      expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          [mockFirstTableView.columns[6].id]: 10,
        }),
      }))
    })

    it('Of a decimal number column', async () => {
      expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          [mockFirstTableView.columns[7].id]: 10.5,
        }),
      }))
    })

    it('Of a date column', async () => {
      expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          [mockFirstTableView.columns[8].id]: '2021-10-01',
        }),
      }))
    })

    it('Of a group column', async () => {
      expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          [mockFirstTableView.columns[9].id]: 'group-3',
        }),
      }))
    })

    it('Of a relation between tables column', async () => {
      expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          [mockFirstTableView.columns[10].id]: 'row-1b',
        }),
      }))
    })

    it('Of a single select column', async () => {
      expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          [mockFirstTableView.columns[11].id]: 'option1',
        }),
      }))
    })

    it('Of a multi select column', async () => {
      expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          [mockFirstTableView.columns[12].id]: ['option1', 'option2'],
        }),
      }))
    })

    it('Of a file column', async () => {
      expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          [mockFirstTableView.columns[13].id]: [1],
        }),
      }))
    })

    it('Of a multi user column (when selecting an item)', async () => {
      expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          [mockFirstTableView.columns[14].id]: ['user-2'],
        }),
      }))
    })

    it('Of a text column', async () => {
      expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          [mockFirstTableView.columns[15].id]: 'Tempora excepturi voluptates dolorem sunt doloremque quia quae.',
        }),
      }))
    })

    it('Of a URL column', async () => {
      expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          [mockFirstTableView.columns[16].id]: 'https://www.locokit.io/img/train.png',
        }),
      }))
    })

    it('Of a geographic column', async () => {
      expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          [mockFirstTableView.columns[17].id]: 'SRID=4326;POINT(-2.85 46.49)',
        }),
      }))
    })

    it('Of a datetime column', async () => {
      expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          [mockFirstTableView.columns[18].id]: '2021-10-01T12:00:00Z',
        }),
      }))
    })
  })

  describe('Row editing from the data detail form', () => {
    let lckDataDetailWrapper

    beforeAll(async () => {
      const wrapper = await mount(Database, globalComponentParams())
      jest.useFakeTimers()
      await flushAll()

      // Display the data detail form
      await wrapper.vm.onOpenDetail({ rowId: mockRows[0].id })
      lckDataDetailWrapper = wrapper.findComponent(DataDetail)
    })

    beforeEach(async () => {
      await flushAll()
      lckServices.tableRow.patch.mockClear()
    })

    it('Of a string column', async () => {
      expect.assertions(1)
      // Get the right input
      const tableColumn = mockFirstTableView.columns[0]
      const input = lckDataDetailWrapper.findComponent({ name: 'p-input-text' })
      // Change the value
      await input.vm.$emit('input', 'JOHN')
      // Simulate the end of the user input
      await input.vm.$emit('blur')
      // Check the API call
      expect(lckServices.tableRow.patch).toHaveBeenLastCalledWith('row-1', expect.objectContaining({
        data: {
          [tableColumn.id]: 'JOHN',
        },
      }))
    })

    it('Of a user column (selection)', async () => {
      expect.assertions(1)
      // Get the right input
      const tableColumn = mockFirstTableView.columns[4]
      const input = lckDataDetailWrapper.findComponent({ name: 'LckAutoComplete' })
      // Change the value
      await input.vm.$emit('item-select',
        {
          value: {
            label: 'Jack Noe',
            value: 'user-4',
          },
        },
      )
      // Check the API call
      expect(lckServices.tableRow.patch).toHaveBeenLastCalledWith('row-1', expect.objectContaining({
        data: {
          [tableColumn.id]: 'user-4',
        },
      }))
    })

    it('Of a user column (clear)', async () => {
      expect.assertions(1)
      // Get the right input
      const tableColumn = mockFirstTableView.columns[4]
      const input = lckDataDetailWrapper.findComponent({ name: 'LckAutoComplete' })
      // Change the value
      await input.vm.$emit('clear')
      // Check the API call
      expect(lckServices.tableRow.patch).toHaveBeenLastCalledWith('row-1', expect.objectContaining({
        data: {
          [tableColumn.id]: null,
        },
      }))
    })

    it('Of a boolean column', async () => {
      expect.assertions(1)
      // Get the right input
      const tableColumn = mockFirstTableView.columns[5]
      const input = lckDataDetailWrapper.findComponent({ name: 'p-checkbox' })
      // Change the value
      await input.vm.$emit('input', false)
      // Check the API call
      expect(lckServices.tableRow.patch).toHaveBeenLastCalledWith('row-1', expect.objectContaining({
        data: {
          [tableColumn.id]: false,
        },
      }))
    })

    it('Of an integer column', async () => {
      expect.assertions(1)
      // Get the right input
      const tableColumn = mockFirstTableView.columns[6]
      const input = lckDataDetailWrapper.findComponent({ name: 'p-input-number' })
      // Change the value
      await input.vm.$emit('input', 10)
      // Simulate the end of the user input
      await input.vm.$emit('blur')
      // Check the API call
      expect(lckServices.tableRow.patch).toHaveBeenLastCalledWith('row-1', expect.objectContaining({
        data: {
          [tableColumn.id]: 10,
        },
      }))
    })

    it('Of a decimal number column', async () => {
      expect.assertions(1)
      // Get the right input
      const tableColumn = mockFirstTableView.columns[7]
      const input = lckDataDetailWrapper.findAllComponents({ name: 'p-input-number' }).at(1)
      // Change the value
      await input.vm.$emit('input', 10.5)
      // Simulate the end of the user input
      await input.vm.$emit('blur')
      // Check the API call
      expect(lckServices.tableRow.patch).toHaveBeenLastCalledWith('row-1', expect.objectContaining({
        data: {
          [tableColumn.id]: 10.5,
        },
      }))
    })

    it('Of a date column - valid date', async () => {
      expect.assertions(1)
      // Get the right input
      const tableColumn = mockFirstTableView.columns[8]
      const input = lckDataDetailWrapper.findComponent({ name: 'p-calendar' })
      // Change the value
      await input.vm.$emit('input', new Date(2021, 9, 1))
      // Simulate the end of the user input
      await input.vm.$emit('hide')
      // Check the API call
      expect(lckServices.tableRow.patch).toHaveBeenLastCalledWith('row-1', expect.objectContaining({
        data: {
          [tableColumn.id]: '2021-10-01',
        },
      }))
    })

    it('Of a date column - empty string', async () => {
      expect.assertions(1)
      // Get the right input
      const tableColumn = mockFirstTableView.columns[8]
      const input = lckDataDetailWrapper.findComponent({ name: 'p-calendar' })
      // Change the value
      await input.vm.$emit('input', '')
      // Simulate the end of the user input
      await input.vm.$emit('hide')
      // Check the API call
      expect(lckServices.tableRow.patch).toHaveBeenLastCalledWith('row-1', expect.objectContaining({
        data: {
          [tableColumn.id]: null,
        },
      }))
    })

    it('Of a group column', async () => {
      expect.assertions(1)
      // Get the right input
      const tableColumn = mockFirstTableView.columns[9]
      const input = lckDataDetailWrapper.findAllComponents({ name: 'LckAutoComplete' }).at(1)
      // Change the value
      await input.vm.$emit('item-select',
        {
          value: {
            label: 'Group 3',
            value: 'group-3',
          },
        },
      )
      // Check the API call
      expect(lckServices.tableRow.patch).toHaveBeenLastCalledWith('row-1', expect.objectContaining({
        data: {
          [tableColumn.id]: 'group-3',
        },
      }))
    })

    it('Of a relation between tables column', async () => {
      expect.assertions(1)
      // Get the right input
      const tableColumn = mockFirstTableView.columns[10]
      const input = lckDataDetailWrapper.findAllComponents({ name: 'LckAutoComplete' }).at(2)
      // Change the value
      await input.vm.$emit('item-select',
        {
          value: {
            label: 'Supplier 1',
            value: 'row-1b',
          },
        },
      )
      // Check the API call
      expect(lckServices.tableRow.patch).toHaveBeenLastCalledWith('row-1', expect.objectContaining({
        data: {
          [tableColumn.id]: 'row-1b',
        },
      }))
    })

    it('Of a single select column', async () => {
      expect.assertions(1)
      // Get the right input
      const tableColumn = mockFirstTableView.columns[11]
      const input = lckDataDetailWrapper.findComponent({ name: 'p-dropdown' })
      // Change the value
      await input.vm.$emit('input', 'option1')
      // Check the API call
      expect(lckServices.tableRow.patch).toHaveBeenLastCalledWith('row-1', expect.objectContaining({
        data: {
          [tableColumn.id]: 'option1',
        },
      }))
    })

    it('Of a multi select column', async () => {
      expect.assertions(1)
      // Get the right input
      const tableColumn = mockFirstTableView.columns[12]
      const input = lckDataDetailWrapper.findComponent({ name: 'LckMultiSelect' })
      // Change the value
      await input.vm.$emit('input', ['option1', 'option2'])
      // Check the API call
      expect(lckServices.tableRow.patch).toHaveBeenLastCalledWith('row-1', expect.objectContaining({
        data: {
          [tableColumn.id]: ['option1', 'option2'],
        },
      }))
    })

    it('Of a file column (addition)', async () => {
      expect.assertions(1)
      // Get the right input
      const tableColumn = mockFirstTableView.columns[13]
      const input = lckDataDetailWrapper.findComponent({ name: 'LckFileInput' })
      // Change the value
      const uploadedFiles = [
        new File([], 'myFile1.jpeg'),
      ]
      // Change the value
      await input.vm.$emit(
        'input',
        uploadedFiles,
      )
      // Check the API call
      expect(lckServices.tableRow.patch).toHaveBeenLastCalledWith('row-1', expect.objectContaining({
        data: {
          [tableColumn.id]: expect.arrayContaining([
            // Previous files
            mockFile1.id,
            mockFile2.id,
            // New file
            0,
          ]),
        },
      }))
    })

    it('Of a file column (deletion)', async () => {
      expect.assertions(1)
      // Get the right input
      const tableColumn = mockFirstTableView.columns[13]
      const input = lckDataDetailWrapper.findComponent({ name: 'LckFileInput' })
      // Change the value
      await input.vm.$emit(
        'remove-attachment',
        mockFile1.id,
      )
      // Check the API call
      expect(lckServices.tableRow.patch).toHaveBeenLastCalledWith('row-1', expect.objectContaining({
        data: {
          [tableColumn.id]: [mockFile2.id],
        },
      }))
    })

    it('Of a multi user column (when selecting an item)', async () => {
      expect.assertions(1)
      // Get the right input
      const tableColumn = mockFirstTableView.columns[14]
      const input = lckDataDetailWrapper.findComponent({ name: 'MultiLckAutoComplete' })
      // Change the value
      await input.vm.$emit('input', [
        {
          label: 'Jane Poe',
          value: 'user-2',
        },
      ])
      await input.vm.$emit('item-select')
      // Check the API call
      expect(lckServices.tableRow.patch).toHaveBeenLastCalledWith('row-1', expect.objectContaining({
        data: {
          [tableColumn.id]: ['user-2'],
        },
      }))
    })

    it('Of a multi user column (when deselecting an item)', async () => {
      expect.assertions(1)
      // Get the right input
      const tableColumn = mockFirstTableView.columns[14]
      const input = lckDataDetailWrapper.findComponent({ name: 'MultiLckAutoComplete' })
      // Change the value
      await input.vm.$emit('input', [
        {
          label: 'Frank Doe',
          value: 'user-3',
        },
      ])
      await input.vm.$emit('item-unselect')
      // Check the API call
      expect(lckServices.tableRow.patch).toHaveBeenLastCalledWith('row-1', expect.objectContaining({
        data: {
          [tableColumn.id]: expect.arrayContaining(['user-3']),
        },
      }))
    })

    it('Of a text column', async () => {
      expect.assertions(1)
      // Get the right input
      const tableColumn = mockFirstTableView.columns[15]
      const newLongText = 'Tempora excepturi voluptates dolorem sunt doloremque quia quae'
      const input = lckDataDetailWrapper.findComponent({ name: 'p-textarea' })
      // Change the value
      await input.vm.$emit('input', newLongText)
      await input.vm.$emit('blur')
      // Check the API call
      expect(lckServices.tableRow.patch).toHaveBeenLastCalledWith('row-1', expect.objectContaining({
        data: {
          [tableColumn.id]: newLongText,
        },
      }))
    })

    it('Of a URL column', async () => {
      expect.assertions(2)
      // Get the right input
      const tableColumn = mockFirstTableView.columns[16]
      const input = lckDataDetailWrapper.findComponent({ name: 'LckURLInput' })
      // Mock the HTML validity API which seems to not be implemented in jest
      input.vm.$refs.URLInput.$el.validity = {
        valid: true,
      }
      // Change the value (valid url)
      await input.vm.$emit('input', 'https://www.locokit.io/index.html')
      await input.vm.$emit('blur')
      // Check the API call
      expect(lckServices.tableRow.patch).toHaveBeenLastCalledWith('row-1', expect.objectContaining({
        data: {
          [tableColumn.id]: 'https://www.locokit.io/index.html',
        },
      }))
      // Change the value (empty url)
      await input.vm.$emit('input', '')
      await input.vm.$emit('blur')
      // Check the API call
      expect(lckServices.tableRow.patch).toHaveBeenLastCalledWith('row-1', expect.objectContaining({
        data: {
          [tableColumn.id]: null,
        },
      }))
    })

    it('Of a geographic column (addition)', async () => {
      expect.assertions(1)
      // Get the right input
      const tableColumn = mockFirstTableView.columns[17]
      const input = lckDataDetailWrapper.findComponent({ name: 'lck-map' })
      // Change the value
      await input.vm.$emit('update-features', [
        {
          id: `row-1:${tableColumn.id}`,
          type: 'Feature',
          properties: {
            id: `row-1:${tableColumn.id}`,
            columnId: tableColumn.id,
            rowId: 'row-1',
            sourceId: mockFirstTableView.id,
          },
          geometry: {
            coordinates: [-2.85, 46.49],
            type: 'Point',
          },
        },
      ])
      // Check the API call
      expect(lckServices.tableRow.patch).toHaveBeenLastCalledWith('row-1', expect.objectContaining({
        data: {
          [tableColumn.id]: 'SRID=4326;POINT(-2.85 46.49)',
        },
      }))
    })

    it('Of a geographic column (clear)', async () => {
      expect.assertions(1)
      // Get the right input
      const tableColumn = mockFirstTableView.columns[17]
      const input = lckDataDetailWrapper.findComponent({ name: 'lck-map' })
      // Change the value
      await input.vm.$emit('remove-features', [
        {
          id: `row-1:${tableColumn.id}`,
          type: 'Feature',
          properties: {
            id: `row-1:${tableColumn.id}`,
            columnId: tableColumn.id,
            rowId: 'row-1',
            sourceId: mockFirstTableView.id,
          },
          geometry: {
            coordinates: [-2.85, 46.49],
            type: 'Point',
          },
        },
      ])
      // Check the API call
      expect(lckServices.tableRow.patch).toHaveBeenLastCalledWith('row-1', expect.objectContaining({
        data: {
          [tableColumn.id]: null,
        },
      }))
    })

    it('Of a datetime column - valid datetime', async () => {
      expect.assertions(1)
      // Get the right input
      const tableColumn = mockFirstTableView.columns[18]
      const input = lckDataDetailWrapper.findAllComponents({ name: 'p-calendar' }).at(1)
      // Change the value
      await input.vm.$emit('input', new Date(2021, 9, 1, 12, 0, 0))
      await input.vm.$emit('hide')
      // Check the API call
      expect(lckServices.tableRow.patch).toHaveBeenLastCalledWith('row-1', expect.objectContaining({
        data: {
          [tableColumn.id]: '2021-10-01T12:00:00Z',
        },
      }))
    })

    it('Of a datetime column - empty string', async () => {
      expect.assertions(1)
      // Get the right input
      const tableColumn = mockFirstTableView.columns[18]
      const input = lckDataDetailWrapper.findAllComponents({ name: 'p-calendar' }).at(1)
      // Change the value
      await input.vm.$emit('input', '')
      await input.vm.$emit('hide')
      // Check the API call
      expect(lckServices.tableRow.patch).toHaveBeenLastCalledWith('row-1', expect.objectContaining({
        data: {
          [tableColumn.id]: null,
        },
      }))
    })
  })

  describe('Row editing from the datatable', () => {
    let firstRowColumnsWrapper, lckDatatableWrapper, primeDatatableWrapper
    const defaultCellEditParams = {
      type: 'outside',
      index: 0,
      originalEvent: {
        target: {
          closest: () => null,
        },
      },
    }

    beforeAll(async () => {
      const wrapper = await mount(Database, globalComponentParams())
      jest.useFakeTimers()
      await flushAll()

      lckDatatableWrapper = wrapper.findComponent(DataTable)
      primeDatatableWrapper = lckDatatableWrapper.find('.p-datatable')
      firstRowColumnsWrapper = primeDatatableWrapper.findAll('table tbody tr:nth-child(1) td')
    })

    beforeEach(async () => {
      await flushAll()
      lckServices.tableRow.patch.mockClear()
    })

    it('Of a string column', async () => {
      expect.assertions(1)
      // Get the right column
      const tableColumn = mockFirstTableView.columns[0]
      const column = firstRowColumnsWrapper.at(tableColumn.position)
      // Make it editable
      await column.trigger('click')
      const input = column.findComponent({ name: 'p-input-text' })
      // Change the value
      await input.vm.$emit('input', 'JOHN')
      // Simulate the end of the user input
      await primeDatatableWrapper.vm.$emit('cell-edit-complete', {
        ...defaultCellEditParams,
        data: lckDatatableWrapper.props('content').data[0],
        field: tableColumn.id,
      })
      // Check the API call
      expect(lckServices.tableRow.patch).toHaveBeenLastCalledWith('row-1', expect.objectContaining({
        data: {
          [tableColumn.id]: 'JOHN',
        },
      }))
    })

    it('Of a user column (selection)', async () => {
      expect.assertions(1)
      // Get the right column
      const tableColumn = mockFirstTableView.columns[4]
      const column = firstRowColumnsWrapper.at(tableColumn.position)
      // Make it editable
      await column.trigger('click')
      const input = column.findComponent({ name: 'LckAutoComplete' })
      // Change the value
      await input.vm.$emit(
        'item-select',
        {
          value: {
            label: 'Jack Noe',
            value: 'user-4',
          },
        },
      )
      // Check the API call
      expect(lckServices.tableRow.patch).toHaveBeenLastCalledWith('row-1', expect.objectContaining({
        data: {
          [tableColumn.id]: 'user-4',
        },
      }))
    })

    it('Of a user column (clear)', async () => {
      expect.assertions(1)
      // Get the right column
      const tableColumn = mockFirstTableView.columns[4]
      const column = firstRowColumnsWrapper.at(tableColumn.position)
      // Make it editable
      await column.trigger('click')
      const input = column.findComponent({ name: 'LckAutoComplete' })
      // Change the value
      await input.vm.$emit('clear')
      // Check the API call
      expect(lckServices.tableRow.patch).toHaveBeenLastCalledWith('row-1', expect.objectContaining({
        data: {
          [tableColumn.id]: null,
        },
      }))
    })

    it('Of a boolean column', async () => {
      expect.assertions(1)
      // Get the right column
      const tableColumn = mockFirstTableView.columns[5]
      const column = firstRowColumnsWrapper.at(tableColumn.position)
      // Make it editable
      await column.trigger('click')
      const input = column.findComponent({ name: 'p-checkbox' })
      // Change the value
      await input.vm.$emit('input', false)
      // Check the API call
      expect(lckServices.tableRow.patch).toHaveBeenLastCalledWith('row-1', expect.objectContaining({
        data: {
          [tableColumn.id]: false,
        },
      }))
    })

    it('Of an integer column', async () => {
      expect.assertions(1)
      // Get the right column
      const tableColumn = mockFirstTableView.columns[6]
      const column = firstRowColumnsWrapper.at(tableColumn.position)
      // Make it editable
      await column.trigger('click')
      const input = column.findComponent({ name: 'p-input-number' })
      // Change the value
      await input.vm.$emit('input', 10)
      // Simulate the end of the user input
      await primeDatatableWrapper.vm.$emit('cell-edit-complete', {
        ...defaultCellEditParams,
        data: lckDatatableWrapper.props('content').data[0],
        field: tableColumn.id,
      })
      // Check the API call
      expect(lckServices.tableRow.patch).toHaveBeenLastCalledWith('row-1', expect.objectContaining({
        data: {
          [tableColumn.id]: 10,
        },
      }))
    })

    it('Of a decimal number column', async () => {
      expect.assertions(1)
      // Get the right column
      const tableColumn = mockFirstTableView.columns[7]
      const column = firstRowColumnsWrapper.at(tableColumn.position)
      // Make it editable
      await column.trigger('click')
      const input = column.findComponent({ name: 'p-input-number' })
      // Change the value
      await input.vm.$emit('input', 10.5)
      // Simulate the end of the user input
      await primeDatatableWrapper.vm.$emit('cell-edit-complete', {
        ...defaultCellEditParams,
        data: lckDatatableWrapper.props('content').data[0],
        field: tableColumn.id,
      })
      // Check the API call
      expect(lckServices.tableRow.patch).toHaveBeenLastCalledWith('row-1', expect.objectContaining({
        data: {
          [tableColumn.id]: 10.5,
        },
      }))
    })

    it('Of a date column - valid date', async () => {
      expect.assertions(1)
      // Get the right column
      const tableColumn = mockFirstTableView.columns[8]
      const column = firstRowColumnsWrapper.at(tableColumn.position)
      // Make it editable
      await column.trigger('click')
      const input = column.findComponent({ name: 'p-calendar' })
      // Change the value
      await input.vm.$emit('input', new Date(2021, 9, 1))
      // Simulate the end of the user input
      await primeDatatableWrapper.vm.$emit('cell-edit-complete', {
        ...defaultCellEditParams,
        data: lckDatatableWrapper.props('content').data[0],
        field: tableColumn.id,
      })
      // Check the API call
      expect(lckServices.tableRow.patch).toHaveBeenLastCalledWith('row-1', expect.objectContaining({
        data: {
          [tableColumn.id]: '2021-10-01',
        },
      }))
    })

    it('Of a date column - empty string', async () => {
      expect.assertions(1)
      // Get the right column
      const tableColumn = mockFirstTableView.columns[8]
      const column = firstRowColumnsWrapper.at(tableColumn.position)
      // Make it editable
      await column.trigger('click')
      const input = column.findComponent({ name: 'p-calendar' })
      // Change the value
      await input.vm.$emit('input', '')
      // Simulate the end of the user input
      await primeDatatableWrapper.vm.$emit('cell-edit-complete', {
        ...defaultCellEditParams,
        data: lckDatatableWrapper.props('content').data[0],
        field: tableColumn.id,
      })
      // Check the API call
      expect(lckServices.tableRow.patch).toHaveBeenLastCalledWith('row-1', expect.objectContaining({
        data: {
          [tableColumn.id]: null,
        },
      }))
    })

    it('Of a group column', async () => {
      expect.assertions(1)
      // Get the right column
      const tableColumn = mockFirstTableView.columns[9]
      const column = firstRowColumnsWrapper.at(tableColumn.position)
      // Make it editable
      await column.trigger('click')
      const input = column.findComponent({ name: 'LckAutoComplete' })
      // Change the value
      await input.vm.$emit(
        'item-select',
        {
          value: {
            label: 'Group 3',
            value: 'group-3',
          },
        },
      )
      // Check the API call
      expect(lckServices.tableRow.patch).toHaveBeenLastCalledWith('row-1', expect.objectContaining({
        data: {
          [tableColumn.id]: 'group-3',
        },
      }))
    })

    it('Of a relation between tables column', async () => {
      expect.assertions(1)
      // Get the right column
      const tableColumn = mockFirstTableView.columns[10]
      const column = firstRowColumnsWrapper.at(tableColumn.position)
      // Make it editable
      await column.trigger('click')
      const input = column.findComponent({ name: 'LckAutoComplete' })
      // Change the value
      await input.vm.$emit(
        'item-select',
        {
          value: {
            label: 'Supplier 1',
            value: 'row-1b',
          },
        },
      )
      // Check the API call
      expect(lckServices.tableRow.patch).toHaveBeenLastCalledWith('row-1', expect.objectContaining({
        data: {
          [tableColumn.id]: 'row-1b',
        },
      }))
    })

    it('Of a single select column', async () => {
      expect.assertions(1)
      // Get the right column
      const tableColumn = mockFirstTableView.columns[11]
      const column = firstRowColumnsWrapper.at(tableColumn.position)
      // Make it editable
      await column.trigger('click')
      const input = column.findComponent({ name: 'p-dropdown' })
      // Change the value
      await input.vm.$emit(
        'change',
        {
          value: 'option1',
        },
      )
      // Check the API call
      expect(lckServices.tableRow.patch).toHaveBeenLastCalledWith('row-1', expect.objectContaining({
        data: {
          [tableColumn.id]: 'option1',
        },
      }))
    })

    it('Of a multi select column', async () => {
      expect.assertions(1)
      // Get the right column
      const tableColumn = mockFirstTableView.columns[12]
      const column = firstRowColumnsWrapper.at(tableColumn.position)
      // Make it editable
      await column.trigger('click')
      const input = column.findComponent({ name: 'LckMultiSelect' })
      // Change the value
      await input.vm.$emit(
        'change',
        {
          value: ['option1', 'option2'],
        },
      )
      // Check the API call
      expect(lckServices.tableRow.patch).toHaveBeenLastCalledWith('row-1', expect.objectContaining({
        data: {
          [tableColumn.id]: ['option1', 'option2'],
        },
      }))
    })

    it('Of a file column (addition)', async () => {
      expect.assertions(1)
      // Get the right column
      const tableColumn = mockFirstTableView.columns[13]
      const column = firstRowColumnsWrapper.at(tableColumn.position)
      // Make it editable
      await column.trigger('click')
      const input = column.findComponent({ name: 'LckFileCell' })
      const uploadedFiles = [
        new File([], 'myFile1.jpeg'),
      ]
      // Change the value
      await input.vm.$emit(
        'input',
        uploadedFiles,
      )
      // Check the API call
      expect(lckServices.tableRow.patch).toHaveBeenLastCalledWith('row-1', expect.objectContaining({
        data: {
          [tableColumn.id]: expect.arrayContaining([
            // Previous files
            mockFile1.id,
            mockFile2.id,
            // New file
            0,
          ]),
        },
      }))
    })

    it('Of a file column (deletion)', async () => {
      expect.assertions(1)
      // Get the right column
      const tableColumn = mockFirstTableView.columns[13]
      const column = firstRowColumnsWrapper.at(tableColumn.position)
      // Make it editable
      await column.trigger('click')
      const input = column.findComponent({ name: 'LckFileCell' })
      // Change the value
      await input.vm.$emit(
        'remove-attachment',
        mockFile1.id,
      )
      // Check the API call
      expect(lckServices.tableRow.patch).toHaveBeenLastCalledWith('row-1', expect.objectContaining({
        data: {
          [tableColumn.id]: [mockFile2.id],
        },
      }))
    })

    it('Of a multi user column (when selecting an item)', async () => {
      expect.assertions(1)
      // Get the right column
      const tableColumn = mockFirstTableView.columns[14]
      const column = firstRowColumnsWrapper.at(tableColumn.position)
      // Make it editable
      await column.trigger('click')
      const input = column.findComponent({ name: 'MultiLckAutoComplete' })
      // Change the value
      await input.vm.$emit('input', [
        {
          label: 'Jane Poe',
          value: 'user-2',
        },
      ])
      await input.vm.$emit('item-select')
      // Check the API call
      expect(lckServices.tableRow.patch).toHaveBeenLastCalledWith('row-1', expect.objectContaining({
        data: {
          [tableColumn.id]: expect.arrayContaining(['user-2']),
        },
      }))
    })

    it('Of a multi user column (when deselecting an item)', async () => {
      expect.assertions(1)
      // Get the right column
      const tableColumn = mockFirstTableView.columns[14]
      const column = firstRowColumnsWrapper.at(tableColumn.position)
      // Make it editable
      await column.trigger('click')
      const input = column.findComponent({ name: 'MultiLckAutoComplete' })
      // Change the value
      await input.vm.$emit('input', [
        {
          label: 'Frank Doe',
          value: 'user-3',
        },
      ])
      await input.vm.$emit('item-unselect')
      // Check the API call
      expect(lckServices.tableRow.patch).toHaveBeenLastCalledWith('row-1', expect.objectContaining({
        data: {
          [tableColumn.id]: expect.arrayContaining(['user-3']),
        },
      }))
    })

    it('Of a text column', async () => {
      expect.assertions(1)
      const newLongText = 'Tempora excepturi voluptates dolorem sunt doloremque quia quae'
      // Get the right column
      const tableColumn = mockFirstTableView.columns[15]
      const column = firstRowColumnsWrapper.at(tableColumn.position)
      // Make it editable
      await column.trigger('click')
      const input = column.findComponent({ name: 'p-textarea' })
      // Change the value
      await input.vm.$emit('input', newLongText)
      // Simulate the end of the user input
      await primeDatatableWrapper.vm.$emit('cell-edit-complete', {
        ...defaultCellEditParams,
        data: lckDatatableWrapper.props('content').data[0],
        field: tableColumn.id,
      })
      // Check the API call
      expect(lckServices.tableRow.patch).toHaveBeenLastCalledWith('row-1', expect.objectContaining({
        data: {
          [tableColumn.id]: newLongText,
        },
      }))
    })

    it('Of a URL column', async () => {
      expect.assertions(1)
      // Get the right column
      const tableColumn = mockFirstTableView.columns[16]
      const column = firstRowColumnsWrapper.at(tableColumn.position)
      // Make it editable
      await column.trigger('click')
      const input = column.findComponent({ name: 'LckURLInput' })
      // Mock the HTML validity API which seems to not be implemented in jest
      input.vm.$refs.URLInput.$el.validity = {
        valid: true,
      }
      // Change the value
      await input.vm.$emit('input', 'https://www.locokit.io/index.html')
      // Simulate the end of the user input
      await primeDatatableWrapper.vm.$emit('cell-edit-complete', {
        ...defaultCellEditParams,
        data: lckDatatableWrapper.props('content').data[0],
        field: tableColumn.id,
      })
      // Check the API call
      expect(lckServices.tableRow.patch).toHaveBeenLastCalledWith('row-1', expect.objectContaining({
        data: {
          [tableColumn.id]: 'https://www.locokit.io/index.html',
        },
      }))
    })

    it('Of a datetime column - valid datetime', async () => {
      expect.assertions(1)
      // Get the right column
      const tableColumn = mockFirstTableView.columns[18]
      const column = firstRowColumnsWrapper.at(tableColumn.position)
      // Make it editable
      await column.trigger('click')
      const input = column.findComponent({ name: 'p-calendar' })
      // Change the value
      await input.vm.$emit('input', new Date(2021, 9, 1, 12, 0, 0))
      // Simulate the end of the user input
      await primeDatatableWrapper.vm.$emit('cell-edit-complete', {
        ...defaultCellEditParams,
        data: lckDatatableWrapper.props('content').data[0],
        field: tableColumn.id,
      })
      // Check the API call
      expect(lckServices.tableRow.patch).toHaveBeenLastCalledWith('row-1', expect.objectContaining({
        data: {
          [tableColumn.id]: '2021-10-01T12:00:00Z',
        },
      }))
    })

    it('Of a datetime column - empty string', async () => {
      expect.assertions(1)
      // Get the right column
      const tableColumn = mockFirstTableView.columns[18]
      const column = firstRowColumnsWrapper.at(tableColumn.position)
      // Make it editable
      await column.trigger('click')
      const input = column.findComponent({ name: 'p-calendar' })
      // Change the value
      await input.vm.$emit('input', '')
      // Simulate the end of the user input
      await primeDatatableWrapper.vm.$emit('cell-edit-complete', {
        ...defaultCellEditParams,
        data: lckDatatableWrapper.props('content').data[0],
        field: tableColumn.id,
      })
      // Check the API call
      expect(lckServices.tableRow.patch).toHaveBeenLastCalledWith('row-1', expect.objectContaining({
        data: {
          [tableColumn.id]: null,
        },
      }))
    })
  })
})
