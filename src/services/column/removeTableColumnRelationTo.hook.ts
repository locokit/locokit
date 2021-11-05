import { Hook, HookContext } from '@feathersjs/feathers'

/**
 * Hook updating data for rows related to the current column,
 * via a table_column_relation
 */
export function removeTableColumnRelationTo (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    if (context.method === 'remove' && context.type === 'before') {
      const isThereColumnRelation = await context.app.service('columnrelation').find({
        query: {
          table_column_to_id: context.id,
        },
      })
      if (isThereColumnRelation.total > 0) {
        await context.app.service('columnrelation').remove(null, {
          query: {
            table_column_to_id: context.id,
          },
        })
      }
    }
    return context
  }
}
