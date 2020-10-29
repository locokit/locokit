import { Hook, HookContext } from '@feathersjs/feathers'
import { COLUMN_TYPE } from '@locokit/lck-glossary'

/**
 * Hook exclusive to create
 * Add default values for single_select fields if not set
 */
export function upsertColumnRelation (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    if (context.method === 'create') {
      if (context.result.column_type_id === COLUMN_TYPE.LOOKED_UP_COLUMN) {
        await context.app.services.columnrelation.create({
          table_column_from_id: context.result.settings.foreignField,
          table_column_to_id: context.result.id
        })
      }
    } else {
      console.log('Hook only for create method. For the moment. Need to think about update / patch methods too.')
    }
    return context
  }
};
