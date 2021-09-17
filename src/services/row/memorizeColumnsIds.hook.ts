import { Hook, HookContext } from '@feathersjs/feathers'

/**
 * Memorize columns ids sent in the row's data.
 * Useful for the after hook historizeDataEvents.
 *
 * We have to memorize them before "completing" data field.
 */
export function memorizeColumnsIds (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    let columnsIdsTransmitted = []
    if (context.data.data) {
      // Get columns specified in the data.data object
      columnsIdsTransmitted = Object.keys(context.data.data || {})
    } else {
      // Get columns specified in the data object with the data prefix (for instance data:columnId)
      for (const currentKey in context.data) {
        const regexResult = currentKey.match(/^data:(.+)$/)
        if (regexResult?.length === 2) {
          columnsIdsTransmitted.push(regexResult[1])
        }
      }
    }
    // Note that the 'columnsIdsTransmitted' variable will also contain the ids of the columns which are automatically
    // computed on the API side and then saved in the database.
    // The 'originalColumnsIdsTransmitted' only contains the ids of the columns effectively sent by the user.
    context.params._meta = {
      ...context.params._meta,
      columnsIdsTransmitted,
      originalColumnsIdsTransmitted: Object.freeze([...columnsIdsTransmitted]),
    }
    return context
  }
};
