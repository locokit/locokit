/* eslint-disable @typescript-eslint/camelcase */

import { shallowMount, createLocalVue } from '@vue/test-utils'
import { USER_PROFILE } from '@locokit/lck-glossary'

import VueRouter from 'vue-router'

import { ROUTES_NAMES, ROUTES_PATH } from '@/router/paths'
import { authState } from '@/store/auth'
// import { lckServices } from '@/services/lck-api'

import Workspace from './Workspace.vue'
import Page from '@/views/routes/workspace/visualization/Page'
// import ChapterDialog from '@/components/visualize/ChapterDialog/ChapterDialog.vue'
// import PageDialog from '@/components/visualize/PageDialog/PageDialog.vue'
import Sidebar from '@/components/visualize/Sidebar/Sidebar'

// import Vue from 'vue'


// Mock glossary
jest.mock('@locokit/lck-glossary', () => ({
  USER_PROFILE: {
    ADMIN: 'ADMIN',
    SUPERADMIN: 'SUPERADMIN',
    USER: 'USER',
  },
  WORKSPACE_ROLE: {
    ADMIN: 'ADMIN',
    OWNER: 'OWNER',
    MEMBER: 'MEMBER',
  },
}))

// Mock primevue component
jest.mock('primevue/togglebutton', () => ({
  name: 'p-toggle-button',
  render: h => h('p-toggle-button'),
}))

jest.mock('primevue/confirmdialog', () => ({
  name: 'p-confirm-dialog',
  render: h => h('p-confirm-dialog'),
}))

// // Mock error
// class MockError extends Error {
//   constructor (code, ...args) {
//     super(args)
//     this.code = code
//   }
// }

// class MockRouterError extends Error {
//   constructor (args) {
//     super(args)
//     this.from = { path: 'from' }
//     this.to = { path: 'to' }
//   }
// }

// Mock variables
const mockWorkspaceContent = [{
  id: 'group-1',
  name: 'Group 1',
  chapter: {
    id: '1',
    text: 'Chapter 1',
    createdAt: '2020-11-02T16:11:03.109Z',
    updatedAt: '2020-12-23T10:56:11.789Z',
    workspace_id: '0',
    pages: [
      {
        id: '11',
        text: 'Page 1',
        createdAt: '2020-11-02T16:11:03.109Z',
        updatedAt: '2020-11-02T16:11:03.109Z',
        chapter_id: '1',
        position: 0,
        hidden: false,
      },
      {
        id: '12',
        text: 'Page 2',
        createdAt: '2020-11-02T16:11:03.109Z',
        updatedAt: '2020-11-02T16:11:03.109Z',
        chapter_id: '1',
        position: 1,
        hidden: true,
      },
    ],
  },
}, {
  id: 'group-2',
  name: 'Group 2',
  chapter: {
    id: '2',
    text: 'Chapter 2',
    createdAt: '2020-11-02T16:11:03.109Z',
    updatedAt: '2020-12-23T10:56:11.789Z',
    workspace_id: '0',
  },
}]

function mockDeepCloneObject (object) {
  return JSON.parse(JSON.stringify(object))
}

// Mock lck functions

jest.mock('@/services/lck-api', () => ({
  lckServices: {
    chapter: {
      patch: jest.fn((id, data) =>
        ({ ...mockWorkspaceContent.chapters.find(c => c.id === id), ...data })),
      create: jest.fn(data =>
        ({ ...mockWorkspaceContent.chapters[0], ...data, id: '2' })),
      remove: jest.fn(),
    },
    page: {
      patch: jest.fn((id, data) =>
        ({ ...mockWorkspaceContent.chapters[0].pages[0], ...data, id })),
      create: jest.fn(data =>
        ({ ...mockWorkspaceContent.chapters[0].pages[0], ...data, id: '13' })),
      remove: jest.fn(),
    },
  },
  lckHelpers: {
    retrieveWorkspaceUserGroupsWithChaptersAndPages: () => mockDeepCloneObject(mockWorkspaceContent),
  },
}))

jest.mock('@/store/auth', () => ({
  authState: {
    data: {
      isAuthenticated: true,
      user: {
        profile: '',
        groups: [],
      },
    },
  },
}))

// jest.mock('@/router/paths', () => ({
//   ROUTES_PATH: {
//     WORKSPACE: '/workspace',
//     VISUALIZATION: '/visualization',
//   },
//   ROUTES_NAMES: {
//     VISUALIZATION: 'WorkspaceVisualization',
//     PAGE: 'Page',
//   },
// }))

// Mock Vue components
jest.mock('@/views/routes/workspace/visualization/Page.vue', () => ({
  name: 'Page',
  render: h => h('section'),
}))

// Mock routes
const mockRoutes = [
  {
    path: ROUTES_PATH.WORKSPACE + '/:workspaceId' + ROUTES_PATH.VISUALIZATION,
    name: 'WorkspaceVisualization',
    component: Workspace,
    props: true,
    children: [{
      name: ROUTES_NAMES.WORKSPACE_VISUALIZATION.PAGE_DETAIL,
      path: ROUTES_PATH.WORKSPACE + '/:workspaceId' + ROUTES_PATH.VISUALIZATION + '/:groupId' + ROUTES_PATH.VISUALIZATION_PAGE + '/:pageId' + ROUTES_PATH.VISUALIZATION_PAGE_DETAIL + '/:pageDetailId',
      props: true,
      component: Page,
    }, {
      name: ROUTES_NAMES.WORKSPACE_VISUALIZATION.PAGE,
      path: ROUTES_PATH.WORKSPACE + '/:workspaceId' + ROUTES_PATH.VISUALIZATION + '/:groupId' + ROUTES_PATH.VISUALIZATION_PAGE + '/:pageId',
      props: true,
      component: Page,
    }],
    meta: {
      needAuthentication: true,
      hasBurgerMenu: true,
    },
  },
]
// Tests

describe('Workspace', () => {
  // For vue router
  const localVue = createLocalVue()
  localVue.use(VueRouter)
  const router = new VueRouter({ routes: mockRoutes })

  // Default workspace component configuration
  const globalComponentParams = {
    localVue,
    router,
    propsData: {
      groupId: '0',
      workspaceId: 'an-id',
    },
    mocks: {
      t: key => key,
      $t: key => key,
      $toast: {
        add: jest.fn(),
      },
      $confirm: {
        require: jest.fn(),
      },
    },
  }

  describe('sidebarItems', () => {
    it('Return an empty array if the workspace content is not defined', async () => {
      expect.assertions(2)
      const wrapper = await shallowMount(Workspace, globalComponentParams)
      await wrapper.setData({ workspaceUserGroups: [] })
      expect(wrapper.vm.sidebarItems.length).toBe(0)
      // expect(wrapper.vm.sidebarItems.length).toBe(2)
      expect(wrapper).toMatchSnapshot()
    })

    it('Return an empty array if the workspace content chapters are not defined', async () => {
      expect.assertions(2)
      const wrapper = await shallowMount(Workspace, globalComponentParams)
      await wrapper.setData({
        workspaceUserGroups: [{
          id: 1,
          name: 'pouet',
          chapter: null,
        }],
      })
      expect(wrapper.vm.sidebarItems.length).toBe(1)
      expect(wrapper.vm.sidebarItems[0]).toStrictEqual({
        id: 1,
        label: 'pouet',
        subitems: undefined,
      })
    })

    describe('Return the right items for a classic user', () => {
      let wrapper
      const currentMockWorkspaceContent = mockDeepCloneObject(mockWorkspaceContent)
      const firstChapter = currentMockWorkspaceContent[0].chapter

      beforeAll(async () => {
        authState.data.user.profile = USER_PROFILE.USER
        wrapper = await shallowMount(Workspace, globalComponentParams)
      })

      afterAll(() => {
        authState.data.user.profile = ''
        authState.data.user.groups = []
      })

      it('The items are passed in Sidebar props', () => {
        expect(wrapper.findComponent(Sidebar).props('items')).toStrictEqual(wrapper.vm.sidebarItems)
      })

      it('Return the right number of items', async () => {
        expect(wrapper.vm.sidebarItems).toHaveLength(currentMockWorkspaceContent.length)
      })

      it('Return the right item id', () => {
        expect(wrapper.vm.sidebarItems[0].subitems[0].id).toBe(firstChapter.pages[0].id)
      })

      it('Return the right item label', () => {
        expect(wrapper.vm.sidebarItems[0].subitems[0].label).toBe(firstChapter.pages[0].text)
      })

      it('Return an empty array as subitems if the chapter pages are not defined', () => {
        expect(wrapper.vm.sidebarItems[1].subitems).toBe(undefined)
      })

      describe('Return right sub items if the chapter pages are defined', () => {
        it('Return the right id', () => {
          expect(wrapper.vm.sidebarItems[0].subitems[0].id).toBe(firstChapter.pages[0].id)
        })

        it('Return the right label', () => {
          expect(wrapper.vm.sidebarItems[0].subitems[0].label).toBe(firstChapter.pages[0].text)
        })

        it('Return the right link', () => {
          expect(wrapper.vm.sidebarItems[0].subitems[0].to).toBe(
            wrapper.vm.$router.resolve({
              name: ROUTES_NAMES.PAGE,
              params: {
                worspaceId: firstChapter.workspace_id,
                pageId: firstChapter.pages[0].id,
              },
            }).route.path,
          )
        })

        it('Indicate if the page are hidden', () => {
          expect(wrapper.vm.sidebarItems[0].subitems[0].hidden).toBe(false)
          expect(wrapper.vm.sidebarItems[0].subitems[1].hidden).toBe(true)
        })
      })
    })
  })

  describe('goToFirstPage', () => {
    let wrapper
    let firstPagePath
    let secondPagePath

    beforeAll(async () => {
      wrapper = await shallowMount(Workspace, globalComponentParams)
      firstPagePath = wrapper.vm.$router.resolve({
        name: ROUTES_NAMES.WORKSPACE_VISUALIZATION.PAGE,
        params: {
          worspaceId: 'an-id',
          groupId: mockWorkspaceContent[0].id,
          pageId: mockWorkspaceContent[0].chapter.pages[0].id,
        },
      }).route.path
      secondPagePath = wrapper.vm.$router.resolve({
        name: ROUTES_NAMES.WORKSPACE_VISUALIZATION.PAGE,
        params: {
          worspaceId: 'an-id',
          groupId: mockWorkspaceContent[0].id,
          pageId: mockWorkspaceContent[0].chapter.pages[1].id,
        },
      }).route.path
    })

    it('Redirect to the first page', async () => {
      wrapper.vm.$router.push('/')
      await wrapper.vm.goToFirstPage()
      expect(wrapper.vm.$router.history.current.path).toBe(firstPagePath)
    })

    it('Do not redirect if a page is already displayed', async () => {
      wrapper.vm.$router.push(secondPagePath)
      await wrapper.vm.goToFirstPage()
      expect(wrapper.vm.$router.history.current.path).toBe(secondPagePath)
    })
  })
})
