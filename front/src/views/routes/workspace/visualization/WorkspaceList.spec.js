/* eslint-disable @typescript-eslint/camelcase */

import { shallowMount, createLocalVue } from '@vue/test-utils'
import { USER_PROFILE } from '@locokit/lck-glossary'
import VueRouter from 'vue-router'

import { ROUTES_PATH, ROUTES_NAMES } from '@/router/paths'
import { authState } from '@/store/auth'

import WorkspaceList from './WorkspaceList.vue'
import { abilitiesPlugin } from '@casl/vue'
import lckAbilitiesService from '@/services/lck-abilities'

import Vue from 'vue'

// Mock glossary
jest.mock('@locokit/lck-glossary', () => ({
  USER_PROFILE: {
    ADMIN: 'ADMIN',
    SUPERADMIN: 'SUPERADMIN',
    CREATOR: 'CREATOR',
    USER: 'USER',
  },
}))

// Mock variables
const mockWorkspaceContent = {
  id: '0',
  text: 'workspace-title',
  createdAt: '2021-01-01T00:00:00.109Z',
  updatedAt: '2021-01-01T00:00:00.109Z',
  chapters: [
    {
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
    {
      id: '2',
      text: 'Chapter 2',
      createdAt: '2020-11-02T16:11:03.109Z',
      updatedAt: '2020-12-23T10:56:11.789Z',
      workspace_id: '0',
    },
  ],
}

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
    group: {
      find: jest.fn(() => []),
    },
    workspace: {
      find: jest.fn(() => [mockWorkspaceContent]),
    },
  },
  lckHelpers: {
    retrieveWorkspaceWithChaptersAndPages: () => mockDeepCloneObject(mockWorkspaceContent),
  },
}))

jest.mock('@/store/auth', () => ({
  authState: {
    data: {
      isAuthenticated: true,
      user: {
        profile: '',
        groups: [],
        rules: [],
      },
    },
  },
}))

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

// Mock Vue components
jest.mock('@/views/routes/workspace/visualization/Page.vue', () => ({
  name: 'Page',
  render: h => h('section'),
}))

// Mock routes
const mockRoutes = [
  {
    path: ROUTES_PATH.WORKSPACE,
    name: ROUTES_NAMES.WORKSPACE,
    component: WorkspaceList,
    props: true,
  },
]
// Tests

describe('Workspace', () => {
  // For vue router
  const localVue = createLocalVue()
  localVue.use(VueRouter)
  localVue.use(abilitiesPlugin, lckAbilitiesService)

  const router = new VueRouter({ routes: mockRoutes })

  // Default workspace component configuration
  const globalComponentParams = {
    localVue,
    router,
    propsData: { groupId: '0' },
    mocks: {
      t: key => key,
      $t: key => key,
      $toast: {
        add: jest.fn(),
      },
    },
  }

  describe('Create workspace button', () => {
    it('Hide if the user has a USER_PROFILE "USER"', async () => {
      authState.data.user.profile = USER_PROFILE.USER
      const wrapper = await shallowMount(WorkspaceList, globalComponentParams)
      await Vue.nextTick()
      expect(wrapper.findAll('.workspaces-new').length).toBe(0)
      expect(wrapper).toMatchSnapshot()
      authState.data.user.profile = ''
    })
    it('Show if the user is a USER_PROFILE "CREATOR"', async () => {
      authState.data.user.profile = USER_PROFILE.CREATOR
      authState.data.user.rules = [{
        action: 'create',
        subject: 'workspace',
      }]
      lckAbilitiesService.update(authState.data.user.rules)
      const wrapper = await shallowMount(WorkspaceList, globalComponentParams)
      await Vue.nextTick()
      expect(wrapper.findAll('.workspaces-new').length).toBe(1)
      expect(wrapper).toMatchSnapshot()
      authState.data.user.profile = ''
    })
    it('Show if the user is a USER_PROFILE "ADMIN"', async () => {
      authState.data.user.profile = USER_PROFILE.ADMIN
      authState.data.user.rules = [{
        action: 'create',
        subject: 'workspace',
      }]
      lckAbilitiesService.update(authState.data.user.rules)
      const wrapper = await shallowMount(WorkspaceList, globalComponentParams)
      await Vue.nextTick()
      expect(wrapper.findAll('.workspaces-new').length).toBe(1)
      expect(wrapper).toMatchSnapshot()
      authState.data.user.profile = ''
    })
    it('Show if the user is a USER_PROFILE "SUPERADMIN"', async () => {
      authState.data.user.profile = USER_PROFILE.SUPERADMIN
      authState.data.user.rules = [{
        action: 'create',
        subject: 'workspace',
      }]
      lckAbilitiesService.update(authState.data.user.rules)
      const wrapper = await shallowMount(WorkspaceList, globalComponentParams)
      await Vue.nextTick()
      expect(wrapper.findAll('.workspaces-new').length).toBe(1)
      expect(wrapper).toMatchSnapshot()
      authState.data.user.profile = ''
    })
  })
})
