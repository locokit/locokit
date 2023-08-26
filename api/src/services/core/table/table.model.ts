import { Model, RelationMappings } from 'objection'
import { DatasourceModel } from '../datasource/datasource.model'

export class TableModel extends Model {
  static readonly model = 'table'
  static readonly tableName = 'lck_table'

  static get relationMappings(): RelationMappings {
    return {
      datasource: {
        relation: Model.HasOneRelation,
        modelClass: DatasourceModel,
        join: {
          from: 'lck_table.datasourceId',
          to: 'lck_datasource.id',
        },
      },
    }
  }
}
