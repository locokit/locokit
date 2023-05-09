import { authenticate } from '@feathersjs/authentication'
import { Forbidden } from '@feathersjs/errors'
import { HookContext } from '@feathersjs/feathers'
import { hooks as schemaHooks } from '@feathersjs/schema'
import { USER_PROFILE } from '@locokit/definitions'
import { transaction } from '@/feathers-objection'
import { UserResult } from '@/services/core/user/user.schema'
import {
  workspacePatchResolver,
  workspaceQueryValidator,
  workspaceResolvers,
} from './core-workspace.resolver'
import { disallow, iffElse, isProvider } from 'feathers-hooks-common'
import {
  workspaceDataValidator,
  workspaceDataInternalValidator,
  workspacePatchValidator,
} from './core-workspace.schema'

export const workspaceHooks = {
  around: {
    all: [
      // schemaHooks.resolveExternal(workspaceResolvers.dispatch),
      // schemaHooks.validateData(workspaceDataValidator),
      schemaHooks.resolveExternal(),
    ],
  },
  before: {
    all: [transaction.start()],
    get: [authenticate('jwt', 'public')],
    find: [
      authenticate('jwt', 'public'),
      schemaHooks.validateQuery(workspaceQueryValidator),
      schemaHooks.resolveQuery(workspaceResolvers.query),
    ],
    create: [
      authenticate('jwt'),

      /**
       * Check the profile of user if external calls (rest, socketio)
       */
      iffElse(
        isProvider('external'),
        [
          schemaHooks.validateData(workspaceDataValidator),
          async function checkProfile(context: HookContext) {
            const user: UserResult = context.params.user
            const profile = user.profile

            if (profile === USER_PROFILE.MEMBER)
              throw new Forbidden("You don't have sufficient privilege to create a workspace.")
          },
        ],
        [schemaHooks.validateData(workspaceDataInternalValidator)],
      ),

      schemaHooks.resolveData(workspaceResolvers.data.create),
    ],
    update: [disallow()],
    patch: [
      authenticate('jwt'),
      schemaHooks.validateData(workspacePatchValidator),
      schemaHooks.resolveData(workspacePatchResolver),
    ],
    remove: [authenticate('jwt')],
  },
  after: {
    all: [],
    get: [schemaHooks.resolveData(workspaceResolvers.result), transaction.end()],
    find: [schemaHooks.resolveData(workspaceResolvers.result), transaction.end()],
    create: [
      /**
       * Creation of the dedicated schema
       */
      async function createDedicatedSchema(context: HookContext) {
        /**
         * Execution of the createWorkspaceSchema function
         */
        const knex = transaction.getKnex(context)
        await knex
          .raw('SELECT core."createWorkspaceSchema"(?)', context.result.id)
          .transacting(context.params.transaction.trx)
      },
      transaction.end(),
    ],
    patch: [transaction.end()],
    remove: [transaction.end()],
  },
  error: {
    all: [transaction.rollback()],
  },
}
