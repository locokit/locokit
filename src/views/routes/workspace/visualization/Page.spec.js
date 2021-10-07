/* eslint-disable @typescript-eslint/camelcase, @typescript-eslint/no-unused-vars */

import { shallowMount, createLocalVue, mount } from '@vue/test-utils'
import { flushAll } from '@/../tests/unit/local-test-utils'
import { BLOCK_TYPE, COLUMN_TYPE } from '@locokit/lck-glossary'
import VueRouter from 'vue-router'
import draggable from 'vuedraggable'
import Toast from 'primevue/toast'

import { ROUTES_PATH, ROUTES_NAMES } from '@/router/paths'
import { lckServices, lckHelpers } from '@/services/lck-api'

import Page from './Page.vue'
import Workspace from '@/views/routes/workspace/visualization/Workspace.vue'

import Block from '@/components/visualize/Block/Block.vue'
import UpdateSidebar from '@/components/visualize/UpdateSidebar/UpdateSidebar.vue'
import DeleteConfirmationDialog from '@/components/ui/DeleteConfirmationDialog/DeleteConfirmationDialog.vue'
import DataTable from '@/components/store/DataTable/DataTable.vue'
import DataDetail from '@/components/store/DataDetail/DataDetail.vue'
import TableSet from '@/components/visualize/TableSet/TableSet.vue'
import MapSet from '@/components/visualize/MapSet/MapSet.vue'
import DialogForm from '@/components/ui/DialogForm/DialogForm.vue'
import Form from '@/components/ui/Form/Form.vue'

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
jest.mock('primevue/button', () => ({
  name: 'p-button',
  render: h => h(),
}))
jest.mock('primevue/breadcrumb', () => ({
  name: 'p-breadcrumb',
  render: h => h(),
}))
jest.mock('primevue/inputtext', () => ({
  name: 'p-input-text',
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
jest.mock('primevue/checkbox', () => ({
  name: 'p-checkbox',
  render: h => h(),
}))

// Mock error
class MockError extends Error {
  constructor (code, ...args) {
    super(...args)
    this.code = code
  }
}

// Mock variables
const mockPages = {
  1: {
    id: '1',
    text: 'Page 1',
    createdAt: '2020-11-02T16:11:03.109Z',
    updatedAt: '2020-11-02T16:11:03.109Z',
    chapter_id: 'C1',
    position: 1,
    hidden: false,
    containers: [
      {
        id: '12',
        text: 'My second container',
        createdAt: '2020-11-02T16:11:03.109Z',
        updatedAt: '2020-11-02T16:11:03.109Z',
        page_id: '1',
        position: 2,
        display_title: false,
        displayed_in_navbar: false,
        blocks: [
          {
            id: '121',
            createdAt: '2020-11-02T16:11:03.109Z',
            updatedAt: '2020-11-02T16:11:03.109Z',
            settings: {
              content: 'My paragraph content',
            },
            title: 'My paragraph block',
            type: BLOCK_TYPE.PARAGRAPH,
            position: 2,
            containerId: '12',
          },
          {
            id: '122',
            createdAt: '2020-11-02T16:11:03.109Z',
            updatedAt: '2020-11-02T16:11:03.109Z',
            settings: {
              id: '1',
            },
            title: 'My TableSet block',
            type: BLOCK_TYPE.TABLE_SET,
            position: 1,
            containerId: '12',
          },
          {
            id: '123',
            createdAt: '2020-11-02T16:11:03.109Z',
            updatedAt: '2020-11-02T16:11:03.109Z',
            settings: {
              sources: [
                {
                  id: '1',
                },
                {
                  id: '2',
                },
                {
                  id: '3',
                },
              ],
            },
            title: 'My map block',
            type: BLOCK_TYPE.MAP_SET,
            position: 3,
            containerId: '12',
          },
        ],
      },
      {
        id: '11',
        text: 'My first container',
        createdAt: '2020-11-02T16:11:03.109Z',
        updatedAt: '2020-11-02T16:11:03.109Z',
        page_id: '1',
        display_title: false,
        displayed_in_navbar: false,
        position: 1,
        blocks: [],
      },
    ],
  },
  2: {
    id: '2',
    text: 'Page 2',
    createdAt: '2020-11-02T16:11:03.109Z',
    updatedAt: '2020-11-02T16:11:03.109Z',
    chapter_id: 'C2',
    position: 2,
    hidden: true,
    containers: [],
  },
  3: {
    id: '3',
    text: 'Page 3',
    createdAt: '2020-11-02T16:11:03.109Z',
    updatedAt: '2020-11-02T16:11:03.109Z',
    chapter_id: 'C1',
    position: 3,
    hidden: true,
    containers: [],
  },
  4: {
    id: '4',
    text: 'Page 4',
    createdAt: '2021-06-25T18:40:03.109Z',
    updatedAt: '2021-06-25T18:40:03.109Z',
    position: 4,
    chapter_id: 'C1',
    containers: [
      {
        id: '14',
        text: 'Main container',
        createdAt: '2021-06-25T18:40:03.109Z',
        updatedAt: '2021-06-25T18:40:03.109Z',
        page_id: '1',
        position: 2,
        display_title: false,
        displayed_in_navbar: false,
        blocks: [
          {
            id: '140',
            createdAt: '2021-06-25T18:40:03.109Z',
            updatedAt: '2021-06-25T18:40:03.109Z',
            settings: {
              id: '1',
            },
            title: 'My TableSet block',
            type: BLOCK_TYPE.TABLE_SET,
            position: 1,
            containerId: '14',
          },
          {
            id: '141',
            createdAt: '2021-06-25T18:40:03.109Z',
            updatedAt: '2021-06-25T18:40:03.109Z',
            settings: {
              sources: [
                {
                  id: '1',
                },
                {
                  id: '2',
                },
              ],
            },
            title: 'My map block',
            type: BLOCK_TYPE.MAP_SET,
            position: 2,
            containerId: '14',
            conditionalDisplayTableViewId: '3',
            conditionalDisplayFieldId: 'displayField',
            conditionalDisplayFieldValue: true,
          },
          {
            id: '142',
            createdAt: '2021-06-25T18:40:03.109Z',
            updatedAt: '2021-06-25T18:40:03.109Z',
            settings: {
              id: '3',
            },
            title: 'My data record block',
            type: BLOCK_TYPE.DATA_RECORD,
            position: 3,
            containerId: '14',
          },
        ],
      },
    ],
  },
  5: {
    id: '5',
    text: 'Page 5',
    createdAt: '2021-06-25T18:40:03.109Z',
    updatedAt: '2021-06-25T18:40:03.109Z',
    chapter_id: 'C1',
    position: 6,
    containers: [
      {
        id: '15',
        text: 'Main container',
        createdAt: '2021-06-25T18:40:03.109Z',
        updatedAt: '2021-06-25T18:40:03.109Z',
        page_id: '1',
        position: 2,
        display_title: false,
        displayed_in_navbar: false,
        blocks: [
          {
            id: '150',
            createdAt: '2021-06-25T18:40:03.109Z',
            updatedAt: '2021-06-25T18:40:03.109Z',
            settings: {
              id: '1',
            },
            title: 'My TableSet block',
            type: BLOCK_TYPE.TABLE_SET,
            position: 1,
            containerId: '15',
          },
          {
            id: '151',
            createdAt: '2021-06-25T18:40:03.109Z',
            updatedAt: '2021-06-25T18:40:03.109Z',
            settings: {
              id: '1',
            },
            title: 'My data record block',
            type: BLOCK_TYPE.DATA_RECORD,
            position: 3,
            containerId: '15',
          },
        ],
      },
    ],
  },
  6: {
    id: '6',
    text: 'Page 6',
    createdAt: '2021-06-25T18:40:03.109Z',
    updatedAt: '2021-06-25T18:40:03.109Z',
    chapter_id: 'C1',
    position: 6,
    containers: [
      {
        id: '16',
        text: 'Main container',
        createdAt: '2021-06-25T18:40:03.109Z',
        updatedAt: '2021-06-25T18:40:03.109Z',
        page_id: '1',
        position: 2,
        display_title: false,
        displayed_in_navbar: false,
        blocks: [
          {
            id: '160',
            createdAt: '2021-06-25T18:40:03.109Z',
            updatedAt: '2021-06-25T18:40:03.109Z',
            containerId: '16',
            settings: {
              addSourceId: '4',
              addAllowed: true,
              addButtonTitle: 'This is my add button, click here !',
              sources: [
                {
                  id: '1',
                },
                {
                  id: '2',
                },
                {
                  id: '3',
                },
              ],
            },
            title: 'My map block',
            type: BLOCK_TYPE.MAP_SET,
            position: 3,
          },
          {
            id: '161',
            createdAt: '2021-06-25T18:40:03.109Z',
            updatedAt: '2021-06-25T18:40:03.109Z',
            settings: {
              id: '1',
            },
            title: 'My data record block',
            type: BLOCK_TYPE.DATA_RECORD,
            position: 3,
            containerId: '16',
          },
        ],
      },
    ],
  },
  7: {
    id: '7',
    text: 'Page 6',
    createdAt: '2021-06-25T18:40:03.109Z',
    updatedAt: '2021-06-25T18:40:03.109Z',
    chapter_id: 'C1',
    position: 7,
    containers: [
      {
        id: '17',
        text: 'Main container',
        createdAt: '2021-06-25T18:40:03.109Z',
        updatedAt: '2021-06-25T18:40:03.109Z',
        page_id: '1',
        position: 2,
        display_title: false,
        displayed_in_navbar: false,
        blocks: [
          {
            id: '160',
            createdAt: '2021-06-25T18:40:03.109Z',
            updatedAt: '2021-06-25T18:40:03.109Z',
            settings: {
              id: '1',
              pagination: 5,
            },
            title: 'My TableSet block',
            type: BLOCK_TYPE.TABLE_SET,
            position: 1,
            containerId: '16',
          },
          {
            id: '161',
            createdAt: '2021-06-25T18:40:03.109Z',
            updatedAt: '2021-06-25T18:40:03.109Z',
            settings: {
              id: '2',
              pagination: -1,
            },
            title: 'My TableSet block',
            type: BLOCK_TYPE.TABLE_SET,
            position: 1,
            containerId: '16',
          },
          {
            id: '162',
            createdAt: '2021-06-25T18:40:03.109Z',
            updatedAt: '2021-06-25T18:40:03.109Z',
            containerId: '16',
            settings: {
              sources: [
                {
                  id: '1',
                },
                {
                  id: '2',
                },
              ],
            },
            title: 'My map block',
            type: BLOCK_TYPE.MAP_SET,
            position: 3,
          },
        ],
      },
    ],
  },
  8: {
    id: '8',
    text: 'Page 8',
    createdAt: '2020-11-02T16:11:03.109Z',
    updatedAt: '2020-11-02T16:11:03.109Z',
    chapter_id: 'C3',
    position: 8,
    hidden: false,
    containers: [
      {
        id: '81',
        text: 'Main container',
        createdAt: '2020-11-02T16:11:03.109Z',
        updatedAt: '2020-11-02T16:11:03.109Z',
        page_id: '1',
        position: 1,
        display_title: false,
        displayed_in_navbar: false,
        blocks: [
          {
            id: '811',
            createdAt: '2020-11-02T16:11:03.109Z',
            updatedAt: '2020-11-02T16:11:03.109Z',
            settings: {
              id: '5',
            },
            title: 'My TableSet block',
            type: BLOCK_TYPE.TABLE_SET,
            position: 1,
            containerId: '81',
          },
        ],
      },
    ],
  },
  9: {
    id: '9',
    text: 'Page 9',
    createdAt: '2020-11-02T16:11:03.109Z',
    updatedAt: '2020-11-02T16:11:03.109Z',
    chapter_id: 'C3',
    position: 8,
    hidden: false,
    containers: [
      {
        id: '91',
        text: 'Main container',
        createdAt: '2020-11-02T16:11:03.109Z',
        updatedAt: '2020-11-02T16:11:03.109Z',
        page_id: '1',
        position: 1,
        display_title: false,
        displayed_in_navbar: false,
        blocks: [
          {
            id: '911',
            createdAt: '2020-11-02T16:11:03.109Z',
            updatedAt: '2020-11-02T16:11:03.109Z',
            settings: {
              id: '5',
              pagination: -1,
            },
            title: 'My TableSet block',
            type: BLOCK_TYPE.TABLE_SET,
            position: 1,
            containerId: '91',
          },
        ],
      },
    ],
  },
  10: {
    id: '10',
    text: 'Page 10',
    createdAt: '2020-11-02T16:11:03.109Z',
    updatedAt: '2020-11-02T16:11:03.109Z',
    chapter_id: 'C3',
    position: 10,
    hidden: false,
    containers: [
      {
        id: '101',
        text: 'Main container',
        createdAt: '2020-11-02T16:11:03.109Z',
        updatedAt: '2020-11-02T16:11:03.109Z',
        page_id: '1',
        position: 1,
        display_title: false,
        displayed_in_navbar: false,
        blocks: [
          {
            id: '1011',
            createdAt: '2020-11-02T16:11:03.109Z',
            updatedAt: '2020-11-02T16:11:03.109Z',
            settings: {
              id: '5',
            },
            title: 'My DataRecord block',
            type: BLOCK_TYPE.DATA_RECORD,
            position: 1,
            containerId: '101',
          },
        ],
      },
    ],
  },
  11: {
    id: '11',
    text: 'Page 11',
    createdAt: '2020-11-02T16:11:03.109Z',
    updatedAt: '2020-11-02T16:11:03.109Z',
    chapter_id: 'C3',
    position: 11,
    hidden: false,
    containers: [
      {
        id: '111',
        text: 'Main container',
        createdAt: '2020-11-02T16:11:03.109Z',
        updatedAt: '2020-11-02T16:11:03.109Z',
        page_id: '1',
        position: 1,
        display_title: false,
        displayed_in_navbar: false,
        blocks: [
          {
            id: '1111',
            createdAt: '2020-11-02T16:11:03.109Z',
            updatedAt: '2020-11-02T16:11:03.109Z',
            settings: {
              id: '5',
            },
            title: 'My FormRecord block',
            type: BLOCK_TYPE.FORM_RECORD,
            position: 1,
            containerId: '111',
          },
        ],
      },
    ],
  },
  12: {
    id: '12',
    text: 'Page 12',
    createdAt: '2020-11-02T16:11:03.109Z',
    updatedAt: '2020-11-02T16:11:03.109Z',
    chapter_id: 'C3',
    position: 12,
    hidden: false,
    containers: [
      {
        id: '121',
        text: 'Main container',
        createdAt: '2020-11-02T16:11:03.109Z',
        updatedAt: '2020-11-02T16:11:03.109Z',
        page_id: '1',
        position: 1,
        display_title: false,
        displayed_in_navbar: false,
        blocks: [
          {
            id: '1211',
            createdAt: '2020-11-02T16:11:03.109Z',
            updatedAt: '2020-11-02T16:11:03.109Z',
            settings: {
              sources: [
                {
                  id: '1',
                },
              ],
              addAllowed: true,
              addSourceId: '5',
              addButtonTitle: 'Add a new element',
            },
            title: 'My MapSet block',
            type: BLOCK_TYPE.MAP_SET,
            position: 1,
            containerId: '121',
          },
        ],
      },
    ],
  },
}

const mockChapters = [
  {
    id: 'C1',
    text: 'First chapter',
    pages: [mockPages['1'], mockPages['3']],
  },
  {
    id: 'C2',
    text: 'Second chapter',
    pages: [mockPages['2']],
  },
  {
    id: 'C3',
    text: 'Third chapter',
    pages: [
      mockPages['8'],
      mockPages['9'],
      mockPages['10'],
      mockPages['11'],
      mockPages['12'],
    ],
  },
]

// Table columns
const defaultParamsTableViewColumn = {
  table_id: 'table-1',
  editable: false,
  reference: false,
  position: 0,
  transmitted: false,
  displayed: true,
  required: false,
  sort: 'DESC',
  table_column_id: '',
  table_view_id: '4',
  style: {},
}

const stringColumn = {
  text: 'Name',
  id: 'strColumn',
  settings: {},
  column_type_id: COLUMN_TYPE.STRING,
  ...defaultParamsTableViewColumn,
}

const mockTableViewDefinitions = {
  1: {
    id: '1',
    columns: [],
    table_id: 'table1',
  },
  2: {
    id: '2',
    columns: [],
    table_id: 'table2',
  },
  3: {
    id: '3',
    columns: [],
    table_id: 'table3',
  },
  4: {
    id: '4',
    columns: [
      stringColumn,
    ],
    table_id: 'table3',
  },
  5: {
    ...mockDatabase.tables[0].views[0],
    id: '5',
  },
}

const mockTableViewContents = () => ({
  1: {
    data: [
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content',
        },
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content',
        },
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content',
        },
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content',
        },
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content',
        },
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content',
        },
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content',
        },
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content',
        },
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content',
        },
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content',
        },
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content',
        },
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content',
        },
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content',
        },
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content',
        },
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content',
        },
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content',
        },
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content',
        },
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content',
        },
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content',
        },
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content',
        },
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content',
        },
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content',
        },
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content',
        },
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content',
        },
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content',
        },
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content',
        },
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content',
        },
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content',
        },
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content',
        },
      },
    ],
  },
  2: {
    data: [
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content',
        },
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content',
        },
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content',
        },
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content',
        },
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content',
        },
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content',
        },
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content',
        },
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content',
        },
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content',
        },
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content',
        },
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content',
        },
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content',
        },
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content',
        },
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content',
        },
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content',
        },
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content',
        },
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content',
        },
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content',
        },
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content',
        },
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content',
        },
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content',
        },
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content',
        },
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content',
        },
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content',
        },
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content',
        },
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content',
        },
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content',
        },
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content',
        },
      },
    ],
  },
  3: {
    data: [
      {
        id: 'tv3r1',
        text: 'TableView 3 - Row 1',
        table_id: 't1',
        data: {
          c3: 'third content',
          displayField: false,
        },
      },
      {
        id: 'tv3r1',
        text: 'TableView 3 - Row 1',
        table_id: 't1',
        data: {
          c3: 'third content',
          displayField: false,
        },
      },
    ],
  },
  4: {
    data: [
      {
        id: 'tv4r1',
        text: 'TableView 4 - Row 1',
        table_id: 't1',
        data: {
          c4: 'third content',
          displayField: false,
        },
      },
      {
        id: 'tv4r1',
        text: 'TableView 4 - Row 1',
        table_id: 't1',
        data: {
          c4: 'third content',
          displayField: false,
        },
      },
    ],
  },
  5: {
    data: mockRowsByTable.T1,
  },
})

const mockBlocksOfFirstPage = mockPages['1'].containers.map(c => c.blocks).flat()

const unknownTypeBlock = {
  id: 'temp',
  title: 'my unknown block',
  type: 'UNKNOWN_TYPE_BLOCK',
}
const paragraphBlock = {
  id: 'temp',
  title: 'my paragraph block',
  type: BLOCK_TYPE.PARAGRAPH,
  settings: {
    content: 'The text to display.',
  },
}
const mediaBlock = {
  id: 'temp',
  title: 'my media block',
  type: BLOCK_TYPE.MEDIA,
  settings: {
    displayMode: 'GALLERY',
    medias: [
      {
        name: 'Image',
        srcURL: '/img/img1.png',
        type: 'IMAGE',
      },
      {
        name: 'Video',
        srcURL: '/videos/video1.avi',
        type: 'VIDEO',
      },
    ],
  },
}

function mockDeepCloneObject (object) {
  return object ? JSON.parse(JSON.stringify(object)) : {}
}

// Mock lck functions
jest.mock('@/services/lck-api', () => ({
  lckServices: {
    container: {
      patch: jest.fn((id, data) =>
        ({ ...mockPages['1'].containers.find(container => container.id === id), ...data })),
      create: jest.fn(data =>
        ({ ...mockPages['1'].containers[0], ...data, id: '22' })),
      remove: jest.fn(),
    },
    block: {
      patch: jest.fn((id, data) =>
        ({ ...mockPages['1'].containers[0].blocks.find(block => block.id === id), ...data })),
      create: jest.fn(data =>
        ({ ...mockPages['1'].containers[0].blocks[0], ...data, id: '22' })),
      remove: jest.fn(),
    },
    tableRow: {
      create: jest.fn(data =>
        ({ ...data, id: '66' })),
      patch: jest.fn(),
    },
  },
  lckHelpers: {
    searchItems: jest.fn(() => ([
      { label: 'A', value: 1 },
      { label: 'B', value: 2 },
      { label: 'C', value: 3 },
    ])),
    formatRowData: jest.fn((...params) => mockFormatRowData(...params)),
    exportTableRowData: jest.fn(() => 'CSV_EXPORT'),
    retrievePageWithContainersAndBlocks: jest.fn(pageId => mockDeepCloneObject(mockPages[pageId])),
    retrieveViewDefinition: jest.fn(
      tableViewIds => Object.values(mockTableViewDefinitions).filter(view => tableViewIds.includes(view.id)),
    ),
    retrieveViewData: jest.fn(
      (tableViewId, _0, skip, limit) => {
        const content = mockTableViewContents()[tableViewId]
        return limit === -1
          ? mockDeepCloneObject(mockTableViewContents()[tableViewId].data)
          : {
            total: content.data.length,
            limit,
            skip,
            data: mockDeepCloneObject(content.data.slice(skip, skip + limit)), // Paginated result
          }
      },
    ),
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
    convertDateInRecords: jest.fn((...params) => mockConvertDateInRecords(...params)),
  },
}))

jest.mock('@/services/lck-helpers/database')

jest.mock('@/router/paths', () => ({
  ROUTES_PATH: {
    WORKSPACE: '/workspace',
    VISUALIZATION: '/visualization',
  },
  ROUTES_NAMES: {
    VISUALIZATION: 'WorkspaceVisualization',
    PAGE: 'Page',
  },
}))

jest.mock('@/views/routes/workspace/visualization/Workspace.vue', () => ({
  name: 'Workspace',
  render: h => h('workspace'),
  computed: {
    sidebarItems: () => [],
  },
}))

// Mock lck components
jest.mock('@/components/ui/ColumnType/Geometry/Map.vue', () => ({
  name: 'lck-map',
  render: h => h(),
}))

// Mock routes
const mockRoutes = [
  {
    path: ROUTES_PATH.WORKSPACE + '/:workspaceId' + ROUTES_PATH.VISUALIZATION,
    name: ROUTES_NAMES.VISUALIZATION,
    component: Page,
    props: true,
    children: [{
      name: ROUTES_NAMES.PAGE,
      path: 'page/:pageId',
      props: true,
      component: Page,
    }],
  },
]

// Tests

describe('Page', () => {
  // Default workspace component configuration
  function globalComponentParams (pageId = '1', workspaceId = '17', groupId = 'this-is-a-group', userId = 1) {
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = new VueRouter({ routes: mockRoutes })
    return {
      localVue,
      router,
      propsData: { workspaceId, pageId, chapters: mockChapters, groupId, userId },
      mocks: {
        t: key => key,
        $t: key => key,
        $tc: key => key,
        $toast: {
          add: jest.fn(),
        },
      },
      parentComponent: Workspace,
    }
  }

  describe('Computed properties', () => {
    describe('Chapter pages', () => {
      let wrapper

      it('Return the pages of the current chapter, excluding the current one.', async () => {
        wrapper = await shallowMount(Page, globalComponentParams())
        expect(wrapper.vm.relatedChapterPages.length).toBe(1)
        expect(wrapper.vm.relatedChapterPages[0].id).toBe(mockPages['3'].id)
      })

      it('Return an empty array if the page is unknown', async () => {
        wrapper = await shallowMount(Page, globalComponentParams('-1'))
        expect(wrapper.vm.relatedChapterPages.length).toBe(0)
      })

      it('Return an empty array if there is not chapters', async () => {
        wrapper = await shallowMount(Page, globalComponentParams())
        await wrapper.setProps({ chapters: null })
        expect(wrapper.vm.relatedChapterPages.length).toBe(0)
      })
    })
  })

  describe('Watchers', () => {
    describe('Load the specified page with containers', () => {
      let wrapper

      beforeAll(async () => {
        wrapper = await shallowMount(Page, globalComponentParams())
      })
      it('Get the right id', () => {
        expect(wrapper.vm.page.id).toBe(mockPages['1'].id)
      })
      it('Get the right text property', () => {
        expect(wrapper.vm.page.text).toBe(mockPages['1'].text)
      })
      it('Get the right chapter_id property', () => {
        expect(wrapper.vm.page.chapter_id).toBe(mockPages['1'].chapter_id)
      })
      it('Get the right position property', () => {
        expect(wrapper.vm.page.position).toBe(mockPages['1'].position)
      })
      it('Get the right hidden property', () => {
        expect(wrapper.vm.page.hidden).toBe(mockPages['1'].hidden)
      })
      describe('Get the right containers', () => {
        it('The containers are sorted', () => {
          expect(wrapper.vm.page.containers[0].id).toBe(mockPages['1'].containers[1].id)
          expect(wrapper.vm.page.containers[1].id).toBe(mockPages['1'].containers[0].id)
        })
        it('Check the empty container (without block)', () => {
          expect(wrapper.vm.page.containers[0]).toStrictEqual(mockPages['1'].containers[1])
        })
        it('The blocks inside each container are sorted', () => {
          expect(wrapper.vm.page.containers[1].blocks[0].id).toBe(mockPages['1'].containers[0].blocks[1].id)
          expect(wrapper.vm.page.containers[1].blocks[1].id).toBe(mockPages['1'].containers[0].blocks[0].id)
          expect(wrapper.vm.page.containers[1].blocks[2].id).toBe(mockPages['1'].containers[0].blocks[2].id)
        })
        it('Get the right properties for the Paragraph block (default)', () => {
          expect(wrapper.vm.page.containers[1].blocks[1]).toMatchObject(mockPages['1'].containers[0].blocks[0])
        })
        it('Get the right properties for the TableSet block', () => {
          const definitionId = wrapper.vm.page.containers[1].blocks[0].settings.id
          expect(wrapper.vm.page.containers[1].blocks[0]).toMatchObject(mockPages['1'].containers[0].blocks[1])
          expect(wrapper.vm.sources[definitionId].definition).toStrictEqual(mockTableViewDefinitions['1'])
          expect(wrapper.vm.sources[definitionId].content.data).toStrictEqual(mockTableViewContents()['1'].data.slice(0, 20))
        })
        it('Get the right properties for the map block', () => {
          expect.assertions(3)
          expect(wrapper.vm.page.containers[1].blocks[2]).toMatchObject(mockPages['1'].containers[0].blocks[2])
          const blockDefinition = wrapper.vm.getBlockDefinition(wrapper.vm.page.containers[1].blocks[2])
          expect(blockDefinition).toStrictEqual({
            1: mockTableViewDefinitions['1'],
            2: mockTableViewDefinitions['2'],
            3: mockTableViewDefinitions['3'],
          })
          const blockContent = wrapper.vm.getBlockContent(wrapper.vm.page.containers[1].blocks[2])
          expect(blockContent).toStrictEqual({
            1: mockTableViewContents()['1'].data.slice(0, 20),
            2: mockTableViewContents()['2'].data,
            3: mockTableViewContents()['3'].data,
          })
        })
      })
    })
    describe('Load the specified page without any containers', () => {
      it('Get the right containers', async () => {
        expect.assertions(1)
        const wrapper = await shallowMount(Page, globalComponentParams('2'))
        expect(wrapper.vm.page.containers).toStrictEqual([])
      })
    })
  })

  describe('Container CRUD', () => {
    describe('Display edit options', () => {
      let wrapper

      beforeAll(async () => {
        wrapper = await shallowMount(Page, globalComponentParams())
        wrapper.setProps({ editMode: true })
      })

      it('Display the button to add a container', () => {
        expect(wrapper.get('.new-container-button').exists()).toBe(true)
      })

      it('Display the containers names', () => {
        const containersNames = wrapper.findAll('.edit-container-line h2')
        expect(containersNames.at(0).text()).toBe(mockPages['1'].containers[1].text)
        expect(containersNames.at(1).text()).toBe(mockPages['1'].containers[0].text)
      })

      it('Display the drag buttons', () => {
        expect(wrapper.findAll('.edit-container-line .handle').length).toBe(2)
      })

      it('Display the edit buttons', () => {
        expect(wrapper.findAll('.edit-container-line .edit-container-button').length).toBe(2)
      })

      it('Display the remove buttons', () => {
        expect(wrapper.findAll('.edit-container-line .remove-container-button').length).toBe(2)
      })
    })

    describe('Events', () => {
      let wrapper
      let containerSidebarWrapper
      let deleteConfirmationWrapper

      const newContainerName = 'newContainerName'
      const firstDisplayedContainer = mockPages['1'].containers[1]
      const secondDisplayedContainer = mockPages['1'].containers[0]

      beforeEach(async () => {
        wrapper = await shallowMount(Page, { ...globalComponentParams(), propsData: { pageId: '1', editMode: true, workspaceId: 'toto', groupId: 'this-is-a-group', userId: 1 } })
        containerSidebarWrapper = wrapper.findComponent(UpdateSidebar)
        deleteConfirmationWrapper = wrapper.findComponent(DeleteConfirmationDialog)
      })

      describe('Add a new container', () => {
        let spyOnContainerCreate

        beforeAll(() => {
          spyOnContainerCreate = jest.spyOn(lckServices.container, 'create')
        })

        beforeEach(() => {
          spyOnContainerCreate.mockClear()
        })

        it('Display the update container sidebar with an empty object when the new container button is clicked', async () => {
          await wrapper.find('.new-container-button').vm.$emit('click')
          // expect(containerSidebarWrapper.props('container')).toStrictEqual({})
          expect(containerSidebarWrapper.props('showSidebar')).toBe(true)
        })

        it('Create a new container if the update-container event is emitted from the update container sidebar with a new container', async () => {
          await wrapper.find('.new-container-button').vm.$emit('click')
          await containerSidebarWrapper.vm.$emit('update-container', { id: 'temp', text: newContainerName, page_id: '1' })
          // Send API request
          expect(spyOnContainerCreate).toHaveBeenCalledWith({ text: newContainerName, page_id: mockPages['1'].id })
          // Update the component data
          const newContainer = wrapper.vm.page.containers[2]
          expect(newContainer).toBeDefined()
          expect(newContainer.text).toBe(newContainerName)
        })
      })

      describe('Update an existing container', () => {
        let spyOnContainerPatch

        beforeAll(() => {
          spyOnContainerPatch = jest.spyOn(lckServices.container, 'patch')
        })

        beforeEach(() => {
          spyOnContainerPatch.mockClear()
        })

        it('Display the update container sidebar with the specified container when the edit button is clicked', async () => {
          await wrapper.find('.edit-container-button').vm.$emit('click', firstDisplayedContainer)
          expect(containerSidebarWrapper.props('container')).toStrictEqual(firstDisplayedContainer)
          expect(containerSidebarWrapper.props('showSidebar')).toBe(true)
        })

        it('Hide the update container sidebar if it emits the close event', async () => {
          // Display the sidebar
          await containerSidebarWrapper.setProps({ showSidebar: true })
          // Hide it
          await containerSidebarWrapper.vm.$emit('close')
          expect(containerSidebarWrapper.props('showSidebar')).toBe(false)
        })

        it('Update the container if the update-container is emitted with an existing container from the sidebar', async () => {
          await wrapper.find('.edit-container-button').vm.$emit('click', firstDisplayedContainer)
          await containerSidebarWrapper.vm.$emit('update-container', { id: firstDisplayedContainer.id, text: newContainerName })
          // Send API request
          expect(spyOnContainerPatch).toHaveBeenCalledWith(firstDisplayedContainer.id, { text: newContainerName })
          // Update the component data
          expect(
            wrapper.vm.page.containers.find(container =>
              container.id === firstDisplayedContainer.id &&
                container.text === newContainerName,
            ),
          ).toBeDefined()
        })

        it('Display a toast if an error is occured', async () => {
          const spyOnToast = jest.spyOn(wrapper.vm, 'displayToastOnError')
          spyOnContainerPatch.mockImplementationOnce(() => { throw new Error() })
          await wrapper.find('.edit-container-button').vm.$emit('click', firstDisplayedContainer)
          await containerSidebarWrapper.vm.$emit('update-container', { id: firstDisplayedContainer.id, text: newContainerName })
          expect(spyOnToast).toHaveBeenCalledTimes(1)
        })
      })

      describe('Delete a container', () => {
        let spyOnContainerRemove

        beforeAll(() => {
          spyOnContainerRemove = jest.spyOn(lckServices.container, 'remove')
        })

        beforeEach(() => {
          spyOnContainerRemove.mockClear()
        })

        it('Display the confirmation dialog with the specified container when the remove button is clicked', async () => {
          await wrapper.find('.remove-container-button').vm.$emit('click')
          expect(deleteConfirmationWrapper.props('visible')).toBe(true)
          expect(deleteConfirmationWrapper.props('value')).toStrictEqual(firstDisplayedContainer)
        })

        it('Hide the confirmation dialog if the close event is emitted', async () => {
          // Display the dialog
          await deleteConfirmationWrapper.setProps({ visible: true })
          // Hide it
          await deleteConfirmationWrapper.vm.$emit('close')
          expect(deleteConfirmationWrapper.props('visible')).toBe(false)
        })

        it('Delete a container if the input event is emitted with an existing container', async () => {
          await wrapper.find('.remove-container-button').vm.$emit('click')
          await deleteConfirmationWrapper.vm.$emit('input', firstDisplayedContainer)
          // Send API request
          expect(spyOnContainerRemove).toHaveBeenCalledWith(firstDisplayedContainer.id)
          // Update the component data
          expect(
            wrapper.vm.page.containers.find(container => container.id === firstDisplayedContainer.id),
          ).toBeUndefined()
        })

        it('Do nothing if the input event is emitted with an empty container', async () => {
          await wrapper.find('.remove-container-button').vm.$emit('click')
          await deleteConfirmationWrapper.vm.$emit('input', {})
          expect(
            wrapper.vm.page.containers.find(container => container.id === firstDisplayedContainer.id),
          ).toBeDefined()
        })

        it('Do nothing if the input event is emitted with an undefined container', async () => {
          await wrapper.find('.remove-container-button').vm.$emit('click')
          await deleteConfirmationWrapper.vm.$emit('input')
          expect(
            wrapper.vm.page.containers.find(container => container.id === firstDisplayedContainer.id),
          ).toBeDefined()
        })

        it('Do nothing if the input event is emitted with an unknown container', async () => {
          await wrapper.find('.remove-container-button').vm.$emit('click')
          await deleteConfirmationWrapper.vm.$emit('input', { ...firstDisplayedContainer, id: '-1' })
          expect(
            wrapper.vm.page.containers.find(container => container.id === firstDisplayedContainer.id),
          ).toBeDefined()
        })

        it('Display a toast if an error is occured', async () => {
          const spyOnToast = jest.spyOn(wrapper.vm, 'displayToastOnError')
          spyOnContainerRemove.mockImplementationOnce(() => { throw new Error() })
          await wrapper.find('.remove-container-button').vm.$emit('click')
          await deleteConfirmationWrapper.vm.$emit('input', { id: firstDisplayedContainer.id })
          expect(spyOnToast).toHaveBeenCalledTimes(1)
        })
      })

      describe('Reorder the containers', () => {
        let spyOnContainerPatch

        beforeAll(() => {
          spyOnContainerPatch = jest.spyOn(lckServices.container, 'patch')
        })

        beforeEach(() => {
          spyOnContainerPatch.mockClear()
        })

        it('Save the new containers positions if the change event is emitted (oldIndex < newIndex)', async () => {
          await wrapper.findComponent(draggable).vm.$emit('change', { moved: { oldIndex: 0, newIndex: 1 } })
          expect(spyOnContainerPatch).toHaveBeenCalledTimes(2)
          expect(spyOnContainerPatch).toHaveBeenNthCalledWith(1, firstDisplayedContainer.id, { position: 0 })
          expect(spyOnContainerPatch).toHaveBeenNthCalledWith(2, secondDisplayedContainer.id, { position: 1 })
        })

        it('Save the new containers positions if the change event is emitted (oldIndex > newIndex)', async () => {
          await wrapper.findComponent(draggable).vm.$emit('change', { moved: { oldIndex: 1, newIndex: 0 } })
          expect(spyOnContainerPatch).toHaveBeenCalledTimes(2)
          expect(spyOnContainerPatch).toHaveBeenNthCalledWith(1, firstDisplayedContainer.id, { position: 0 })
          expect(spyOnContainerPatch).toHaveBeenNthCalledWith(2, secondDisplayedContainer.id, { position: 1 })
        })

        it('Do not save the new containers positions if the drag over event is not a move event ', async () => {
          await wrapper.findComponent(draggable).vm.$emit('change', { added: { newIndex: 0 } })
          expect(spyOnContainerPatch).toHaveBeenCalledTimes(0)
        })

        it('Display a toast if an error is occured', async () => {
          const spyOnToast = jest.spyOn(wrapper.vm, 'displayToastOnError')
          spyOnContainerPatch.mockRejectedValueOnce(new MockError(400))
          await wrapper.findComponent(draggable).vm.$emit('change', { moved: { oldIndex: 0, newIndex: 1 } })
          process.nextTick(() => {
            expect(spyOnToast).toHaveBeenCalledTimes(1)
          })
        })
      })
    })
  })

  describe('Block CRUD', () => {
    describe('Display edit options', () => {
      let wrapper

      beforeAll(async () => {
        wrapper = await shallowMount(Page, globalComponentParams())
        wrapper.setProps({ editMode: true })
      })

      it('Display the buttons to add a container', () => {
        expect(wrapper.findAll('.new-block-button').length).toBe(2)
      })
    })

    describe('Events', () => {
      let wrapper
      let containerSidebarWrapper

      const firstDisplayedContainer = mockPages['1'].containers[1]
      const secondDisplayedContainer = mockPages['1'].containers[0]
      const firstDisplayedBlock = secondDisplayedContainer.blocks[1]
      const secondDisplayedBlock = secondDisplayedContainer.blocks[0]

      beforeEach(async () => {
        wrapper = await shallowMount(Page, { ...globalComponentParams(), propsData: { pageId: '1', editMode: true, workspaceId: 'toto', groupId: 'this-is-a-group', userId: 1 } })
        containerSidebarWrapper = wrapper.findComponent(UpdateSidebar)
        // deleteBlockWrapper = wrapper.findAllComponents(DeleteConfirmationDialog).at(1)
      })

      describe('Add a new block', () => {
        let spyOnBlockCreate

        beforeAll(() => {
          spyOnBlockCreate = jest.spyOn(lckServices.block, 'create')
        })

        beforeEach(() => {
          spyOnBlockCreate.mockClear()
        })

        it('Display the update container sidebar with the related container and an object with an empty id for the block when the new block button is clicked', async () => {
          await wrapper.findAll('.new-block-button').at(0).vm.$emit('click')
          expect(containerSidebarWrapper.props('container')).toStrictEqual(firstDisplayedContainer)
          expect(containerSidebarWrapper.props('block')).toStrictEqual({ id: 'temp' })
          expect(containerSidebarWrapper.props('showSidebar')).toBe(true)
        })

        it('Display the update container sidebar with the specified container when the click-block event is emitted from the sidebar component with an object with an empty id.', async () => {
          await wrapper.findAll('.edit-container-button').at(1).vm.$emit('click', secondDisplayedContainer)
          await containerSidebarWrapper.vm.$emit('click-block', { id: '' })
          expect(containerSidebarWrapper.props('showSidebar')).toBe(true)
        })

        it('Create a new unknown type block if the update-block event is emitted from the update container sidebar with a new block', async () => {
          await wrapper.findAll('.new-block-button').at(0).vm.$emit('click')
          await containerSidebarWrapper.vm.$emit('update-block', { blockToEdit: unknownTypeBlock })
          // Send API request
          const { id, ...data } = unknownTypeBlock
          expect(spyOnBlockCreate).toHaveBeenCalledWith({ ...data, container_id: firstDisplayedContainer.id })
          // Update the component data
          const newBlock = wrapper.vm.page.containers[0].blocks[0]
          expect(newBlock).toBeDefined()
          expect(newBlock.title).toBe(unknownTypeBlock.title)
          expect(newBlock.type).toBe(unknownTypeBlock.type)
        })

        it('Create a new unknown type block if the update-block event is emitted from the update container sidebar inside a container that has not got any blocks', async () => {
          wrapper.vm.page.containers[0].blocks = null
          await wrapper.findAll('.new-block-button').at(0).vm.$emit('click')
          await containerSidebarWrapper.vm.$emit('update-block', { blockToEdit: unknownTypeBlock })
          // Send API request
          const { id, ...data } = unknownTypeBlock
          expect(spyOnBlockCreate).toHaveBeenCalledWith({ ...data, container_id: firstDisplayedContainer.id })
          // Update the component data
          const newBlock = wrapper.vm.page.containers[0].blocks[0]
          expect(newBlock).toBeDefined()
          expect(newBlock.title).toBe(unknownTypeBlock.title)
          expect(newBlock.type).toBe(unknownTypeBlock.type)
        })

        it('Create a new paragraph block if the update-block event is emitted from the update container sidebar with a new block', async () => {
          await wrapper.findAll('.new-block-button').at(0).vm.$emit('click')
          await containerSidebarWrapper.vm.$emit('update-block', { blockToEdit: paragraphBlock })
          // Send API request
          const { id, ...data } = paragraphBlock
          expect(spyOnBlockCreate).toHaveBeenCalledWith({ ...data, container_id: firstDisplayedContainer.id })
          // Update the component data
          const newBlock = wrapper.vm.page.containers[0].blocks[0]
          expect(newBlock).toBeDefined()
          expect(newBlock.type).toBe(paragraphBlock.type)
          expect(newBlock.settings).toStrictEqual(paragraphBlock.settings)
        })

        it('Create a new media block if the update-block event is emitted from the update container sidebar with a new block', async () => {
          await wrapper.findAll('.new-block-button').at(0).vm.$emit('click')
          await containerSidebarWrapper.vm.$emit('update-block', { blockToEdit: mediaBlock })
          // Send API request
          const { id, ...data } = mediaBlock
          expect(spyOnBlockCreate).toHaveBeenCalledWith({ ...data, container_id: firstDisplayedContainer.id })
          // Update the component data
          const newBlock = wrapper.vm.page.containers[0].blocks[0]
          expect(newBlock).toBeDefined()
          expect(newBlock.title).toBe(mediaBlock.title)
          expect(newBlock.type).toBe(mediaBlock.type)
          expect(newBlock.settings).toStrictEqual(mediaBlock.settings)
        })
      })

      describe('Update an existing block', () => {
        const blockToEdit = {
          id: secondDisplayedBlock.id,
          title: 'newBlockName',
          type: 'MARKDOWN',
          settings: { content: 'My new content' },
        }
        let spyOnBlockPatch

        beforeAll(() => {
          spyOnBlockPatch = jest.spyOn(lckServices.block, 'patch')
        })

        beforeEach(() => {
          spyOnBlockPatch.mockClear()
        })

        it('Display the update container sidebar with the specified container and paragraph block when the update block event is emitted from the block component', async () => {
          await wrapper.findAllComponents(Block).at(0).vm.$emit('update-block')
          expect(containerSidebarWrapper.props('container').id).toBe(secondDisplayedContainer.id)
          expect(containerSidebarWrapper.props('block')).toStrictEqual(
            expect.objectContaining({ ...firstDisplayedBlock }),
          )
        })

        it('Display the update container sidebar with the specified container and paragraph block when the click-block event is emitted from the sidebar component', async () => {
          await wrapper.findAll('.edit-container-button').at(1).vm.$emit('click', secondDisplayedContainer)
          await containerSidebarWrapper.vm.$emit('click-block', firstDisplayedBlock)
          expect(containerSidebarWrapper.props('container').id).toBe(secondDisplayedContainer.id)
        })

        it('Display the update container sidebar with the specified container and table view block when the update block event is emitted from the block component', async () => {
          await wrapper.findAllComponents(Block).at(0).vm.$emit('update-block')
          expect(containerSidebarWrapper.props('block').definition).toStrictEqual(mockTableViewDefinitions['1'])
        })

        it('Display the update container sidebar with the specified container and detail view block when the update block event is emitted from the block component', async () => {
          await wrapper.findAllComponents(Block).at(0).vm.$emit('update-block')
          expect(containerSidebarWrapper.props('block').definition).toStrictEqual(mockTableViewDefinitions['1'])
        })

        it('Update the block if the update-block event is emitted with an existing block from the sidebar', async () => {
          await wrapper.findAllComponents(Block).at(1).vm.$emit('update-block')
          await containerSidebarWrapper.vm.$emit('update-block', { blockToEdit })

          expect.assertions(2)
          // Send API request
          expect(spyOnBlockPatch).toHaveBeenCalledWith(
            secondDisplayedBlock.id,
            {
              title: blockToEdit.title,
              type: blockToEdit.type,
              settings: blockToEdit.settings,
            })
          // Update the component data
          expect(wrapper.vm.page.containers[1].blocks[1]).toStrictEqual(
            expect.objectContaining({ ...blockToEdit }),
          )
        })

        it('Refresh the block after updating if is necessary', async () => {
          const spyOnRefreshDefinitionAndContent = jest.spyOn(wrapper.vm, 'refreshDefinitionAndContent')
          await wrapper.findAllComponents(Block).at(1).vm.$emit('update-block')
          await containerSidebarWrapper.vm.$emit('update-block', { blockToEdit, blockRefreshRequired: true })
          expect(spyOnRefreshDefinitionAndContent).toHaveBeenCalled()
        })

        it('Display a toast if an error is occured', async () => {
          const spyOnToast = jest.spyOn(wrapper.vm, 'displayToastOnError')
          spyOnBlockPatch.mockImplementationOnce(() => { throw new Error() })
          await wrapper.findAllComponents(Block).at(1).vm.$emit('update-block')
          await containerSidebarWrapper.vm.$emit('update-block', { blockToEdit })
          expect(spyOnToast).toHaveBeenCalledTimes(1)
        })
      })

      describe('Delete a container', () => {
        let deleteBlockWrapper
        let spyOnBlockRemove

        beforeAll(() => {
          spyOnBlockRemove = jest.spyOn(lckServices.block, 'remove')
        })

        beforeEach(async () => {
          spyOnBlockRemove.mockClear()
          deleteBlockWrapper = wrapper.findAllComponents(DeleteConfirmationDialog).at(1)
        })

        it('Display the confirmation dialog with the specified block when the delete-block event is emitted from the Block component.', async () => {
          await wrapper.findAllComponents(Block).at(0).vm.$emit('delete-block')
          expect(deleteBlockWrapper.props('visible')).toBe(true)
          expect(deleteBlockWrapper.props('value')).toStrictEqual(expect.objectContaining({ ...firstDisplayedBlock }))
        })

        it('Display the confirmation dialog with the specified block when the delete-block event is emitted from the sidebar.', async () => {
          await wrapper.findAll('.edit-container-button').at(1).vm.$emit('click', secondDisplayedContainer)
          await containerSidebarWrapper.vm.$emit('delete-block', firstDisplayedBlock)
          expect(deleteBlockWrapper.props('visible')).toBe(true)
          expect(deleteBlockWrapper.props('value')).toStrictEqual(expect.objectContaining({ ...firstDisplayedBlock }))
        })

        it('Hide the confirmation dialog if the close event is emitted', async () => {
          // Display the dialog
          await deleteBlockWrapper.setProps({ visible: true })
          // Hide it
          await deleteBlockWrapper.vm.$emit('close')
          expect(deleteBlockWrapper.props('visible')).toBe(false)
        })

        it('Delete a block if the input event is emitted with an existing block', async () => {
          await wrapper.findAll('.edit-container-button').at(1).vm.$emit('click', secondDisplayedContainer)
          await wrapper.findAllComponents(Block).at(0).vm.$emit('delete-block')
          await deleteBlockWrapper.vm.$emit('input', firstDisplayedBlock)
          // Send API request
          expect(spyOnBlockRemove).toHaveBeenCalledWith(firstDisplayedBlock.id)
          // // Update the component data
          // expect(
          //   wrapper.vm.page.containers[1].blocks.find(block => block.id === firstDisplayedBlock.id)
          // ).toBeUndefined()
        })

        it('Delete a block if the input event is emitted with an existing block which is editing', async () => {
          await wrapper.findAllComponents(Block).at(0).vm.$emit('update-block')
          await wrapper.findAllComponents(Block).at(0).vm.$emit('delete-block')
          await deleteBlockWrapper.vm.$emit('input', firstDisplayedBlock)
          // Send API request
          expect(spyOnBlockRemove).toHaveBeenCalledWith(firstDisplayedBlock.id)
          // Update the component data
          // expect(
          //   wrapper.vm.page.containers[1].blocks.find(block => block.id === firstDisplayedBlock.id)
          // ).toBeUndefined()
        })

        it('Do nothing if the input event is emitted with an empty block', async () => {
          await wrapper.findAllComponents(Block).at(0).vm.$emit('delete-block')
          await deleteBlockWrapper.vm.$emit('input', {})
          expect(spyOnBlockRemove).not.toHaveBeenCalled()
          expect(wrapper.vm.page.containers[1].blocks.length).toBe(3)
        })

        it('Do not update the local data if the input event is emitted with an unknown container', async () => {
          await wrapper.findAllComponents(Block).at(0).vm.$emit('delete-block')
          await deleteBlockWrapper.vm.$emit('input', { ...firstDisplayedBlock, id: '-1' })
          expect(spyOnBlockRemove).toHaveBeenCalled()
          expect(wrapper.vm.page.containers[1].blocks.length).toBe(3)
        })

        it('Display a toast if an error is occured', async () => {
          const spyOnToast = jest.spyOn(wrapper.vm, 'displayToastOnError')
          spyOnBlockRemove.mockImplementationOnce(() => { throw new Error() })
          await wrapper.find('.remove-container-button').vm.$emit('click')
          await deleteBlockWrapper.vm.$emit('input', firstDisplayedBlock)
          expect(spyOnToast).toHaveBeenCalledTimes(1)
        })
      })

      describe('Reorder the blocks', () => {
        let spyOnBlockPatch

        beforeAll(() => {
          spyOnBlockPatch = jest.spyOn(lckServices.block, 'patch')
        })

        beforeEach(() => {
          spyOnBlockPatch.mockClear()
        })

        it('Save the new blocks positions if the change event is emitted (oldIndex < newIndex)', async () => {
          await wrapper.findAllComponents(draggable).at(2).vm.$emit('change', { moved: { oldIndex: 0, newIndex: 1 } })
          expect(spyOnBlockPatch).toHaveBeenCalledTimes(2)
          expect(spyOnBlockPatch).toHaveBeenNthCalledWith(1, firstDisplayedBlock.id, { position: 0 })
          expect(spyOnBlockPatch).toHaveBeenNthCalledWith(2, secondDisplayedBlock.id, { position: 1 })
        })
        it('Save the new blocks positions if the change event is emitted (oldIndex > newIndex)', async () => {
          await wrapper.findAllComponents(draggable).at(2).vm.$emit('change', { moved: { oldIndex: 1, newIndex: 0 } })
          expect(spyOnBlockPatch).toHaveBeenCalledTimes(2)
          expect(spyOnBlockPatch).toHaveBeenNthCalledWith(1, firstDisplayedBlock.id, { position: 0 })
          expect(spyOnBlockPatch).toHaveBeenNthCalledWith(2, secondDisplayedBlock.id, { position: 1 })
        })
        it('Do not save the new blocks positions if the drag over event is not a move event ', async () => {
          await wrapper.findAllComponents(draggable).at(2).vm.$emit('change', { added: { newIndex: 0 } })
          expect(spyOnBlockPatch).toHaveBeenCalledTimes(0)
        })
        it('Display a toast if an error is occured', async () => {
          const spyOnToast = jest.spyOn(wrapper.vm, 'displayToastOnError')
          spyOnBlockPatch.mockRejectedValueOnce(new MockError(400))
          await wrapper.findAllComponents(draggable).at(2).vm.$emit('change', { moved: { oldIndex: 0, newIndex: 1 } })
          process.nextTick(() => {
            expect(spyOnToast).toHaveBeenCalledTimes(1)
          })
        })
      })
    })
  })

  describe('Methods', () => {
    describe('displayToastOnError', () => {
      let wrapper
      let spyOnToastAdd

      beforeAll(async () => {
        wrapper = await shallowMount(Page, globalComponentParams())
        spyOnToastAdd = jest.spyOn(wrapper.vm.$toast, 'add')
      })

      afterEach(() => {
        spyOnToastAdd.mockClear()
      })

      it('Display a toast with the specified parameters for an error without code', () => {
        wrapper.vm.displayToastOnError('summary', new Error('an error without a code'))
        expect(spyOnToastAdd).toHaveBeenLastCalledWith(
          expect.objectContaining({
            summary: 'summary',
            detail: 'error.basic',
          }),
        )
      })

      it('Display a toast with the specified parameters for an error with a code', () => {
        wrapper.vm.displayToastOnError('summary', new MockError(404, 'an error with a code'))
        expect(spyOnToastAdd).toHaveBeenLastCalledWith(
          expect.objectContaining({
            summary: 'summary',
            detail: 'error.http.404',
          }),
        )
      })
    })
  })

  describe('Conditional display', () => {
    let wrapper

    beforeEach(async () => {
      wrapper = await shallowMount(Page, {
        ...globalComponentParams(),
        propsData: {
          pageId: '4',
          editMode: false,
          workspaceId: 'toto',
          groupId: 'this-is-a-group',
          userId: 1,
        },
      })
    })

    it('hide the block if the display value is not respected', async () => {
      const blocks = await wrapper.findAllComponents(Block)
      expect.assertions(4)
      expect(blocks.length).toBe(2)
      expect(wrapper.vm.isBlockDisplayed(mockPages['4'].containers[0].blocks[0])).toBe(true)
      expect(wrapper.vm.isBlockDisplayed(mockPages['4'].containers[0].blocks[1])).toBe(false)
      expect(wrapper.vm.isBlockDisplayed(mockPages['4'].containers[0].blocks[2])).toBe(true)
    })
    it('show the block if the display value is respected', async () => {
      await wrapper.setData({
        sources: {
          3: {
            content: {
              data: [{
                ...wrapper.vm.sources['3'].content.data[0],
                data: {
                  ...wrapper.vm.sources['3'].content.data[0].data,
                  displayField: true,
                },
              }],
            },
          },
        },
      })
      const blocks = await wrapper.findAllComponents(Block)
      expect.assertions(4)
      expect(blocks.length).toBe(3)
      expect(wrapper.vm.isBlockDisplayed(mockPages['4'].containers[0].blocks[0])).toBe(true)
      expect(wrapper.vm.isBlockDisplayed(mockPages['4'].containers[0].blocks[1])).toBe(true)
      expect(wrapper.vm.isBlockDisplayed(mockPages['4'].containers[0].blocks[2])).toBe(true)
    })
    it('show the block after the display value change to be the good one', async () => {
      let blocks = await wrapper.findAllComponents(Block)
      expect.assertions(10)
      expect(wrapper.vm.sources['3'].content.data[0].data.displayField).toBe(false)
      expect(blocks.length).toBe(2)
      expect(wrapper.vm.isBlockDisplayed(mockPages['4'].containers[0].blocks[0])).toBe(true)
      expect(wrapper.vm.isBlockDisplayed(mockPages['4'].containers[0].blocks[1])).toBe(false)
      expect(wrapper.vm.isBlockDisplayed(mockPages['4'].containers[0].blocks[2])).toBe(true)
      await wrapper.setData({
        sources: {
          3: {
            content: {
              data: [{
                ...wrapper.vm.sources['3'].content.data[0],
                data: {
                  ...wrapper.vm.sources['3'].content.data[0].data,
                  displayField: true,
                },
              }],
            },
          },
        },
      })
      expect(wrapper.vm.sources['3'].content.data[0].data.displayField).toBe(true)
      blocks = await wrapper.findAllComponents(Block)
      expect(blocks.length).toBe(3)
      expect(wrapper.vm.isBlockDisplayed(mockPages['4'].containers[0].blocks[0])).toBe(true)
      expect(wrapper.vm.isBlockDisplayed(mockPages['4'].containers[0].blocks[1])).toBe(true)
      expect(wrapper.vm.isBlockDisplayed(mockPages['4'].containers[0].blocks[2])).toBe(true)
    })
  })

  describe('Mutualisation sources', () => {
    let wrapper

    beforeEach(async () => {
      wrapper = await shallowMount(Page, {
        ...globalComponentParams(),
        propsData: {
          pageId: '4',
          editMode: false,
          workspaceId: 'toto',
          groupId: 'this-is-a-group',
          userId: 1,
        },
      })
    })

    it('mutualize in 3 sources', () => {
      expect.assertions(4)
      expect(wrapper.vm.sources['1']).toBeDefined()
      expect(wrapper.vm.sources['2']).toBeDefined()
      expect(wrapper.vm.sources['3']).toBeDefined()
      expect(Object.keys(wrapper.vm.sources).length).toBe(3)
    })
    it('mutualize all definitions in the page sources', () => {
      expect.assertions(3)
      expect(wrapper.vm.sources['1'].definition).toStrictEqual(mockTableViewDefinitions['1'])
      expect(wrapper.vm.sources['2'].definition).toStrictEqual(mockTableViewDefinitions['2'])
      expect(wrapper.vm.sources['3'].definition).toStrictEqual(mockTableViewDefinitions['3'])
    })
    it('mutualize all content in the page sources', () => {
      expect.assertions(3)
      expect(wrapper.vm.sources['1'].content.data).toStrictEqual(mockTableViewContents()['1'].data.slice(0, 20)) // paginated result
      expect(wrapper.vm.sources['2'].content).toStrictEqual(mockTableViewContents()['2'].data) // this is a geo source only, limit to -1
      expect(wrapper.vm.sources['3'].content.data).toStrictEqual([mockTableViewContents()['3'].data[0]])
    })
    it('provide paginated data to MapSet if mutualized with a TableSet', () => {
      expect.assertions(3)
      const tableSetContent = wrapper.vm.getBlockContent(mockPages['4'].containers[0].blocks[0])
      const mapSetContent = wrapper.vm.getBlockContent(mockPages['4'].containers[0].blocks[1])
      expect(tableSetContent.data).toBe(mapSetContent['1'])
      expect(tableSetContent.data.length).toBe(20)
      expect(mapSetContent['2'].length).toBe(28) // no limit for a geo source used only by one block
    })
    it('provide correctly data to record blocks', () => {
      expect.assertions(1)
      const dataRecordContent = wrapper.vm.getBlockContent(mockPages['4'].containers[0].blocks[2])
      expect(dataRecordContent.data.length).toBe(1)
    })
    it('do not display warning toaster if no mixed multi-mono sources', async () => {
      expect.assertions(1)
      const toasts = await wrapper.findAllComponents(Toast)
      expect(toasts.length).toBe(0)
    })
    it('display a warning toaster if multi and mono sources are mixed in the same page', async () => {
      const wrapper = await shallowMount(Page, {
        ...globalComponentParams(),
        propsData: {
          pageId: '5',
          editMode: false,
          workspaceId: 'toto',
          groupId: 'this-is-a-group',
          userId: 1,
        },
      })
      const spyOnToastAdd = jest.spyOn(wrapper.vm.$toast, 'add')
      await wrapper.vm.$nextTick()

      expect.assertions(2)
      expect(spyOnToastAdd).toHaveBeenCalledTimes(1)
      expect(spyOnToastAdd).toHaveBeenLastCalledWith(
        expect.objectContaining({
          severity: 'warn',
        }),
      )

      spyOnToastAdd.mockClear()
    })
  })

  describe('Mutualisation sources with custom table set pagination', () => {
    let wrapper

    beforeEach(async () => {
      wrapper = await shallowMount(Page, {
        ...globalComponentParams(),
        propsData: {
          pageId: '7',
          editMode: false,
          workspaceId: 'toto',
          groupId: 'this-is-a-group',
          userId: 1,
        },
      })
    })

    it('mutualize 2 sources', () => {
      expect.assertions(3)
      expect(Object.keys(wrapper.vm.sources)).toHaveLength(2)
      expect(wrapper.vm.sources['1']).toBeDefined()
      expect(wrapper.vm.sources['2']).toBeDefined()
    })
    it('provide paginated data to MapSet if mutualized with a TableSet', () => {
      expect.assertions(4)
      const limitedTableSetContent = wrapper.vm.getBlockContent(mockPages['7'].containers[0].blocks[0])
      const unlimitedTableSetContent = wrapper.vm.getBlockContent(mockPages['7'].containers[0].blocks[1])
      const mapSetContent = wrapper.vm.getBlockContent(mockPages['7'].containers[0].blocks[2])
      expect(limitedTableSetContent.data).toBe(mapSetContent['1'])
      expect(limitedTableSetContent.data.length).toBe(5)
      expect(unlimitedTableSetContent.data).toBe(mapSetContent['2'])
      expect(unlimitedTableSetContent.data.length).toBe(28)
    })
  })

  describe('Create new records (blocks Set)', () => {
    let wrapper
    beforeEach(async () => {
      wrapper = await shallowMount(Page, {
        ...globalComponentParams(),
        attachTo: document.body,
        propsData: {
          pageId: '6',
          editMode: false,
          workspaceId: 'toto',
          groupId: 'this-is-a-group',
          userId: 1,
        },
      })
    })
    it('match snapshot and display all blocks', async () => {
      expect.assertions(2)
      expect(wrapper.html()).toMatchSnapshot()
      const blocks = wrapper.findAllComponents(Block)
      expect(blocks.length).toBe(2)
    })
    it('by calling the API with structured data', async () => {
      expect.assertions(2)
      const blocks = wrapper.findAllComponents(Block)
      const spyOnTableRowCreation = jest.spyOn(lckServices.tableRow, 'create')
      blocks.at(0).vm.$emit('create-row', { data: { strColumn: 'yes' } })
      expect(spyOnTableRowCreation).toHaveBeenCalledTimes(1)
      expect(spyOnTableRowCreation).toHaveBeenNthCalledWith(1, {
        data: { strColumn: 'yes' },
        table_view_id: '4',
        $lckGroupId: 'this-is-a-group',
      })
      spyOnTableRowCreation.mockClear()
    })
    it('by refreshing all sources linked to the same table_id if succeed', async () => {
      expect.assertions(3)
      const blocks = wrapper.findAllComponents(Block)
      const spyOnLoadSourceContent = jest.spyOn(wrapper.vm, 'loadSourceContent')
      await blocks.at(0).vm.$emit('create-row', { data: { strColumn: 'yes' } })
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()
      expect(spyOnLoadSourceContent).toHaveBeenCalledTimes(2)
      expect(spyOnLoadSourceContent).toHaveBeenNthCalledWith(1, '4')
      expect(spyOnLoadSourceContent).toHaveBeenNthCalledWith(2, '3')
      // spyOnLoadSourceContent.mockClear()
    })
    it('display a $toast if an error occured', async () => {
      expect.assertions(3)
      const blocks = wrapper.findAllComponents(Block)
      const initialCreate = lckServices.tableRow.create
      lckServices.tableRow.create = jest.fn(() => { throw new Error('you loose') })
      const spyOnToast = jest.spyOn(wrapper.vm.$toast, 'add')
      blocks.at(0).vm.$emit('create-row', { data: { strColumn: 'yes' } })
      /**
         * Here we have two toaster that have been displayed
         * because we mix a DATA_RECORD and a MAP_SET on the same tableViewId
         * so we have a warn toast + error toast
         */
      expect(spyOnToast).toHaveBeenCalledTimes(2)
      expect(spyOnToast).toHaveBeenNthCalledWith(1, {
        detail: 'error.cms.blockMultiConflictDetail',
        severity: 'warn',
        summary: 'error.cms.blockMultiConflictSummary',
      })
      expect(spyOnToast).toHaveBeenNthCalledWith(2, {
        severity: 'error',
        detail: 'error.basic',
        life: 5000,
        summary: 'error.http.undefined',
      })
      lckServices.tableRow.create = initialCreate
    })
    afterEach(async () => {
      await wrapper.destroy()
    })
  })

  describe('Manage the secondary sources', () => {
    let wrapper

    beforeEach(async () => {
      wrapper = await shallowMount(Page, {
        ...globalComponentParams(),
        propsData: {
          pageId: '1',
          editMode: false,
          workspaceId: 'toto',
          groupId: 'this-is-a-group',
          userId: 1,
        },
      })
    })
    const loadedContent = mockTableViewContents()

    it('load the specified secondary sources', async () => {
      // Initialization
      expect(wrapper.vm.secondarySources).toEqual({
        [mockBlocksOfFirstPage[0].id]: {},
        [mockBlocksOfFirstPage[1].id]: {},
        [mockBlocksOfFirstPage[2].id]: {},
      })
      lckHelpers.retrieveViewDefinition.mockClear()
      // Get the secondary sources the first time
      await wrapper.vm.getSecondarySources(mockBlocksOfFirstPage[0], [
        mockTableViewDefinitions['1'].id,
      ])
      // Database calls
      expect(lckHelpers.retrieveViewDefinition).toHaveBeenCalledTimes(1)
      expect(lckHelpers.retrieveViewDefinition).toHaveBeenCalledWith([
        mockTableViewDefinitions['1'].id,
      ])
      // Result
      expect(wrapper.vm.secondarySources[mockBlocksOfFirstPage[0].id]).toEqual({
        1: {
          definition: mockTableViewDefinitions['1'],
          content: loadedContent['1'].data,
        },
      })
      lckHelpers.retrieveViewDefinition.mockClear()
      // Get the secondary sources the second time
      await wrapper.vm.getSecondarySources(mockBlocksOfFirstPage[0], [
        mockTableViewDefinitions['1'].id,
        mockTableViewDefinitions['2'].id,
      ])
      // Database calls
      expect(lckHelpers.retrieveViewDefinition).toHaveBeenCalledTimes(1)
      expect(lckHelpers.retrieveViewDefinition).toHaveBeenCalledWith([
        mockTableViewDefinitions['2'].id,
      ])
      // Result
      expect(wrapper.vm.secondarySources[mockBlocksOfFirstPage[0].id]).toEqual({
        1: {
          definition: mockTableViewDefinitions['1'],
          content: loadedContent['1'].data,
        },
        2: {
          definition: mockTableViewDefinitions['2'],
          content: loadedContent['2'].data,
        },
      })
    })
  })

  describe('API calls when editing or creating a row', () => {
    const currentTableView = mockTableViewDefinitions['5']
    const defaultCellEditParams = {
      type: 'outside',
      index: 0,
      originalEvent: {
        target: {
          closest: () => null,
        },
      },
    }

    describe('From a MapSet block', () => {
      describe('Row creation', () => {
        beforeAll(async () => {
          // Mount the wrapper
          const wrapper = await mount(Page, {
            ...globalComponentParams(),
            attachTo: document.body,
            propsData: {
              pageId: '12',
              workspaceId: 'W1',
              groupId: 'this-is-a-group',
              userId: 1,
            },
          })
          jest.useFakeTimers()
          await flushAll()

          // Display the creation form
          const lckMapSetWrapper = wrapper.findComponent(MapSet)
          await lckMapSetWrapper.vm.onClickAddButton()
          await flushAll()

          const lckDataDetailWrapper = lckMapSetWrapper.findComponent(DataDetail)
          const lckFormWrapper = lckMapSetWrapper.findComponent(DialogForm)

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
          await textInput.vm.$emit('input', 'Jack')
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
          const geoColumn = currentTableView.columns[16]
          await geoInput.vm.$emit('update-features', [
            {
              id: `row-1:${geoColumn.id}`,
              type: 'Feature',
              properties: {
                id: `row-1:${geoColumn.id}`,
                columnId: geoColumn.id,
                rowId: 'row-1',
                sourceId: currentTableView.id,
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

        it('Of a string column', () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[0].id]: 'Jack',
            }),
          }))
        })

        it('Of a user column', () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[4].id]: 'user-4',
            }),
          }))
        })

        it('Of a boolean column', () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[5].id]: true,
            }),
          }))
        })

        it('Of an integer column', () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[6].id]: 10,
            }),
          }))
        })

        it('Of a decimal number column', () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[7].id]: 10.5,
            }),
          }))
        })

        it('Of a date column', () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[8].id]: '2021-10-01',
            }),
          }))
        })

        it('Of a group column', () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[9].id]: 'group-3',
            }),
          }))
        })

        it('Of a relation between tables column', () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[10].id]: 'row-1b',
            }),
          }))
        })

        it('Of a single select column', () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[11].id]: 'option1',
            }),
          }))
        })

        it('Of a multi select column', () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[12].id]: ['option1', 'option2'],
            }),
          }))
        })

        it('Of a file column', () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[13].id]: [1],
            }),
          }))
        })

        it('Of a multi user column (when selecting an item)', () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[14].id]: ['user-2'],
            }),
          }))
        })

        it('Of a text column', () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[15].id]: 'Tempora excepturi voluptates dolorem sunt doloremque quia quae.',
            }),
          }))
        })

        it('Of a URL column', () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[16].id]: 'https://www.locokit.io/img/train.png',
            }),
          }))
        })

        it('Of a geographic column', () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[17].id]: 'SRID=4326;POINT(-2.85 46.49)',
            }),
          }))
        })

        it('Of a datetime column', () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[18].id]: '2021-10-01T12:00:00Z',
            }),
          }))
        })
      })
    })

    describe('From a FormRecord block', () => {
      describe('Row creation', () => {
        let wrapper, lckDataDetailWrapper
        beforeAll(async () => {
          // Mount the wrapper
          wrapper = await mount(Page, {
            ...globalComponentParams(),
            attachTo: document.body,
            propsData: {
              pageId: '11',
              workspaceId: 'W1',
              groupId: 'this-is-a-group',
              userId: 1,
            },
          })

          jest.useFakeTimers()
          await flushAll()

          lckDataDetailWrapper = wrapper.findComponent(DataDetail)
          const lckFormWrapper = wrapper.findComponent(Form)

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
          const geoColumn = currentTableView.columns[16]
          await geoInput.vm.$emit('update-features', [
            {
              id: `row-1:${geoColumn.id}`,
              type: 'Feature',
              properties: {
                id: `row-1:${geoColumn.id}`,
                columnId: geoColumn.id,
                rowId: 'row-1',
                sourceId: currentTableView.id,
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
          await lckFormWrapper.vm.$emit('submit')
        })

        it('Of a string column', async () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[0].id]: 'JOHN',
            }),
          }))
        })

        it('Of a user column', async () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[4].id]: 'user-4',
            }),
          }))
        })

        it('Of a boolean column', async () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[5].id]: true,
            }),
          }))
        })

        it('Of an integer column', async () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[6].id]: 10,
            }),
          }))
        })

        it('Of a decimal number column', async () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[7].id]: 10.5,
            }),
          }))
        })

        it('Of a date column', async () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[8].id]: '2021-10-01',
            }),
          }))
        })

        it('Of a group column', async () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[9].id]: 'group-3',
            }),
          }))
        })

        it('Of a relation between tables column', async () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[10].id]: 'row-1b',
            }),
          }))
        })

        it('Of a single select column', async () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[11].id]: 'option1',
            }),
          }))
        })

        it('Of a multi select column', async () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[12].id]: ['option1', 'option2'],
            }),
          }))
        })

        it('Of a file column', async () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[13].id]: [1],
            }),
          }))
        })

        it('Of a multi user column (when selecting an item)', async () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[14].id]: ['user-2'],
            }),
          }))
        })

        it('Of a text column', async () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[15].id]: 'Tempora excepturi voluptates dolorem sunt doloremque quia quae.',
            }),
          }))
        })

        it('Of a URL column', async () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[16].id]: 'https://www.locokit.io/img/train.png',
            }),
          }))
        })

        it('Of a geographic column', async () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[17].id]: 'SRID=4326;POINT(-2.85 46.49)',
            }),
          }))
        })

        it('Of a datetime column', async () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[18].id]: '2021-10-01T12:00:00Z',
            }),
          }))
        })
      })
    })

    describe('From a DataRecord block', () => {
      describe('Row editing', () => {
        let lckDataDetailWrapper, wrapper

        beforeAll(async () => {
          wrapper = await mount(Page, {
            ...globalComponentParams(),
            attachTo: document.body,
            propsData: {
              pageId: '10',
              workspaceId: 'W1',
              groupId: 'this-is-a-group',
              userId: 1,
            },
          })

          jest.useFakeTimers()
          await flushAll()

          lckDataDetailWrapper = wrapper.findComponent(DataDetail)
        })

        beforeEach(async () => {
          await flushAll()
          lckServices.tableRow.patch.mockClear()
        })

        it('Of a string column', async () => {
          expect.assertions(1)
          // Get the right column
          const tableColumn = currentTableView.columns[0]
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
          const tableColumn = currentTableView.columns[4]
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
          const tableColumn = currentTableView.columns[4]
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
          const tableColumn = currentTableView.columns[5]
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
          const tableColumn = currentTableView.columns[6]
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
          const tableColumn = currentTableView.columns[7]
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
          const tableColumn = currentTableView.columns[8]
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
          const tableColumn = currentTableView.columns[8]
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
          const tableColumn = currentTableView.columns[9]
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
          const tableColumn = currentTableView.columns[10]
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
          const tableColumn = currentTableView.columns[11]
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
          const tableColumn = currentTableView.columns[12]
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
          const tableColumn = currentTableView.columns[13]
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
          const tableColumn = currentTableView.columns[13]
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
          const tableColumn = currentTableView.columns[14]
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
          const tableColumn = currentTableView.columns[14]
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
          const tableColumn = currentTableView.columns[15]
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
          expect.assertions(1)
          // Get the right input
          const tableColumn = currentTableView.columns[16]
          const input = lckDataDetailWrapper.findComponent({ name: 'LckURLInput' })
          // Mock the HTML validity API which seems to not be implemented in jest
          input.vm.$refs.URLInput.$el.validity = {
            valid: true,
          }
          // Change the value
          await input.vm.$emit('input', 'https://www.locokit.io/index.html')
          await input.vm.$emit('blur')
          // Check the API call
          expect(lckServices.tableRow.patch).toHaveBeenLastCalledWith('row-1', expect.objectContaining({
            data: {
              [tableColumn.id]: 'https://www.locokit.io/index.html',
            },
          }))
        })

        it('Of a geographic column (addition)', async () => {
          expect.assertions(1)
          // Get the right input
          const tableColumn = currentTableView.columns[17]
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
                sourceId: currentTableView.id,
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
          const tableColumn = currentTableView.columns[17]
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
                sourceId: currentTableView.id,
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
          const tableColumn = currentTableView.columns[18]
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
          const tableColumn = currentTableView.columns[18]
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
    })

    describe('From a TableSet block', () => {
      describe('Row editing with paginated data', () => {
        let firstRowColumnsWrapper, lckDatatableWrapper, primeDatatableWrapper, wrapper

        beforeAll(async () => {
          wrapper = await mount(Page, {
            ...globalComponentParams(),
            attachTo: document.body,
            propsData: {
              pageId: '8',
              workspaceId: 'W1',
              groupId: 'this-is-a-group',
              userId: 1,
            },
          })

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
          const tableColumn = currentTableView.columns[0]
          const column = firstRowColumnsWrapper.at(0)
          // Make it editable
          await column.trigger('click')
          const input = column.findComponent({ name: 'p-input-text' })
          // Change the value
          await input.vm.$emit('input', 'Jake')
          // Simulate the end of the user input
          await primeDatatableWrapper.vm.$emit('cell-edit-complete', {
            ...defaultCellEditParams,
            data: lckDatatableWrapper.props('content').data[0],
            field: tableColumn.id,
          })
          // Check the API call
          expect(lckServices.tableRow.patch).toHaveBeenLastCalledWith('row-1', expect.objectContaining({
            data: {
              [tableColumn.id]: 'Jake',
            },
          }))
        })

        it('Of a user column (selection)', async () => {
          expect.assertions(1)
          // Get the right column
          const tableColumn = currentTableView.columns[4]
          const column = firstRowColumnsWrapper.at(4)
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
          const tableColumn = currentTableView.columns[4]
          const column = firstRowColumnsWrapper.at(4)
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
          const tableColumn = currentTableView.columns[5]
          const column = firstRowColumnsWrapper.at(5)
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
          const tableColumn = currentTableView.columns[6]
          const column = firstRowColumnsWrapper.at(6)
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
          const tableColumn = currentTableView.columns[7]
          const column = firstRowColumnsWrapper.at(7)
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
          const tableColumn = currentTableView.columns[8]
          const column = firstRowColumnsWrapper.at(8)
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
          const tableColumn = currentTableView.columns[8]
          const column = firstRowColumnsWrapper.at(8)
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
          const tableColumn = currentTableView.columns[9]
          const column = firstRowColumnsWrapper.at(9)
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
          const tableColumn = currentTableView.columns[10]
          const column = firstRowColumnsWrapper.at(10)
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
          const tableColumn = currentTableView.columns[11]
          const column = firstRowColumnsWrapper.at(11)
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
          const tableColumn = currentTableView.columns[12]
          const column = firstRowColumnsWrapper.at(12)
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

        it('Of a file column', async () => {
          expect.assertions(1)
          // Get the right column
          const tableColumn = currentTableView.columns[13]
          const column = firstRowColumnsWrapper.at(13)
          // Make it editable
          await column.trigger('click')
          const input = column.findComponent({ name: 'LckFileCell' })
          const uploadedFiles = [
            new File([''], 'myFile1.txt', { type: 'text/plain' }),
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

        it('Of a multi user column (when selecting an item)', async () => {
          expect.assertions(1)
          // Get the right column
          const tableColumn = currentTableView.columns[14]
          const column = firstRowColumnsWrapper.at(14)
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
          const tableColumn = currentTableView.columns[14]
          const column = firstRowColumnsWrapper.at(14)
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
          const tableColumn = currentTableView.columns[15]
          const column = firstRowColumnsWrapper.at(15)
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
          const tableColumn = currentTableView.columns[16]
          const column = firstRowColumnsWrapper.at(16)
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
          const tableColumn = currentTableView.columns[18]
          const column = firstRowColumnsWrapper.at(18)
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
          const tableColumn = currentTableView.columns[18]
          const column = firstRowColumnsWrapper.at(18)
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
      describe('Row editing with unpaginated data', () => {
        let firstRowColumnsWrapper, lckDatatableWrapper, primeDatatableWrapper, wrapper

        beforeAll(async () => {
          wrapper = await mount(Page, {
            ...globalComponentParams(),
            attachTo: document.body,
            propsData: {
              pageId: '9',
              workspaceId: 'W1',
              groupId: 'this-is-a-group',
              userId: 1,
            },
          })

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
          const tableColumn = currentTableView.columns[0]
          const column = firstRowColumnsWrapper.at(0)
          // Make it editable
          await column.trigger('click')
          const input = column.findComponent({ name: 'p-input-text' })
          // Change the value
          await input.vm.$emit('input', 'Jake')
          // Simulate the end of the user input
          await primeDatatableWrapper.vm.$emit('cell-edit-complete', {
            ...defaultCellEditParams,
            data: lckDatatableWrapper.props('content').data[0],
            field: tableColumn.id,
          })
          // Check the API call
          expect(lckServices.tableRow.patch).toHaveBeenLastCalledWith('row-1', expect.objectContaining({
            data: {
              [tableColumn.id]: 'Jake',
            },
          }))
        })

        it('Of a file column (deletion)', async () => {
          expect.assertions(1)
          // Get the right column
          const tableColumn = currentTableView.columns[13]
          const column = firstRowColumnsWrapper.at(13)
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
      })
      describe('Row creation', () => {
        beforeAll(async () => {
          // Mount the wrapper
          const wrapper = await mount(Page, {
            ...globalComponentParams(),
            attachTo: document.body,
            propsData: {
              pageId: '8',
              workspaceId: 'W1',
              groupId: 'this-is-a-group',
              userId: 1,
            },
          })
          jest.useFakeTimers()
          await flushAll()

          // Display the creation form
          const lckTableSetWrapper = wrapper.findComponent(TableSet)
          await lckTableSetWrapper.vm.onClickAddButton()
          await flushAll()

          const lckDataDetailWrapper = lckTableSetWrapper.findComponent(DataDetail)
          const lckFormWrapper = lckTableSetWrapper.findComponent(DialogForm)

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
          await textInput.vm.$emit('input', 'Jack')
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
          const geoColumn = currentTableView.columns[16]
          await geoInput.vm.$emit('update-features', [
            {
              id: `row-1:${geoColumn.id}`,
              type: 'Feature',
              properties: {
                id: `row-1:${geoColumn.id}`,
                columnId: geoColumn.id,
                rowId: 'row-1',
                sourceId: currentTableView.id,
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

        it('Of a string column', () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[0].id]: 'Jack',
            }),
          }))
        })

        it('Of a user column', () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[4].id]: 'user-4',
            }),
          }))
        })

        it('Of a boolean column', () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[5].id]: true,
            }),
          }))
        })

        it('Of an integer column', () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[6].id]: 10,
            }),
          }))
        })

        it('Of a decimal number column', () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[7].id]: 10.5,
            }),
          }))
        })

        it('Of a date column', () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[8].id]: '2021-10-01',
            }),
          }))
        })

        it('Of a group column', () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[9].id]: 'group-3',
            }),
          }))
        })

        it('Of a relation between tables column', () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[10].id]: 'row-1b',
            }),
          }))
        })

        it('Of a single select column', () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[11].id]: 'option1',
            }),
          }))
        })

        it('Of a multi select column', () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[12].id]: ['option1', 'option2'],
            }),
          }))
        })

        it('Of a file column', () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[13].id]: [1],
            }),
          }))
        })

        it('Of a multi user column (when selecting an item)', () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[14].id]: ['user-2'],
            }),
          }))
        })

        it('Of a text column', () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[15].id]: 'Tempora excepturi voluptates dolorem sunt doloremque quia quae.',
            }),
          }))
        })

        it('Of a URL column', () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[16].id]: 'https://www.locokit.io/img/train.png',
            }),
          }))
        })

        it('Of a geographic column', () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[17].id]: 'SRID=4326;POINT(-2.85 46.49)',
            }),
          }))
        })

        it('Of a datetime column', () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[18].id]: '2021-10-01T12:00:00Z',
            }),
          }))
        })
      })
      describe('Row duplication', () => {
        beforeAll(async () => {
          // Mount the wrapper
          const wrapper = await mount(Page, {
            ...globalComponentParams(),
            attachTo: document.body,
            propsData: {
              pageId: '8',
              workspaceId: 'W1',
              groupId: 'this-is-a-group',
              userId: 1,
            },
          })
          jest.useFakeTimers()
          await flushAll()
          lckServices.tableRow.create.mockClear()
          const lckDatatableWrapper = wrapper.findComponent(DataTable)

          // Duplicate the second row
          lckDatatableWrapper.vm.$emit('row-duplicate', lckDatatableWrapper.props('content').data[1])
          await flushAll()
        })

        it('Of a string column', async () => {
          expect(lckServices.tableRow.create).toHaveBeenCalledTimes(1)
          expect(lckServices.tableRow.create).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[0].id]: 'Jane',
            }),
          }))
        })

        it('Of a user column', async () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[4].id]: 'user-2',
            }),
          }))
        })

        it('Of a boolean column', async () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[5].id]: false,
            }),
          }))
        })

        it('Of an integer column', async () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[6].id]: 2,
            }),
          }))
        })

        it('Of a decimal number column', async () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[7].id]: 2.5,
            }),
          }))
        })

        it('Of a date column', async () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[8].id]: '2021-09-02',
            }),
          }))
        })

        it('Of a group column', async () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[9].id]: 'group-1',
            }),
          }))
        })

        it('Of a relation between tables column', async () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[10].id]: 'row-1b',
            }),
          }))
        })

        it('Of a single select column', async () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[11].id]: 'option2',
            }),
          }))
        })

        it('Of a multi select column', async () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[12].id]: ['option1', 'option2'],
            }),
          }))
        })

        it('Of a file column', async () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[13].id]: [1],
            }),
          }))
        })

        it('Of a multi user column (when selecting an item)', async () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[14].id]: ['user-2', 'user-4'],
            }),
          }))
        })

        it('Of a text column', async () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[15].id]: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            }),
          }))
        })

        it('Of a URL column', async () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[16].id]: 'https://www.locokit.io',
            }),
          }))
        })

        it('Of a geographic column', async () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[17].id]: 'SRID=4326;POINT(1.2 45)',
            }),
          }))
        })

        it('Of a datetime column', async () => {
          expect(lckServices.tableRow.create).toHaveBeenLastCalledWith(expect.objectContaining({
            data: expect.objectContaining({
              [currentTableView.columns[18].id]: '2021-09-02T12:00:00Z',
            }),
          }))
        })
      })
    })
  })
})
