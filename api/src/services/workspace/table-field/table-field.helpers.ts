import { FIELD_TYPE, DB_DIALECT, DB_TYPE } from '@locokit/definitions'

export function convertLocoKitFieldTypeToDBType(
  locokitFieldType: keyof typeof FIELD_TYPE,
  dbDialect: DB_DIALECT,
): DB_TYPE {
  if (!locokitFieldType) throw new Error('No LocoKit field type given in parameters')
  if (!dbDialect) throw new Error('No dialect given in parameters')
  switch (dbDialect) {
    case 'pg':
      switch (locokitFieldType) {
        case FIELD_TYPE.ID_NUMBER:
          return 'integer'
        case FIELD_TYPE.ID_UUID:
          return 'uuid'
        case FIELD_TYPE.SINGLE_SELECT:
        case FIELD_TYPE.STRING:
          return 'character varying'
        case FIELD_TYPE.TEXT:
          return 'text'
        case FIELD_TYPE.DATE:
          return 'date'
        case FIELD_TYPE.DATETIME:
          return 'timestamp with time zone'
        case FIELD_TYPE.BOOLEAN:
          return 'boolean'
        case FIELD_TYPE.NUMBER:
          return 'integer'
        case FIELD_TYPE.FLOAT:
          return 'double'
        case FIELD_TYPE.GEOMETRY:
        case FIELD_TYPE.GEOMETRY_POINT:
        case FIELD_TYPE.GEOMETRY_LINESTRING:
        case FIELD_TYPE.GEOMETRY_POLYGON:
        case FIELD_TYPE.GEOMETRY_MULTIPOINT:
        case FIELD_TYPE.GEOMETRY_MULTILINESTRING:
        case FIELD_TYPE.GEOMETRY_MULTIPOLYGON:
          return 'geometry'
        case FIELD_TYPE.ARRAY_TEXT:
          return '_text'
        case FIELD_TYPE.ARRAY_UUID:
          return '_uuid'
        case FIELD_TYPE.ARRAY_NUMBER:
          return '_integer'
        case FIELD_TYPE.ARRAY_BOOLEAN:
          return '_boolean'
        case FIELD_TYPE.ARRAY_DATE:
          return '_date'

        default:
          throw new Error('Field type not recognized for validation : ' + locokitFieldType)
      }
    case 'sqlite3':
      switch (locokitFieldType) {
        case FIELD_TYPE.SINGLE_SELECT:
        case FIELD_TYPE.STRING:
          return 'varchar'
        case FIELD_TYPE.TEXT:
          return 'text'
        case FIELD_TYPE.DATE:
          return 'date'
        case FIELD_TYPE.DATETIME:
          return 'datetime'
        case FIELD_TYPE.BOOLEAN:
          return 'bool'
        case FIELD_TYPE.NUMBER:
          return 'integer'
        case FIELD_TYPE.FLOAT:
          return 'float'
        case FIELD_TYPE.GEOMETRY:
        case FIELD_TYPE.GEOMETRY_POINT:
        case FIELD_TYPE.GEOMETRY_LINESTRING:
        case FIELD_TYPE.GEOMETRY_POLYGON:
        case FIELD_TYPE.GEOMETRY_MULTIPOINT:
        case FIELD_TYPE.GEOMETRY_MULTILINESTRING:
        case FIELD_TYPE.GEOMETRY_MULTIPOLYGON:
          return 'text'

        default:
          throw new Error('Field type not recognized for validation : ' + locokitFieldType)
      }
    default:
      throw new Error(`${dbDialect as string} : Dialect unknown`)
  }
}
