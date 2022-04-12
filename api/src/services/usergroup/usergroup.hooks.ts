import * as authentication from '@feathersjs/authentication'
import { defineAbilitiesIffHook } from '../../abilities/group.abilities'
import { authorize } from 'feathers-casl/dist/hooks'
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks

export default {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [
      defineAbilitiesIffHook(),
      authorize({
        adapter: 'feathers-objection',
      }),
    ],
    update: [],
    patch: [
      defineAbilitiesIffHook(),
      authorize({
        adapter: 'feathers-objection',
      }),
    ],
    remove: [
      defineAbilitiesIffHook(),
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
