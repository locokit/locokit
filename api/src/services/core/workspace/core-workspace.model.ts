import { Model, RelationMappings } from 'objection'
import { GroupModel } from '@/services/core/group/group.model'
import { RoleModel } from '@/services/core/role/role.model'
import { UserModel } from '@/services/auth/user/user.model'
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
      roles: {
        relation: Model.HasManyRelation,
        modelClass: RoleModel,
        join: {
          from: 'lck_workspace.id',
          to: 'lck_role.workspaceId',
        },
      },
    }
  }
}
