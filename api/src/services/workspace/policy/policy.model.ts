import { Model, RelationMappings } from 'objection'
import { WorkspaceGroupModel } from '../group/group.model'
import { WorkspacePolicyVariableModel } from '../policy-variable/policy-variable.model'
import { WorkspacePolicyTableFieldModel } from '../policy-table-field/policy-table-field.model'
import { WorkspacePolicyTableModel } from '../policy-table/policy-table.model'

/**
 * Policy objection Model
 */
export class WorkspacePolicyModel extends Model {
  static readonly model = 'policy'

  static readonly tableName = 'policy'

  static get relationMappings(): RelationMappings {
    return {
      variables: {
        relation: Model.HasManyRelation,
        modelClass: WorkspacePolicyVariableModel,
        join: {
          from: 'policy.id',
          to: 'policyVariable.policyId',
        },
      },
      tables: {
        relation: Model.HasManyRelation,
        modelClass: WorkspacePolicyTableModel,
        join: {
          from: 'policy.id',
          to: 'policyTable.policyId',
        },
      },
      fields: {
        relation: Model.HasManyRelation,
        modelClass: WorkspacePolicyTableFieldModel,
        join: {
          from: 'policy.id',
          to: 'policyTableField.policyId',
        },
      },
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
