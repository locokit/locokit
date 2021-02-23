// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import { TableColumn } from '../../models/tablecolumn.model'
// import { TableColumnDTO, LckColumnFilter } from '../../models/tableview.model'
// import { COLUMN_TYPE } from '@locokit/lck-glossary'
import { raw, ref, ColumnRef } from 'objection'
import { COLUMN_TYPE } from '@locokit/lck-glossary'

/**
 * Add filters depending on the table view wished
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

/**
 * Add filters depending on the table view wished
 */
export function transformGeometryColumnInJSON (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    /**
     * Only for find / get + after hook
     */
    /**
     * Sum up geometry columns
     */
    const geometryColumnsId = context.params._meta.columns.reduce((acc: string[], c: TableColumn) => {
      switch (c.column_type_id) {
        case COLUMN_TYPE.GEOMETRY_LINESTRING:
        case COLUMN_TYPE.GEOMETRY_POLYGON:
        case COLUMN_TYPE.GEOMETRY_POINT:
          acc.push(c.id)
      }
      return acc
    }, [])
    context.result.data = context.result.data.map((d: Record<string, any>) => {
      const newData = {
        id: d.id,
        text: d.text,
        data: {} as Record<string, any>
      }
      context.params._meta.columns.forEach((c: TableColumn) => {
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
    console.log(geometryColumnsId, context.result)
    return context
  }
};
