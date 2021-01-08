/* eslint-disable @typescript-eslint/camelcase */

import { shallowMount, createLocalVue } from '@vue/test-utils'
import { USER_PROFILE, WORKSPACE_ROLE } from '@locokit/lck-glossary'
import ToggleButton from 'primevue/togglebutton'
import VueRouter from 'vue-router'

import { ROUTES_PATH, ROUTES_NAMES } from '@/router/paths'
import { authState } from '@/store/auth'
import { lckServices } from '@/services/lck-api'

import Workspace from './Workspace.vue'
import Page from '@/views/routes/workspace/visualization/Page'
import DeleteConfirmationDialog from '@/components/ui/DeleteConfirmationDialog/DeleteConfirmationDialog.vue'
import ChapterDialog from '@/components/visualize/Chapter/Chapter'
import PageDialog from '@/components/visualize/Page/Page'
import Sidebar from '@/components/visualize/Sidebar/Sidebar'

// Mock glossary
jest.mock('@locokit/lck-glossary', () => ({
  USER_PROFILE: {
    ADMIN: 'ADMIN',
    SUPERADMIN: 'SUPERADMIN',
    USER: 'USER'
  },
  WORKSPACE_ROLE: {
    ADMIN: 'ADMIN',
    OWNER: 'OWNER',
    MEMBER: 'MEMBER'
  }
}))

// Mock primevue component
jest.mock('primevue/togglebutton', () => ({
  name: 'p-toggle-button',
  render: h => h('p-toggle-button')
}))

// Mock error
class MockError extends Error {
  constructor (code, ...args) {
    super(args)
    this.code = code
  }
}

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
          hidden: false
        },
        {
          id: '12',
          text: 'Page 2',
          createdAt: '2020-11-02T16:11:03.109Z',
          updatedAt: '2020-11-02T16:11:03.109Z',
          chapter_id: '1',
          position: 1,
          hidden: true
        }
      ]
    },
    {
      id: '2',
      text: 'Chapter 2',
      createdAt: '2020-11-02T16:11:03.109Z',
      updatedAt: '2020-12-23T10:56:11.789Z',
      workspace_id: '0'
    }
  ]
}
const mockUserGroups = [
  { chapter_id: '0', workspace_id: '0', workspace_role: WORKSPACE_ROLE.OWNER },
  { chapter_id: '1', workspace_id: '0', workspace_role: WORKSPACE_ROLE.ADMIN },
  { chapter_id: '2', workspace_id: '0', workspace_role: WORKSPACE_ROLE.MEMBER },
  { chapter_id: '3', workspace_id: '1', workspace_role: WORKSPACE_ROLE.OWNER }
]

function mockRouterPath (workspaceId, pageId) {
  return `${ROUTES_PATH.WORKSPACE}/${workspaceId}${ROUTES_PATH.VISUALIZATION}/page/${pageId}`
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
      remove: jest.fn()
    },
    page: {
      patch: jest.fn((id, data) =>
        ({ ...mockWorkspaceContent.chapters[0].pages[0], ...data, id })),
      create: jest.fn(data =>
        ({ ...mockWorkspaceContent.chapters[0].pages[0], ...data, id: '13' })),
      remove: jest.fn()
    }
  }
}))

jest.mock('@/store/visualize', () => ({
  retrieveWorkspaceWithChaptersAndPages: () => mockDeepCloneObject(mockWorkspaceContent)
}))

jest.mock('@/store/auth', () => ({
  authState: {
    data: {
      isAuthenticated: true,
      user: {
        profile: '',
        groups: []
      }
    }
  }
}))

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

// Mock Vue components
jest.mock('@/views/routes/workspace/visualization/Page.vue', () => ({
  name: 'Page',
  render: h => h('section')
}))

// Mock routes
const mockRoutes = [
  {
    path: ROUTES_PATH.WORKSPACE + '/:workspaceId' + ROUTES_PATH.VISUALIZATION,
    name: ROUTES_NAMES.VISUALIZATION,
    component: Workspace,
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

describe('Workspace', () => {
  // For vue router
  const localVue = createLocalVue()
  localVue.use(VueRouter)
  const router = new VueRouter({ routes: mockRoutes })

  // Default workspace component configuration
  const globalComponentParams = {
    localVue,
    router,
    propsData: { workspaceId: '0' },
    mocks: {
      t: key => key,
      $t: key => key,
      $toast: {
        add: jest.fn()
      }
    }
  }

  describe('Edit button', () => {
    it('Hide it by default', async () => {
      const wrapper = await shallowMount(Workspace, globalComponentParams)
      expect(wrapper.findComponent(ToggleButton).exists()).toBe(false)
    })

    it('Hide it if the user can not edit the workspace', async () => {
      authState.data.user.profile = USER_PROFILE.USER
      const wrapper = await shallowMount(Workspace, globalComponentParams)
      expect(wrapper.findComponent(ToggleButton).exists()).toBe(false)
      authState.data.user.profile = ''
    })

    it('Display it if the user can edit the workspace', async () => {
      authState.data.user.profile = USER_PROFILE.SUPERADMIN
      const wrapper = await shallowMount(Workspace, globalComponentParams)
      expect(wrapper.findComponent(ToggleButton).exists()).toBe(true)
      authState.data.user.profile = ''
    })

    it('Update the edit mode when the user clicks on it', async () => {
      authState.data.user.profile = USER_PROFILE.SUPERADMIN
      const wrapper = await shallowMount(Workspace, globalComponentParams)
      expect(wrapper.vm.editMode).toBe(false)
      wrapper.findComponent(ToggleButton).vm.$emit('input', true)
      expect(wrapper.vm.editMode).toBe(true)
      authState.data.user.profile = ''
    })

    it('The edit mode is passed in Sidebar props', async () => {
      authState.data.user.profile = USER_PROFILE.SUPERADMIN
      const wrapper = await shallowMount(Workspace, globalComponentParams)
      expect(wrapper.findComponent(Sidebar).props('displayEditActions')).toBe(false)
      await wrapper.setData({ editMode: true })
      expect(wrapper.findComponent(Sidebar).props('displayEditActions')).toBe(true)
      authState.data.user.profile = ''
    })
  })

  describe('sidebarItems', () => {
    it('Return an empty array if the workspace content is not defined', async () => {
      const wrapper = await shallowMount(Workspace, globalComponentParams)
      await wrapper.setData({ workspaceContent: undefined })
      expect(wrapper.vm.sidebarItems).toStrictEqual([])
    })

    it('Return an empty array if the workspace content chapters are not defined', async () => {
      const wrapper = await shallowMount(Workspace, globalComponentParams)
      await wrapper.setData({ workspaceContent: { chapters: undefined } })
      expect(wrapper.vm.sidebarItems).toStrictEqual([])
    })

    describe('Return the right items for a classic user', () => {
      let wrapper
      const currentMockWorkspaceContent = mockDeepCloneObject(mockWorkspaceContent)
      const firstChapter = currentMockWorkspaceContent.chapters[0]

      beforeAll(async () => {
        authState.data.user.profile = USER_PROFILE.USER
        authState.data.user.groups = mockUserGroups
        wrapper = await shallowMount(Workspace, globalComponentParams)
      })

      afterAll(() => {
        authState.data.user.profile = ''
        authState.data.user.groups = []
      })

      it('The items are passed in Sidebar props', () => {
        expect(wrapper.findComponent(Sidebar).props('items')).toStrictEqual(wrapper.vm.sidebarItems)
      })

      it('Indicate that the chapters are editable', () => {
        expect(wrapper.vm.sidebarItems[0].editable).toBe(true)
        expect(wrapper.vm.sidebarItems[1].editable).toBe(false)
      })

      it('Return the right number of items', async () => {
        expect(wrapper.vm.sidebarItems).toHaveLength(currentMockWorkspaceContent.chapters.length)
      })

      it('Return the right item id', () => {
        expect(wrapper.vm.sidebarItems[0].id).toBe(firstChapter.id)
      })

      it('Return the right item label', () => {
        expect(wrapper.vm.sidebarItems[0].label).toBe(firstChapter.text)
      })

      it('Indicate that the right chapter is active', () => {
        expect(wrapper.vm.sidebarItems[0].active).toBe(true)
        expect(wrapper.vm.sidebarItems[1].active).toBe(false)
      })

      it('Return an empty array as subitems if the chapter pages are not defined', () => {
        expect(wrapper.vm.sidebarItems[1].subitems).toStrictEqual([])
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
                pageId: firstChapter.pages[0].id
              }
            }).route.path
          )
        })

        it('Indicate that the right page is active', () => {
          expect(wrapper.vm.sidebarItems[0].subitems[0].active).toBe(true)
          expect(wrapper.vm.sidebarItems[0].subitems[1].active).toBe(false)
        })

        it('Indicate if the page are hidden', () => {
          expect(wrapper.vm.sidebarItems[0].subitems[0].hidden).toBe(false)
          expect(wrapper.vm.sidebarItems[0].subitems[1].hidden).toBe(true)
        })
      })
    })

    describe('Return the right items for a SUPERADMIN user', () => {
      let wrapper

      beforeAll(async () => {
        authState.data.user.profile = USER_PROFILE.SUPERADMIN
        wrapper = await shallowMount(Workspace, globalComponentParams)
      })

      afterAll(() => {
        authState.data.user.profile = ''
      })

      it('Indicate that the chapters are editable', () => {
        expect(wrapper.vm.sidebarItems[0].editable).toBe(true)
        expect(wrapper.vm.sidebarItems[1].editable).toBe(true)
      })
    })
  })

  describe('isAdmin', () => {
    afterEach(() => {
      authState.data.user.profile = ''
    })

    it('Return true if the user is SUPERADMIN', async () => {
      authState.data.user.profile = USER_PROFILE.SUPERADMIN
      const wrapper = await shallowMount(Workspace, globalComponentParams)
      expect(wrapper.vm.isAdmin).toBe(true)
    })

    it('Return true if the user is ADMIN', async () => {
      authState.data.user.profile = USER_PROFILE.ADMIN
      const wrapper = await shallowMount(Workspace, globalComponentParams)
      expect(wrapper.vm.isAdmin).toBe(true)
    })

    it('Return false if the user is USER', async () => {
      authState.data.user.profile = USER_PROFILE.USER
      const wrapper = await shallowMount(Workspace, globalComponentParams)
      expect(wrapper.vm.isAdmin).toBe(false)
    })

    it('Pass the isAdmin value as Sidebar prop', async () => {
      authState.data.user.profile = USER_PROFILE.SUPERADMIN
      const wrapper = await shallowMount(Workspace, globalComponentParams)
      expect(wrapper.findComponent(Sidebar).props('isAdmin')).toBe(true)
    })
  })

  describe('editableChapters', () => {
    describe('The user profile is specified', () => {
      let wrapper

      beforeAll(async () => {
        authState.data.user.groups = mockUserGroups
        wrapper = await shallowMount(Workspace, globalComponentParams)
      })

      afterAll(() => {
        authState.data.user.groups = []
      })

      it('Return the chapters of the current workspace if the user is OWNER', () => {
        expect(wrapper.vm.editableChapters['0']).toBe(true)
      })

      it('Return the chapters of the current workspace if the user is ADMIN', () => {
        expect(wrapper.vm.editableChapters['1']).toBe(true)
      })

      it('Does not return the chapters of the current workspace if the user is USER', () => {
        expect(wrapper.vm.editableChapters['2']).toBeFalsy()
      })

      it('Does not return the chapters of other workspace', () => {
        expect(wrapper.vm.editableChapters['3']).toBeFalsy()
      })
    })

    it('The user profile is not specified : Return an empty object', async () => {
      authState.data.user = {}
      const wrapper = await shallowMount(Workspace, globalComponentParams)
      expect(wrapper.vm.editableChapters).toStrictEqual({})
      authState.data.user.groups = []
    })
  })

  describe('canEditWorkspace', () => {
    afterAll(() => {
      authState.data.user.profile = ''
      authState.data.user.groups = []
    })

    it('Return true if the user is an ADMIN (profile)', async () => {
      authState.data.user.profile = USER_PROFILE.ADMIN
      authState.data.user.groups = []
      const wrapper = await shallowMount(Workspace, globalComponentParams)
      expect(wrapper.vm.canEditWorkspace).toBe(true)
    })

    it('Return true if the user is an USER (profile) and can edit some chapters', async () => {
      authState.data.user.profile = USER_PROFILE.USER
      authState.data.user.groups = mockUserGroups
      const wrapper = await shallowMount(Workspace, globalComponentParams)
      expect(wrapper.vm.canEditWorkspace).toBe(true)
    })

    it('Return true if the user is a SUPERADMIN (profile) and can edit some chapters', async () => {
      authState.data.user.profile = USER_PROFILE.SUPERADMIN
      authState.data.user.groups = mockUserGroups
      const wrapper = await shallowMount(Workspace, globalComponentParams)
      expect(wrapper.vm.canEditWorkspace).toBe(true)
    })

    it('Return false if the user is an USER (profile) and can not edit some chapters', async () => {
      authState.data.user.profile = USER_PROFILE.USER
      authState.data.user.groups = []
      const wrapper = await shallowMount(Workspace, globalComponentParams)
      expect(wrapper.vm.canEditWorkspace).toBe(false)
    })
  })

  describe('Chapter crud', () => {
    let wrapper
    beforeEach(async () => {
      wrapper = await shallowMount(Workspace, globalComponentParams)
    })

    describe('Add a new chapter', () => {
      it('Display the chapter edit dialog with an empty object when the add-item event is emitted from sidebar', async () => {
        await wrapper.findComponent(Sidebar).vm.$emit('add-item')
        const chapterWrapper = wrapper.findComponent(ChapterDialog)
        expect(chapterWrapper.props('value')).toStrictEqual({})
        expect(chapterWrapper.props('visible')).toBe(true)
      })

      it('Create a new chapter if the input event is emitted without an existing chapter', async () => {
        const newChapterName = 'newChapterName'
        await wrapper.vm.onChapterEditClick()
        await wrapper.findComponent(ChapterDialog).vm.$emit('input', { text: newChapterName })
        expect(wrapper.vm.workspaceContent.chapters[2]).toBeDefined()
        expect(wrapper.vm.workspaceContent.chapters[2].text).toBe(newChapterName)
      })
    })

    describe('Update a chapter', () => {
      it('Display the chapter edit dialog with the specified chapter when the edit-item event is emitted from sidebar', async () => {
        await wrapper.findComponent(Sidebar).vm.$emit('edit-item', '1')
        const chapterWrapper = wrapper.findComponent(ChapterDialog)
        expect(chapterWrapper.props('visible')).toBe(true)
        expect(chapterWrapper.props('value')).toStrictEqual(mockWorkspaceContent.chapters[0])
      })

      it('Hide the chapter edit dialog if it emits the close event', async () => {
        const chapterWrapper = wrapper.findComponent(ChapterDialog)
        // Display the dialog
        await chapterWrapper.setProps({ visible: true })
        // Hide it
        await chapterWrapper.vm.$emit('close')
        expect(chapterWrapper.props('visible')).toBe(false)
      })

      it('Update the chapter if the input event is emitted with an existing chapter', async () => {
        const newChapterName = 'newChapterName'
        await wrapper.vm.onChapterEditClick('1')
        await wrapper.findComponent(ChapterDialog).vm.$emit('input', { id: '1', text: newChapterName })
        expect(wrapper.vm.workspaceContent.chapters.find(c => c.id === '1' && c.text === newChapterName)).toBeDefined()
      })

      it('Display a toast if an error is occured', async () => {
        const spyOnToast = jest.spyOn(wrapper.vm, 'displayToastOnError')
        lckServices.chapter.create.mockImplementationOnce(() => { throw new Error() })
        await wrapper.findComponent(ChapterDialog).vm.$emit('input')
        expect(spyOnToast).toHaveBeenCalledTimes(1)
      })
    })

    describe('Delete a chapter', () => {
      let deleteConfirmationWrapper

      beforeEach(() => {
        deleteConfirmationWrapper = wrapper.findAllComponents(DeleteConfirmationDialog).at(0)
      })

      it('Display the confirmation dialog with the specified chapter when the delete-item event is emitted', async () => {
        await wrapper.findComponent(Sidebar).vm.$emit('delete-item', '1')
        expect(deleteConfirmationWrapper.props('visible')).toBe(true)
        expect(deleteConfirmationWrapper.props('value')).toStrictEqual(mockWorkspaceContent.chapters[0])
      })

      it('Hide the confirmation dialog if the close event is emitted', async () => {
        // Display the dialog
        await deleteConfirmationWrapper.setProps({ visible: true })
        // Hide it
        await deleteConfirmationWrapper.vm.$emit('close')
        expect(deleteConfirmationWrapper.props('visible')).toBe(false)
      })

      it('Delete a chapter if the input event is emitted with an existing chapter', async () => {
        await wrapper.vm.onChapterDeleteClick('1')
        await deleteConfirmationWrapper.vm.$emit('input', { id: '1' })
        expect(wrapper.vm.workspaceContent.chapters.find(c => c.id === '1')).toBeUndefined()
      })

      it('Do nothing if the input event is emitted without an existing chapter', async () => {
        await wrapper.vm.onChapterDeleteClick()
        await deleteConfirmationWrapper.vm.$emit('input')
        expect(wrapper.vm.workspaceContent.chapters.find(c => c.id === '1')).toBeDefined()
      })

      it('Do nothing if the input event is emitted with an unknown chapter', async () => {
        await wrapper.vm.onChapterDeleteClick()
        await deleteConfirmationWrapper.vm.$emit('input', { id: '-1' })
        expect(wrapper.vm.workspaceContent.chapters.find(c => c.id === '1')).toBeDefined()
      })

      it('Display a toast if an error is occured', async () => {
        const spyOnToast = jest.spyOn(wrapper.vm, 'displayToastOnError')
        lckServices.chapter.remove.mockImplementationOnce(() => { throw new Error() })
        await deleteConfirmationWrapper.vm.$emit('input', { id: '1' })
        expect(spyOnToast).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('Page crud', () => {
    let wrapper
    let pageWrapper
    const newPageName = 'newPageName'
    const pageIsHidden = true

    beforeEach(async () => {
      wrapper = await shallowMount(Workspace, globalComponentParams)
      pageWrapper = wrapper.findComponent(PageDialog)
    })

    describe('Add a new page', () => {
      it('Do not display the page edit dialog if the add-subitem event is emitted from sidebar without an existing chapter', async () => {
        await wrapper.findComponent(Sidebar).vm.$emit('add-subitem', {})
        expect(pageWrapper.props('visible')).toBe(false)
      })

      it('Display the page edit dialog with an empty object when the add-subitem event is emitted from sidebar with an existing chapter', async () => {
        await wrapper.findComponent(Sidebar).vm.$emit('add-subitem', { item: '1' })
        expect(pageWrapper.props('value')).toStrictEqual({})
        expect(pageWrapper.props('visible')).toBe(true)
      })

      it('Create a new page if the input event is emitted with an existing chapter which already has some pages', async () => {
        await wrapper.vm.onPageEditClick({ item: '1' })
        await pageWrapper.vm.$emit('input', { text: newPageName, hidden: pageIsHidden })
        const newPage = wrapper.vm.workspaceContent.chapters[0].pages[2]
        expect(newPage).toBeDefined()
        expect(newPage.text).toBe(newPageName)
        expect(newPage.hidden).toBe(pageIsHidden)
      })

      it('Create a new page if the input event is emitted with an existing chapter which has not got any pages', async () => {
        await wrapper.vm.onPageEditClick({ item: '2' })
        await pageWrapper.vm.$emit('input', { text: newPageName, hidden: pageIsHidden })
        const newPage = wrapper.vm.workspaceContent.chapters[1].pages[0]
        expect(newPage).toBeDefined()
        expect(newPage.text).toBe(newPageName)
        expect(newPage.hidden).toBe(pageIsHidden)
      })
    })

    describe('Update a page', () => {
      it('Display the page edit dialog when the edit-item event is emitted from sidebar with an existing chapter', async () => {
        await wrapper.findComponent(Sidebar).vm.$emit('add-subitem', { item: '1', subitem: '12' })
        expect(pageWrapper.props('visible')).toBe(true)
        expect(pageWrapper.props('value')).toStrictEqual(mockWorkspaceContent.chapters[0].pages[1])
      })

      it('Hide the page edit dialog if it emits the close event', async () => {
        // Display the dialog
        await pageWrapper.setProps({ visible: true })
        // Hide it
        await pageWrapper.vm.$emit('close')
        expect(pageWrapper.props('visible')).toBe(false)
      })

      it('Update the page if the input event is emitted with an existing chapter and an existing page', async () => {
        await wrapper.vm.onPageEditClick({ item: '1', subitem: '12' })
        await pageWrapper.vm.$emit('input', { id: '12', text: newPageName, hidden: pageIsHidden })
        const updatedPage = wrapper.vm.workspaceContent.chapters[0].pages[1]
        expect(updatedPage).toBeDefined()
        expect(updatedPage.text).toBe(newPageName)
        expect(updatedPage.hidden).toBe(pageIsHidden)
      })

      it('Display a toast if an error is occured', async () => {
        const spyOnToast = jest.spyOn(wrapper.vm, 'displayToastOnError')
        lckServices.page.create.mockImplementationOnce(() => { throw new Error() })
        await pageWrapper.vm.$emit('input')
        expect(spyOnToast).toHaveBeenCalledTimes(1)
      })
    })

    describe('Delete a page', () => {
      let deleteConfirmationWrapper

      beforeEach(() => {
        deleteConfirmationWrapper = wrapper.findAllComponents(DeleteConfirmationDialog).at(1)
      })

      it('Display the confirmation dialog with the specified page when the delete-subitem event is emitted', async () => {
        await wrapper.findComponent(Sidebar).vm.$emit('delete-subitem', { item: '1', subitem: '12' })
        expect(deleteConfirmationWrapper.props('visible')).toBe(true)
        expect(deleteConfirmationWrapper.props('value')).toStrictEqual(mockWorkspaceContent.chapters[0].pages[1])
      })

      it('Hide the confirmation dialog if the close event is emitted', async () => {
        // Display the dialog
        await deleteConfirmationWrapper.setProps({ visible: true })
        // Hide it
        await deleteConfirmationWrapper.vm.$emit('close')
        expect(deleteConfirmationWrapper.props('visible')).toBe(false)
      })

      it('Delete a page if the input event is emitted with an existing page and an existing chapter', async () => {
        await wrapper.vm.onPageDeleteClick({ item: '1', subitem: '12' })
        await deleteConfirmationWrapper.vm.$emit('input', { id: '12' })
        expect(wrapper.vm.workspaceContent.chapters[0].pages.find(p => p.id === '12')).toBeUndefined()
      })

      it('Do nothing if the input event is emitted without an existing page', async () => {
        await wrapper.vm.onPageDeleteClick({ item: '1' })
        await deleteConfirmationWrapper.vm.$emit('input')
        expect(wrapper.vm.workspaceContent.chapters[0].pages)
          .toStrictEqual(mockWorkspaceContent.chapters[0].pages)
      })

      it('Do nothing if the input event is emitted with an unknown page', async () => {
        await wrapper.vm.onPageDeleteClick({ item: '1', subitem: '-12' })
        await deleteConfirmationWrapper.vm.$emit('input', { id: '-12' })
        expect(wrapper.vm.workspaceContent.chapters[0].pages)
          .toStrictEqual(mockWorkspaceContent.chapters[0].pages)
      })

      it('Display a toast if an error is occured', async () => {
        const spyOnToast = jest.spyOn(wrapper.vm, 'displayToastOnError')
        lckServices.page.remove.mockImplementationOnce(() => { throw new Error() })
        await deleteConfirmationWrapper.vm.$emit('input', { id: '12' })
        expect(spyOnToast).toHaveBeenCalledTimes(1)
      })
    })

    describe('Reorder pages', () => {
      it('Reorder the pages if the reorder-subitem event is emitted with an existing chapter and valid positions', async () => {
        await wrapper.vm.onPageReorderClick('1', { moved: { oldIndex: 0, newIndex: 1 } })
        const updatedPages = wrapper.vm.workspaceContent.chapters[0].pages
        const originalPages = mockWorkspaceContent.chapters[0].pages
        expect(updatedPages[0].position).toBe(0)
        expect(updatedPages[0].id).toBe(originalPages[1].id)
        expect(updatedPages[1].position).toBe(1)
        expect(updatedPages[1].id).toBe(originalPages[0].id)
      })

      it('Reorder the pages if the reorder-subitem event is emitted with an existing chapter and valid positions', async () => {
        await wrapper.vm.onPageReorderClick('1', { moved: { oldIndex: 1, newIndex: 0 } })
        const updatedPages = wrapper.vm.workspaceContent.chapters[0].pages
        const originalPages = mockWorkspaceContent.chapters[0].pages
        expect(updatedPages[0].position).toBe(0)
        expect(updatedPages[0].id).toBe(originalPages[1].id)
        expect(updatedPages[1].position).toBe(1)
        expect(updatedPages[1].id).toBe(originalPages[0].id)
      })

      it('Do nothing if the drag over event is not a moved event', async () => {
        await wrapper.vm.onPageReorderClick('1', { added: { newIndex: 0 } })
        const updatedPages = wrapper.vm.workspaceContent.chapters[0].pages
        const originalPages = mockWorkspaceContent.chapters[0].pages
        expect(updatedPages[0].position).toBe(0)
        expect(updatedPages[0].id).toBe(originalPages[0].id)
        expect(updatedPages[1].position).toBe(1)
        expect(updatedPages[1].id).toBe(originalPages[1].id)
      })

      it('Do nothing if the chapter id is not provided', async () => {
        await wrapper.vm.onPageReorderClick(null, { moved: { oldIndex: 1, newIndex: 0 } })
        const updatedPages = wrapper.vm.workspaceContent.chapters[0].pages
        const originalPages = mockWorkspaceContent.chapters[0].pages
        expect(updatedPages[0].position).toBe(0)
        expect(updatedPages[0].id).toBe(originalPages[0].id)
        expect(updatedPages[1].position).toBe(1)
        expect(updatedPages[1].id).toBe(originalPages[1].id)
      })

      it('Display a toast if an error is occured', async () => {
        const spyOnToast = jest.spyOn(wrapper.vm, 'displayToastOnError')
        lckServices.page.patch.mockRejectedValue(new Error())
        await wrapper.vm.onPageReorderClick('1', { moved: { oldIndex: 1, newIndex: 0 } })
        expect(spyOnToast).toHaveBeenCalled()
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
        name: ROUTES_NAMES.PAGE,
        params: {
          worspaceId: mockWorkspaceContent.id,
          pageId: mockWorkspaceContent.chapters[0].pages[0].id
        }
      }).route.path
      secondPagePath = wrapper.vm.$router.resolve({
        name: ROUTES_NAMES.PAGE,
        params: {
          worspaceId: mockWorkspaceContent.id,
          pageId: mockWorkspaceContent.chapters[0].pages[1].id
        }
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

  describe('goToSpecificChapterPage', () => {
    let wrapper
    let firstPagePath
    let secondPagePath
    let defaultWorkspacePath
    let firstChapter

    beforeAll(async () => {
      wrapper = await shallowMount(Workspace, globalComponentParams)
      firstChapter = wrapper.vm.workspaceContent.chapters[0]
      firstPagePath = wrapper.vm.$router.resolve({
        name: ROUTES_NAMES.PAGE,
        params: {
          worspaceId: mockWorkspaceContent.id,
          pageId: firstChapter.pages[0].id
        }
      }).route.path
      secondPagePath = wrapper.vm.$router.resolve({
        name: ROUTES_NAMES.PAGE,
        params: {
          worspaceId: mockWorkspaceContent.id,
          pageId: firstChapter.pages[1].id
        }
      }).route.path
      defaultWorkspacePath = wrapper.vm.$router.resolve({
        name: ROUTES_NAMES.VISUALIZATION,
        params: {
          worspaceId: mockWorkspaceContent.id
        }
      }).route.path
    })

    it('Redirect to the specific page of a specific chapter', async () => {
      await wrapper.vm.goToSpecificChapterPage(firstChapter, firstChapter.pages[1])
      expect(wrapper.vm.$router.history.current.path).toBe(secondPagePath)
    })

    it('Redirect to the first page of a specific chapter', async () => {
      await wrapper.vm.goToSpecificChapterPage(firstChapter)
      expect(wrapper.vm.$router.history.current.path).toBe(firstPagePath)
    })

    it('Do nothing if we are already on the same page', async () => {
      await wrapper.vm.goToSpecificChapterPage(firstChapter, firstChapter.pages[1])
      const spyOnRouterReplace = jest.spyOn(wrapper.vm.$router, 'replace')
      await wrapper.vm.goToSpecificChapterPage(firstChapter, firstChapter.pages[1])
      expect(wrapper.vm.$router.history.current.path).toBe(secondPagePath)
      expect(spyOnRouterReplace).not.toHaveBeenCalled()
    })

    it('Redirect to a default page if there is no page in the specified chapter', async () => {
      await wrapper.setData({ workspaceContent: { chapters: [{ pages: [] }] } })
      await wrapper.vm.goToSpecificChapterPage(wrapper.vm.workspaceContent.chapters[0])
      expect(wrapper.vm.$router.history.current.path).toBe(defaultWorkspacePath)
    })
  })

  describe('displayToastOnError', () => {
    let wrapper

    beforeAll(async () => {
      wrapper = await shallowMount(Workspace, globalComponentParams)
      wrapper.vm.$toast.add.mockReset()
    })

    afterEach(() => {
      wrapper.vm.$toast.add.mockReset()
    })

    it('Display a toast with the specified parameters for an error without code', () => {
      wrapper.vm.displayToastOnError('summary', new Error('an error without a code'))
      expect(wrapper.vm.$toast.add).toHaveBeenLastCalledWith(
        expect.objectContaining({
          summary: 'summary',
          detail: 'error.basic'
        })
      )
    })

    it('Display a toast with the specified parameters for an error with a code', () => {
      wrapper.vm.displayToastOnError('summary', new MockError(404, 'an error with a code'))
      expect(wrapper.vm.$toast.add).toHaveBeenLastCalledWith(
        expect.objectContaining({
          summary: 'summary',
          detail: 'error.http.404'
        })
      )
    })
  })
})
