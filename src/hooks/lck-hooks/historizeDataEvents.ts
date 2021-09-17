import { NotFound } from '@feathersjs/errors'
import { Hook, HookContext } from '@feathersjs/feathers'

import { Log, LOG_EVENT } from '../../models/log.model'
import { User } from '../../models/user.model'
import { getSubObject } from '../../utils'

/**
 * Historize all events on a row :
 * * which type
 * * who
 * * when
 * * what data
 * * which values (from > to)
 */
export function historizeDataEvents (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    if (
      context.params.provider !== undefined && // External calls
      context.result.id // Single operation
    ) {
      // The log depends on the context method

      // We keep a subset of the previous data (transmitted column(s))
      const log: Partial<Log> | undefined = ((method: string) => {
        switch (method) {
          case 'create':
            return {
              event: LOG_EVENT.RECORD_CREATE,
              record_id: context.result.id,
              to: getSubObject(context.result.data, context.params._meta.originalColumnsIdsTransmitted),
              user_id: context.params.user?.id,
            }
          case 'update':
            return {
              event: LOG_EVENT.RECORD_UPDATE,
              from: getSubObject(context.params._meta.item.data, context.params._meta.originalColumnsIdsTransmitted),
              record_id: context.result.id,
              to: getSubObject(context.result.data, context.params._meta.originalColumnsIdsTransmitted),
              user_id: context.params.user?.id,
            }
          case 'patch':
            return {
              event: LOG_EVENT.RECORD_PATCH,
              field_id: context.params._meta.originalColumnsIdsTransmitted[0],
              from: getSubObject(context.params._meta.item.data, context.params._meta.originalColumnsIdsTransmitted),
              record_id: context.result.id,
              to: getSubObject(context.result.data, context.params._meta.originalColumnsIdsTransmitted),
              user_id: context.params.user?.id,
            }
        }
      })(context.method)

      // Save the specified log
      if (log) {
        if (!context.params._meta) {
          context.params._meta = {}
        }
        context.params._meta.log = await context.app.service('log').create(log)
      }
    }
    return context
  }
}

/**
 * Update existing logs when removing the related user.
 */
export function updateLogsOnUserRemoving (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    if (
      context.params.provider !== undefined && // External calls
      context.method === 'remove' &&
      context.id
    ) {
      try {
        await context.app.service('log').patch(null,
          {
            deleted_user: (context.result as User).email,
          },
          {
            query: {
              user_id: context.id,
              $noSelect: true,
            },
            paginate: false,
          },
        )
      } catch (error) {
        if (!(error instanceof NotFound)) throw error
      }
    }
    return context
  }
}
