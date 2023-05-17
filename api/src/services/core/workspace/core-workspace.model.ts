import { Model, RelationMappings } from 'objection'
import { GroupModel } from '@/services/core/group/group.model'
import { PolicyModel } from '@/services/core/policy/policy.model'
import { UserModel } from '@/services/core/user/user.model'
import { CoreDatasourceModel } from '../datasource/core-datasource.model'

/**
 * Workspace objection Model
 */
export class WorkspaceModel extends Model {
  static readonly model = 'workspace'

  static readonly tableName = 'lck_workspace'

  static get relationMappings(): RelationMappings {
    return {
      datasources: {
        relation: Model.HasManyRelation,
        modelClass: CoreDatasourceModel,
        join: {
          from: 'lck_workspace.id',
          to: 'lck_datasource.workspaceId',
        },
      },
      owner: {
        relation: Model.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: 'lck_workspace.createdBy',
          to: 'lck_user.id',
        },
      },
      groups: {
        relation: Model.HasManyRelation,
        modelClass: GroupModel,
        join: {
          from: 'lck_workspace.id',
          to: 'lck_group.workspaceId',
        },
      },
      policies: {
        relation: Model.HasManyRelation,
        modelClass: PolicyModel,
        join: {
          from: 'lck_workspace.id',
          to: 'lck_policy.workspaceId',
        },
      },
    }
  }
}
