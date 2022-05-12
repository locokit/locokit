import * as authentication from '@feathersjs/authentication'
import { defineAbilitiesIffHook } from '../../abilities/process.abilities'
import { authorize } from 'feathers-casl/dist/hooks'
import { HookContext } from '@feathersjs/feathers'
import { Process } from '../../models/process.model'
import { NotAcceptable } from '@feathersjs/errors'
import { preventChanges } from 'feathers-hooks-common'

const { authenticate } = authentication.hooks

export default {
  before: {
    all: [
      authenticate('jwt'),
      defineAbilitiesIffHook(),
    ],
    find: [
      authorize({
        adapter: 'feathers-objection',
      }),
    ],
    get: [
      authorize({
        adapter: 'feathers-objection',
      }),
    ],
    create: [
      authorize({
        adapter: 'feathers-objection',
      }),
    ],
    update: [
      async (context: HookContext) => {
        const p = await context.service.get(context.id as number) as Process
        if (p.workspace_id !== context.data.workspace_id) {
          throw new NotAcceptable('You can\'t change the workspace of this process.')
        }
        return context
      },
      authorize({
        adapter: 'feathers-objection',
      }),
    ],
    patch: [
      preventChanges(true, 'workspace_id'),
      authorize({
        adapter: 'feathers-objection',
      }),
    ],
    remove: [
      authorize({
        adapter: 'feathers-objection',
      }),
    ],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
}
