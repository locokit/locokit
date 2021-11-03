/* eslint-disable @typescript-eslint/camelcase */
import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { flushAll } from '@/../tests/unit/local-test-utils'
import VueRouter from 'vue-router'
import { ROUTES_NAMES, ROUTES_PATH } from '@/router/paths'

import { LckAclTable as MockLckAclTable, LckAclSet as MockLckAclSet } from '@/services/lck-api/definitions'
import { lckServices } from '@/services/lck-api'

import AclSetForm from './AclSetForm.vue'
import AclSetListing from './AclSetListing.vue'
import Form from '@/components/ui/Form/Form.vue'

// Mock variables
const mockChapters = [
  {
    id: 'chapter1_id',
    text: 'Chapter 1',
  },
  {
    id: 'chapter2_id',
    text: 'Chapter 2',
  },
]

const mockTables = [
  {
    id: 'table1_id',
    text: 'Table 1',
  },
  {
    id: 'table2_id',
    text: 'Table 2',
  },
]

const mockAclTables = [
  { ...new MockLckAclTable('aclset1_id', mockTables[0]) },
  { id: 'acltable2_id', ...new MockLckAclTable('aclset1_id', mockTables[1]) },
]

const mockAclSets = [
  {
    acltables: mockAclTables,
    chapter: mockChapters[0],
    chapter_id: mockChapters[0].id,
    id: 'aclset1_id',
    label: 'AclSet 1',
    manager: true,
    workspace_id: 'workspace1_id',
  },
  {
    chapter_id: mockChapters[1].id,
    id: 'aclset2_id',
    label: 'AclSet 2',
    manager: false,
    workspace_id: 'workspace1_id',
  },
]

const mockWorkspaces = [
  {
    id: 'workspace1_id',
    text: 'Workspace 1',
    databases: [
      {
        id: 'database1_id',
        text: 'Database 1',
        workspace_id: 'workspace1_id',
        tables: mockTables,
      },
    ],
    aclsets: mockAclSets,
  },
]

const mockRoutes = [
  {
    path: ROUTES_PATH.ACLSET,
    name: ROUTES_NAMES.WORKSPACE_ADMIN.ACL,
    component: AclSetListing,
    props: true,
    meta: {
      needAuthentication: true,
      hasBurgerMenu: true,
    },
    children: [{
      path: ROUTES_PATH.ACLSET + '/:aclSetId',
      name: ROUTES_NAMES.WORKSPACE_ADMIN.ACL_DETAIL,
      component: AclSetListing,
      props: true,
      meta: {
        needAuthentication: true,
        hasBurgerMenu: true,
      },
    }],
  },
]

const globalComponentParams = (workspaceId, aclSetId = null) => {
  const localVue = createLocalVue()
  const router = new VueRouter({ routes: mockRoutes })
  localVue.use(VueRouter)

  return {
    localVue,
    router,
    propsData: {
      workspaceId,
      aclSetId,
    },
    mocks: {
      $confirm: {
        require: ({ accept }) => accept(), // We simulate that the user confirm
      },
      t: key => key,
      $t: key => key,
      $toast: {
        add: jest.fn(),
      },
      $route: {
        params: {},
      },
    },
  }
}

// Method to make an object deep copy
function mockDeepCloneObject (object, defaultValue = {}) {
  return object ? JSON.parse(JSON.stringify(object)) : defaultValue
}

// Mock lck functions
jest.mock('@/services/lck-api', () => ({
  lckServices: {
    aclset: {
      create: jest.fn(data => ({
        ...new MockLckAclSet('AclSet 3', data.workspace_id),
        ...data,
        id: 'aclset3_id,',
      })),
      find: jest.fn(() => mockDeepCloneObject(mockAclSets, [])),
      get: jest.fn(id => mockDeepCloneObject(mockAclSets.find(aclSet => aclSet.id === id))),
      patch: jest.fn((id, data) => ({
        ...mockAclSets.find(aclSet => aclSet.id === id),
        ...data,
      })),
      remove: jest.fn(),
    },
    acltable: {
      create: jest.fn(data => ({
        ...new MockLckAclTable(data.aclset_id),
        ...data,
        id: 'acltable3_id,',
      })),
      patch: jest.fn((id, data) => ({
        ...mockAclTables.find(aclTable => aclTable.id === id),
        ...data,
      })),
    },
    chapter: {
      find: jest.fn(() => mockDeepCloneObject(mockChapters, [])),
    },
    table: {
      find: jest.fn(() => mockDeepCloneObject(mockTables, [])),
    },
    workspace: {
      get: jest.fn(id => mockDeepCloneObject(mockWorkspaces.find(w => w.id === id), null)),
    },
  },
}))

describe('AclSetListing', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  it('display a message if there is no aclsets', async () => {
    expect.assertions(1)
    const wrapper = await mount(AclSetListing, globalComponentParams('unknown_workspace'))
    await flushAll()
    expect(wrapper).toMatchSnapshot()
  })

  it('display a list of aclsets if there are ones', async () => {
    expect.assertions(1)
    const wrapper = await mount(AclSetListing, globalComponentParams(mockWorkspaces[0].id))
    await flushAll()
    expect(wrapper).toMatchSnapshot()
  })

  it('create a new aclset', async () => {
    expect.assertions(6)
    const wrapper = await mount(AclSetListing, globalComponentParams(mockWorkspaces[0].id))
    await flushAll()
    // The aclset form is not displayed by default
    expect(wrapper.findComponent(AclSetForm).exists()).toBe(false)
    // But the list of the created aclsets is displayed
    expect(wrapper.findAll('.lck-sidebar-link').length).toBe(2)
    // Display the aclset form on button click
    const buttonToAdd = wrapper.find('.p-button.p-button-primary')
    await buttonToAdd.trigger('click')
    const formWrapper = wrapper.findComponent(AclSetForm)
    expect(formWrapper.exists()).toBe(true)
    // Complete the form
    await formWrapper.find('#label').setValue('New aclset')
    await formWrapper.find('#manager input').trigger('click')
    await formWrapper.find('#chapter').vm.$emit('item-select', { value: mockChapters[0] })
    // After submitting the form, use the api to create the new aclset
    await formWrapper.findComponent(Form).vm.$emit('submit')
    expect(lckServices.aclset.create).toHaveBeenLastCalledWith({
      chapter_id: mockChapters[0].id,
      label: 'New aclset',
      manager: true,
      workspace_id: mockWorkspaces[0].id,
    })
    await flushAll()
    // Come back to the list of the created aclsets that contains now the new aclset
    expect(wrapper.findAll('.lck-sidebar-link').length).toBe(3)
    expect(wrapper).toMatchSnapshot()
  })

  it('remove an aclset', async () => {
    expect.assertions(4)
    const wrapper = await mount(AclSetListing, globalComponentParams(mockWorkspaces[0].id, mockAclSets[0].id))
    await flushAll()
    // But the list of the created aclsets is displayed
    const items = wrapper.findAll('.lck-sidebar-link')
    expect(items.length).toBe(2)
    await items.at(0).trigger('click')
    // Display the aclset form on button click
    await flushAll()
    const formWrapper = wrapper.findComponent(AclSetForm)
    expect(formWrapper.exists()).toBe(true)
    // After clicking on the deletion button, use the api to remove the aclset
    await formWrapper.find('.delete-aclset-button').trigger('click')
    await flushAll()
    expect(lckServices.aclset.remove).toHaveBeenLastCalledWith(mockWorkspaces[0].aclsets[0].id)
    // We come back to the list of the created aclsets that no contains anymore the deleted aclset
    expect(wrapper.findAll('.lck-sidebar-link').length).toBe(1)
  })

  it('update an aclset', async () => {
    expect.assertions(3)
    const currentAclset = mockWorkspaces[0].aclsets[0]
    const wrapper = await mount(AclSetListing, globalComponentParams(mockWorkspaces[0].id, mockAclSets[0].id))
    await flushAll()
    // Display the aclset form on button click
    await wrapper.find('.lck-sidebar-link').trigger('click')
    const formWrapper = wrapper.findComponent(AclSetForm)
    expect(formWrapper.exists()).toBe(true)
    // Edit the form
    await formWrapper.find('#label').setValue(currentAclset.label + ' updated')
    await formWrapper.find('#manager input').trigger('click')
    await formWrapper.find('#chapter').vm.$emit('item-select', { value: mockChapters[1] })
    // After submitting the form, use the api to update the aclset
    await formWrapper.findComponent(Form).vm.$emit('submit')
    await flushAll()
    expect(lckServices.aclset.patch).toHaveBeenLastCalledWith(currentAclset.id, {
      chapter_id: mockChapters[1].id,
      label: currentAclset.label + ' updated',
      manager: false,
    })
    expect(wrapper).toMatchSnapshot()
  })

  it('add a new acltable to an aclset', async () => {
    expect.assertions(2)
    const currentAclset = mockWorkspaces[0].aclsets[0]
    const wrapper = await mount(AclSetListing, globalComponentParams(mockWorkspaces[0].id, mockAclSets[0].id))
    await flushAll()
    // Display the aclset form on button click
    // await wrapper.findAll('.lck-sidebar-link').at(1).trigger('click')
    // Go to the acltable configuration tab
    // await wrapper.findAll('.p-tabview-nav-link').at(1).trigger('click')
    // After editing a value in the table, use the api to create a new acltable
    await wrapper.find('.p-datatable-tbody button').trigger('click')
    expect(lckServices.acltable.create).toHaveBeenCalledWith({
      aclset_id: currentAclset.id,
      create_rows: true,
      table_id: mockTables[0].id,
    })
    await flushAll()
    expect(wrapper).toMatchSnapshot()
  })

  it('patch an acltable of an aclset', async () => {
    expect.assertions(2)
    const wrapper = await mount(AclSetListing, globalComponentParams(mockWorkspaces[0].id, mockAclSets[0].id))
    await flushAll()
    // Display the aclset form on button click
    // await wrapper.find('.lck-sidebar-link').trigger('click')
    // Go to the acltable configuration tab
    // await wrapper.findAll('.p-tabview-nav-link').at(1).trigger('click')
    // After editing a value in the table, use the api to patch the existing acltable
    await wrapper.find('.p-datatable-tbody tr:nth-child(2) button').trigger('click')
    expect(lckServices.acltable.patch).toHaveBeenCalledWith(mockAclTables[1].id, {
      create_rows: true,
    })
    await flushAll()
    expect(wrapper).toMatchSnapshot()
  })
})
