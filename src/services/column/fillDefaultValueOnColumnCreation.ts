import { GeneralError } from '@feathersjs/errors'
import { Hook, HookContext } from '@feathersjs/feathers'
import { COLUMN_TYPE } from '@locokit/lck-glossary'

import { TableColumn } from '../../models/tablecolumn.model'

/**
 * Hook setting a default value for the rows related to the created column
 */
export function fillDefaultValueOnColumnCreation (): Hook {
  return async (context: HookContext<TableColumn>): Promise<HookContext> => {
    // Only set a default value on valid creation
    if (context.method === 'create' && context.result) {
      let defaultValue: string | boolean | number | undefined
      switch (context.result.column_type_id) {
        case COLUMN_TYPE.BOOLEAN:
          // A boolean value is false by default except if we specified a default value in the settings column
          defaultValue = context.result.settings?.default === true
          break
        default:
          return context
      }
      if (defaultValue !== undefined) {
        // Update all rows of the table related to the created column
        try {
          await context.app.service('row')._patch(null, {
            [`data:${context.result.id as string}`]: defaultValue,
          },
          {
            query: {
              table_id: context.result.table_id,
            },
            paginate: false,
          })
        } catch (err) {
          // Don't throw an error if there is no row to update
          if (err.code !== 404) {
            throw new GeneralError('An error has been encountered when filling a default value for the rows related to the created column')
          }
        }
      }
    }
    return context
  }
}
