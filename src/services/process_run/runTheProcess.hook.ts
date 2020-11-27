/* eslint-disable camelcase */
import { HookContext } from '@feathersjs/feathers'
import { Process } from '../../models/process.model'
import axios, { AxiosError, AxiosResponse } from 'axios'
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
    .then((value: AxiosResponse) => {
      const log = `
Log for the run ${context.result.id}

Process n° : ${context.result.process_id}

Row n° : ${context.data.table_row_id}

Begin : ${context.result.createdAt}

End : ${new Date().toISOString()}

Status : ${value.status} ${value.statusText}

Log (eventually) :

${value.data && value.data.log}

HTTP Response

${value.data.toString()}

`
      context.service.patch(context.result?.id, {
        duration: Date.now() - now,
        status: ProcessRunStatus.SUCCESS,
        log
      })
    })
    .catch((reason: AxiosError) => {
      const log = `
An error occured during the run ${context.result.id}

Process n° : ${context.result.process_id}

Row n° : ${context.data.table_row_id}

Begin : ${context.result.createdAt}

End : ${new Date().toISOString()}

HTTP Code : ${reason.code}

Axios error ? : ${reason.isAxiosError}

Message : ${reason.message}

Stack :

${reason.stack}
`
      context.service.patch(context.result?.id, {
        duration: Date.now() - now,
        status: ProcessRunStatus.ERROR,
        log
      })
    })
  /**
   * Return the context, maybe by updating the status of run to 'RUNNING'
   */
  return context
}
