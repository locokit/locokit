export function getJSONTypeFromSQLType(sqlType: string) {
  switch (sqlType) {
    case 'jsonb':
      return 'object'
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
    case 'lck_snake_case':
    case 'varchar':
      return 'string'
    case 'date':
      return 'date'
    default:
      if (process.env.NODE_ENV === 'production') return 'string'
      throw new Error(`Type ${sqlType} unknown, please find a conversion type first.`)
  }
}
