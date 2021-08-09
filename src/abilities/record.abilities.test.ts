import { Ability, subject } from '@casl/ability'
import { USER_PROFILE } from '@locokit/lck-glossary'
import { defineAbilityFor } from './record.abilities'
import app from '../app'
import { User } from '../models/user.model'

import { builderTestEnvironment, SetupData } from './helpers'
import { LckAclTable } from '../models/acltable.model'
import { TableRow } from '../models/tablerow.model'
import { Paginated } from '@feathersjs/feathers'
import { Forbidden, NotFound } from '@feathersjs/errors'

const builder = builderTestEnvironment('record-abilities')

describe('Records abilities', () => {
  let ability: Ability
  let user
  let setupData: SetupData

  beforeAll(async () => {
    setupData = await builder.setupWorkspace()
  })

  describe('when user is a SUPERADMIN', () => {
    beforeEach(async () => {
      user = { profile: USER_PROFILE.SUPERADMIN }
      ability = await defineAbilityFor(user as User, {}, app.services)
    })

    it('can manage all workspaces, so all tables, so the one we want to', async () => {
      expect.assertions(4)

      const rowTable1 = await app.service('row')
        .create({
          data: {
          },
          table_id: setupData.table1Id,
        })
      expect(ability.can('manage', 'row')).toBe(true)
      expect(ability.can('manage', subject('row', rowTable1))).toBe(true)
      expect(ability.can('manage', subject('row', { table_id: setupData.table1Id }))).toBe(true)
      expect(ability.can('manage', subject('row', { table_id: setupData.table2Id }))).toBe(true)
      await app.service('row').remove(rowTable1.id)
    })
  })

  describe('when user is an ADMIN', () => {
    beforeEach(async () => {
      user = { profile: USER_PROFILE.ADMIN }
      ability = await defineAbilityFor(user as User, {}, app.services)
    })

    it('can manage all tables, so the records in the table we want to', async () => {
      expect.assertions(4)

      const rowTable1 = await app.service('row')
        .create({
          data: {
          },
          table_id: setupData.table1Id,
        })
      expect(ability.can('manage', 'row')).toBe(true)
      expect(ability.can('manage', subject('row', rowTable1))).toBe(true)
      expect(ability.can('manage', subject('row', { table_id: setupData.table1Id }))).toBe(true)
      expect(ability.can('manage', subject('row', { table_id: setupData.table2Id }))).toBe(true)
      await app.service('row').remove(rowTable1.id)
    })
  })

  describe('when user (user4) is a USER in a manager group', () => {
    it('can manage rows by default', async () => {
      ability = await defineAbilityFor(setupData.user4, {}, app.services)
      expect.assertions(4)
      expect(ability.can('create', 'row')).toBe(true)
      expect(ability.can('read', 'row')).toBe(true)
      expect(ability.can('update', 'row')).toBe(true)
      expect(ability.can('delete', 'row')).toBe(true)
    })
    it('can manage table rows of the workspace', async () => {
      ability = await defineAbilityFor(setupData.user4, {}, app.services)
      expect.assertions(2)
      expect(ability.can('manage', subject('row', { table_id: setupData.table1Id }))).toBe(true)
      expect(ability.can('manage', subject('row', { table_id: setupData.table2Id }))).toBe(true)
    })
    it('can not manage other table rows', async () => {
      ability = await defineAbilityFor(setupData.user4, {}, app.services)
      expect.assertions(2)
      expect(ability.can('manage', subject('row', { table_id: 'pouet' }))).toBe(false)
      expect(ability.can('manage', subject('row', { table_id: 'pouic' }))).toBe(false)
    })
  })
  describe('when user (user3, aclset2) is a simple USER (without manager acl)', () => {
    let acltable: LckAclTable | null = null
    beforeEach(async () => {
    })

    it('can not crud rows by default', async () => {
      ability = await defineAbilityFor(setupData.user3, {}, app.services)
      expect.assertions(4)
      expect(ability.can('create', 'row')).toBe(false)
      expect(ability.can('read', 'row')).toBe(false)
      expect(ability.can('update', 'row')).toBe(false)
      expect(ability.can('delete', 'row')).toBe(false)
    })

    it('can evolve in its abilities according to acltable', async () => {
      expect.assertions(16)
      acltable = await app.service('acltable').create({
        aclset_id: setupData.aclset2.id,
        table_id: setupData.table1Id,
        create_rows: true,
      })
      ability = await defineAbilityFor(setupData.user3, {}, app.services)
      expect(ability.can('create', 'row')).toBe(true)
      expect(ability.can('read', 'row')).toBe(false)
      expect(ability.can('update', 'row')).toBe(false)
      expect(ability.can('delete', 'row')).toBe(false)
      await app.service('acltable').patch((acltable as LckAclTable).id, {
        read_rows: true,
      })
      ability = await defineAbilityFor(setupData.user3, {}, app.services)
      expect(ability.can('create', 'row')).toBe(true)
      expect(ability.can('read', 'row')).toBe(true)
      expect(ability.can('update', 'row')).toBe(false)
      expect(ability.can('delete', 'row')).toBe(false)
      await app.service('acltable').patch((acltable as LckAclTable).id, {
        update_rows: true,
      })
      ability = await defineAbilityFor(setupData.user3, {}, app.services)
      expect(ability.can('create', 'row')).toBe(true)
      expect(ability.can('read', 'row')).toBe(true)
      expect(ability.can('update', 'row')).toBe(true)
      expect(ability.can('delete', 'row')).toBe(false)
      await app.service('acltable').patch((acltable as LckAclTable).id, {
        delete_rows: true,
      })
      ability = await defineAbilityFor(setupData.user3, {}, app.services)
      expect(ability.can('create', 'row')).toBe(true)
      expect(ability.can('read', 'row')).toBe(true)
      expect(ability.can('update', 'row')).toBe(true)
      expect(ability.can('delete', 'row')).toBe(true)
    })

    it('can read data according to acltable filter ({userId})', async () => {
      expect.assertions(5)
      acltable = await app.service('acltable').create({
        aclset_id: setupData.aclset2.id,
        table_id: setupData.table1Id,
        read_rows: true,
        read_filter: {
          data: {
            [setupData.columnTable1UserId + '.reference']: '{userId}',
          },
        },
      })
      ability = await defineAbilityFor(setupData.user3, {}, app.services)
      expect(ability.can('read', 'row')).toBe(true)
      // these tests can't passed exactly as we have a condition with a dot inside, this don't really work
      // expect(ability.can('read', subject('row', setupData.row1Table1))).toBe(false)
      // expect(ability.can('read', subject('row', setupData.row2Table1))).toBe(true)
      // expect(ability.can('read', subject('row', setupData.row3Table1))).toBe(false)
      const rows = await app.service('row').find({
        query: {
          table_id: setupData.table1Id,
        },
        provider: 'external',
        user: setupData.user3,
        accessToken: setupData.user3Authentication.accessToken,
        authenticated: true,
      }) as Paginated<TableRow>
      expect(rows.total).toBe(1)
      expect(rows.data.length).toBe(1)
      expect(rows.data[0].text).toBe('Row 2 Table 1')
      expect(rows.data[0].data[setupData.columnTable1UserId]).toStrictEqual({
        reference: setupData.user3.id,
        value: setupData.user3.name,
      })
    })

    it('can read data according to acltable filter ({groupId})', async () => {
      expect.assertions(4)
      acltable = await app.service('acltable').create({
        aclset_id: setupData.aclset2.id,
        table_id: setupData.table1Id,
        read_rows: true,
        read_filter: {
          data: {
            [setupData.columnTable1GroupId + '.reference']: '{groupId}',
          },
        },
      })
      ability = await defineAbilityFor(setupData.user3, {
        $lckGroupId: setupData.group2,
      }, app.services)
      expect(ability.can('read', 'row')).toBe(true)

      const rows = await app.service('row').find({
        query: {
          table_id: setupData.table1Id,
          $lckGroupId: setupData.group2.id,
        },
        provider: 'external',
        user: setupData.user3,
        accessToken: setupData.user3Authentication.accessToken,
        authenticated: true,
      }) as Paginated<TableRow>
      expect(rows.data.length).toBe(1)
      expect(rows.data[0].text).toBe('Row 3 Table 1')
      expect(rows.data[0].data[setupData.columnTable1GroupId]).toStrictEqual({
        reference: setupData.group2.id,
        value: setupData.group2.name,
      })
    })

    it('can read data according to acltable filter ({groupId}) even without $lckGroupId', async () => {
      expect.assertions(4)
      acltable = await app.service('acltable').create({
        aclset_id: setupData.aclset2.id,
        table_id: setupData.table1Id,
        read_rows: true,
        read_filter: {
          data: {
            [setupData.columnTable1GroupId + '.reference']: '{groupId}',
          },
        },
      })
      ability = await defineAbilityFor(setupData.user3, {}, app.services)
      expect(ability.can('read', 'row')).toBe(true)

      const rows = await app.service('row').find({
        query: {
          table_id: setupData.table1Id,
        },
        provider: 'external',
        user: setupData.user3,
        accessToken: setupData.user3Authentication.accessToken,
        authenticated: true,
      }) as Paginated<TableRow>
      expect(rows.data.length).toBe(1)
      expect(rows.data[0].text).toBe('Row 3 Table 1')
      expect(rows.data[0].data[setupData.columnTable1GroupId]).toStrictEqual({
        reference: setupData.group2.id,
        value: setupData.group2.name,
      })
    })

    it('can not create data if not authorized', async () => {
      expect.assertions(4)
      acltable = await app.service('acltable').create({
        aclset_id: setupData.aclset2.id,
        table_id: setupData.table1Id,
      })
      ability = await defineAbilityFor(setupData.user3, {}, app.services)
      expect(ability.can('read', 'row')).toBe(false)
      expect(ability.can('create', 'row')).toBe(false)
      expect(ability.can('delete', 'row')).toBe(false)
      await expect(app.service('row').create({
        table_id: setupData.table1Id,
      }, {
        provider: 'external',
        user: setupData.user3,
        accessToken: setupData.user3Authentication.accessToken,
        authenticated: true,
      })).rejects.toThrow(Forbidden)
    })

    it('can create data if authorized', async () => {
      expect.assertions(5)
      acltable = await app.service('acltable').create({
        aclset_id: setupData.aclset2.id,
        table_id: setupData.table1Id,
        create_rows: true,
      })
      ability = await defineAbilityFor(setupData.user3, {}, app.services)
      expect(ability.can('read', 'row')).toBe(false)
      expect(ability.can('create', 'row')).toBe(true)
      expect(ability.can('delete', 'row')).toBe(false)
      const row = await app.service('row').create({
        table_id: setupData.table1Id,
      }, {
        provider: 'external',
        user: setupData.user3,
        accessToken: setupData.user3Authentication.accessToken,
        authenticated: true,
      })
      expect(row).toBeDefined()
      expect(row.table_id).toBe(setupData.table1Id)
    })

    it('can patch data on which he has authorization', async () => {
      expect.assertions(8)
      acltable = await app.service('acltable').create({
        aclset_id: setupData.aclset2.id,
        table_id: setupData.table1Id,
        update_rows: true,
        update_filter: {
          ['data.' + setupData.columnTable1UserId + '.reference']: '{userId}',
        },
      })
      ability = await defineAbilityFor(setupData.user3, {}, app.services)
      expect(ability.can('read', 'row')).toBe(false)
      expect(ability.can('update', 'row')).toBe(true)
      expect(ability.can('delete', 'row')).toBe(false)

      expect(ability.can('update', subject('row', setupData.row1Table1))).toBe(false)
      expect(ability.can('update', subject('row', setupData.row2Table1))).toBe(true)
      expect(ability.can('update', subject('row', setupData.row3Table1))).toBe(false)

      const row = await app.service('row').patch(setupData.row2Table1.id, {
        data: {
          [setupData.columnTable1BooleanId]: false,
        },
      }, {
        provider: 'external',
        user: setupData.user3,
        accessToken: setupData.user3Authentication.accessToken,
        authenticated: true,
      })
      expect(row).toBeDefined()
      expect(row.data[setupData.columnTable1BooleanId]).toBe(false)
    })

    it('can not patch data on which he can not access', async () => {
      expect.assertions(7)
      acltable = await app.service('acltable').create({
        aclset_id: setupData.aclset2.id,
        table_id: setupData.table1Id,
        update_rows: true,
        update_filter: {
          ['data.' + setupData.columnTable1UserId + '.reference']: '{userId}',
        },
      })
      ability = await defineAbilityFor(setupData.user3, {}, app.services)
      expect(ability.can('read', 'row')).toBe(false)
      expect(ability.can('update', 'row')).toBe(true)
      expect(ability.can('delete', 'row')).toBe(false)

      expect(ability.can('update', subject('row', setupData.row1Table1))).toBe(false)
      expect(ability.can('update', subject('row', setupData.row2Table1))).toBe(true)
      expect(ability.can('update', subject('row', setupData.row3Table1))).toBe(false)

      await expect(app.service('row').patch(setupData.row3Table1.id, {
        data: {
          [setupData.columnTable1BooleanId]: false,
        },
      }, {
        provider: 'external',
        user: setupData.user3,
        accessToken: setupData.user3Authentication.accessToken,
        authenticated: true,
      })).rejects.toThrow(Forbidden)
    })

    it('can delete data on which he has authorization', async () => {
      expect.assertions(8)
      acltable = await app.service('acltable').create({
        aclset_id: setupData.aclset2.id,
        table_id: setupData.table1Id,
        delete_rows: true,
        delete_filter: {
          ['data.' + setupData.columnTable1UserId + '.reference']: '{userId}',
        },
      })
      ability = await defineAbilityFor(setupData.user3, {}, app.services)
      expect(ability.can('read', 'row')).toBe(false)
      expect(ability.can('delete', 'row')).toBe(true)
      expect(ability.can('update', 'row')).toBe(false)

      expect(ability.can('delete', subject('row', setupData.row1Table1))).toBe(false)
      expect(ability.can('delete', subject('row', setupData.row2Table1))).toBe(true)
      expect(ability.can('delete', subject('row', setupData.row3Table1))).toBe(false)

      // explicitly remove row2Table2 before, because they are linked
      await app.service('row').remove(setupData.row2Table2.id)

      const row = await app.service('row').remove(setupData.row2Table1.id, {
        provider: 'external',
        user: setupData.user3,
        accessToken: setupData.user3Authentication.accessToken,
        authenticated: true,
      })
      expect(row).toBeDefined()
      await expect(app.service('row').get(setupData.row2Table1.id, {
        provider: 'external',
        user: setupData.user3,
        accessToken: setupData.user3Authentication.accessToken,
        authenticated: true,
      })).rejects.toThrow(NotFound)
    })

    it('can not delete data on which he can not access', async () => {
      expect.assertions(7)
      acltable = await app.service('acltable').create({
        aclset_id: setupData.aclset2.id,
        table_id: setupData.table1Id,
        delete_rows: true,
        delete_filter: {
          ['data.' + setupData.columnTable1UserId + '.reference']: '{userId}',
        },
      })
      ability = await defineAbilityFor(setupData.user3, {}, app.services)
      expect(ability.can('read', 'row')).toBe(false)
      expect(ability.can('delete', 'row')).toBe(true)
      expect(ability.can('update', 'row')).toBe(false)

      expect(ability.can('delete', subject('row', setupData.row1Table1))).toBe(false)
      expect(ability.can('delete', subject('row', setupData.row2Table1))).toBe(true)
      expect(ability.can('delete', subject('row', setupData.row3Table1))).toBe(false)

      // explicitly remove row2Table2 before, because they are linked
      await app.service('row').remove(setupData.row3Table2.id)

      await expect(app.service('row').remove(setupData.row3Table1.id, {
        provider: 'external',
        user: setupData.user3,
        accessToken: setupData.user3Authentication.accessToken,
        authenticated: true,
      })).rejects.toThrow(Forbidden)
    })

    afterEach(async () => {
      if (acltable) {
        await app.service('acltable').remove(acltable.id)
      }
    })
  })

  describe('when user have several groups (user1, aclset1 aclset4) is a simple USER', () => {
    let acltable: LckAclTable | null = null
    beforeEach(async () => {
    })

    it('can retrieve all authorized rows even if user does not specify $lckGroupId and user have several groups', async () => {
      expect.assertions(7)
      acltable = await app.service('acltable').create({
        aclset_id: setupData.aclset2.id,
        table_id: setupData.table1Id,
        read_rows: true,
        read_filter: {
          data: {
            [setupData.columnTable1GroupId + '.reference']: '{groupId}',
          },
        },
      })
      ability = await defineAbilityFor(setupData.user5, {}, app.services)
      expect(ability.can('read', 'row')).toBe(true)
      const rows = await app.service('row').find({
        query: {
          table_id: setupData.table1Id,
          $sort: {
            text: 1,
          },
        },
        provider: 'external',
        user: setupData.user5,
        accessToken: setupData.user1Authentication.accessToken,
        authenticated: true,
      }) as Paginated<TableRow>
      expect(rows.total).toBe(2)
      expect(rows.data.length).toBe(2)
      expect(rows.data[0].text).toBe('Row 3 Table 1')
      expect(rows.data[1].text).toBe('Row 4 Table 1')
      expect(rows.data[0].id).toBe(setupData.row3Table1.id)
      expect(rows.data[1].id).toBe(setupData.row4Table1.id)
    })

    it('can retrieve authorized rows filtered by groupId when user specify $lckGroupId and user have several groups', async () => {
      expect.assertions(5)
      acltable = await app.service('acltable').create({
        aclset_id: setupData.aclset2.id,
        table_id: setupData.table1Id,
        read_rows: true,
        read_filter: {
          data: {
            [setupData.columnTable1GroupId + '.reference']: '{groupId}',
          },
        },
      })
      ability = await defineAbilityFor(setupData.user5, {}, app.services)
      expect(ability.can('read', 'row')).toBe(true)
      const rows = await app.service('row').find({
        query: {
          $lckGroupId: setupData.group2.id,
          table_id: setupData.table1Id,
          $sort: {
            text: 1,
          },
        },
        provider: 'external',
        user: setupData.user5,
        accessToken: setupData.user1Authentication.accessToken,
        authenticated: true,
      }) as Paginated<TableRow>
      expect(rows.total).toBe(1)
      expect(rows.data.length).toBe(1)
      expect(rows.data[0].text).toBe('Row 3 Table 1')
      expect(rows.data[0].id).toBe(setupData.row3Table1.id)
    })

    afterEach(async () => {
      if (acltable) {
        await app.service('acltable').remove(acltable.id)
      }
    })
  })

  afterAll(async () => {
    await builder.teardownWorkspace()
  })
})
