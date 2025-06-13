import { Model, RelationMappings } from 'objection'
import { WorkspacePolicyModel } from '../policy/policy.model'

/**
 * Policy objection Model
 */
export class WorkspaceGroupPolicyVariableModel extends Model {
  static readonly model = 'group-policy-variable'

  static readonly tableName = 'groupPolicyVariable'

  static get relationMappings(): RelationMappings {
    return {
      policy: {
        relation: Model.HasOneRelation,
        modelClass: WorkspacePolicyModel,
        join: {
          from: 'groupPolicyVariable.policyId',
          to: 'policy.id',
        },
      },
    }
  }
}
