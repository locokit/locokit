import { Model, RelationMappings } from 'objection'
import { TableModel } from '../table/table.model'

/**
 * Policy objection Model
 */
export class WorkspacePolicyTableModel extends Model {
  static readonly model = 'policy-table'

  static readonly tableName = 'policyTable'

  static get relationMappings(): RelationMappings {
    return {
      table: {
        relation: Model.HasOneRelation,
        modelClass: TableModel,
        join: {
          from: 'policyVariable.tableId',
          to: 'table.id',
        },
      },
    }
  }
}
