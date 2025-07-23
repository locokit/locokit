import { Model, RelationMappings } from 'objection'
import { WorkspaceGroupModel } from '../group/group.model'
import { UserModel } from '../../core/user/user.model'

/**
 * user-group objection Model
 */
export class WorkspaceUserGroupModel extends Model {
  static get idColumn() {
    return ['userId', 'groupId']
  }

  static readonly model = 'user-group'

  static readonly tableName = 'userGroup'

  static get relationMappings(): RelationMappings {
    return {
      group: {
        relation: Model.BelongsToOneRelation,
        modelClass: WorkspaceGroupModel,
        join: {
          from: 'userGroup.groupId',
          to: 'group.id',
        },
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: 'userGroup.userId',
          to: 'lck_user.id',
        },
      },
    }
  }
}
