/* eslint-disable camelcase */
import { HookContext } from '@feathersjs/feathers'
import { ProcessTrigger } from '../../models/process_trigger.model'
import axios from 'axios'
import { ProcessExecutionStatus } from '../../models/process_execution.model'

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
  axios.post((context.result.process_trigger as ProcessTrigger).process?.url as string, {
    process_trigger_id: context.result.process_trigger_id,
    process_execution_id: context.data.id,
    table_row_id: context.data.table_row_id
  })
    .then(value => {
      context.service.patch(context.result?.id, {
        duration: Date.now() - now,
        status: ProcessExecutionStatus.SUCCESS,
        log: value.data?.log
      })
    })
    .catch(reason => {
      context.service.patch(context.result?.id, {
        duration: Date.now() - now,
        status: ProcessExecutionStatus.ERROR,
        log: reason
      })
    })
  /**
   * Return the context, maybe by updating the status of execution to 'RUNNING'
   */
  return context
}
