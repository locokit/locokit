import { type DB_TYPE } from '@locokit/definitions'

/**
 * Try to convert a SQL Type to a JSON one for AJV
 *
 * @param sqlType String of a db type
 * @returns a default JSON type
 */
export function getJSONTypeFromSQLType(sqlType: DB_TYPE) {
  const arrayDeep = (sqlType.match(/\[\]/g) || []).length
  if (arrayDeep > 0) return 'array'

  switch (sqlType.toLowerCase()) {
    case 'jsonb':
      return 'object'
    case 'bigint':
    case 'integer':
    case 'decimal':
    case 'numeric':
      return 'number'
    case 'boolean':
    case 'bool':
      return 'boolean'
    case 'uuid':
    case 'timestamp with time zone':
    case 'timestamp without time zone':
    case 'character varying':
    case 'text':
    case 'varchar':
    case 'date':
      return 'string'
    // geometry
    case 'geometry':
    case 'geography':
    case 'point':
    case 'polygon':
    case 'line':
      return 'string'
    default:
      if (process.env.NODE_ENV === 'production') return 'string'
      throw new Error(`Type ${sqlType} unknown, please find a conversion type first.`)
  }
}
