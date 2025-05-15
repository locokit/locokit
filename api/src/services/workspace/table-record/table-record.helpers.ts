import { Type } from '@feathersjs/typebox'
import { FIELD_TYPE, Nullable } from '@locokit/definitions'
import { TableFieldSchema } from '../table-field/table-field.schema'

export function convertLocoKitFieldTypeToTypeboxSchema(locokitField: TableFieldSchema) {
  const nullable = locokitField.settings?.nullable
  const defaultType = Type.String()
  let currentType = defaultType
  switch (locokitField.type) {
    case FIELD_TYPE.NATIVE:
    case FIELD_TYPE.STRING:
    case FIELD_TYPE.TEXT:
      //   return Type.String()
      break
    case FIELD_TYPE.DATE:
      currentType = Type.String({
        format: 'date',
      })
      break
    case FIELD_TYPE.DATETIME:
      currentType = Type.String({
        format: 'date-time',
      })
      break
    case FIELD_TYPE.BOOLEAN:
      currentType = Type.Boolean()
      break
    case FIELD_TYPE.ID_NUMBER:
    case FIELD_TYPE.NUMBER:
    case FIELD_TYPE.FLOAT:
      currentType = Type.Number()
      break

    case FIELD_TYPE.UUID:
    case FIELD_TYPE.ID_UUID:
      currentType = Type.String({ format: 'uuid' })
      break

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
      //   return Type.String()
      break

    /**
     * Array fields
     */
    case FIELD_TYPE.ARRAY_TEXT:
      currentType = Type.Array(Type.String())
      break
    case FIELD_TYPE.ARRAY_UUID:
      currentType = Type.Array(Type.String({ format: 'uuid' }))
      break

    case FIELD_TYPE.ARRAY_DATE:
      currentType = Type.Array(
        Type.String({
          format: 'date',
        }),
      )
      break
    case FIELD_TYPE.ARRAY_BOOLEAN:
      currentType = Type.Array(Type.Boolean())
      break
    case FIELD_TYPE.ARRAY_NUMBER:
      currentType = Type.Array(Type.Number())
      break

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

  return nullable ? Nullable(currentType) : currentType
}
