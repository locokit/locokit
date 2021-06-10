/* eslint-disable @typescript-eslint/camelcase, @typescript-eslint/no-unused-vars */

import { shallowMount, createLocalVue } from '@vue/test-utils'
import { BLOCK_TYPE } from '@locokit/lck-glossary'
import VueRouter from 'vue-router'
import draggable from 'vuedraggable'

import { ROUTES_PATH, ROUTES_NAMES } from '@/router/paths'
import { lckServices } from '@/services/lck-api'

import Page from './Page.vue'
import Workspace from '@/views/routes/workspace/visualization/Workspace.vue'

import Block from '@/components/visualize/Block/Block'
import UpdateSidebar from '@/components/visualize/UpdateSidebar/UpdateSidebar.vue'
import DeleteConfirmationDialog from '@/components/ui/DeleteConfirmationDialog/DeleteConfirmationDialog.vue'

// Mock external libraries

jest.mock('@locokit/lck-glossary', () => ({
  BLOCK_TYPE: {
    PARAGRAPH: 'Paragraph',
    TABLE_VIEW: 'TableView'
  },
  COLUMN_TYPE: {
  }
}))

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
    super(args)
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
        settings: null,
        position: 2,
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
            container_id: '11'
          },
          {
            id: '122',
            createdAt: '2020-11-02T16:11:03.109Z',
            updatedAt: '2020-11-02T16:11:03.109Z',
            settings: {
              id: 'ref_view'
            },
            title: 'My paragraph block',
            type: BLOCK_TYPE.TABLE_VIEW,
            position: 1,
            container_id: '11'
          }
        ]
      },
      {
        id: '11',
        text: 'My first container',
        createdAt: '2020-11-02T16:11:03.109Z',
        updatedAt: '2020-11-02T16:11:03.109Z',
        page_id: '1',
        settings: null,
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
  }
}

const mockChapters = [
  {
    id: 'C1',
    pages: [mockPages['1'], mockPages['3']]
  },
  {
    id: 'C2',
    pages: [mockPages['2']]
  }
]

const mockTableViewDefinition = {
  id: '123456',
  text: 'My view to display'
}

const mockTableViewContent = 'content'

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
    retrievePageWithContainersAndBlocks: jest.fn((pageId) => mockDeepCloneObject(mockPages[pageId])),
    retrieveViewDefinition: jest.fn(() => mockTableViewDefinition),
    retrieveViewData: jest.fn(() => mockTableViewContent)
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
        })
        it('Get the right properties for the Paragraph block (default)', () => {
          expect(wrapper.vm.page.containers[1].blocks[1]).toMatchObject(mockPages['1'].containers[0].blocks[0])
        })
        it('Get the right properties for the TableView block', () => {
          expect(wrapper.vm.page.containers[1].blocks[0]).toMatchObject(mockPages['1'].containers[0].blocks[1])
          expect(wrapper.vm.page.containers[1].blocks[0].definition).toStrictEqual(mockTableViewDefinition)
          expect(wrapper.vm.page.containers[1].blocks[0].content).toStrictEqual(mockTableViewContent)
        })
      })
    })
    describe('Load the specified page without any containers', () => {
      it('Get the right containers', async () => {
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
        beforeEach(() => {
          lckServices.container.create.mockClear()
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
          expect(lckServices.container.create).toHaveBeenCalledWith({ text: newContainerName, page_id: mockPages['1'].id })
          // Update the component data
          const newContainer = wrapper.vm.page.containers[2]
          expect(newContainer).toBeDefined()
          expect(newContainer.text).toBe(newContainerName)
        })
      })

      describe('Update an existing container', () => {
        beforeEach(() => {
          lckServices.container.patch.mockClear()
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
          expect(lckServices.container.patch).toHaveBeenCalledWith(firstDisplayedContainer.id, { text: newContainerName })
          // Update the component data
          expect(
            wrapper.vm.page.containers.find(
              container => container.id === firstDisplayedContainer.id &&
              container.text === newContainerName)
          ).toBeDefined()
        })

        it('Display a toast if an error is occured', async () => {
          const spyOnToast = jest.spyOn(wrapper.vm, 'displayToastOnError')
          lckServices.container.patch.mockImplementationOnce(() => { throw new Error() })
          await wrapper.find('.edit-container-button').vm.$emit('click', firstDisplayedContainer)
          await containerSidebarWrapper.vm.$emit('update-container', { id: firstDisplayedContainer.id, text: newContainerName })
          expect(spyOnToast).toHaveBeenCalledTimes(1)
        })
      })

      describe('Delete a container', () => {
        beforeEach(() => {
          lckServices.container.remove.mockClear()
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
          expect(lckServices.container.remove).toHaveBeenCalledWith(firstDisplayedContainer.id)
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
          lckServices.container.remove.mockImplementationOnce(() => { throw new Error() })
          await wrapper.find('.remove-container-button').vm.$emit('click')
          await deleteConfirmationWrapper.vm.$emit('input', { id: firstDisplayedContainer.id })
          expect(spyOnToast).toHaveBeenCalledTimes(1)
        })
      })

      describe('Reorder the containers', () => {
        beforeEach(() => {
          lckServices.container.patch.mockClear()
        })
        it('Save the new containers positions if the change event is emitted (oldIndex < newIndex)', async () => {
          await wrapper.findComponent(draggable).vm.$emit('change', { moved: { oldIndex: 0, newIndex: 1 } })
          expect(lckServices.container.patch).toHaveBeenCalledTimes(2)
          expect(lckServices.container.patch).toHaveBeenNthCalledWith(1, firstDisplayedContainer.id, { position: 0 })
          expect(lckServices.container.patch).toHaveBeenNthCalledWith(2, secondDisplayedContainer.id, { position: 1 })
        })
        it('Save the new containers positions if the change event is emitted (oldIndex > newIndex)', async () => {
          await wrapper.findComponent(draggable).vm.$emit('change', { moved: { oldIndex: 1, newIndex: 0 } })
          expect(lckServices.container.patch).toHaveBeenCalledTimes(2)
          expect(lckServices.container.patch).toHaveBeenNthCalledWith(1, firstDisplayedContainer.id, { position: 0 })
          expect(lckServices.container.patch).toHaveBeenNthCalledWith(2, secondDisplayedContainer.id, { position: 1 })
        })
        it('Do not save the new containers positions if the drag over event is not a move event ', async () => {
          await wrapper.findComponent(draggable).vm.$emit('change', { added: { newIndex: 0 } })
          expect(lckServices.container.patch).toHaveBeenCalledTimes(0)
        })
        it('Display a toast if an error is occured', async () => {
          const spyOnToast = jest.spyOn(wrapper.vm, 'displayToastOnError')
          lckServices.container.patch.mockRejectedValueOnce(new MockError())
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
        beforeEach(() => {
          lckServices.block.create.mockClear()
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
          expect(lckServices.block.create).toHaveBeenCalledWith({ ...data, container_id: firstDisplayedContainer.id })
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
          expect(lckServices.block.create).toHaveBeenCalledWith({ ...data, container_id: firstDisplayedContainer.id })
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
          expect(lckServices.block.create).toHaveBeenCalledWith({ ...data, container_id: firstDisplayedContainer.id })
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
          expect(lckServices.block.create).toHaveBeenCalledWith({ ...data, container_id: firstDisplayedContainer.id })
          // Update the component data
          const newBlock = wrapper.vm.page.containers[0].blocks[0]
          expect(newBlock).toBeDefined()
          expect(newBlock.title).toBe(mediaBlock.title)
          expect(newBlock.type).toBe(mediaBlock.type)
          expect(newBlock.settings).toStrictEqual(mediaBlock.settings)
        })
      })

      describe('Update an existing container', () => {
        const blockToEdit = { id: secondDisplayedBlock.id, title: 'newBlockName', type: 'MARKDOWN', settings: { content: 'My new content' } }

        beforeEach(() => {
          lckServices.container.patch.mockClear()
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
          // expect(containerSidebarWrapper.props('block')).toStrictEqual(
          //   expect.objectContaining({ ...firstDisplayedBlock })
          // )
        })

        it('Display the update container sidebar with the specified container and table view block when the update block event is emitted from the block component', async () => {
          await wrapper.findAllComponents(Block).at(0).vm.$emit('update-block')
          expect(containerSidebarWrapper.props('block').definition).toStrictEqual(mockTableViewDefinition)
          expect(containerSidebarWrapper.props('block').content).toStrictEqual(mockTableViewContent)
        })

        it('Display the update container sidebar with the specified container and detail view block when the update block event is emitted from the block component', async () => {
          await wrapper.findAllComponents(Block).at(0).vm.$emit('update-block')
          expect(containerSidebarWrapper.props('block').definition).toStrictEqual(mockTableViewDefinition)
        })

        it('Update the block if the update-block event is emitted with an existing block from the sidebar', async () => {
          await wrapper.findAllComponents(Block).at(1).vm.$emit('update-block')
          await containerSidebarWrapper.vm.$emit('update-block', { blockToEdit })

          // Send API request
          expect(lckServices.block.patch).toHaveBeenCalledWith(
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
          const spyOnLoadBlockContentAndDefinition = jest.spyOn(wrapper.vm, 'loadBlockContentAndDefinition')
          await wrapper.findAllComponents(Block).at(1).vm.$emit('update-block')
          await containerSidebarWrapper.vm.$emit('update-block', { blockToEdit, blockRefreshRequired: true })
          expect(spyOnLoadBlockContentAndDefinition).toHaveBeenCalled()
        })

        it('Display a toast if an error is occured', async () => {
          const spyOnToast = jest.spyOn(wrapper.vm, 'displayToastOnError')
          lckServices.block.patch.mockImplementationOnce(() => { throw new Error() })
          await wrapper.findAllComponents(Block).at(1).vm.$emit('update-block')
          await containerSidebarWrapper.vm.$emit('update-block', { blockToEdit })
          expect(spyOnToast).toHaveBeenCalledTimes(1)
        })
      })

      describe('Delete a container', () => {
        let deleteBlockWrapper

        beforeEach(async () => {
          lckServices.block.remove.mockClear()
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
          expect(lckServices.block.remove).toHaveBeenCalledWith(firstDisplayedBlock.id)
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
          expect(lckServices.block.remove).toHaveBeenCalledWith(firstDisplayedBlock.id)
          // Update the component data
          // expect(
          //   wrapper.vm.page.containers[1].blocks.find(block => block.id === firstDisplayedBlock.id)
          // ).toBeUndefined()
        })

        it('Do nothing if the input event is emitted with an empty block', async () => {
          await wrapper.findAllComponents(Block).at(0).vm.$emit('delete-block')
          await deleteBlockWrapper.vm.$emit('input', {})
          expect(lckServices.block.remove).not.toHaveBeenCalled()
          expect(wrapper.vm.page.containers[1].blocks.length).toBe(2)
        })

        it('Do not update the local data if the input event is emitted with an unknown container', async () => {
          await wrapper.findAllComponents(Block).at(0).vm.$emit('delete-block')
          await deleteBlockWrapper.vm.$emit('input', { ...firstDisplayedBlock, id: '-1' })
          expect(lckServices.block.remove).toHaveBeenCalled()
          expect(wrapper.vm.page.containers[1].blocks.length).toBe(2)
        })

        it('Display a toast if an error is occured', async () => {
          const spyOnToast = jest.spyOn(wrapper.vm, 'displayToastOnError')
          lckServices.block.remove.mockImplementationOnce(() => { throw new Error() })
          await wrapper.find('.remove-container-button').vm.$emit('click')
          await deleteBlockWrapper.vm.$emit('input', firstDisplayedBlock)
          expect(spyOnToast).toHaveBeenCalledTimes(1)
        })
      })

      describe('Reorder the blocks', () => {
        beforeEach(() => {
          lckServices.block.patch.mockClear()
        })
        it('Save the new blocks positions if the change event is emitted (oldIndex < newIndex)', async () => {
          await wrapper.findAllComponents(draggable).at(2).vm.$emit('change', { moved: { oldIndex: 0, newIndex: 1 } })
          expect(lckServices.block.patch).toHaveBeenCalledTimes(2)
          expect(lckServices.block.patch).toHaveBeenNthCalledWith(1, firstDisplayedBlock.id, { position: 0 })
          expect(lckServices.block.patch).toHaveBeenNthCalledWith(2, secondDisplayedBlock.id, { position: 1 })
        })
        it('Save the new blocks positions if the change event is emitted (oldIndex > newIndex)', async () => {
          await wrapper.findAllComponents(draggable).at(2).vm.$emit('change', { moved: { oldIndex: 1, newIndex: 0 } })
          expect(lckServices.block.patch).toHaveBeenCalledTimes(2)
          expect(lckServices.block.patch).toHaveBeenNthCalledWith(1, firstDisplayedBlock.id, { position: 0 })
          expect(lckServices.block.patch).toHaveBeenNthCalledWith(2, secondDisplayedBlock.id, { position: 1 })
        })
        it('Do not save the new blocks positions if the drag over event is not a move event ', async () => {
          await wrapper.findAllComponents(draggable).at(2).vm.$emit('change', { added: { newIndex: 0 } })
          expect(lckServices.block.patch).toHaveBeenCalledTimes(0)
        })
        it('Display a toast if an error is occured', async () => {
          const spyOnToast = jest.spyOn(wrapper.vm, 'displayToastOnError')
          lckServices.block.patch.mockRejectedValueOnce(new MockError())
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

      beforeAll(async () => {
        wrapper = await shallowMount(Page, globalComponentParams())
        wrapper.vm.$toast.add.mockClear()
      })

      afterEach(() => {
        wrapper.vm.$toast.add.mockClear()
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
})
