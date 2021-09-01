import { NotFound } from '@feathersjs/errors'
import { Hook, HookContext } from '@feathersjs/feathers'

import { Log, LOG_EVENT } from '../../models/log.model'
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
    if (context.params.provider !== undefined) { // External calls
      // The log depends on the context method
      const log: Partial<Log> | undefined = ((method: string) => {
        switch (method) {
          case 'create':
            return {
              deleted_references: {},
              event: LOG_EVENT.ROW_CREATE,
              record_id: context.result.id,
              to: getSubObject(context.result.data, context.params._meta.originalColumnsIdsTransmitted),
              user_id: context.params.user?.id,
            }
          case 'update':
            return {
              deleted_references: {},
              event: LOG_EVENT.ROW_UPDATE,
              from: getSubObject(context.params._meta.item.data, context.params._meta.originalColumnsIdsTransmitted),
              record_id: context.result.id,
              to: getSubObject(context.result.data, context.params._meta.originalColumnsIdsTransmitted),
              user_id: context.params.user?.id,
            }
          case 'patch':
            return {
              deleted_references: {},
              event: LOG_EVENT.ROW_PATCH,
              field_id: context.params._meta.originalColumnsIdsTransmitted[0],
              from: getSubObject(context.params._meta.item.data, context.params._meta.originalColumnsIdsTransmitted),
              record_id: context.result.id,
              to: getSubObject(context.result.data, context.params._meta.originalColumnsIdsTransmitted),
              user_id: context.params.user?.id,
            }
          case 'remove':
            return {
              deleted_references: {
                record_id: context.result.id,
              },
              event: LOG_EVENT.ROW_REMOVE,
              user_id: context.params.user?.id,
              from: context.result.data,
            }
        }
      })(context.method)

      // Save the specified log
      if (log) context.params._meta.log = await context.app.service('log').create(log)
    }
    return context
  }
}

/**
 * Update existing logs when removing data (field / record).
 */
export function updateLogsOnRemoving (dataKey: 'field_id' | 'record_id'): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    if (
      context.params.provider !== undefined && // External calls
      context.method === 'remove' &&
      context.id
    ) {
      try {
        await context.app.service('log').patch(null, {
          [`deleted_references:${dataKey}`]: context.id,
        }, {
          query: {
            [dataKey]: context.id,
          },
          paginate: false,
        })
      } catch (error) {
        if (!(error instanceof NotFound)) throw error
      }
    }
    return context
  }
}
