// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import { TableColumn } from '../../models/tablecolumn.model'
// import { TableColumnDTO, LckColumnFilter } from '../../models/tableview.model'
// import { COLUMN_TYPE } from '@locokit/lck-glossary'
import { raw, ref, ColumnRef } from 'objection'
import { COLUMN_TYPE } from '@locokit/lck-glossary'
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
    const $select: (string | ColumnRef)[] = ['text']
    context.params._meta.columns.forEach((c: TableColumn) => {
      switch (c.column_type_id) {
        case COLUMN_TYPE.GEOMETRY_LINESTRING:
        case COLUMN_TYPE.GEOMETRY_POLYGON:
        case COLUMN_TYPE.GEOMETRY_POINT:
          $select.push(raw(`ST_AsGeoJSON(ST_GeomFromEWKT(data->>'${c.id}'::text))`).as(c.id))
          break
        default:
          $select.push(ref(`data:${c.id}`).as(c.id))
      }
    })
    context.params.query = {
      ...context.params.query,
      $select
    }
    return context
  }
};

function rebuild (items: TableRow[], columns: TableColumn[]) {
  return items.map((d: Record<string, any>) => {
    const newData = {
      ...d,
      data: {} as Record<string, any>
    }
    columns.forEach((c: TableColumn) => {
      switch (c.column_type_id) {
        case COLUMN_TYPE.GEOMETRY_LINESTRING:
        case COLUMN_TYPE.GEOMETRY_POLYGON:
        case COLUMN_TYPE.GEOMETRY_POINT:
          if (d[c.id]) {
            newData.data[c.id] = JSON.parse(d[c.id])
          }
          break
        default:
          newData.data[c.id] = d[c.id]
      }
    })
    return newData
  })
}
/**
 * Build the data object, and transform geojson in true JSON
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
