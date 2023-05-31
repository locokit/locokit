import { Model, RelationMappings } from 'objection'
import { TableModel } from '../table/table.model'

export class DatasourceModel extends Model {
  static readonly model = 'datasource'

  static readonly tableName = 'datasource'

  static get relationMappings(): RelationMappings {
    return {
      tables: {
        relation: Model.HasManyRelation,
        modelClass: TableModel,
        join: {
          from: 'datasource.id',
          to: 'table.datasourceId',
        },
      },
    }
  }
}
