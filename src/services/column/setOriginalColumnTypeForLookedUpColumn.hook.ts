import { Hook, HookContext } from '@feathersjs/feathers'
import { COLUMN_TYPE } from '@locokit/lck-glossary'
import { getItems, replaceItems } from 'feathers-hooks-common'
import { TableColumn } from '../../models/tablecolumn.model'

export async function getFirstParentColumn (context: HookContext, columnId: string): Promise<TableColumn> {
  const column = await context.app.service('column')._get(columnId, {}) as TableColumn
  /**
   * If we are still on a LOOKED_UP_COLUMN, we dig a little more
   */
  if (column.column_type_id === COLUMN_TYPE.LOOKED_UP_COLUMN) {
    return getFirstParentColumn(context, column.settings?.foreignField as string)
  } else {
    return column
  }
}

/**
 * Hook updating data for rows related to the current column,
 * via a table_column_relation
 */
export function setOriginalColumnTypeForLookedUpColumn (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    if (
      (context.method === 'find' || context.method === 'get') &&
      context.type === 'after'
    ) {
      /**
       * if we are on a paginated result,
       * or a single element,
       * or a non paginated result
       */
      const items = getItems(context)
      if (Array.isArray(items)) {
        await Promise.all(
          items.map(async (currentItem: TableColumn) => {
            if (currentItem.column_type_id === COLUMN_TYPE.LOOKED_UP_COLUMN) {
              const originalColumn = await getFirstParentColumn(context, currentItem.settings?.foreignField as string)
              currentItem.originalColumn = originalColumn
            }
          })
        )
      } else {
        const currentColumn = items as TableColumn
        if (currentColumn.column_type_id === COLUMN_TYPE.LOOKED_UP_COLUMN) {
          const originalColumn = await getFirstParentColumn(context, currentColumn.settings?.foreignField as string)
          items.originalColumn = originalColumn
        }
      }
      replaceItems(context, items)
    }
    return context
  }
}
