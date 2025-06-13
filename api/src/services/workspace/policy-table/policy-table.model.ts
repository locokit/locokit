import { Model, RelationMappings } from 'objection'
import { WorkspacePolicyModel } from '../policy/policy.model'

/**
 * Policy objection Model
 */
export class WorkspacePolicyTableModel extends Model {
  static readonly model = 'policy-variable'

  static readonly tableName = 'policyVariable'

  static get relationMappings(): RelationMappings {
    return {
      policy: {
        relation: Model.HasOneRelation,
        modelClass: WorkspacePolicyModel,
        join: {
          from: 'policyVariable.policyId',
          to: 'policy.id',
        },
      },
    }
  }
}
