import { JSONSchema, Model, RelationMappings } from 'objection'
import { TableModel } from '../table/table.model'
import { TableFieldModel } from '../table-field/table-field.model'
import { tableRelationDataSchema } from './table-relation.schema'

export class TableRelationModel extends Model {
  static readonly model = 'tableRelation'

  static readonly tableName = 'tableRelation'

  static get jsonSchema(): JSONSchema {
    return tableRelationDataSchema.definition as unknown as JSONSchema
  }

  static get relationMappings(): RelationMappings {
    return {
      fromTable: {
        relation: Model.BelongsToOneRelation,
        modelClass: TableModel,
        join: {
          from: 'tableRelation.fromTableId',
          to: 'table.id',
        },
      },
      toTable: {
        relation: Model.BelongsToOneRelation,
        modelClass: TableModel,
        join: {
          from: 'tableRelation.toTableId',
          to: 'table.id',
        },
      },
      throughTable: {
        relation: Model.BelongsToOneRelation,
        modelClass: TableModel,
        join: {
          from: 'tableRelation.throughTableId',
          to: 'table.id',
        },
      },
      fromField: {
        relation: Model.BelongsToOneRelation,
        modelClass: TableFieldModel,
        join: {
          from: 'tableRelation.fromFieldId',
          to: 'tableField.id',
        },
      },
      toField: {
        relation: Model.BelongsToOneRelation,
        modelClass: TableFieldModel,
        join: {
          from: 'tableRelation.toFieldId',
          to: 'tableField.id',
        },
      },
      throughField: {
        relation: Model.BelongsToOneRelation,
        modelClass: TableFieldModel,
        join: {
          from: 'tableRelation.throughFieldId',
          to: 'tableField.id',
        },
      },
    }
  }
}
