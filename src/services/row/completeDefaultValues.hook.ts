import { Hook, HookContext } from '@feathersjs/feathers'
import { COLUMN_TYPE } from '@locokit/lck-glossary'
import { TableColumn } from '../../models/tablecolumn.model'

/**
 * Hook exclusive to create
 * Add default values for single_select fields if not set
 */
export function completeDefaultValues (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    if (context.method === 'create') {
      context.data.data = context.data.data || {};
      (context.params._meta.columns as TableColumn[]).forEach(currentColumnDefinition => {
        if (typeof context.data.data[currentColumnDefinition.id] === 'undefined') {
          context.data.data[currentColumnDefinition.id] = null
          switch (currentColumnDefinition.column_type_id) {
            case COLUMN_TYPE.SINGLE_SELECT:
              if (currentColumnDefinition.settings?.default) {
                context.data.data[currentColumnDefinition.id] = currentColumnDefinition.settings.default
              }
              break
          }
        }
      })
    }
    return context
  }
};
