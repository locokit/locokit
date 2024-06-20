import { Type } from '@feathersjs/typebox'
import { FIELD_TYPE } from '@locokit/definitions'
import { TableFieldSchema } from '../table-field/table-field.schema'

export function convertLocoKitFieldTypeToTypeboxSchema(locokitField: TableFieldSchema) {
  switch (locokitField.type) {
    case FIELD_TYPE.STRING:
    case FIELD_TYPE.TEXT:
      return Type.String()
    case FIELD_TYPE.DATE:
      return Type.String({
        format: 'date',
      })
    case FIELD_TYPE.DATETIME:
      return Type.String({
        format: 'datetime',
      })
    case FIELD_TYPE.BOOLEAN:
      return Type.Boolean()
    case FIELD_TYPE.NUMBER:
    case FIELD_TYPE.FLOAT:
      return Type.Number()
    case FIELD_TYPE.GEOMETRY:
      return Type.String()

    case FIELD_TYPE.UUID:
    case FIELD_TYPE.ID_UUID:
      return Type.String()

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
