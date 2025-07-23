import { Model, RelationMappings } from 'objection'
import { WorkspaceGroupModel } from '../group/group.model'
import { WorkspacePolicyVariableModel } from '../policy-variable/policy-variable.model'

/**
 * Policy objection Model
 */
export class WorkspaceGroupPolicyVariableModel extends Model {
  static readonly model = 'group-policy-variable'

  static readonly tableName = 'groupPolicyVariable'

  static get relationMappings(): RelationMappings {
    return {
      policyVariable: {
        relation: Model.HasOneRelation,
        modelClass: WorkspacePolicyVariableModel,
        join: {
          from: 'groupPolicyVariable.policyVariableId',
          to: 'policyVariable.id',
        },
      },
      group: {
        relation: Model.HasOneRelation,
        modelClass: WorkspaceGroupModel,
        join: {
          from: 'groupPolicyVariable.groupId',
          to: 'group.id',
        },
      },
    }
  }
}
