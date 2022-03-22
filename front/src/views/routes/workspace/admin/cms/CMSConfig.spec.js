/* eslint-disable @typescript-eslint/camelcase */

import { shallowMount, createLocalVue } from '@vue/test-utils'
import { USER_PROFILE } from '@locokit/lck-glossary'
import ToggleButton from 'primevue/togglebutton'
import ConfirmDialog from 'primevue/confirmdialog'
import VueRouter from 'vue-router'

import { ROUTES_PATH, ROUTES_NAMES } from '@/router/paths'
import { authState } from '@/store/auth'
import { lckServices } from '@/services/lck-api'

import CMSConfig from './CMSConfig.vue'
import CMSPage from '@/views/routes/workspace/admin/cms/Page'
import ChapterDialog from '@/components/visualize/ChapterDialog/ChapterDialog.vue'
import Sidebar from '@/components/visualize/Sidebar/Sidebar'

import Vue from 'vue'

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

/* // Mock error
class MockError extends Error {
  constructor (code, ...args) {
    super(args)
    this.code = code
  }
}

class MockRouterError extends Error {
  constructor (args) {
    super(args)
    this.from = { path: 'from' }
    this.to = { path: 'to' }
  }
}
*/
// Mock variables
const mockWorkspaceContent = {
  chapters: [{
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
  }, {
    id: '2',
    text: 'Chapter 2',
    createdAt: '2020-11-02T16:11:03.109Z',
    updatedAt: '2020-12-23T10:56:11.789Z',
    workspace_id: '0',
  }],
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
      },
    },
  },
}))

// Mock Vue components
jest.mock('@/views/routes/workspace/admin/cms/Page.vue', () => ({
  name: 'Page',
  render: h => h('section'),
}))

// Mock routes
const mockRoutes = [
  {
    path: ROUTES_PATH.WORKSPACE + '/:workspaceId' + ROUTES_PATH.ADMIN + ROUTES_PATH.CMS,
    name: ROUTES_NAMES.WORKSPACE_ADMIN.CMS,
    component: CMSConfig,
    props: true,
    meta: {
      needAuthentication: true,
      hasBurgerMenu: true,
    },
    children: [{
      name: ROUTES_NAMES.WORKSPACE_ADMIN.CMS_PAGE_DETAIL,
      path: ROUTES_PATH.WORKSPACE + '/:workspaceId' + ROUTES_PATH.ADMIN + ROUTES_PATH.CMS + ROUTES_PATH.CMS_PAGE + '/:pageId' + ROUTES_PATH.CMS_PAGE_DETAIL + '/:pageDetailId',
      props: true,
      component: CMSPage,
    }, {
      name: ROUTES_NAMES.WORKSPACE_ADMIN.CMS_PAGE,
      path: ROUTES_PATH.WORKSPACE + '/:workspaceId' + ROUTES_PATH.ADMIN + ROUTES_PATH.CMS + ROUTES_PATH.CMS_PAGE + '/:pageId',
      props: true,
      component: CMSPage,
    }],
  },
]
// Tests

describe('CMSConfig', () => {
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
      sidebarActive: true,
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

  describe('Edit button', () => {
    it('Hide it by default', async () => {
      const wrapper = await shallowMount(CMSConfig, globalComponentParams)
      await Vue.nextTick()
      expect(wrapper.findComponent(ToggleButton).exists()).toBe(false)
    })

    it('Hide it if the user can not edit the workspace', async () => {
      authState.data.user.profile = USER_PROFILE.USER
      const wrapper = await shallowMount(CMSConfig, globalComponentParams)
      await Vue.nextTick()
      expect(wrapper.findComponent(ToggleButton).exists()).toBe(false)
      authState.data.user.profile = ''
    })

    it('Display it if the user can edit the workspace', async () => {
      authState.data.user.profile = USER_PROFILE.SUPERADMIN
      const wrapper = await shallowMount(CMSConfig, globalComponentParams)
      await Vue.nextTick()
      expect(wrapper.findComponent(ToggleButton).exists()).toBe(true)
      authState.data.user.profile = ''
    })

    it('Update the edit mode when the user clicks on it', async () => {
      authState.data.user.profile = USER_PROFILE.SUPERADMIN
      const wrapper = await shallowMount(CMSConfig, globalComponentParams)
      await Vue.nextTick()
      expect(wrapper.vm.editMode).toBe(false)
      wrapper.findComponent(ToggleButton).vm.$emit('input', true)
      expect(wrapper.vm.editMode).toBe(true)
      authState.data.user.profile = ''
    })

    it('The edit mode is passed in Sidebar props', async () => {
      authState.data.user.profile = USER_PROFILE.SUPERADMIN
      const wrapper = await shallowMount(CMSConfig, globalComponentParams)
      await Vue.nextTick()
      expect(wrapper.findComponent(Sidebar).props('displayEditActions')).toBe(false)
      await wrapper.setData({ editMode: true })
      expect(wrapper.findComponent(Sidebar).props('displayEditActions')).toBe(true)
      authState.data.user.profile = ''
    })
  })

  describe('sidebarItems', () => {
    it('Return an empty array if the workspace content is not defined', async () => {
      expect.assertions(2)
      const wrapper = await shallowMount(CMSConfig, globalComponentParams)
      await wrapper.setData({ workspaceContent: null })
      expect(wrapper.vm.sidebarItems.length).toBe(0)
      expect(wrapper).toMatchSnapshot()
    })

    it('Return an empty array if the workspace content chapters are not defined', async () => {
      expect.assertions(1)
      const wrapper = await shallowMount(CMSConfig, globalComponentParams)
      await wrapper.setData({
        workspaceContent: {
          chapters: null,
        },
      })
      expect(wrapper.vm.sidebarItems.length).toBe(0)
    })

    describe('Return the right items for a classic user', () => {
      let wrapper
      const currentMockWorkspaceContent = mockDeepCloneObject(mockWorkspaceContent)
      const firstChapter = currentMockWorkspaceContent.chapters[0]

      beforeAll(async () => {
        authState.data.user.profile = USER_PROFILE.USER
        wrapper = await shallowMount(CMSConfig, globalComponentParams)
      })

      afterAll(() => {
        authState.data.user.profile = ''
        authState.data.user.groups = []
      })

      it('The items are passed in Sidebar props', () => {
        expect(wrapper.findComponent(Sidebar).props('items')).toStrictEqual(wrapper.vm.sidebarItems)
      })

      it('Return the right number of items', async () => {
        expect(wrapper.vm.sidebarItems).toHaveLength(currentMockWorkspaceContent.chapters.length)
      })

      it('Return the right item id', () => {
        expect(wrapper.vm.sidebarItems[0].subitems[0].id).toBe(firstChapter.pages[0].id)
      })

      it('Return the right item label', () => {
        expect(wrapper.vm.sidebarItems[0].subitems[0].label).toBe(firstChapter.pages[0].text)
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

        // it('Return the right link', () => {
        //   expect(wrapper.vm.sidebarItems[0].subitems[0].to).toBe(
        //     wrapper.vm.$router.resolve({
        //       name: ROUTES_NAMES.WORKSPACE_ADMIN.CMS_PAGE,
        //       params: {
        //         worspaceId: firstChapter.workspace_id,
        //         pageId: firstChapter.pages[0].id,
        //       },
        //     }).route.path,
        //   )
        // })

        it('Indicate if the page are hidden', () => {
          expect(wrapper.vm.sidebarItems[0].subitems[0].hidden).toBe(false)
          expect(wrapper.vm.sidebarItems[0].subitems[1].hidden).toBe(true)
        })
      })
    })
  })

  describe('isAdmin', () => {
    afterEach(() => {
      authState.data.user.profile = ''
    })

    it('Return true if the user is SUPERADMIN', async () => {
      authState.data.user.profile = USER_PROFILE.SUPERADMIN
      const wrapper = await shallowMount(CMSConfig, globalComponentParams)
      expect(wrapper.vm.isAdmin).toBe(true)
    })

    it('Return true if the user is ADMIN', async () => {
      authState.data.user.profile = USER_PROFILE.ADMIN
      const wrapper = await shallowMount(CMSConfig, globalComponentParams)
      expect(wrapper.vm.isAdmin).toBe(true)
    })

    it('Return false if the user is USER', async () => {
      authState.data.user.profile = USER_PROFILE.USER
      const wrapper = await shallowMount(CMSConfig, globalComponentParams)
      expect(wrapper.vm.isAdmin).toBe(false)
    })
  })

  describe('Chapter crud', () => {
    let wrapper
    let sidebarWrapper
    const newChapterName = 'newChapterName'

    beforeEach(async () => {
      wrapper = await shallowMount(CMSConfig, globalComponentParams)
      await Vue.nextTick()
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
        await chapterWrapper.vm.$emit('input', newChapterName)
        // Send API request
        expect(lckServices.chapter.create).toHaveBeenCalledWith({
          text: newChapterName,
          workspace_id: 'an-id',
        })
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
        await sidebarWrapper.vm.$emit('edit-item', '1')
        // Hide it
        await chapterWrapper.vm.$emit('close')
        expect(chapterWrapper.props('visible')).toBe(false)
      })

      it('Update the chapter if the input event is emitted with an existing chapter', async () => {
        await wrapper.vm.onChapterEditClick('1')
        await chapterWrapper.vm.$emit('input', newChapterName)
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
        deleteConfirmationWrapper = wrapper.findComponent(ConfirmDialog)
      })

      it('Display the confirmation dialog with the specified chapter when the delete-item event is emitted', async () => {
        await sidebarWrapper.vm.$emit('confirm-delete-chapter', { chapterId: '1', chapterName: 'My chapter' })
        expect(deleteConfirmationWrapper.exists()).toBe(true)
      })

      it('Send chapter to delete in confirmeDialog', async () => {
        // Call method
        await wrapper.vm.onConfirmationDeleteChapter({ chapterId: '1', chapterName: 'My chapter' })
        // Expect activate prime mechanism
        expect(wrapper.vm.$confirm.require).toHaveBeenCalled()
      })
    })
  })

  // describe('Page crud', () => {
  //   let wrapper
  //   let pageWrapper
  //   const newPageName = 'newPageName'
  //   const pageIsHidden = true

  //   beforeEach(async () => {
  //     wrapper = await shallowMount(CMSConfig, globalComponentParams)
  //     await Vue.nextTick()
  //     pageWrapper = wrapper.findComponent(PageDialog)
  //   })

  //   describe('Add a new page', () => {
  //     beforeEach(() => {
  //       lckServices.page.create.mockClear()
  //     })

  //     it('Do not display the page edit dialog if the add-subitem event is emitted from sidebar without an existing chapter', async () => {
  //       await wrapper.findComponent(Sidebar).vm.$emit('add-subitem', {})
  //       expect(pageWrapper.props('visible')).toBe(false)
  //     })

  //     it('Display the page edit dialog with an empty object when the add-subitem event is emitted from sidebar with an existing chapter', async () => {
  //       await wrapper.findComponent(Sidebar).vm.$emit('add-subitem', { item: '1' })
  //       expect(pageWrapper.props('page')).toStrictEqual({})
  //       expect(pageWrapper.props('visible')).toBe(true)
  //     })

  //     it('Create a new page if the input event is emitted with an existing chapter which already has some pages', async () => {
  //       await wrapper.vm.onPageEditClick({ item: '1' })
  //       await pageWrapper.vm.$emit('input', { text: newPageName, hidden: pageIsHidden })
  //       // Send API request
  //       expect(lckServices.page.create).toHaveBeenCalledWith({ text: newPageName, hidden: pageIsHidden, chapter_id: '1' })
  //       // Update the component data
  //       const newPage = wrapper.vm.workspaceContent.chapters[0].pages[2]
  //       expect(newPage).toBeDefined()
  //       expect(newPage.text).toBe(newPageName)
  //       expect(newPage.hidden).toBe(pageIsHidden)
  //     })

  //     it('Create a new page if the input event is emitted with an existing chapter which has not got any pages', async () => {
  //       await wrapper.vm.onPageEditClick({ item: '2' })
  //       await pageWrapper.vm.$emit('input', { text: newPageName, hidden: pageIsHidden })
  //       // Send API request
  //       expect(lckServices.page.create).toHaveBeenCalledWith({ text: newPageName, hidden: pageIsHidden, chapter_id: '2' })
  //       // Update the component data
  //       const newPage = wrapper.vm.workspaceContent.chapters[1].pages[0]
  //       expect(newPage).toBeDefined()
  //       expect(newPage.text).toBe(newPageName)
  //       expect(newPage.hidden).toBe(pageIsHidden)
  //     })

  //     it('Redirect to the new page if the input event is emitted with an existing chapter', async () => {
  //       await wrapper.vm.onPageEditClick({ item: '2' })
  //       await pageWrapper.vm.$emit('input', { text: newPageName, hidden: pageIsHidden })
  //       expect(wrapper.vm.$router.history.current.path).toBe(wrapper.vm.$router.resolve({
  //         name: ROUTES_NAMES.PAGE,
  //         params: {
  //           worspaceId: mockWorkspaceContent.id,
  //           pageId: '13',
  //         },
  //       }).route.path)
  //     })
  //   })

  //   describe('Update a page', () => {
  //     beforeEach(() => {
  //       lckServices.page.patch.mockClear()
  //     })

  //     it('Display the page edit dialog when the edit-item event is emitted from sidebar with an existing chapter', async () => {
  //       await wrapper.findComponent(Sidebar).vm.$emit('add-subitem', { item: '1', subitem: '12' })
  //       expect(pageWrapper.props('visible')).toBe(true)
  //       expect(pageWrapper.props('page')).toStrictEqual(mockWorkspaceContent.chapters[0].pages[1])
  //     })

  //     it('Hide the page edit dialog if it emits the close event', async () => {
  //       // Display the dialog
  //       await pageWrapper.setProps({ visible: true })
  //       // Hide it
  //       await pageWrapper.vm.$emit('close')
  //       expect(pageWrapper.props('visible')).toBe(false)
  //     })

  //     it('Update the page if the input event is emitted with an existing chapter and an existing page', async () => {
  //       await wrapper.vm.onPageEditClick({ item: '1', subitem: '12' })
  //       await pageWrapper.vm.$emit('input', { id: '12', text: newPageName, hidden: pageIsHidden })
  //       // Send API request
  //       expect(lckServices.page.patch).toHaveBeenCalledWith('12', { text: newPageName, hidden: pageIsHidden })
  //       // Update the component data
  //       const updatedPage = wrapper.vm.workspaceContent.chapters[0].pages[1]
  //       expect(updatedPage).toBeDefined()
  //       expect(updatedPage.text).toBe(newPageName)
  //       expect(updatedPage.hidden).toBe(pageIsHidden)
  //     })

  //     it('Redirect to the edit page if the input event is emitted with an existing chapter and an existing page', async () => {
  //       await wrapper.vm.onPageEditClick({ item: '1', subitem: '12' })
  //       await pageWrapper.vm.$emit('input', { id: '12', text: newPageName, hidden: pageIsHidden })
  //       expect(wrapper.vm.$router.history.current.path).toBe(wrapper.vm.$router.resolve({
  //         name: ROUTES_NAMES.PAGE,
  //         params: {
  //           worspaceId: mockWorkspaceContent.id,
  //           pageId: '12',
  //         },
  //       }).route.path)
  //     })

  //     it('Display a toast if an error is occured', async () => {
  //       const spyOnToast = jest.spyOn(wrapper.vm, 'displayToastOnError')
  //       lckServices.page.create.mockImplementationOnce(() => { throw new Error() })
  //       await pageWrapper.vm.$emit('input')
  //       expect(spyOnToast).toHaveBeenCalledTimes(1)
  //     })
  //   })

  //   describe('Delete a page', () => {
  //     let deleteConfirmationWrapper

  //     beforeEach(() => {
  //       deleteConfirmationWrapper = wrapper.findComponent(ConfirmDialog)
  //       lckServices.page.remove.mockClear()
  //     })

  //     it('Display the confirmation dialog with the specified page when the delete-subitem event is emitted', async () => {
  //       await wrapper.findComponent(Sidebar).vm.$emit('confirm-delete-chapter', {
  //         chapterId: '1',
  //         pageId: '12',
  //         pageName: 'My page',
  //       })
  //       expect(deleteConfirmationWrapper.exists()).toBe(true)
  //     })

  //     it('Send page to delete in confirmeDialog', async () => {
  //       // Call method
  //       await wrapper.vm.onConfirmationDeletePage({
  //         chapterId: '1',
  //         pageId: '12',
  //         pageName: 'My page',
  //       })
  //       // Expect activate prime mechanism
  //       expect(wrapper.vm.$confirm.require).toHaveBeenCalled()
  //     })

  //     // Need refacto in function
  //     // it('Redirect to a default page if the active page is the deleted page', async () => {
  //     //   await wrapper.vm.onConfirmationDeletePage({
  //     //     chapterId: '1',
  //     //     pageId: '11',
  //     //     pageName: 'My page',
  //     //   })
  //     //
  //     //   expect(wrapper.vm.$router.history.current.path).toBe(wrapper.vm.$router.resolve({
  //     //     name: ROUTES_NAMES.VISUALIZATION,
  //     //     params: {
  //     //       worspaceId: mockWorkspaceContent.id,
  //     //     },
  //     //   }).route.path)
  //     // })
  //     //
  //     // it('Keep on the same page if the active page is not the deleted page', async () => {
  //     //   await wrapper.vm.onConfirmationDeletePage({
  //     //     chapterId: '1',
  //     //     pageId: '12',
  //     //     pageName: 'My page',
  //     //   })
  //     //   expect(wrapper.vm.$router.history.current.path).toBe(wrapper.vm.$router.resolve({
  //     //     name: ROUTES_NAMES.PAGE,
  //     //     params: {
  //     //       worspaceId: mockWorkspaceContent.id,
  //     //       pageId: mockWorkspaceContent.chapters[0].pages[0].id,
  //     //     },
  //     //   }).route.path)
  //     // })
  //   })

  //   describe('Reorder pages', () => {
  //     it('Reorder the pages if the reorder-subitem event is emitted with an existing chapter and valid positions', async () => {
  //       await wrapper.vm.onPageReorderClick('1', { moved: { oldIndex: 0, newIndex: 1 } })
  //       const updatedPages = wrapper.vm.workspaceContent.chapters[0].pages
  //       const originalPages = mockWorkspaceContent.chapters[0].pages
  //       expect(updatedPages[0].position).toBe(0)
  //       expect(updatedPages[0].id).toBe(originalPages[1].id)
  //       expect(updatedPages[1].position).toBe(1)
  //       expect(updatedPages[1].id).toBe(originalPages[0].id)
  //     })

  //     it('Reorder the pages if the reorder-subitem event is emitted with an existing chapter and valid positions', async () => {
  //       await wrapper.vm.onPageReorderClick('1', { moved: { oldIndex: 1, newIndex: 0 } })
  //       const updatedPages = wrapper.vm.workspaceContent.chapters[0].pages
  //       const originalPages = mockWorkspaceContent.chapters[0].pages
  //       expect(updatedPages[0].position).toBe(0)
  //       expect(updatedPages[0].id).toBe(originalPages[1].id)
  //       expect(updatedPages[1].position).toBe(1)
  //       expect(updatedPages[1].id).toBe(originalPages[0].id)
  //     })

  //     it('Do nothing if the drag over event is not a moved event', async () => {
  //       await wrapper.vm.onPageReorderClick('1', { added: { newIndex: 0 } })
  //       const updatedPages = wrapper.vm.workspaceContent.chapters[0].pages
  //       const originalPages = mockWorkspaceContent.chapters[0].pages
  //       expect(updatedPages[0].position).toBe(0)
  //       expect(updatedPages[0].id).toBe(originalPages[0].id)
  //       expect(updatedPages[1].position).toBe(1)
  //       expect(updatedPages[1].id).toBe(originalPages[1].id)
  //     })

  //     it('Do nothing if the chapter id is not provided', async () => {
  //       await wrapper.vm.onPageReorderClick(null, { moved: { oldIndex: 1, newIndex: 0 } })
  //       const updatedPages = wrapper.vm.workspaceContent.chapters[0].pages
  //       const originalPages = mockWorkspaceContent.chapters[0].pages
  //       expect(updatedPages[0].position).toBe(0)
  //       expect(updatedPages[0].id).toBe(originalPages[0].id)
  //       expect(updatedPages[1].position).toBe(1)
  //       expect(updatedPages[1].id).toBe(originalPages[1].id)
  //     })

  //     it('Display a toast if an error is occured', async () => {
  //       const spyOnToast = jest.spyOn(wrapper.vm, 'displayToastOnError')
  //       lckServices.page.patch.mockRejectedValue(new Error())
  //       await wrapper.vm.onPageReorderClick('1', { moved: { oldIndex: 1, newIndex: 0 } })
  //       expect(spyOnToast).toHaveBeenCalled()
  //     })
  //   })
  // })

  // describe('goToFirstPage', () => {
  //   let wrapper
  //   let firstPagePath
  //   let secondPagePath

  //   beforeAll(async () => {
  //     wrapper = await shallowMount(CMSConfig, globalComponentParams)
  //     firstPagePath = wrapper.vm.$router.resolve({
  //       name: ROUTES_NAMES.PAGE,
  //       params: {
  //         worspaceId: mockWorkspaceContent.id,
  //         pageId: mockWorkspaceContent.chapters[0].pages[0].id,
  //       },
  //     }).route.path
  //     secondPagePath = wrapper.vm.$router.resolve({
  //       name: ROUTES_NAMES.PAGE,
  //       params: {
  //         worspaceId: mockWorkspaceContent.id,
  //         pageId: mockWorkspaceContent.chapters[0].pages[1].id,
  //       },
  //     }).route.path
  //   })

  //   it('Redirect to the first page', async () => {
  //     wrapper.vm.$router.push('/')
  //     await wrapper.vm.goToFirstPage()
  //     expect(wrapper.vm.$router.history.current.path).toBe(firstPagePath)
  //   })

  //   it('Do not redirect if a page is already displayed', async () => {
  //     wrapper.vm.$router.push(secondPagePath)
  //     await wrapper.vm.goToFirstPage()
  //     expect(wrapper.vm.$router.history.current.path).toBe(secondPagePath)
  //   })
  // })

  describe('goToSpecificPage', () => {
    let wrapper
    let firstChapter

    beforeEach(async () => {
      wrapper = await shallowMount(CMSConfig, globalComponentParams)
      firstChapter = mockWorkspaceContent.chapters[0]
    })

    it('Redirect to the specific page if it is not the current page ', async () => {
      await wrapper.vm.goToSpecificPage(firstChapter.pages[1].id)
      expect(wrapper.vm.$router.history.current.path).toBe(wrapper.vm.$router.resolve({
        name: ROUTES_NAMES.WORKSPACE_ADMIN.CMS_PAGE,
        params: {
          worspaceId: 'an-id',
          pageId: firstChapter.pages[1].id,
        },
      }).route.path)
    })

    it('Refresh the necessary children components keys if we want to access the current page and keep the same path', async () => {
      await wrapper.vm.goToSpecificPage(firstChapter.pages[0].id)
      const originalKey = wrapper.vm.forceUpdateKey
      await wrapper.vm.goToSpecificPage(firstChapter.pages[0].id)
      expect(wrapper.vm.forceUpdateKey).toBe(!originalKey)
      expect(wrapper.vm.$router.history.current.path).toBe(wrapper.vm.$router.resolve({
        name: ROUTES_NAMES.WORKSPACE_ADMIN.CMS_PAGE,
        params: {
          worspaceId: mockWorkspaceContent.id,
          pageId: firstChapter.pages[0].id,
        },
      }).route.path)
    })

    // it('Throw the error if it is not due to a duplicated path', async () => {
    //   jest.spyOn(wrapper.vm.$router, 'replace').mockImplementationOnce(() => Promise.reject(new MockRouterError()))
    //   let throwError = false
    //   try {
    //     await wrapper.vm.goToSpecificPage('0')
    //   } catch (error) {
    //     throwError = true
    //   }
    //   expect(throwError).toBe(true)
    // })
  })

  // describe('goToDefaultRoute', () => {
  //   let wrapper

  //   beforeEach(async () => {
  //     wrapper = await shallowMount(CMSConfig, globalComponentParams)
  //   })

  //   it('Redirect to the default route ', async () => {
  //     await wrapper.vm.goToDefaultRoute()
  //     expect(wrapper.vm.$router.history.current.path).toBe(wrapper.vm.$router.resolve({
  //       name: ROUTES_NAMES.VISUALIZATION,
  //       params: {
  //         worspaceId: mockWorkspaceContent.id,
  //       },
  //     }).route.path)
  //   })

  //   it('Do not throw an error if the default route is the current one', async () => {
  //     await wrapper.vm.goToDefaultRoute()
  //     let throwError = false
  //     try {
  //       await wrapper.vm.goToDefaultRoute()
  //     } catch (error) {
  //       throwError = true
  //     }
  //     expect(throwError).toBe(false)
  //   })

  //   it('Throw the error if it is not due to a duplicated path', async () => {
  //     jest.spyOn(wrapper.vm.$router, 'replace').mockImplementationOnce(() => Promise.reject(new MockRouterError()))
  //     let throwError = false
  //     try {
  //       await wrapper.vm.goToDefaultRoute()
  //     } catch (error) {
  //       throwError = true
  //     }
  //     expect(throwError).toBe(true)
  //   })
  // })

  // describe('displayToastOnError', () => {
  //   let wrapper

  //   beforeAll(async () => {
  //     wrapper = await shallowMount(CMSConfig, globalComponentParams)
  //   })

  //   beforeEach(() => {
  //     wrapper.vm.$toast.add.mockClear()
  //   })

  //   it('Display a toast with the specified parameters for an error without code', () => {
  //     wrapper.vm.displayToastOnError('summary', new Error('an error without a code'))
  //     expect(wrapper.vm.$toast.add).toHaveBeenCalledWith(
  //       expect.objectContaining({
  //         summary: 'summary',
  //         detail: 'error.basic',
  //       }),
  //     )
  //   })

  //   it('Display a toast with the specified parameters for an error with a code', () => {
  //     wrapper.vm.displayToastOnError('summary', new MockError(404, 'an error with a code'))
  //     expect(wrapper.vm.$toast.add).toHaveBeenCalledWith(
  //       expect.objectContaining({
  //         summary: 'summary',
  //         detail: 'error.http.404',
  //       }),
  //     )
  //   })
  // })
})
