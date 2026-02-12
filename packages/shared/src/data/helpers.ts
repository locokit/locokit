import { pgDbTypes } from './ds/pg'
import { sqliteDbTypes } from './ds/sqlite'
import { LocoKitFieldTypeId, FIELD_TYPE } from './fields'

export type DB_TYPE = pgDbTypes | sqliteDbTypes
export type DB_DIALECT = 'pg' | 'sqlite3'

export function convertDBTypeToFieldType(
  dbDialect: DB_DIALECT,
  dbType: DB_TYPE | undefined,
  primary: boolean = false,
): LocoKitFieldTypeId {
  if (!dbDialect) throw new Error('Dialect undefined.')
  if (!dbType) throw new Error('Data type undefined.')

  const arrayDeep = (dbType.match(/\[\]/g) || []).length
  if (arrayDeep > 0) return FIELD_TYPE.NATIVE

  switch (dbDialect) {
    /**
     * Check https://www.postgresql.org/docs/current/datatype.html
     */
    case 'pg':
      // we lower the db type as it can be sometimes UPPERCASE
      switch (dbType.toLowerCase() as pgDbTypes) {
        /**
         * Boolean fields
         */
        case 'boolean':
          return FIELD_TYPE.BOOLEAN

        /**
         * Date fields
         */
        case 'date':
          return FIELD_TYPE.DATE
        case 'timestamp':
        case 'timestamp without time zone':
        case 'timestamp with time zone':
        case 'timestamptz':
          return FIELD_TYPE.DATETIME

        /**
         * Numeric fields
         */
        case 'smallint':
        case 'integer':
        case 'bigint':
          return primary ? FIELD_TYPE.ID_NUMBER : FIELD_TYPE.NUMBER
        case 'numeric':
          return FIELD_TYPE.FLOAT

        /**
         * String fields
         */
        case 'character':
        case 'character varying':
          return FIELD_TYPE.STRING
        case 'text':
          return FIELD_TYPE.TEXT

        /**
         * Geometry fields
         */
        case 'geometry':
        case 'geography':
          return FIELD_TYPE.GEOMETRY
        case 'point':
          return FIELD_TYPE.GEOMETRY_POINT
        case 'line':
          return FIELD_TYPE.GEOMETRY_LINESTRING
        case 'polygon':
          return FIELD_TYPE.GEOMETRY_POLYGON
        case 'multipoint':
          return FIELD_TYPE.GEOMETRY_MULTIPOINT
        case 'multiline':
          return FIELD_TYPE.GEOMETRY_MULTILINESTRING
        case 'multipolygon':
          return FIELD_TYPE.GEOMETRY_MULTIPOLYGON

        /**
         * Other types
         */
        case 'jsonb':
          return FIELD_TYPE.JSON
        case 'inet':
          return FIELD_TYPE.NETWORK
        case 'uuid':
          return primary ? FIELD_TYPE.ID_UUID : FIELD_TYPE.UUID

        /**
         * Array types
         */
        case '_text':
        case 'text[]':
          return FIELD_TYPE.ARRAY_TEXT
        case '_uuid':
        case 'uuid[]':
          return FIELD_TYPE.ARRAY_UUID
        case '_boolean':
          return FIELD_TYPE.ARRAY_BOOLEAN
        case '_integer':
          return FIELD_TYPE.ARRAY_NUMBER
        case '_date':
          return FIELD_TYPE.ARRAY_DATE

        default:
          if (process.env.NODE_ENV === 'production') {
            console.warn('New data type found without matching field type : ' + dbType)
            return FIELD_TYPE.STRING
          }
      }
      break
    /**
     * Check https://www.sqlite.org/datatype3.html
     */
    case 'sqlite3':
      switch (dbType as sqliteDbTypes) {
        case 'bool':
          return FIELD_TYPE.BOOLEAN
        case 'datetime':
          return FIELD_TYPE.DATETIME
        case 'date':
          return FIELD_TYPE.DATE
        case 'smallintunsigned':
        case 'integer':
          return FIELD_TYPE.NUMBER
        case 'decimal':
        case 'float':
          return FIELD_TYPE.FLOAT
        case 'varchar':
          return FIELD_TYPE.STRING
        case 'text':
          return FIELD_TYPE.TEXT
        default:
          if (process.env.NODE_ENV === 'production') {
            console.warn('New data type found without matching field type : ' + dbType)
            return FIELD_TYPE.STRING
          }
          throw new Error('New data type found without matching field type : ' + dbType)
      }
    default:
      throw new Error(`New dialect found without matching : ${dbDialect as string}`)
  }

  throw new Error(`No matching found for dialect ${dbDialect} and type ${dbType}`)
}
