import { Model, RelationMappings } from 'objection'
import { TableFieldModel } from '../table-field/table-field.model'

/**
 * Policy objection Model
 */
export class WorkspacePolicyTableFieldModel extends Model {
  static readonly model = 'policy-table-field'

  static readonly tableName = 'policyTableField'

  static get relationMappings(): RelationMappings {
    return {
      tableField: {
        relation: Model.HasOneRelation,
        modelClass: TableFieldModel,
        join: {
          from: 'policyTableField.tableFieldId',
          to: 'tableField.id',
        },
      },
    }
  }
}
