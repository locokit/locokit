import { Hook, HookContext } from '@feathersjs/feathers'

/**
 * Memorize columns ids sent in the row's data.
 * Useful for the after hook historizeDataEvents.
 *
 * We have to memorize them before "completing" data field.
 */
export function memorizeColumnsIds (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    context.params._meta = {
      ...context.params._meta,
      columnsIdsTransmitted: Object.keys(context.data.data || {}),
    }
    return context
  }
};
