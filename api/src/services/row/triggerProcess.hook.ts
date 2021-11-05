/* eslint-disable camelcase */
import { HookContext } from '@feathersjs/feathers'
import { Process, ProcessTrigger } from '../../models/process.model'
import { TableRow } from '../../models/tablerow.model'

/**
 * Trigger processes linked to this table and the actual method called
 */
export async function triggerProcess (context: HookContext): Promise<HookContext> {
  const updatedRows: TableRow[] = Array.isArray(context.result) ? context.result : [context.result]

  if (updatedRows.length === 0) return context

  /**
   * Find all triggers on this table that are not MANUAL or CRON events
   */
  const triggersForTheCurrentRow = await context.app.services.process.find({
    query: {
      table_id: updatedRows[0].table_id,
      trigger: {
        $in: [
          ProcessTrigger.CREATE_ROW,
          ProcessTrigger.UPDATE_ROW,
          ProcessTrigger.UPDATE_ROW_DATA,
        ],
      },
      enabled: true,
    },
    paginate: false,
  })

  const processRunCreatePromises: Array<Promise<ProcessTrigger>> = []

  /**
   * Filter triggers that are with the "good" events
   */
  triggersForTheCurrentRow.forEach((currentTrigger: Process) => {
    let needExecution = false
    switch (currentTrigger.trigger) {
      case ProcessTrigger.CREATE_ROW:
        if (context.method === 'create') needExecution = true
        break
      case ProcessTrigger.UPDATE_ROW:
        if (context.method === 'update' ||
        context.method === 'patch'
        ) needExecution = true
        break
      case ProcessTrigger.UPDATE_ROW_DATA:
        if (context.method === 'update' ||
        context.method === 'patch'
        ) {
          if (context.params._meta.columnsIdsTransmitted.indexOf(currentTrigger.settings?.column_id) > -1) {
            needExecution = true
          }
        }
        break
    }
    if (needExecution) {
      updatedRows.forEach(updatedRow => {
        processRunCreatePromises.push(
          context.app.services['process-run'].create({
            text: 'Triggering process ' + Date.now(),
            process_id: currentTrigger.id,
            table_row_id: updatedRow.id,
            data_log_id: context.params._meta.log?.id,
          }),
        )
      })
    }
  })
  await Promise.all(processRunCreatePromises)

  return context
}
