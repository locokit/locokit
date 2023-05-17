import { Model, RelationMappings } from 'objection'
import { WorkspaceModel } from '@/services/core/workspace/core-workspace.model'
import { GroupModel } from '../group/group.model'

/**
 * Policy objection Model
 */
export class PolicyModel extends Model {
  static readonly model = 'policy'

  static readonly tableName = 'lck_policy'

  static get relationMappings(): RelationMappings {
    return {
      workspace: {
        relation: Model.BelongsToOneRelation,
        modelClass: WorkspaceModel,
        join: {
          from: 'lck_policy.workspaceId',
          to: 'lck_workspace.id',
        },
      },
      groups: {
        relation: Model.HasManyRelation,
        modelClass: GroupModel,
        join: {
          from: 'lck_policy.id',
          to: 'lck_group.policyId',
        },
      },
    }
  }
}
