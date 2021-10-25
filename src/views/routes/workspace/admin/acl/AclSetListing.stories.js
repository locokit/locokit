/* eslint-disable @typescript-eslint/camelcase */
import AclSetListing from './AclSetListing.vue'

import { LckAclTable, LckAclSet } from '@/services/lck-api/definitions'

export default {
  title: 'views/routes/workspace/acl/AclSetListing',
  component: AclSetListing,
}

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
  new LckAclTable('aclset1_id', mockTables[0]),
  new LckAclTable('aclset1_id', mockTables[1]),
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

const mockWorkspace = {
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
}

const mockMethods = {
  lckServices: {
    aclset: {
      create (data) {
        return new Promise(resolve => {
          resolve({
            ...new LckAclSet('AclSet 3', mockWorkspace.id),
            ...data,
            id: 'aclset3_id',
          })
        })
      },
      find () {
        return new Promise(resolve => {
          resolve(mockAclSets)
        })
      },
      get (id) {
        return new Promise(resolve => {
          resolve(mockAclSets.find(aclSet => aclSet.id === id))
        })
      },
      patch (id, data) {
        return new Promise(resolve => {
          resolve({
            ...mockAclSets.find(aclSet => aclSet.id === id),
            ...data,
          })
        })
      },
      remove () {
        return new Promise(resolve => {
          resolve()
        })
      },
    },
    acltable: {
      create (data) {
        return new Promise(resolve => {
          resolve({
            ...new LckAclTable(data.aclset_id, data.table),
            ...data,
            id: 'new_acltable_id',
          })
        })
      },
      patch (id, data) {
        return new Promise(resolve => {
          resolve({
            ...mockAclTables.find(aclTable => aclTable.id === id),
            ...data,
          })
        })
      },
    },
    chapter: {
      find () {
        return new Promise(resolve => {
          resolve(mockChapters)
        })
      },
    },
    table: {
      find () {
        return new Promise(resolve => {
          resolve(mockTables)
        })
      },
    },
    workspace: {
      get () {
        return new Promise(resolve => {
          resolve(mockWorkspace)
        })
      },
    },
  },
}

export const withAclSetsToDisplay = () => {
  return {
    components: { AclSetListing },
    template: `
      <AclSetListing
        workspaceId="workspace1_id"
      />
    `,
  }
}

withAclSetsToDisplay.storyName = 'with acl sets to display'
withAclSetsToDisplay.parameters = mockMethods
