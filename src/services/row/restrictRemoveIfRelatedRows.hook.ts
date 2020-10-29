import { Hook, HookContext } from '@feathersjs/feathers'
import { NotAcceptable } from '@feathersjs/errors'

/**
 * Restrict the removal of a row if there are dependencies on this row
 */
export function restrictRemoveIfRelatedRows () : Hook {
  return async (context: HookContext): Promise<HookContext> => {
    if (context.method === 'remove') {
      // find if there are related rows dependent of the current row (table_row_from_id)
      const matchingRows = await context.app.services.trr.find({
        query: {
          table_row_from_id: context.id
        }
      })
      if (matchingRows.total > 0) {
        throw new NotAcceptable('Can\'t remove current row, related rows are still present')
      }
    } else {
      console.log('restrictRemoveIfRelatedRows is remove only hook')
    }
    return context
  }
}
