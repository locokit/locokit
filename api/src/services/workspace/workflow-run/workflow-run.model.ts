import { Model } from 'objection'

export class WorkflowRunModel extends Model {
  static readonly model = 'workflowRun'

  static readonly tableName = 'workflowRun'

  static get jsonAttributes() {
    return ['input', 'result', 'output']
  }
}
