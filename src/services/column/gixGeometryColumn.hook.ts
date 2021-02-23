import { Hook, HookContext } from '@feathersjs/feathers'
import { COLUMN_TYPE } from '@locokit/lck-glossary'
import Knex from 'knex'

function isGeometryColumn (columnType: COLUMN_TYPE): boolean {
  switch (columnType) {
    case COLUMN_TYPE.GEOMETRY_LINESTRING:
    case COLUMN_TYPE.GEOMETRY_POINT:
    case COLUMN_TYPE.GEOMETRY_POLYGON:
      return true
    default:
      return false
  }
}

/**
 * Hook updating data for rows related to the current column,
 * via a table_column_relation
 */
export function createGIX (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    if (
      context.method === 'create' &&
      isGeometryColumn(context.result.column_type_id)
    ) {
      /**
       * Check it's a geometry column
       */
      const uuidTableShort = context.result.table_id.substr(0, context.result.table_id.indexOf('-'))
      const uuidColumnShort = context.result.id.substr(0, context.result.id.indexOf('-'))

      await (context.app.get('knex') as Knex).raw(`
        CREATE INDEX record_table_${uuidTableShort}_field_${uuidColumnShort}
        ON table_row
        USING GIST(ST_GeomFromEWKT(data->>'${context.result.id}'))
        WHERE table_id = '${context.result.table_id}'
      `)
    }
    return context
  }
}

/**
 * Hook updating data for rows related to the current column,
 * via a table_column_relation
 */
export function dropGIX (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    if (
      context.method === 'remove' &&
      isGeometryColumn(context.result.column_type_id)
    ) {
      const uuidTableShort = context.result.table_id.substr(0, context.result.table_id.indexOf('-'))
      const uuidColumnShort = context.result.id.substr(0, context.result.id.indexOf('-'))

      await (context.app.get('knex') as Knex).raw(`
        DROP INDEX record_table_${uuidTableShort}_field_${uuidColumnShort}
      `)
    }
    return context
  }
}
