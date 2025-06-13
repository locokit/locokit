import { KnexAdapterParams } from '@feathersjs/knex'
import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  UserGroupData,
  UserGroupResult,
  UserGroupQuery,
  workspaceUserGroupPolicyVariableDataValidator,
  workspaceUserGroupPolicyVariablePatchValidator,
  workspaceUserGroupPolicyVariableQueryValidator,
} from './user-group-policy-variable.schema'
import { workspaceUserGroupPolicyVariableResolvers } from './user-group-policy-variable.resolver'
import { Application } from '@/declarations'
import { authenticate } from '@feathersjs/authentication'
import { ObjectionService } from '@/feathers-objection'
import { USER_PROFILE } from '@locokit/definitions'
import { HookMap } from '@feathersjs/feathers'
import { checkUserHasAccess } from '@/hooks/profile.hooks'

export const workspaceUserGroupPolicyVariableHooks: HookMap<
  Application,
  WorkspaceUserGroupPolicyVariableService
> = {
  around: {
    all: [
      authenticate('jwt'),
      schemaHooks.resolveExternal(workspaceUserGroupPolicyVariableResolvers.dispatch),
      schemaHooks.resolveResult(workspaceUserGroupPolicyVariableResolvers.result),
    ],
  },
  before: {
    all: [
      checkUserHasAccess({
        allowedProfile: [USER_PROFILE.ADMIN, USER_PROFILE.CREATOR],
        internalProvider: true,
        internalProviderProfileCheck: 'IF_USER_PROVIDED',
      }),
    ],
    find: [
      schemaHooks.validateQuery(workspaceUserGroupPolicyVariableQueryValidator),
      schemaHooks.resolveQuery(workspaceUserGroupPolicyVariableResolvers.query),
    ],
    create: [
      schemaHooks.validateData(workspaceUserGroupPolicyVariableDataValidator),
      schemaHooks.resolveData(workspaceUserGroupPolicyVariableResolvers.data.create),
    ],
    patch: [
      schemaHooks.validateData(workspaceUserGroupPolicyVariablePatchValidator),
      schemaHooks.resolveData(workspaceUserGroupPolicyVariableResolvers.data.patch),
    ],
    update: [
      schemaHooks.validateData(workspaceUserGroupPolicyVariableDataValidator),
      schemaHooks.resolveData(workspaceUserGroupPolicyVariableResolvers.data.update),
    ],
  },
  after: {},
  error: {},
}

export interface UserGroupParams extends KnexAdapterParams<UserGroupQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class WorkspaceUserGroupPolicyVariableService extends ObjectionService<
  UserGroupResult,
  UserGroupData,
  UserGroupParams
> {}
