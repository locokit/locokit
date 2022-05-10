/* eslint-disable no-duplicate-case */
import { USER_PROFILE } from '@locokit/lck-glossary'
import { AbilityBuilder, makeAbilityFromRules } from 'feathers-casl'

import { AppAbility, resolveAction } from './definitions'
import { HookContext } from '@feathersjs/feathers'
import { User } from '../models/user.model'
import { ServiceTypes } from '../declarations'
import { iff, IffHook, isProvider } from 'feathers-hooks-common'
import { Usergroup } from '../models/usergroup.model'
import { Forbidden, NotAcceptable } from '@feathersjs/errors'
import { Process } from '../models/process.model'
import { ProcessRun } from '../models/process_run.model'

/**
 * Define abilities for process runs
 * regarding the current hook context.
 *
 * * SUPERADMIN / ADMIN can manage all runs
 * * workspace's managers can manage runs of the workspace they are member of
 * * other users cannot see anything
 *
 * @param context Hook contegroupIdxt, provided by FeathersJS
 * @returns Promise<HookContext>
 */
export async function createAbility (
  user: User,
  services: ServiceTypes,
  method: HookContext['method'],
  processId?: string,
  processRunId?: string,
): Promise<AppAbility> {
  // also see https://casl.js.org/v5/en/guide/define-rules
  const { can, rules } = new AbilityBuilder(AppAbility)

  /**
   * User is anonymous, no permission granted
   */
  switch (user?.profile) {
    /**
     * SUPERADMIN / ADMIN
     * can manage all groups
     */
    case USER_PROFILE.SUPERADMIN:
    case USER_PROFILE.ADMIN:
      can('manage', 'process-run')
      break
    default:
      /**
       * query param workspace_id is mandatory for find operation
       */
      if (method === 'find' && !processId) {
        throw new NotAcceptable('You cannot find process without setting a workspace_id query param.')
      }

      /**
       * If there is a process id,
       * we're on a update/patch/remove request.
       *
       * We'll retrieve workspace_id by trying to retrieve the current item.
       */
      let currentProcessId = processId
      let currentWorkspaceId = null
      if (processRunId) {
        const currentProcessRun = await services['process-run']._get(processRunId) as ProcessRun
        currentProcessId = currentProcessRun.process_id
      }

      if (!currentProcessId) {
        throw new NotAcceptable('Your request cannot be handled. Your run seems not be recognized.')
      } else {
        const currentProcess = await services.process._get(currentProcessId) as Process
        currentWorkspaceId = currentProcess.workspace_id
      }

      /**
       * Check the user have access to this workspace
       */
      const usergroups = await services.usergroup._find({
        query: {
          user_id: user.id,
          $eager: '[group.[aclset.[acltables]]]',
          $joinRelation: '[group.[aclset]]',
          'group:aclset.workspace_id': currentWorkspaceId,
          'group:aclset.manager': true,
        },
        paginate: false,
      }) as Usergroup[]

      if (usergroups.length === 0) {
        throw new Forbidden('You do not have access to this process.')
      }

      /**
       * find all processes for this workspace,
       * and allow the user to manage runs for these processes
       */
      const processes: Process[] = await services.process.find({
        query: {
          workspace_id: currentWorkspaceId,
        },
        paginate: false,
      }) as Process []

      can('manage', 'process-run', {
        process_id: {
          $in: processes.map(p => p.id),
        },
      })
  }

  return makeAbilityFromRules(rules, { resolveAction }) as AppAbility
}

/**
 * Define abilities for processes and runs
 *
 * @param context Hook context, provided by FeathersJS
 * @returns Promise<HookContext>
 */
async function defineAbilities (context: HookContext): Promise<HookContext> {
  const contextData = ['find', 'get'].includes(context.method) ? context.params.query : context.data
  const ability: AppAbility = await createAbility(
    context.params.user as User,
    context.app.services,
    context.method,
    contextData?.process_id,
    context.id as string,
  )
  context.params.ability = ability
  context.params.rules = ability.rules

  return context
}

export function defineAbilitiesIffHook (): IffHook {
  return iff(
    isProvider('external'),
    defineAbilities,
  )
}
