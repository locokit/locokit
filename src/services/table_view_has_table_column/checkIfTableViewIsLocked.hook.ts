/* eslint-disable camelcase */
import { Forbidden } from '@feathersjs/errors'
import { HookContext } from '@feathersjs/feathers'
import { TableView } from '../../models/tableview.model'
import { TableViewColumn } from '../../models/tableviewcolumn.model'

/**
 * avoid the creation / update / patch / remove for a view blocked
 */
export async function checkIfTableViewIsLocked (context: HookContext): Promise<HookContext> {
  let table_view_id
  const idTableViewIndex = TableViewColumn.idColumn.indexOf('table_view_id')
  switch ((context.method)) {
    case 'create':
      table_view_id = context.data.table_view_id
      break
    default:
      table_view_id = (context.id as string).split(',')[idTableViewIndex]
      break
  }
  const currentView: TableView = await context.app.services.view.get(table_view_id)
  if (currentView.locked) {
    throw new Forbidden('The view is locked', {
      code: 'VIEW_LOCKED'
    })
  }
  return context
}
