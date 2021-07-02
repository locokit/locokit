import { Ability, subject } from '@casl/ability'
import { USER_PROFILE } from '@locokit/lck-glossary'
import { defineAbilityFor } from './record.abilities'
import app from '../app'
import { User } from '../models/user.model'

import { builderTestEnvironment } from './helpers'
import { LckAclSet } from '../models/aclset.model'
import { LckAclTable } from '../models/acltable.model'

const builder = builderTestEnvironment()

describe('Records abilities', () => {
  let ability: Ability
  let user
  let setupData: {
    user1: User
    user2: User
    user3: User
    user4: User
    aclset1: LckAclSet
    aclset2: LckAclSet
    aclset3: LckAclSet
    aclset4: LckAclSet
    table1Id: string
    table2Id: string
  }

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

  // describe('when user (user1) is a CREATOR', () => {
  //   beforeEach(async () => {
  //     ability = await defineAbilityFor(user1, app.services)
  //   })

  //   it('can manage workspace (not all, but at least one)', () => {
  //     expect(ability.can('manage', 'workspace')).toBe(true)
  //   })
  //   it('can read workspace', () => {
  //     expect(ability.can('read', 'workspace')).toBe(true)
  //   })
  //   it('can create workspace', () => {
  //     expect(ability.can('create', 'workspace')).toBe(true)
  //   })
  //   it('can read workspace2 & workspace1', () => {
  //     expect.assertions(2)
  //     expect(ability.can('read', workspace1)).toBe(true)
  //     expect(ability.can('read', workspace2)).toBe(true)
  //   })
  //   it('can manage workspace1 but not workspace2', () => {
  //     expect.assertions(2)
  //     expect(ability.can('manage', workspace1)).toBe(true)
  //     expect(ability.cannot('manage', workspace2)).toBe(true)
  //   })
  // })

  // describe('when user (user2) is a simple USER with 2 groups for 2 workspaces', () => {
  //   beforeEach(async () => {
  //     ability = await defineAbilityFor(user2, app.services)
  //   })

  //   it('can not manage a single workspace (USER)', () => {
  //     expect(ability.cannot('manage', 'workspace')).toBe(true)
  //   })
  //   it('can read workspace', () => {
  //     expect(ability.can('read', 'workspace')).toBe(true)
  //   })
  //   it('cannot create workspace', () => {
  //     expect(ability.cannot('create', 'workspace')).toBe(true)
  //   })
  //   it('can read workspace2 & workspace1', () => {
  //     expect.assertions(2)
  //     expect(ability.can('read', workspace1)).toBe(true)
  //     expect(ability.can('read', workspace2)).toBe(true)
  //   })
  //   it('cannot manage workspace2 neither workspace1 because it is a USER', () => {
  //     expect.assertions(2)
  //     expect(ability.cannot('manage', workspace2)).toBe(true)
  //     expect(ability.cannot('manage', workspace1)).toBe(true)
  //   })
  // })

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
  describe('when user (user3, aclset2) is a simple USER ', () => {
    let acltable: LckAclTable
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
      await app.service('acltable').patch(acltable.id, {
        read_rows: true,
      })
      ability = await defineAbilityFor(setupData.user3, {}, app.services)
      expect(ability.can('create', 'row')).toBe(true)
      expect(ability.can('read', 'row')).toBe(true)
      expect(ability.can('update', 'row')).toBe(false)
      expect(ability.can('delete', 'row')).toBe(false)
      await app.service('acltable').patch(acltable.id, {
        update_rows: true,
      })
      ability = await defineAbilityFor(setupData.user3, {}, app.services)
      expect(ability.can('create', 'row')).toBe(true)
      expect(ability.can('read', 'row')).toBe(true)
      expect(ability.can('update', 'row')).toBe(true)
      expect(ability.can('delete', 'row')).toBe(false)
      await app.service('acltable').patch(acltable.id, {
        delete_rows: true,
      })
      ability = await defineAbilityFor(setupData.user3, {}, app.services)
      expect(ability.can('create', 'row')).toBe(true)
      expect(ability.can('read', 'row')).toBe(true)
      expect(ability.can('update', 'row')).toBe(true)
      expect(ability.can('delete', 'row')).toBe(true)
    })

    it('can read data according to acltable filter', () => {

    })

    it('can read data related to its group', () => {

    })

    it('can read data related to its user', () => {

    })

    it('can read data related to createdAt', () => {

    })

    it('can create data if authorized', () => {

    })

    it('can not create data if not authorized', () => {

    })

    it('can update data on which he has authorization', () => {

    })

    it('can not update data on which he can not access', () => {

    })

    it('can delete data on which he has authorization', () => {

    })

    it('can not delete data on which he can not access', () => {

    })

    it('can not manage a single workspace (USER)', () => {
    })
    it('can read workspace', () => {
    })
    it('cannot create workspace', () => {
    })
    it('can read workspace1 but not workspace2', () => {
    })
    it('cannot manage workspace1 neither workspace2 because it is a USER', () => {
    })

    afterAll(async () => {
      await app.service('acltable').remove(acltable.id)
    })
  })

  afterAll(async () => {
    await builder.teardownWorkspace()
  })
})
