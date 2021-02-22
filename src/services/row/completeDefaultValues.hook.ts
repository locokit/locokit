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
      if (!context.data.data) context.data.data = {}
      await Promise.all(
        (context.params._meta.columns as TableColumn[]).map(currentColumnDefinition => {
          if (!context.data.data[currentColumnDefinition.id]) {
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
      )
    }
    return context
  }
};
