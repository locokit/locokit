import { NotAcceptable } from '@feathersjs/errors'
import { Hook, HookContext } from '@feathersjs/feathers'
import { COLUMN_TYPE } from '@locokit/lck-glossary'

import { TableColumn } from '../../models/tablecolumn.model'

/**
 * Hook checking the column definition.
 */
export function checkColumnDefinition (): Hook {
  return async (context: HookContext<TableColumn>): Promise<HookContext> => {
    if (!context.data) return context

    let columnTypeId: number | undefined

    if (context.method === 'create') {
      columnTypeId = context.data.column_type_id
    } else if (context.method === 'patch') {
      columnTypeId = context.params._meta?.item.column_type_id
    }

    if (!columnTypeId) throw new NotAcceptable('Invalid column: the column type id is missing.')

    switch (columnTypeId) {
      case COLUMN_TYPE.LOOKED_UP_COLUMN:
        // Prevent a LOOKED_UP_COLUMN to target a VIRTUAL_LOOKED_UP_COLUMN
        if (context.data.settings?.foreignField) {
          const foreignColumn = await context.app.service('column').get(
            context.data.settings.foreignField,
          ) as TableColumn
          if (foreignColumn.column_type_id === COLUMN_TYPE.VIRTUAL_LOOKED_UP_COLUMN) {
            throw new NotAcceptable('Invalid column: a looked-up column could not target a virtual looked-up column.')
          }
        }
        break
      case COLUMN_TYPE.VIRTUAL_LOOKED_UP_COLUMN:
      case COLUMN_TYPE.FORMULA:
        // Prevent the column to be used as reference
        if (context.data.reference) {
          throw new NotAcceptable('Invalid column: it can not be used as row reference.')
        }
        break
    }
    return context
  }
}
