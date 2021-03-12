// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import { TableColumn } from '../../models/tablecolumn.model'
import { ref, ColumnRef } from 'objection'
import { TableRow } from '../../models/tablerow.model'

/**
 * Only select columns from table or view,
 * and add geom function to retrieve geojson instead of ewkt
 */
export function selectColumnsOfTableOrTableView (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    /**
     * Only for find / get
     */
    const $select: Array<string | ColumnRef> = ['text']
    context.params._meta.columns.forEach((c: TableColumn) => {
      switch (c.column_type_id) {
        default:
          $select.push(ref(`data:${c.id}`).as(c.id))
      }
    })
    context.params.query = {
      ...context.params.query,
      $select,
    }
    return context
  }
};

function rebuild (items: TableRow[], columns: TableColumn[]) {
  return items.map((d: Record<string, any>) => {
    const newData = {
      id: d.id,
      text: d.text,
      data: {} as Record<string, any>,
    }
    columns.forEach((c: TableColumn) => {
      switch (c.column_type_id) {
        default:
          newData.data[c.id] = d[c.id]
      }
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
