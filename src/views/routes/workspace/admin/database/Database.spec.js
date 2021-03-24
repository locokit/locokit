/* eslint-disable @typescript-eslint/camelcase */

import { shallowMount } from '@vue/test-utils'

import { lckServices } from '@/services/lck-api'

import Database from './Database.vue'
import DataTable from '@/components/store/DataTable/DataTable.vue'
import ColumnForm from '@/components/store/ColumnForm/ColumnForm.vue'

// Mock external libraries

jest.mock('@locokit/lck-glossary', () => ({
  COLUMN_TYPE: {
    STRING: 2,
    DATE: 5,
    USER: 6,
    LOOKED_UP_COLUMN: 9,
    SINGLE_SELECT: 10,
    MULTI_SELECT: 11,
    TEXT: 16
  }
}))

jest.mock('date-fns')
jest.mock('file-saver')

// Mock primevue component
jest.mock('primevue/tabview', () => ({
  name: 'p-tab-view',
  render: h => h('p-tab-view')
}))
jest.mock('primevue/tabpanel', () => ({
  name: 'p-tab-panel',
  render: h => h('p-tab-panel')
}))
jest.mock('primevue/button', () => ({
  name: 'p-button',
  render: h => h('p-button')
}))
jest.mock('primevue/sidebar', () => ({
  name: 'p-sidebar',
  render: h => h('p-sidebar')
}))

// Mock error
class MockError extends Error {
  constructor (code, ...args) {
    super(args)
    this.code = code
  }
}

// Mock variables
/* eslint-disable @typescript-eslint/camelcase */
const mockDatabase = {
  id: 'D1',
  text: 'Base principale',
  createdAt: '2020-11-02T16:11:03.109Z',
  updatedAt: '2020-11-02T16:11:03.109Z',
  workspace_id: 'W1',
  tables: [
    {
      id: 'T1',
      text: 'Personne',
      createdAt: '2020-11-02T16:11:03.109Z',
      updatedAt: '2020-11-02T16:11:03.109Z',
      database_id: 'D1',
      views: [
        {
          id: 'V11',
          text: 'Vue - bénéficiaires',
          createdAt: '2021-01-29T10:38:30.213Z',
          updatedAt: '2021-02-08T10:42:32.622Z',
          table_id: 'T1',
          locked: false,
          columns: [
            {
              id: 'C11',
              text: 'Prénom',
              createdAt: '2020-11-02T16:11:03.109Z',
              updatedAt: '2020-11-02T16:11:03.109Z',
              settings: null,
              position: 1,
              reference: true,
              reference_position: 0,
              table_id: 'T1',
              column_type_id: 2,
              locked: false,
              displayed: false,
              filter: null,
              transmitted: true,
              editable: true,
              style: {
                width: 128
              },
              default: null
            },
            {
              id: 'C13',
              text: 'E-mail',
              createdAt: '2020-11-02T16:11:03.109Z',
              updatedAt: '2021-02-09T08:29:25.368Z',
              settings: {},
              position: 2,
              reference: false,
              reference_position: null,
              table_id: 'T1',
              column_type_id: 2,
              locked: false,
              displayed: true,
              filter: null,
              transmitted: true,
              editable: null,
              style: {
                width: 352
              },
              default: null
            },
            {
              id: 'C12',
              text: 'Nom',
              createdAt: '2020-11-02T16:11:03.109Z',
              updatedAt: '2020-11-02T16:11:03.109Z',
              settings: null,
              position: 3,
              reference: true,
              reference_position: 1,
              table_id: 'T1',
              column_type_id: 2,
              locked: false,
              displayed: true,
              filter: null,
              transmitted: true,
              editable: null,
              style: {
                width: 153
              },
              default: null
            }
          ]
        },
        {
          id: 'V12',
          text: 'Vue - Prénom',
          createdAt: '2021-01-29T10:38:30.213Z',
          updatedAt: '2021-02-08T10:42:32.622Z',
          table_id: 'T1',
          locked: false,
          columns: [
            {
              id: 'C11',
              text: 'Prénom',
              createdAt: '2020-11-02T16:11:03.109Z',
              updatedAt: '2020-11-02T16:11:03.109Z',
              settings: null,
              position: 1,
              reference: true,
              reference_position: 0,
              table_id: 'T1',
              column_type_id: 2,
              locked: false,
              displayed: false,
              filter: null,
              transmitted: true,
              editable: true,
              style: {
                width: 128
              },
              default: null
            }
          ]
        }
      ],
      columns: [
        {
          id: 'C11',
          text: 'Prénom',
          createdAt: '2020-11-02T16:11:03.109Z',
          updatedAt: '2020-11-02T16:11:03.109Z',
          settings: null,
          position: 0,
          reference: true,
          reference_position: 0,
          table_id: 'T1',
          column_type_id: 2,
          locked: false
        },
        {
          id: 'C12',
          text: 'Nom',
          createdAt: '2020-11-02T16:11:03.109Z',
          updatedAt: '2020-11-02T16:11:03.109Z',
          settings: null,
          position: 1,
          reference: true,
          reference_position: 1,
          table_id: 'T1',
          column_type_id: 2,
          locked: false
        },
        {
          id: 'C13',
          text: 'E-mail',
          createdAt: '2020-11-02T16:11:03.109Z',
          updatedAt: '2021-02-09T08:29:25.368Z',
          settings: {},
          position: 2,
          reference: false,
          reference_position: null,
          table_id: 'T1',
          column_type_id: 2,
          locked: false
        },
        {
          id: 'C14',
          text: 'Tél',
          createdAt: '2020-11-02T16:11:03.109Z',
          updatedAt: '2020-11-02T16:11:03.109Z',
          settings: null,
          position: 3,
          reference: false,
          reference_position: null,
          table_id: 'T1',
          column_type_id: 2,
          locked: false
        },
        {
          id: 'C15',
          text: 'Utilisateur',
          createdAt: '2020-11-02T16:11:03.109Z',
          updatedAt: '2020-11-02T16:11:03.109Z',
          settings: null,
          position: 4,
          reference: false,
          reference_position: null,
          table_id: 'T1',
          column_type_id: 6,
          locked: false
        }
      ]
    },
    {
      id: 'T2',
      text: 'Fournisseur',
      createdAt: '2020-11-02T16:11:03.109Z',
      updatedAt: '2020-11-02T16:11:03.109Z',
      database_id: 'D1',
      views: [
        {
          id: 'V11',
          text: 'Ensemble des fournisseurs',
          createdAt: '2020-11-02T16:11:03.109Z',
          updatedAt: '2020-11-02T16:11:03.109Z',
          table_id: 'T2',
          locked: false,
          columns: [
            {
              id: 'C21',
              text: 'Utilisateur',
              createdAt: '2020-11-02T16:11:03.109Z',
              updatedAt: '2020-11-02T16:11:03.109Z',
              settings: null,
              position: 1,
              reference: false,
              reference_position: null,
              table_id: 'T2',
              column_type_id: 6,
              locked: false,
              displayed: true,
              filter: null,
              transmitted: true,
              editable: true,
              style: {
                width: 337
              },
              default: null
            },
            {
              id: 'C22',
              text: 'Nom fournisseur',
              createdAt: '2020-11-02T16:11:03.109Z',
              updatedAt: '2020-11-02T16:11:03.109Z',
              settings: null,
              position: 0,
              reference: true,
              reference_position: null,
              table_id: 'T2',
              column_type_id: 2,
              locked: false,
              displayed: true,
              filter: null,
              transmitted: true,
              editable: true,
              style: {
                width: 164
              },
              default: null
            }
          ]
        }
      ],
      columns: [
        {
          id: 'C21',
          text: 'Nom fournisseur',
          createdAt: '2020-11-02T16:11:03.109Z',
          updatedAt: '2020-11-02T16:11:03.109Z',
          settings: null,
          position: 0,
          reference: true,
          reference_position: null,
          table_id: 'T2',
          column_type_id: 2,
          locked: false
        },
        {
          id: 'C22',
          text: 'Utilisateur',
          createdAt: '2020-11-02T16:11:03.109Z',
          updatedAt: '2020-11-02T16:11:03.109Z',
          settings: null,
          position: 2,
          reference: false,
          reference_position: null,
          table_id: 'T2',
          column_type_id: 6,
          locked: false
        }
      ]
    }
  ]
}
// Shortcuts
const mockFirstTable = mockDatabase.tables[0]
const mockFirstTableView = mockFirstTable.views[0]

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
      })
    },
    tableView: {},
    tableColumn: {
      patch: jest.fn((id, data) =>
        (mockDeepCloneObject({ ...mockFirstTable.columns.find(column => column.id === id), ...data })))
    },
    tableRow: {}
  },
  lckHelpers: {
    searchItems: jest.fn(() => ([
      { label: 'A', value: 1 },
      { label: 'B', value: 2 },
      { label: 'C', value: 3 }
    ])),
    exportTableRowData: jest.fn(() => 'CSV_EXPORT')
  }
}))

jest.mock('@/store/database', () => {
  // TODO : find a way to use the mockDatabase variable defined above instead of creating a newer variable
  const mockDatabaseCopy = {
    id: 'D1',
    text: 'Base principale',
    createdAt: '2020-11-02T16:11:03.109Z',
    updatedAt: '2020-11-02T16:11:03.109Z',
    workspace_id: 'W1',
    tables: [
      {
        id: 'T1',
        text: 'Personne',
        createdAt: '2020-11-02T16:11:03.109Z',
        updatedAt: '2020-11-02T16:11:03.109Z',
        database_id: 'D1',
        views: [
          {
            id: 'V11',
            text: 'Vue - bénéficiaires',
            createdAt: '2021-01-29T10:38:30.213Z',
            updatedAt: '2021-02-08T10:42:32.622Z',
            table_id: 'T1',
            locked: false,
            columns: [
              {
                id: 'C11',
                text: 'Prénom',
                createdAt: '2020-11-02T16:11:03.109Z',
                updatedAt: '2020-11-02T16:11:03.109Z',
                settings: null,
                position: 1,
                reference: true,
                reference_position: 0,
                table_id: 'T1',
                column_type_id: 2,
                locked: false,
                displayed: false,
                filter: null,
                transmitted: true,
                editable: true,
                style: {
                  width: 128
                },
                default: null
              },
              {
                id: 'C13',
                text: 'E-mail',
                createdAt: '2020-11-02T16:11:03.109Z',
                updatedAt: '2021-02-09T08:29:25.368Z',
                settings: {},
                position: 3,
                reference: false,
                reference_position: null,
                table_id: 'T1',
                column_type_id: 2,
                locked: false,
                displayed: true,
                filter: null,
                transmitted: true,
                editable: null,
                style: {
                  width: 352
                },
                default: null
              },
              {
                id: 'C12',
                text: 'Nom',
                createdAt: '2020-11-02T16:11:03.109Z',
                updatedAt: '2020-11-02T16:11:03.109Z',
                settings: null,
                position: 2,
                reference: true,
                reference_position: 1,
                table_id: 'T1',
                column_type_id: 2,
                locked: false,
                displayed: true,
                filter: null,
                transmitted: true,
                editable: null,
                style: {
                  width: 153
                },
                default: null
              }
            ]
          },
          {
            id: 'V12',
            text: 'Vue - Prénom',
            createdAt: '2021-01-29T10:38:30.213Z',
            updatedAt: '2021-02-08T10:42:32.622Z',
            table_id: 'T1',
            locked: false,
            columns: [
              {
                id: 'C11',
                text: 'Prénom',
                createdAt: '2020-11-02T16:11:03.109Z',
                updatedAt: '2020-11-02T16:11:03.109Z',
                settings: null,
                position: 1,
                reference: true,
                reference_position: 0,
                table_id: 'T1',
                column_type_id: 2,
                locked: false,
                displayed: false,
                filter: null,
                transmitted: true,
                editable: true,
                style: {
                  width: 128
                },
                default: null
              }
            ]
          }
        ],
        columns: [
          {
            id: 'C11',
            text: 'Prénom',
            createdAt: '2020-11-02T16:11:03.109Z',
            updatedAt: '2020-11-02T16:11:03.109Z',
            settings: null,
            position: 0,
            reference: true,
            reference_position: 0,
            table_id: 'T1',
            column_type_id: 2,
            locked: false
          },
          {
            id: 'C12',
            text: 'Nom',
            createdAt: '2020-11-02T16:11:03.109Z',
            updatedAt: '2020-11-02T16:11:03.109Z',
            settings: null,
            position: 1,
            reference: true,
            reference_position: 1,
            table_id: 'T1',
            column_type_id: 2,
            locked: false
          },
          {
            id: 'C13',
            text: 'E-mail',
            createdAt: '2020-11-02T16:11:03.109Z',
            updatedAt: '2021-02-09T08:29:25.368Z',
            settings: {},
            position: 2,
            reference: false,
            reference_position: null,
            table_id: 'T1',
            column_type_id: 2,
            locked: false
          },
          {
            id: 'C14',
            text: 'Tél',
            createdAt: '2020-11-02T16:11:03.109Z',
            updatedAt: '2020-11-02T16:11:03.109Z',
            settings: null,
            position: 3,
            reference: false,
            reference_position: null,
            table_id: 'T1',
            column_type_id: 2,
            locked: false
          },
          {
            id: 'C15',
            text: 'Utilisateur',
            createdAt: '2020-11-02T16:11:03.109Z',
            updatedAt: '2020-11-02T16:11:03.109Z',
            settings: null,
            position: 4,
            reference: false,
            reference_position: null,
            table_id: 'T1',
            column_type_id: 6,
            locked: false
          }
        ]
      },
      {
        id: 'T2',
        text: 'Fournisseur',
        createdAt: '2020-11-02T16:11:03.109Z',
        updatedAt: '2020-11-02T16:11:03.109Z',
        database_id: 'D1',
        views: [
          {
            id: 'V11',
            text: 'Ensemble des fournisseurs',
            createdAt: '2020-11-02T16:11:03.109Z',
            updatedAt: '2020-11-02T16:11:03.109Z',
            table_id: 'T2',
            locked: false,
            columns: [
              {
                id: 'C21',
                text: 'Utilisateur',
                createdAt: '2020-11-02T16:11:03.109Z',
                updatedAt: '2020-11-02T16:11:03.109Z',
                settings: null,
                position: 1,
                reference: false,
                reference_position: null,
                table_id: 'T2',
                column_type_id: 6,
                locked: false,
                displayed: true,
                filter: null,
                transmitted: true,
                editable: true,
                style: {
                  width: 337
                },
                default: null
              },
              {
                id: 'C22',
                text: 'Nom fournisseur',
                createdAt: '2020-11-02T16:11:03.109Z',
                updatedAt: '2020-11-02T16:11:03.109Z',
                settings: null,
                position: 0,
                reference: true,
                reference_position: null,
                table_id: 'T2',
                column_type_id: 2,
                locked: false,
                displayed: true,
                filter: null,
                transmitted: true,
                editable: true,
                style: {
                  width: 164
                },
                default: null
              }
            ]
          }
        ],
        columns: [
          {
            id: 'C21',
            text: 'Nom fournisseur',
            createdAt: '2020-11-02T16:11:03.109Z',
            updatedAt: '2020-11-02T16:11:03.109Z',
            settings: null,
            position: 0,
            reference: true,
            reference_position: null,
            table_id: 'T2',
            column_type_id: 2,
            locked: false
          },
          {
            id: 'C22',
            text: 'Utilisateur',
            createdAt: '2020-11-02T16:11:03.109Z',
            updatedAt: '2020-11-02T16:11:03.109Z',
            settings: null,
            position: 2,
            reference: false,
            reference_position: null,
            table_id: 'T2',
            column_type_id: 6,
            locked: false
          }
        ]
      }
    ]
  }
  return ({
    databaseState: { data: mockDatabaseCopy },
    patchTableData: () => ({}),
    retrieveDatabaseTableAndViewsDefinitions: () => ({}),
    retrieveTableColumns: jest.fn((tableId) => mockDeepCloneObject(mockDatabase.tables.find(table => table.id === tableId).columns)),
    retrieveTableRowsWithSkipAndLimit: jest.fn(() => ({})),
    retrieveTableViews: jest.fn((tableId) => mockDeepCloneObject(mockDatabase.tables.find(table => table.id === tableId).views)),
    saveTableData: jest.fn(({ data, table_id }) => ({
      id: 'TABLE_ROW_ID', ...data, table_id
    }))
  })
})

jest.mock('@/store/process')
/*
  createProcessRun,
  patchProcess,
  retrieveManualProcessWithRuns,
  retrieveProcessesByRow
*/

jest.mock('@/services/lck-utils/columns')
/*
getComponentEditableColumn
isEditableColumn
*/

jest.mock('@/services/lck-utils/filter', () => ({
  getCurrentFilters: () => ({})
}))

// Tests

describe('Database', () => {
  // Default database component configuration
  function globalComponentParams (databaseId = 'D1', workspaceId = 'W1') {
    return {
      propsData: { databaseId, workspaceId },
      mocks: {
        t: key => key,
        $t: key => key,
        $toast: {
          add: jest.fn()
        }
      }
    }
  }

  describe('Column editing', () => {
    let wrapper
    let datatableWrapper
    let columnFormWrapper

    beforeEach(async () => {
      wrapper = await shallowMount(Database, globalComponentParams())
      datatableWrapper = wrapper.findComponent(DataTable)
      columnFormWrapper = wrapper.findComponent(ColumnForm)
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
        await columnFormWrapper.vm.$emit('column-edit', updatedColumnData)
        // Send api request
        expect(lckServices.tableColumn.patch).toHaveBeenCalledWith(
          mockFirstTable.columns[0].id,
          updatedColumnData
        )
        // Update local data
        expect(wrapper.vm.views[0].columns[0].text).toBe(updatedColumnData.text)
        expect(wrapper.vm.views[1].columns[0].text).toBe(updatedColumnData.text)
        expect(wrapper.vm.block.definition.columns[0].text).toBe(updatedColumnData.text)
      })

      it('Don\'t update the data if no column is selected', async () => {
        // Edit the column
        await columnFormWrapper.vm.$emit('column-edit', updatedColumnData)
        // Don't send an api request
        expect(lckServices.tableColumn.patch).not.toHaveBeenCalled()
      })

      it('Display a toast if an error is occured', async () => {
        const spyOnToast = jest.spyOn(wrapper.vm.$toast, 'add')
        lckServices.tableColumn.patch.mockImplementationOnce(() => { throw new Error() })
        // Select a column
        await datatableWrapper.vm.$emit('column-select', wrapper.vm.displayColumnsView.columns[0])
        // Edit the column
        await columnFormWrapper.vm.$emit('column-edit', updatedColumnData)
        expect(spyOnToast).toHaveBeenCalledTimes(1)
        expect(spyOnToast).toHaveBeenCalledWith(
          expect.objectContaining({
            summary: mockFirstTable.columns[0].text,
            detail: 'error.basic'
          })
        )
      })

      it('Display a toast with a specific message if a known error is occured', async () => {
        const spyOnToast = jest.spyOn(wrapper.vm.$toast, 'add')
        lckServices.tableColumn.patch.mockImplementationOnce(() => { throw new MockError(404) })
        // Select a column
        await datatableWrapper.vm.$emit('column-select', wrapper.vm.displayColumnsView.columns[0])
        // Edit the column
        await columnFormWrapper.vm.$emit('column-edit', updatedColumnData)
        expect(spyOnToast).toHaveBeenCalledTimes(1)
        expect(spyOnToast).toHaveBeenCalledWith(
          expect.objectContaining({
            summary: mockFirstTable.columns[0].text,
            detail: 'error.http.404'
          })
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
        await columnFormWrapper.vm.$emit('table-view-column-edit', updatedTableColumnData)
        // Send api request
        expect(lckServices.tableViewColumn.patch).toHaveBeenCalledWith(
          `${mockFirstTableView.id},${mockFirstTableView.columns[0].id}`,
          updatedTableColumnData
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
          updatedTableColumnData
        )
        // Update local data
        expect(wrapper.vm.views[0].columns[0].displayed).toBe(updatedTableColumnData.displayed)
      })

      it('Don\'t update the data if no column is selected', async () => {
        // Edit the column
        await columnFormWrapper.vm.$emit('table-view-column-edit', updatedTableColumnData)
        // Don't send an api request
        expect(lckServices.tableViewColumn.patch).not.toHaveBeenCalled()
      })

      it('Display a toast with a generic message if an unknown error is occured', async () => {
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
            detail: 'error.basic'
          })
        )
      })

      it('Display a toast with a specific message if a known error is occured', async () => {
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
            detail: 'error.http.404'
          })
        )
      })
    })
  })
})
