import { Hook, HookContext } from '@feathersjs/feathers'
import { COLUMN_TYPE } from '@locokit/lck-glossary'

/**
 * Hook exclusive to create
 * Add default values for single_select fields if not set
 */
export function upsertColumnRelation (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    if (context.result.column_type_id !== COLUMN_TYPE.LOOKED_UP_COLUMN) {
      // console.log('Hook only for LOOKED UP COLUMNS')
      return context
    }

    if (!['create', 'patch'].includes(context.method)) {
      // console.log('Hook only for create or patch method.')
      return context
    }

    /**
     * remove colummn relation if any exist for the column_to_id
     */
    if (context.method === 'patch') {
      await context.app.services.columnrelation._remove(null, {
        query: {
          table_column_to_id: context.result.id,
        },
      })
    }

    /**
     * create the new column relation
     */
    await context.app.services.columnrelation.create({
      table_column_from_id: context.result.settings.foreignField,
      table_column_to_id: context.result.id,
    })

    return context
  }
};
