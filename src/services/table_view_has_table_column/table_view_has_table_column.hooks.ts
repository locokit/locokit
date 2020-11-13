/* eslint-disable camelcase */
import * as authentication from '@feathersjs/authentication'
import { Forbidden } from '@feathersjs/errors'
import { HookContext } from '@feathersjs/feathers'
import { TableView } from '../../models/tableview.model'
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks

/**
 * avoid the creation / update / patch / remove for a view blocked
 */
async function checkIfTableViewIsLocked (context: HookContext): Promise<HookContext> {
  let table_view_id
  switch ((context.method)) {
    case 'create':
      table_view_id = context.data.table_view_id
      break
    default:
      table_view_id = (context.id as string).split(',')[1]
      break
  }
  // const { table_view_id } = context.data
  const currentView: TableView = await context.app.services.view.get(table_view_id)
  if (currentView.locked) {
    throw new Forbidden('The view is locked', {
      code: 'VIEW_LOCKED'
    })
  }
  return context
}

export default {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [
      checkIfTableViewIsLocked
    ],
    update: [
      checkIfTableViewIsLocked
    ],
    patch: [
      checkIfTableViewIsLocked
    ],
    remove: [
      checkIfTableViewIsLocked
    ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
