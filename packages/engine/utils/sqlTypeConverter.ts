export function getJSONTypeFromSQLType(sqlType: string) {
  switch (sqlType) {
    case 'jsonb':
      return 'object'
    case 'integer':
      return 'number'
    case 'boolean':
      return 'boolean'
    case 'uuid':
    case 'timestamp with time zone':
    case 'character varying':
    case 'text':
    case 'lck_snake_case':
    default:
      return 'string'
  }
}
