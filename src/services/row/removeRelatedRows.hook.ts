import { Hook, HookContext } from '@feathersjs/feathers'

/**
 * Clean the related rows for the row deleted
 */
export function removeRelatedRows () : Hook {
  return async (context: HookContext): Promise<HookContext> => {
    if (context.method === 'remove') {
      // remove the related rows pointing to the current row
      const matchingRows = await context.app.services.trr.find({
        query: {
          table_row_to_id: context.id
        }
      })
      if (matchingRows.total > 0) {
        await context.app.services.trr.remove(null, {
          query: {
            table_row_to_id: context.id
          }
        })
      }
    }
    return context
  }
}

export function removeRelatedExecutions () : Hook {
  return async (context: HookContext): Promise<HookContext> => {
    if (context.method === 'remove') {
      // remove the related rows pointing to the current row
      const matchingExecution = await context.app.service('process-run').find({
        query: {
          table_row_id: context.id
        },
        paginate: false
      })
      if (matchingExecution.length > 0) {
        await context.app.service('process-run').remove(null, {
          query: {
            table_row_id: context.id
          }
        })
      }
    }
    return context
  }
}
