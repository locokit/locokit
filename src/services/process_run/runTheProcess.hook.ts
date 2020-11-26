/* eslint-disable camelcase */
import { HookContext } from '@feathersjs/feathers'
import { Process } from '../../models/process.model'
import axios from 'axios'
import { ProcessRunStatus } from '../../models/process_run.model'

/**
 * Run the process id.
 * Actually, only one process type : URL.
 * So, we have to call the URL by giving it some params.
 */
export async function runTheProcess (context: HookContext): Promise<HookContext> {
  /**
   * Spawn a new process to run it, in fire&forget mode
   */
  const now = Date.now()
  axios.post((context.result.process as Process).url as string, {
    process_id: context.result.process_id,
    process_run_id: context.data.id,
    table_row_id: context.data.table_row_id
  })
    .then(value => {
      context.service.patch(context.result?.id, {
        duration: Date.now() - now,
        status: ProcessRunStatus.SUCCESS,
        log: value.data?.log
      })
    })
    .catch(reason => {
      context.service.patch(context.result?.id, {
        duration: Date.now() - now,
        status: ProcessRunStatus.ERROR,
        log: reason?.toString()
      })
    })
  /**
   * Return the context, maybe by updating the status of run to 'RUNNING'
   */
  return context
}
