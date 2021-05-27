/* eslint-disable camelcase */
import { HookContext } from '@feathersjs/feathers'
import { Process } from '../../models/process.model'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { ProcessRunStatus } from '../../models/process_run.model'

const logSuccess = (context: HookContext, value: AxiosResponse) => (
`
Log for the run ${context.result.id}

Process n°: ${context.result.process_id}

Row n°: ${context.data.table_row_id}

Begin: ${context.result.createdAt}

End: ${new Date().toISOString()}

Status: ${value.status} ${value.statusText}

Log (eventually):

${value.data && value.data.log}

HTTP Response:

${JSON.stringify(value.data)}
`)

const logError = (context: HookContext, reason: AxiosError) => (
`
An error occured during the run ${context.result.id}

Process n° : ${context.result.process_id}

Row n° : ${context.data.table_row_id}

Begin : ${context.result.createdAt}

End : ${new Date().toISOString()}

Status : ${reason.response?.status} ${reason.response?.statusText}

Axios error ? : ${reason.isAxiosError}

Message : ${reason.message}

Response :

${JSON.stringify(reason.response?.data)}

Stack :

${reason.stack}
`)

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
  if (context.params.waitForOutput) {
    try {
      const processResult = await axios.post((context.result.process as Process).url, {
        process_id: context.result.process_id,
        process_run_id: context.data.id,
        table_row_id: context.data.table_row_id,
        user_id: context.params?.user?.id,
      })

      context.result = await context.service.patch(context.result?.id, {
        duration: Date.now() - now,
        status: ProcessRunStatus.SUCCESS,
        log: logSuccess(context, processResult),
      })
      // @ts-expect-error
    } catch (reason: AxiosError) {
      context.result = await context.service.patch(context.result?.id, {
        duration: Date.now() - now,
        status: ProcessRunStatus.ERROR,
        log: logError(context, reason),
      })
    }
    /**
     * Return the context, maybe by updating the status of run to 'RUNNING'
     */
    return context
  }
  axios.post((context.result.process as Process).url, {
    process_id: context.result.process_id,
    process_run_id: context.data.id,
    table_row_id: context.data.table_row_id,
    user_id: context.params?.user?.id,
  })
    .then((value: AxiosResponse) => {
      context.service.patch(context.result?.id, {
        duration: Date.now() - now,
        status: ProcessRunStatus.SUCCESS,
        log: logSuccess(context, value),
      })
    })
    .catch((reason: AxiosError) => {
      context.service.patch(context.result?.id, {
        duration: Date.now() - now,
        status: ProcessRunStatus.ERROR,
        log: logError(context, reason),
      })
    })
  /**
   * Return the context, maybe by updating the status of run to 'RUNNING'
   */
  return context
}
