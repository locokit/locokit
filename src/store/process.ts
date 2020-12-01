import { lckServices } from '@/services/lck-api'
import { LckProcessRun, LckProcessWithRuns, ProcessEvent } from '@/services/lck-utils/process'
import { databaseState } from '@/store/database'

export async function retrieveManualProcessWithRuns (tableId: string) {
  try {
    const res = await lckServices.process.find({
      query: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        table_id: tableId,
        trigger: ProcessEvent.MANUAL,
        $sort: { createdAt: 1 },
        $eager: 'runs',
        $limit: 50
      }
    })
    return res.data
  } catch ({ code, name }) {
    return { code, name }
  }
}

export async function retrieveProcessesByRow (tableId: string, rowId: string) {
  try {
    const resProcess = await lckServices.process.find({
      query: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        table_id: tableId,
        $sort: { createdAt: 1 },
        $limit: 50 // $limit: -1  // Disable pagination
      }
    })

    const resRuns = await lckServices.processRun.find({
      query: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        table_row_id: rowId,
        $sort: { createdAt: -1 },
        $limit: 50 // $limit: -1  // Disable pagination
      }
    })

    return resProcess.data.map((trigger: LckProcessWithRuns) => {
      trigger.runs = []
      resRuns.data.forEach((exec: LckProcessRun) => {
        if (trigger.id === exec.process_id) {
          trigger.runs.push(exec)
        }
      })
      return trigger
    })
  } catch ({ code, name }) {
    return { code, name }
  }
}

export async function createProcessRun (formData: { process_id: string; table_row_id: string }) {
  try {
    return await lckServices.processRun.create(formData)
  } catch ({ code, name }) {
    return { code, name }
  }
}

export async function patchProcess (processId: string, formData: object) {
  try {
    return await lckServices.process.patch(processId, formData)
  } catch ({ code, name }) {
    return { code, name }
  }
}
