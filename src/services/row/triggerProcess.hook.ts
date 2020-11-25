/* eslint-disable camelcase */
import { HookContext } from '@feathersjs/feathers'
import { ProcessTrigger, ProcessTriggerEvent } from '../../models/process_trigger.model'

/**
 * Trigger processes linked to this table and the actual method called
 */
export async function triggerProcess (context: HookContext): Promise<HookContext> {
  /**
   * Find all triggers on this table that are not MANUAL or CRON events
   */
  const triggersForTheCurrentRow = await context.app.services['process-trigger'].find({
    query: {
      table_id: context.result.table_id,
      event: {
        $in: [
          ProcessTriggerEvent.CREATE_ROW,
          ProcessTriggerEvent.UPDATE_ROW,
          ProcessTriggerEvent.UPDATE_ROW_DATA
        ]
      },
      enabled: true
    },
    paginate: false
  })

  /**
   * Filter triggers that are with the "good" events
   */
  await Promise.all(
    triggersForTheCurrentRow.map(async (currentTrigger: ProcessTrigger) => {
      let needExecution = false
      switch (currentTrigger.event) {
        case ProcessTriggerEvent.CREATE_ROW:
          if (context.method === 'create') needExecution = true
          break
        case ProcessTriggerEvent.UPDATE_ROW:
          if (context.method === 'update' ||
          context.method === 'patch'
          ) needExecution = true
          break
        case ProcessTriggerEvent.UPDATE_ROW_DATA:
          if (context.method === 'update' ||
          context.method === 'patch'
          ) {
            if (context.params._meta.columnsIdsTransmitted.indexOf(currentTrigger.settings?.column_id) > -1) {
              needExecution = true
            }
          }
          break
      }
      needExecution && await context.app.services['process-execution'].create({
        text: 'Triggering process ' + Date.now(),
        process_trigger_id: currentTrigger.id,
        table_row_id: context.result.id
      })
    })
  )

  return context
}
