import { JSONSchema, Model, RelationMappings } from 'objection'
import { WorkspaceDatasourceModel } from '../datasource/datasource.model'
import { TableFieldModel } from '../table-field/table-field.model'
import { TableRelationModel } from '../table-relation/table-relation.model'
import { tableDataSchema } from './table.schema'

export class TableModel extends Model {
  static readonly model = 'table'

  static readonly tableName = 'table'

  static get jsonSchema(): JSONSchema {
    return tableDataSchema.definition as unknown as JSONSchema
  }

  static get relationMappings(): RelationMappings {
    return {
      datasource: {
        relation: Model.HasOneRelation,
        modelClass: WorkspaceDatasourceModel,
        join: {
          from: 'table.datasourceId',
          to: 'datasource.id',
        },
      },
      fields: {
        relation: Model.HasManyRelation,
        modelClass: TableFieldModel,
        join: {
          from: 'table.id',
          to: 'tableField.tableId',
        },
      },
      relations: {
        relation: Model.HasManyRelation,
        modelClass: TableRelationModel,
        join: {
          from: 'table.id',
          to: 'tableRelation.fromTableId',
        },
      },
      lookups: {
        relation: Model.HasManyRelation,
        modelClass: TableRelationModel,
        join: {
          from: 'table.id',
          to: 'tableRelation.toTableId',
        },
      },
    }
  }
}
