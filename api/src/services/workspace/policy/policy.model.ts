import { Model, RelationMappings } from 'objection'
import { WorkspaceGroupModel } from '../group/group.model'

/**
 * Policy objection Model
 */
export class WorkspacePolicyModel extends Model {
  static readonly model = 'policy'

  static readonly tableName = 'policy'

  static get relationMappings(): RelationMappings {
    return {
      groups: {
        relation: Model.HasManyRelation,
        modelClass: WorkspaceGroupModel,
        join: {
          from: 'policy.id',
          to: 'group.policyId',
        },
      },
    }
  }
}
