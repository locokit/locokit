import { Model, RelationMappings } from 'objection'
import { WorkspaceModel } from '@/services/core/workspace/workspace.model'
import { UserGroupModel } from '../user-group/user-group.model'
import { PolicyModel } from '../policy/policy.model'
import { UserModel } from '../../core/user/user.model'

/**
 * Group objection Model
 */
export class GroupModel extends Model {
  static readonly model = 'group'

  static readonly tableName = 'lck_group'

  static get relationMappings(): RelationMappings {
    return {
      workspace: {
        relation: Model.BelongsToOneRelation,
        modelClass: WorkspaceModel,
        join: {
          from: 'lck_group.workspaceId',
          to: 'lck_workspace.id',
        },
      },
      policy: {
        relation: Model.BelongsToOneRelation,
        modelClass: PolicyModel,
        join: {
          from: 'lck_group.policyId',
          to: 'lck_policy.id',
        },
      },
      userGroups: {
        relation: Model.HasManyRelation,
        modelClass: UserGroupModel,
        join: {
          from: 'lck_group.id',
          to: 'lck_userGroup.group_id',
        },
      },
      users: {
        relation: Model.ManyToManyRelation,
        modelClass: UserModel,
        join: {
          from: 'lck_group.id',
          through: {
            from: 'lck_userGroup.groupId',
            to: 'lck_userGroup.userId',
            // extra: ['userGroupRole'],
          },
          to: 'lck_user.id',
        },
      },
    }
  }
}
