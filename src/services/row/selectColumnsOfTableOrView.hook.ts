// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import { TableColumn } from '../../models/tablecolumn.model'
// import { TableColumnDTO, LckColumnFilter } from '../../models/tableview.model'
// import { COLUMN_TYPE } from '@locokit/lck-glossary'
import { raw, ref, ColumnRef } from 'objection'
import { COLUMN_TYPE } from '@locokit/lck-glossary'
import Knex from 'knex'
const { getItems, replaceItems } = require('feathers-hooks-common')

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

/**
 * Build the data object, and transform geojson in true JSON
 */
export function rebuildDataAndGeom (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    if (
      (context.method === 'find' || context.method === 'get') &&
      context.type === 'after'
    ) {
      /**
       * Only for find / get + after hook
       */
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
    }
    return context
  }
};

/**
 * Transform geojson column in true JSON
 */
export function formatGeomColumnInData (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    if (
      (
        context.method === 'create' ||
        context.method === 'patch' ||
        context.method === 'update'
      ) &&
      context.type === 'after'
    ) {
      /**
       * Only for create / patch / update + after hook
       */
      const items = getItems(context)
      if (Array.isArray(items)) {
        await Promise.all(items.map(async (item) => {
          return await Promise.all(
            context.params._meta.columns.map(async (c: TableColumn) => {
              switch (c.column_type_id) {
                case COLUMN_TYPE.GEOMETRY_LINESTRING:
                case COLUMN_TYPE.GEOMETRY_POLYGON:
                case COLUMN_TYPE.GEOMETRY_POINT:
                  if (item.data[c.id]) {
                    const resultDB = await (context.app.get('knex') as Knex<{ ewkt: string }>).raw(`
                      SELECT ST_AsGeoJSON(ST_GeomFromEWKT('${item.data[c.id]}'::text)) geojson
                    `)
                    item.data[c.id] = JSON.parse(resultDB.rows[0].geojson)
                  }
                  break
              }
            }))
        }))
      } else {
        await Promise.all(
          context.params._meta.columns.map(async (c: TableColumn) => {
            switch (c.column_type_id) {
              case COLUMN_TYPE.GEOMETRY_LINESTRING:
              case COLUMN_TYPE.GEOMETRY_POLYGON:
              case COLUMN_TYPE.GEOMETRY_POINT:
                if (items.data[c.id]) {
                  const resultDB = await (context.app.get('knex') as Knex<{ ewkt: string }>).raw(`
                    SELECT ST_AsGeoJSON(ST_GeomFromEWKT('${items.data[c.id]}'::text)) geojson
                  `)
                  items.data[c.id] = JSON.parse(resultDB.rows[0].geojson)
                }
                break
            }
          }))
      }
      replaceItems(context, items)
    }
    return context
  }
};
