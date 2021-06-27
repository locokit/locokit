/* eslint-disable @typescript-eslint/camelcase, @typescript-eslint/no-unused-vars */

import { shallowMount, createLocalVue } from '@vue/test-utils'
import { BLOCK_TYPE } from '@locokit/lck-glossary'
import VueRouter from 'vue-router'
import draggable from 'vuedraggable'
import Toast from 'primevue/toast'

import { ROUTES_PATH, ROUTES_NAMES } from '@/router/paths'
import { lckServices } from '@/services/lck-api'

import Page from './Page.vue'
import Workspace from '@/views/routes/workspace/visualization/Workspace.vue'

import Block from '@/components/visualize/Block/Block.vue'
import UpdateSidebar from '@/components/visualize/UpdateSidebar/UpdateSidebar.vue'
import DeleteConfirmationDialog from '@/components/ui/DeleteConfirmationDialog/DeleteConfirmationDialog.vue'

// Mock external libraries

jest.mock('date-fns')
jest.mock('file-saver')
jest.mock('vuedraggable')

// Mock primevue component
jest.mock('primevue/button', () => ({
  name: 'p-button',
  render: h => h('p-button')
}))

jest.mock('primevue/breadcrumb', () => ({
  name: 'p-breadcrumb',
  render: h => h('p-breadcrumb')
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
              content: 'My paragraph content'
            },
            title: 'My paragraph block',
            type: BLOCK_TYPE.PARAGRAPH,
            position: 2,
            container_id: '12'
          },
          {
            id: '122',
            createdAt: '2020-11-02T16:11:03.109Z',
            updatedAt: '2020-11-02T16:11:03.109Z',
            settings: {
              id: '1'
            },
            title: 'My TableSet block',
            type: BLOCK_TYPE.TABLE_SET,
            position: 1,
            container_id: '12'
          },
          {
            id: '123',
            createdAt: '2020-11-02T16:11:03.109Z',
            updatedAt: '2020-11-02T16:11:03.109Z',
            settings: {
              sources: [
                {
                  id: '1'
                },
                {
                  id: '2'
                },
                {
                  id: '3'
                }
              ]
            },
            title: 'My map block',
            type: BLOCK_TYPE.MAP_SET,
            position: 3,
            container_id: '12'
          }
        ]
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
        blocks: []
      }
    ]
  },
  2: {
    id: '2',
    text: 'Page 2',
    createdAt: '2020-11-02T16:11:03.109Z',
    updatedAt: '2020-11-02T16:11:03.109Z',
    chapter_id: 'C2',
    position: 2,
    hidden: true,
    containers: []
  },
  3: {
    id: '3',
    text: 'Page 3',
    createdAt: '2020-11-02T16:11:03.109Z',
    updatedAt: '2020-11-02T16:11:03.109Z',
    chapter_id: 'C1',
    position: 2,
    hidden: true,
    containers: []
  },
  4: {
    id: '4',
    text: 'Page 4',
    createdAt: '2021-06-25T18:40:03.109Z',
    updatedAt: '2021-06-25T18:40:03.109Z',
    position: 3,
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
              id: '1'
            },
            title: 'My TableSet block',
            type: BLOCK_TYPE.TABLE_SET,
            position: 1,
            container_id: '14'
          },
          {
            id: '141',
            createdAt: '2021-06-25T18:40:03.109Z',
            updatedAt: '2021-06-25T18:40:03.109Z',
            settings: {
              sources: [
                {
                  id: '1'
                },
                {
                  id: '2'
                }
              ]
            },
            title: 'My map block',
            type: BLOCK_TYPE.MAP_SET,
            position: 2,
            container_id: '14',
            conditionalDisplayTableViewId: '3',
            conditionalDisplayFieldId: 'displayField',
            conditionalDisplayFieldValue: true
          },
          {
            id: '142',
            createdAt: '2021-06-25T18:40:03.109Z',
            updatedAt: '2021-06-25T18:40:03.109Z',
            settings: {
              id: '3'
            },
            title: 'My data record block',
            type: BLOCK_TYPE.DATA_RECORD,
            position: 3,
            container_id: '14'
          }
        ]
      }
    ]
  },
  5: {
    id: '5',
    text: 'Page 5',
    createdAt: '2021-06-25T18:40:03.109Z',
    updatedAt: '2021-06-25T18:40:03.109Z',
    chapter_id: 'C1',
    position: 4,
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
              id: '1'
            },
            title: 'My TableSet block',
            type: BLOCK_TYPE.TABLE_SET,
            position: 1,
            container_id: '15'
          },
          {
            id: '151',
            createdAt: '2021-06-25T18:40:03.109Z',
            updatedAt: '2021-06-25T18:40:03.109Z',
            settings: {
              id: '1'
            },
            title: 'My data record block',
            type: BLOCK_TYPE.DATA_RECORD,
            position: 3,
            container_id: '15'
          }
        ]
      }
    ]
  }
}

const mockChapters = [
  {
    id: 'C1',
    text: 'First chapter',
    pages: [mockPages['1'], mockPages['3']]
  },
  {
    id: 'C2',
    text: 'Second chapter',
    pages: [mockPages['2']]
  }
]

const mockTableViewDefinitions = {
  1: {
    id: '1',
    columns: []
  },
  2: {
    id: '2',
    columns: []
  },
  3: {
    id: '3',
    columns: []
  }
}

const mockTableViewContents = () => ({
  1: {
    data: [
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content'
        }
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content'
        }
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content'
        }
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content'
        }
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content'
        }
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content'
        }
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content'
        }
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content'
        }
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content'
        }
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content'
        }
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content'
        }
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content'
        }
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content'
        }
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content'
        }
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content'
        }
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content'
        }
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content'
        }
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content'
        }
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content'
        }
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content'
        }
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content'
        }
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content'
        }
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content'
        }
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content'
        }
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content'
        }
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content'
        }
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content'
        }
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content'
        }
      },
      {
        id: 'tv1r1',
        text: 'TableView 1 - Row 1',
        table_id: 't1',
        data: {
          c1: 'first content'
        }
      }
    ]
  },
  2: {
    data: [
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content'
        }
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content'
        }
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content'
        }
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content'
        }
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content'
        }
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content'
        }
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content'
        }
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content'
        }
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content'
        }
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content'
        }
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content'
        }
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content'
        }
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content'
        }
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content'
        }
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content'
        }
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content'
        }
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content'
        }
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content'
        }
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content'
        }
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content'
        }
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content'
        }
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content'
        }
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content'
        }
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content'
        }
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content'
        }
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content'
        }
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content'
        }
      },
      {
        id: 'tv2r1',
        text: 'TableView 2 - Row 1',
        table_id: 't1',
        data: {
          c2: 'second content'
        }
      }
    ]
  },
  3: {
    data: [
      {
        id: 'tv3r1',
        text: 'TableView 3 - Row 1',
        table_id: 't1',
        data: {
          c3: 'third content',
          displayField: false
        }
      },
      {
        id: 'tv3r1',
        text: 'TableView 3 - Row 1',
        table_id: 't1',
        data: {
          c3: 'third content',
          displayField: false
        }
      }
    ]
  }
})

const unknownTypeBlock = {
  id: 'temp',
  title: 'my unknown block',
  type: 'UNKNOWN_TYPE_BLOCK'
}
const paragraphBlock = {
  id: 'temp',
  title: 'my paragraph block',
  type: BLOCK_TYPE.PARAGRAPH,
  settings: {
    content: 'The text to display.'
  }
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
        type: 'IMAGE'
      },
      {
        name: 'Video',
        srcURL: '/videos/video1.avi',
        type: 'VIDEO'
      }
    ]
  }
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
      remove: jest.fn()
    },
    block: {
      patch: jest.fn((id, data) =>
        ({ ...mockPages['1'].containers[0].blocks.find(block => block.id === id), ...data })),
      create: jest.fn(data =>
        ({ ...mockPages['1'].containers[0].blocks[0], ...data, id: '22' })),
      remove: jest.fn()
    }
  },
  lckHelpers: {
    searchItems: jest.fn(() => ([
      { label: 'A', value: 1 },
      { label: 'B', value: 2 },
      { label: 'C', value: 3 }
    ])),
    exportTableRowData: jest.fn(() => 'CSV_EXPORT'),
    retrievePageWithContainersAndBlocks: jest.fn(pageId => mockDeepCloneObject(mockPages[pageId])),
    retrieveViewDefinition: jest.fn(
      tableViewIds => Object.values(mockTableViewDefinitions).filter(view => tableViewIds.includes(view.id))
    ),
    retrieveViewData: jest.fn(
      (tableViewId, _0, skip, limit) => {
        const content = mockTableViewContents()[tableViewId]
        return limit === -1
          ? mockTableViewContents()[tableViewId].data
          : {
            total: content.data.length,
            limit,
            skip,
            data: content.data.slice(skip, skip + limit) // Paginated result
          }
      }
    )
  }
}))

jest.mock('@/services/lck-helpers/database')

jest.mock('@/router/paths', () => ({
  ROUTES_PATH: {
    WORKSPACE: '/workspace',
    VISUALIZATION: '/visualization'
  },
  ROUTES_NAMES: {
    VISUALIZATION: 'WorkspaceVisualization',
    PAGE: 'Page'
  }
}))

jest.mock('@/views/routes/workspace/visualization/Workspace.vue', () => ({
  name: 'Workspace',
  render: h => h('workspace'),
  computed: {
    sidebarItems: () => []
  }
}))

jest.mock('@/components/visualize/Block/Block', () => ({
  name: 'Block',
  render: h => h('block')
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
      component: Page
    }]
  }
]

// Tests

describe('Page', () => {
  // For vue router
  const localVue = createLocalVue()
  localVue.use(VueRouter)
  const router = new VueRouter({ routes: mockRoutes })

  // Default workspace component configuration
  function globalComponentParams (pageId = '1', workspaceId = '17', groupId = 'this-is-a-group') {
    return {
      localVue,
      router,
      propsData: { workspaceId, pageId, chapters: mockChapters, groupId },
      mocks: {
        t: key => key,
        $t: key => key,
        $toast: {
          add: jest.fn()
        }
      },
      parentComponent: Workspace
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
            3: mockTableViewDefinitions['3']
          })
          const blockContent = wrapper.vm.getBlockContent(wrapper.vm.page.containers[1].blocks[2])
          expect(blockContent).toStrictEqual({
            1: mockTableViewContents()['1'].data.slice(0, 20),
            2: mockTableViewContents()['2'].data,
            3: mockTableViewContents()['3'].data
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
        wrapper = await shallowMount(Page, { ...globalComponentParams(), propsData: { pageId: '1', editMode: true, workspaceId: 'toto', groupId: 'this-is-a-group' } })
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
              container.text === newContainerName
            )
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
            wrapper.vm.page.containers.find(container => container.id === firstDisplayedContainer.id)
          ).toBeUndefined()
        })

        it('Do nothing if the input event is emitted with an empty container', async () => {
          await wrapper.find('.remove-container-button').vm.$emit('click')
          await deleteConfirmationWrapper.vm.$emit('input', {})
          expect(
            wrapper.vm.page.containers.find(container => container.id === firstDisplayedContainer.id)
          ).toBeDefined()
        })

        it('Do nothing if the input event is emitted with an undefined container', async () => {
          await wrapper.find('.remove-container-button').vm.$emit('click')
          await deleteConfirmationWrapper.vm.$emit('input')
          expect(
            wrapper.vm.page.containers.find(container => container.id === firstDisplayedContainer.id)
          ).toBeDefined()
        })

        it('Do nothing if the input event is emitted with an unknown container', async () => {
          await wrapper.find('.remove-container-button').vm.$emit('click')
          await deleteConfirmationWrapper.vm.$emit('input', { ...firstDisplayedContainer, id: '-1' })
          expect(
            wrapper.vm.page.containers.find(container => container.id === firstDisplayedContainer.id)
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
        wrapper = await shallowMount(Page, { ...globalComponentParams(), propsData: { pageId: '1', editMode: true, workspaceId: 'toto', groupId: 'this-is-a-group' } })
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
          settings: { content: 'My new content' }
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
            expect.objectContaining({ ...firstDisplayedBlock })
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
              settings: blockToEdit.settings
            })
          // Update the component data
          expect(wrapper.vm.page.containers[1].blocks[1]).toStrictEqual(
            expect.objectContaining({ ...blockToEdit })
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
            detail: 'error.basic'
          })
        )
      })

      it('Display a toast with the specified parameters for an error with a code', () => {
        wrapper.vm.displayToastOnError('summary', new MockError(404, 'an error with a code'))
        expect(spyOnToastAdd).toHaveBeenLastCalledWith(
          expect.objectContaining({
            summary: 'summary',
            detail: 'error.http.404'
          })
        )
      })
    })
  })

  describe('Conditional display', () => {
    let wrapper

    beforeEach(async () => {
      wrapper = shallowMount(Page, {
        ...globalComponentParams(),
        propsData: {
          pageId: '4',
          editMode: false,
          workspaceId: 'toto',
          groupId: 'this-is-a-group'
        }
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
                  displayField: true
                }
              }]
            }
          }
        }
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
                  displayField: true
                }
              }]
            }
          }
        }
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
      wrapper = shallowMount(Page, {
        ...globalComponentParams(),
        propsData: {
          pageId: '4',
          editMode: false,
          workspaceId: 'toto',
          groupId: 'this-is-a-group'
        }
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
          groupId: 'this-is-a-group'
        }
      })
      const spyOnToastAdd = jest.spyOn(wrapper.vm.$toast, 'add')
      await wrapper.vm.$nextTick()

      expect.assertions(2)
      expect(spyOnToastAdd).toHaveBeenCalledTimes(1)
      expect(spyOnToastAdd).toHaveBeenLastCalledWith(
        expect.objectContaining({
          severity: 'warn'
        })
      )

      spyOnToastAdd.mockClear()
    })
  })
})
