import { JSONSchema, Model, RelationMappings } from 'objection'
import { TableModel } from '../table/table.model'
import { tableFieldDataSchema } from './table-field.schema'

export class TableFieldModel extends Model {
  static readonly model = 'tableField'

  static readonly tableName = 'tableField'

  static get jsonSchema(): JSONSchema {
    return tableFieldDataSchema.definition as unknown as JSONSchema
  }

  static get relationMappings(): RelationMappings {
    return {
      table: {
        relation: Model.BelongsToOneRelation,
        modelClass: TableModel,
        join: {
          from: 'tableField.tableId',
          to: 'table.id',
        },
      },
    }
  }
}
