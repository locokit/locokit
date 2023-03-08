import { authenticate } from '@feathersjs/authentication'
import { Forbidden } from '@feathersjs/errors'
import { HookContext } from '@feathersjs/feathers'
import { hooks as schemaHooks } from '@feathersjs/schema'
import { USER_PROFILE } from '@locokit/definitions'
import { Id } from 'objection'
import { transaction } from '@/feathers-objection'
import { UserResult } from '@/services/auth/user/user.schema'
import { workspaceQueryValidator, workspaceResolvers } from './core-workspace.resolver'
// import { workspaceDataValidator } from './core-workspace.schema'

export const workspaceHooks = {
  around: {
    all: [
      // schemaHooks.resolveExternal(workspaceResolvers.dispatch),
      // schemaHooks.validateData(workspaceDataValidator),
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
      schemaHooks.resolveData(workspaceResolvers.data.create),
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

      /**
       * Remove the dedicated schema
       */
      async function removeDedicatedSchema(context: HookContext) {
        /**
         * Execution of the createWorkspaceSchema function
         */

        const knex = transaction.getKnex(context)
        await knex
          .raw('SELECT core."dropWorkspaceSchema"(?)', context.id as Id)
          .transacting(context.params.transaction.trx)
      },
    ],
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
    remove: [transaction.end()],
  },
  error: {
    all: [transaction.rollback()],
  },
}
