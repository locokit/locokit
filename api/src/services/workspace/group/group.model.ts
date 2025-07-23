import { Model, RelationMappings } from 'objection'
import { WorkspaceUserGroupModel } from '../user-group/user-group.model'
import { WorkspacePolicyModel } from '../policy/policy.model'
import { UserModel } from '../../core/user/user.model'
import { WorkspaceGroupPolicyVariableModel } from '../group-policy-variable/group-policy-variable.model'

/**
 * Group objection Model
 */
export class WorkspaceGroupModel extends Model {
  static readonly model = 'group'

  static readonly tableName = 'group'

  static get relationMappings(): RelationMappings {
    return {
      policy: {
        relation: Model.BelongsToOneRelation,
        modelClass: WorkspacePolicyModel,
        join: {
          from: 'group.policyId',
          to: 'policy.id',
        },
      },
      groupPolicyVariable: {
        relation: Model.HasManyRelation,
        modelClass: WorkspaceGroupPolicyVariableModel,
        join: {
          from: 'group.id',
          to: 'groupPolicyVariable.groupId',
        },
      },
      memberships: {
        relation: Model.HasManyRelation,
        modelClass: WorkspaceUserGroupModel,
        join: {
          from: 'group.id',
          to: 'userGroup.groupId',
        },
      },
      users: {
        relation: Model.ManyToManyRelation,
        modelClass: UserModel,
        join: {
          from: 'group.id',
          through: {
            from: 'userGroup.groupId',
            to: 'userGroup.userId',
            // extra: ['userGroupRole'],
          },
          to: 'lck_user.id',
        },
      },
    }
  }
}
