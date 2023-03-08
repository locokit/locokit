import { Model, RelationMappings } from 'objection'
import { CoreDatasourceModel } from '../datasource/core-datasource.model'

export class CoreTableModel extends Model {
  static readonly model = 'table'
  static readonly tableName = 'lck_table'

  static get relationMappings(): RelationMappings {
    return {
      datasource: {
        relation: Model.HasOneRelation,
        modelClass: CoreDatasourceModel,
        join: {
          from: 'lck_table.datasourceId',
          to: 'lck_datasource.id',
        },
      },
    }
  }
}
