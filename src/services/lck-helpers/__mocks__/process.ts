import { lckServices } from '@/services/lck-api'
import { LckProcess, LckProcessRun, PROCESS_TRIGGER } from '@/services/lck-api/definitions'
import { Paginated } from '@feathersjs/feathers'

export async function retrieveManualProcessWithRuns (tableId: string) {
  try {
    const res = await lckServices.process.find({
      query: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        table_id: tableId,
        trigger: PROCESS_TRIGGER.MANUAL,
        $sort: { createdAt: 1 },
        $eager: 'runs',
        $limit: 50
      }
    }) as Paginated<LckProcess>
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
    }) as Paginated<LckProcess>

    const resRuns = await lckServices.processRun.find({
      query: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        table_row_id: rowId,
        $sort: { createdAt: -1 },
        $limit: 50 // $limit: -1  // Disable pagination
      }
    }) as Paginated<LckProcessRun>

    return resProcess.data.map(process => {
      process.runs = []
      resRuns.data.forEach(exec => {
        if (process.id === exec.process_id) {
          (process.runs as LckProcessRun[]).push(exec)
        }
      })
      return process
    })
  } catch ({ code, name }) {
    return { code, name }
  }
}

export async function createProcessRun (formData: { process_id: string; table_row_id: string; waitForOutput: false }) {
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
