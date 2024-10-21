import { type DB_TYPE } from '@locokit/definitions'

/**
 * Try to convert a SQL Type to a JSON one
 *
 * @param sqlType String of a db type
 * @returns a default JSON type
 */
export function getJSONTypeFromSQLType(sqlType: DB_TYPE) {
  const arrayDeep = (sqlType.match(/\[\]/g) || []).length
  if (arrayDeep > 0) return 'string'

  switch (sqlType) {
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
      return 'string'
    case 'date':
      return 'date'
    default:
      if (process.env.NODE_ENV === 'production') return 'string'
      throw new Error(`Type ${sqlType} unknown, please find a conversion type first.`)
  }
}
