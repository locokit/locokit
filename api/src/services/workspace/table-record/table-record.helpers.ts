import { Type } from '@feathersjs/typebox'
import { FIELD_TYPE } from '@locokit/definitions'
import { TableFieldSchema } from '../table-field/table-field.schema'

export function convertLocoKitFieldTypeToTypeboxSchema(locokitField: TableFieldSchema) {
  switch (locokitField.type) {
    case FIELD_TYPE.NATIVE:
    case FIELD_TYPE.STRING:
    case FIELD_TYPE.TEXT:
      return Type.String()
    case FIELD_TYPE.DATE:
      return Type.String({
        format: 'date',
      })
    case FIELD_TYPE.DATETIME:
      return Type.String({
        format: 'date-time',
      })
    case FIELD_TYPE.BOOLEAN:
      return Type.Boolean()
    case FIELD_TYPE.ID_NUMBER:
    case FIELD_TYPE.NUMBER:
    case FIELD_TYPE.FLOAT:
      return Type.Number()

    case FIELD_TYPE.UUID:
    case FIELD_TYPE.ID_UUID:
      return Type.String({ format: 'uuid' })

    /**
     * Geometry fields
     */
    case FIELD_TYPE.GEOMETRY:
    case FIELD_TYPE.GEOMETRY_POINT:
    case FIELD_TYPE.GEOMETRY_LINESTRING:
    case FIELD_TYPE.GEOMETRY_POLYGON:
    case FIELD_TYPE.GEOMETRY_MULTIPOINT:
    case FIELD_TYPE.GEOMETRY_MULTILINESTRING:
    case FIELD_TYPE.GEOMETRY_MULTIPOLYGON:
      return Type.String()

    /**
     * Array fields
     */
    case FIELD_TYPE.ARRAY_TEXT:
      return Type.Array(Type.String())
    case FIELD_TYPE.ARRAY_UUID:
      return Type.Array(Type.String({ format: 'uuid' }))

    case FIELD_TYPE.ARRAY_DATE:
      return Type.Array(
        Type.String({
          format: 'date',
        }),
      )
    case FIELD_TYPE.ARRAY_BOOLEAN:
      return Type.Array(Type.Boolean())
    case FIELD_TYPE.ARRAY_NUMBER:
      return Type.Array(Type.Number())

    default:
      throw new Error(
        '[' +
          locokitField.slug +
          '] Field type not recognized for validation : ' +
          locokitField.type +
          '/' +
          locokitField.dbType,
      )
  }
}
