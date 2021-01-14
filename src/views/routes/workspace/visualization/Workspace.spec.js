/* eslint-disable @typescript-eslint/camelcase */

import { shallowMount, createLocalVue } from '@vue/test-utils'
import { USER_PROFILE, WORKSPACE_ROLE } from '@locokit/lck-glossary'
import ToggleButton from 'primevue/togglebutton'
import VueRouter from 'vue-router'

import { ROUTES_PATH } from '@/router/paths'
import { authState } from '@/store/auth'
import { lckServices } from '@/services/lck-api'

import Workspace from './Workspace.vue'
import DeleteConfirmationDialog from '@/components/ui/DeleteConfirmationDialog/DeleteConfirmationDialog.vue'
import ChapterDialog from '@/components/visualize/Chapter/Chapter'
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
          hidden: false
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
  }
}))

// Tests

describe('Workspace', () => {
  // For vue router
  const localVue = createLocalVue()
  localVue.use(VueRouter)
  const router = new VueRouter()

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
        wrapper.setData({ workspaceContent: currentMockWorkspaceContent })
        wrapper.vm.$route.params.pageId = firstChapter.pages[0].id
        wrapper.vm.$route.params.workspaceId = firstChapter.workspace_id
      })

      afterAll(() => {
        authState.data.user.profile = ''
        authState.data.user.groups = []
        wrapper.vm.$route.params.pageId = undefined
        wrapper.vm.$route.params.workspaceId = undefined
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
            mockRouterPath(firstChapter.workspace_id, firstChapter.pages[0].id)
          )
        })

        it('Indicate that the right page is active', () => {
          expect(wrapper.vm.sidebarItems[0].subitems[0].active).toBe(true)
          expect(wrapper.vm.sidebarItems[0].subitems[1].active).toBe(false)
        })
      })
    })

    describe('Return the right items for a SUPERADMIN user', () => {
      let wrapper
      const currentMockWorkspaceContent = mockDeepCloneObject(mockWorkspaceContent)

      beforeAll(async () => {
        authState.data.user.profile = USER_PROFILE.SUPERADMIN
        wrapper = await shallowMount(Workspace, globalComponentParams)
        wrapper.setData({ workspaceContent: currentMockWorkspaceContent })
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
    let sidebarWrapper
    const newChapterName = 'newChapterName'

    beforeEach(async () => {
      wrapper = await shallowMount(Workspace, globalComponentParams)
      sidebarWrapper = wrapper.findComponent(Sidebar)
    })

    describe('Add a new chapter', () => {
      let chapterWrapper

      beforeEach(() => {
        lckServices.chapter.create.mockClear()
        chapterWrapper = wrapper.findComponent(ChapterDialog)
      })

      it('Display the chapter edit dialog with an empty object when the add-item event is emitted from sidebar', async () => {
        await sidebarWrapper.vm.$emit('add-item')
        expect(chapterWrapper.props('chapter')).toStrictEqual({})
        expect(chapterWrapper.props('visible')).toBe(true)
      })

      it('Create a new chapter if the input event is emitted without an existing chapter', async () => {
        await wrapper.vm.onChapterEditClick()
        await chapterWrapper.vm.$emit('input', { text: newChapterName })
        // Send API request
        expect(lckServices.chapter.create).toHaveBeenCalledWith({ text: newChapterName, workspace_id: mockWorkspaceContent.id })
        // Update the component data
        expect(wrapper.vm.workspaceContent.chapters[2]).toBeDefined()
        expect(wrapper.vm.workspaceContent.chapters[2].text).toBe(newChapterName)
      })
    })

    describe('Update a chapter', () => {
      let chapterWrapper

      beforeEach(() => {
        lckServices.chapter.patch.mockClear()
        chapterWrapper = wrapper.findComponent(ChapterDialog)
      })

      it('Display the chapter edit dialog with the specified chapter when the edit-item event is emitted from sidebar', async () => {
        await sidebarWrapper.vm.$emit('edit-item', '1')
        expect(chapterWrapper.props('visible')).toBe(true)
        expect(chapterWrapper.props('chapter')).toStrictEqual(mockWorkspaceContent.chapters[0])
      })

      it('Hide the chapter edit dialog if it emits the close event', async () => {
        // Display the dialog
        await chapterWrapper.setProps({ visible: true })
        // Hide it
        await chapterWrapper.vm.$emit('close')
        expect(chapterWrapper.props('visible')).toBe(false)
      })

      it('Update the chapter if the input event is emitted with an existing chapter', async () => {
        await wrapper.vm.onChapterEditClick('1')
        await chapterWrapper.vm.$emit('input', { id: '1', text: newChapterName })
        // Send API request
        expect(lckServices.chapter.patch).toHaveBeenCalledWith('1', { text: newChapterName })
        // Update the component data
        expect(wrapper.vm.workspaceContent.chapters.find(c => c.id === '1' && c.text === newChapterName)).toBeDefined()
      })

      it('Display a toast if an error is occured', async () => {
        const spyOnToast = jest.spyOn(wrapper.vm, 'displayToastOnError')
        lckServices.chapter.create.mockImplementationOnce(() => { throw new Error() })
        await chapterWrapper.vm.$emit('input')
        expect(spyOnToast).toHaveBeenCalledTimes(1)
      })
    })

    describe('Delete a chapter', () => {
      let deleteConfirmationWrapper
      beforeEach(() => {
        lckServices.chapter.remove.mockClear()
        deleteConfirmationWrapper = wrapper.findComponent(DeleteConfirmationDialog)
      })

      it('Display the confirmation dialog with the specified chapter when the delete-item event is emitted', async () => {
        await sidebarWrapper.vm.$emit('delete-item', '1')
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
        // Send API request
        expect(lckServices.chapter.remove).toHaveBeenCalledWith('1')
        // Update the component data
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

  describe('goToFirstPage', () => {
    let wrapper
    let firstPagePath
    let secondPagePath

    beforeAll(async () => {
      wrapper = await shallowMount(Workspace, globalComponentParams)
      firstPagePath = mockRouterPath(
        mockWorkspaceContent.id,
        mockWorkspaceContent.chapters[0].pages[0].id
      )
      secondPagePath = mockRouterPath(
        mockWorkspaceContent.id,
        mockWorkspaceContent.chapters[0].pages[1].id
      )
    })

    it('Redirect to the first page by default', async () => {
      expect(wrapper.vm.$router.history.current.path).toBe(firstPagePath)
    })

    it('Do not redirect if a page is already displayed', async () => {
      wrapper.vm.$router.push(secondPagePath)
      await wrapper.vm.goToFirstPage()
      expect(wrapper.vm.$router.history.current.path).toBe(secondPagePath)
    })
  })

  describe('displayToastOnError', () => {
    let wrapper

    beforeAll(async () => {
      wrapper = await shallowMount(Workspace, globalComponentParams)
    })

    beforeEach(() => {
      wrapper.vm.$toast.add.mockClear()
    })

    it('Display a toast with the specified parameters for an error without code', () => {
      wrapper.vm.displayToastOnError('summary', new Error('an error without a code'))
      expect(wrapper.vm.$toast.add).toHaveBeenCalledWith(
        expect.objectContaining({
          summary: 'summary',
          detail: 'error.basic'
        })
      )
    })

    it('Display a toast with the specified parameters for an error with a code', () => {
      wrapper.vm.displayToastOnError('summary', new MockError(404, 'an error with a code'))
      expect(wrapper.vm.$toast.add).toHaveBeenCalledWith(
        expect.objectContaining({
          summary: 'summary',
          detail: 'error.http.404'
        })
      )
    })
  })
})
