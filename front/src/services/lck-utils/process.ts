import { LckProcess, PROCESS_RUN_STATUS } from '../lck-api/definitions'

export function getDisabledProcessTrigger (process: LckProcess, rowId: string): boolean {
  if (process.runs && process.runs.length > 0) {
    const res = process.runs?.filter(run => rowId === run.table_row_id && run.status === PROCESS_RUN_STATUS.SUCCESS)
    return res.length === process.maximumNumberSuccess
  }
  return false
}
