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
    } else {
      console.log('removeRelatedRows is remove only hook')
    }
    return context
  }
}
