import { authenticate } from '@feathersjs/authentication'
import { Forbidden } from '@feathersjs/errors'
import { HookContext } from '@feathersjs/feathers'
import {
  validateData,
  resolveData,
  validateQuery,
  resolveQuery,
  resolveExternal,
} from '@feathersjs/schema'
import { USER_PROFILE } from '@locokit/definitions'
import { UserResult } from '../auth/user/user.schema'
import { workspaceQueryValidator, workspaceResolvers } from './workspace.resolver'
import { workspaceDataValidator } from './workspace.schema'

export const workspaceHooks = {
  around: {
    all: [resolveExternal(workspaceResolvers.dispatch), validateData(workspaceDataValidator)],
  },
  before: {
    get: [authenticate('jwt', 'public')],
    find: [
      authenticate('jwt', 'public'),
      validateQuery(workspaceQueryValidator),
      resolveQuery(workspaceResolvers.query),
    ],
    create: [
      authenticate('jwt'),
      resolveData(workspaceResolvers.data.create),
      async function checkProfile(context: HookContext) {
        const user: UserResult = context.params.user
        const profile = user.profile

        if (profile === USER_PROFILE.MEMBER)
          throw new Forbidden("You don't have sufficient privilege to create a workspace.")
      },
    ],
    patch: [authenticate('jwt')],
    remove: [
      authenticate('jwt'),
      // removeDedicatedWorkspaceSchema,
    ],
  },
  after: {
    get: [resolveData(workspaceResolvers.result)],
    find: [resolveData(workspaceResolvers.result)],
    create: [
      /**
       * Creation of the dedicated schema
       */
      (context: HookContext) => {
        console.log('creation of the dedicated schema', context.app.get('db'))
      },
    ],
  },
  error: {},
}
