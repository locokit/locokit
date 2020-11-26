import { lckServices } from '@/services/lck-api'
import { LckProcessExecution, LckProcessTriggerWithExecutions, ProcessTriggerEvent } from '@/services/lck-utils/process'
import { databaseState } from '@/store/database'

export async function retrieveManualProcessTrigger (tableId: string) {
  databaseState.error = null

  try {
    const res = await lckServices.processTrigger.find({
      query: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        table_id: tableId,
        event: ProcessTriggerEvent.MANUAL,
        $eager: 'executions'
      }
    })
    return res.data
  } catch (error) {
    databaseState.error = error
  }
  databaseState.loading = false
}

export async function retrieveProcessesByRow (tableId: string, rowId: string) {
  databaseState.error = null
  // These responses are not paginated.
  try {
    const resTrigger = await lckServices.processTrigger.find({
      query: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        table_id: tableId,
        $sort: { createdAt: 1 },
        $limit: -1
      }
    })

    const resExecutions = await lckServices.processExecution.find({
      query: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        table_row_id: rowId,
        $sort: { createdAt: -1 },
        $limit: -1
      }
    })

    return resTrigger.map((trigger: LckProcessTriggerWithExecutions) => {
      trigger.executions = []
      resExecutions.forEach((exec: LckProcessExecution) => {
        if (trigger.id === exec.process_trigger_id) {
          trigger.executions.push(exec)
        }
      })
      return trigger
    })
  } catch (error) {
    databaseState.error = error
  }
  databaseState.loading = false
}

export async function createManualProcessExecution (formData: { process_trigger_id: string; table_row_id: string }) {
  databaseState.error = null

  try {
    return await lckServices.processExecution.create(formData)
  } catch (error) {
    databaseState.error = error
  }
  databaseState.loading = false
}

export async function patchProcessTrigger (processTriggerId: string, formData: object) {
  databaseState.loading = true
  try {
    return await lckServices.processTrigger.patch(processTriggerId, formData)
  } catch ({ code, name }) {
    databaseState.error = new Error(`${code}: ${name}`)
  }
  databaseState.loading = false
}
