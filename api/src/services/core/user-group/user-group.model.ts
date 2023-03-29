import { Model, RelationMappings } from 'objection'
import { GroupModel } from '../group/group.model'
import { UserModel } from '../../core/user/user.model'

/**
 * user-group objection Model
 */
export class UserGroupModel extends Model {
  static get idColumn() {
    return ['userId', 'groupId']
  }

  static readonly model = 'user-group'

  static readonly tableName = 'lck_userGroup'

  static get relationMappings(): RelationMappings {
    return {
      group: {
        relation: Model.BelongsToOneRelation,
        modelClass: GroupModel,
        join: {
          from: 'lck_userGroup.groupId',
          to: 'lck_group.id',
        },
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: 'lck_userGroup.userId',
          to: 'lck_user.id',
        },
      },
    }
  }
}
