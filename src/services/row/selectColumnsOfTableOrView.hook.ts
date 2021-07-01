// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import { TableColumn } from '../../models/tablecolumn.model'
import { ref, ColumnRef } from 'objection'
import { RowData, TableRow } from '../../models/tablerow.model'

/**
 * Only select columns from table or view,
 * and add geom function to retrieve geojson instead of ewkt
 */
export function selectColumnsOfTableOrTableView (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    /**
     * Only for find / get
     */
    const $select: Array<string | ColumnRef> = ['text', 'table_id', 'createdAt', 'updatedAt']
    context.params._meta.columns.forEach((c: TableColumn) => {
      $select.push(ref(`data:${c.id}`).as(c.id))
    })
    context.params.query = {
      ...context.params.query,
      $select,
    }
    return context
  }
};

/**
 * Rebuild items with a `data` destructured
 *
 * @param items
 * Items to rebuild
 * @param columns
 * Listing of all columns to rebuild
 * @returns
 * An array of all items rebuilt
 */
function rebuild (items: TableRow[], columns: TableColumn[]): Array<Partial<TableRow>> {
  return items.map((d: Record<string, any>) => {
    const newData: Partial<TableRow> = {
      id: d.id,
      text: d.text,
      table_id: d.table_id,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
      ...d.data, // TODO: this need to be removed, but there is a bug after removal in computeLookedUpColumns hook
      data: {},
    }
    columns.forEach((c: TableColumn) => {
      (newData.data as RowData)[c.id] = d.data[c.id]
    })
    return newData
  })
}
/**
 * Build the data object
 */
export function rebuildData (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    if (
      (context.method === 'find' || context.method === 'get') &&
      context.type === 'after'
    ) {
      if (
        context.params.paginate ||
        context.params.paginate === undefined
      ) {
        /**
         * Only for find / get + after hook
         */
        context.result.data = rebuild(context.result.data, context.params._meta.columns)
      } else {
        context.result = rebuild(context.result, context.params._meta.columns)
      }
    }

    return context
  }
};
