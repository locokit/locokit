import { KnexAdapterParams } from '@feathersjs/knex'
import { HookContext, HookMap } from '@feathersjs/feathers'
import { ObjectionService } from '@/feathers-objection'
import { hooks as schemaHooks } from '@feathersjs/schema'
import { Application } from '@/declarations'

import {
  GroupData,
  GroupResult,
  GroupQuery,
  groupDataValidator,
  groupQueryValidator,
  groupPatchValidator,
  groupUpdateValidator,
} from './group.schema'
import { groupResolvers } from './group.resolver'
import { authenticate } from '@feathersjs/authentication'
import { UserResult } from '../user/user.schema'

async function checkProfile(context: HookContext) {
  const user: UserResult = context.params.user
  const profile = user.profile

  if (profile === USER_PROFILE.MEMBER)
    throw new Forbidden("You don't have sufficient privilege to create a group.")
}
import { defineRules } from './group.ability'
import { authorize } from 'feathers-casl'
import { Forbidden } from '@feathersjs/errors'

const authorizeHook = authorize({ adapter: '@feathersjs/knex' })

export const groupHooks: HookMap<Application, GroupService> = {
  around: {
    all: [
      authenticate('jwt'),
      schemaHooks.resolveExternal(groupResolvers.dispatch),
      schemaHooks.resolveResult(groupResolvers.result),
    ],
  },
  before: {
    all: [defineRules, authorizeHook],
    find: [
      schemaHooks.validateQuery(groupQueryValidator),
      schemaHooks.resolveQuery(groupResolvers.query),
    ],
    create: [
      checkProfile,
      schemaHooks.validateData(groupDataValidator),
      schemaHooks.resolveData(groupResolvers.data.create),
    ],
    patch: [
      checkProfile,
      schemaHooks.validateData(groupPatchValidator),
      schemaHooks.resolveData(...groupResolvers.data.patch),
    ],
    update: [
      checkProfile,
      schemaHooks.validateData(groupUpdateValidator),
      schemaHooks.resolveData(...groupResolvers.data.update),
    ],
    remove: [],
  },
  after: {},
  error: {},
}

export interface GroupParams extends KnexAdapterParams<GroupQuery> {}

// By default, calls the standard Knex adapter service methods but can be customized with your own functionality.
export class GroupService extends ObjectionService<GroupResult, GroupData, GroupParams> {}
