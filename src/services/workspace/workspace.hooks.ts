import * as authentication from '@feathersjs/authentication'
import { authorize } from 'feathers-casl/dist/hooks'
import { defineAbilities } from '../../abilities/workspace.abilities'
import filterChapterAccordingPermissions from './filterChapter.hook'
import { iff, isProvider } from 'feathers-hooks-common'
import { addWorkspaceDependencies } from './addWorkspaceDependencies.hook'
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks

export default {
  before: {
    all: [
      authenticate('jwt'),
      iff(
        isProvider('external'),
        defineAbilities,
      )
    ],
    find: [
      authorize({
        adapter: 'feathers-objection',
      }),
    ],
    get: [
      filterChapterAccordingPermissions(),
      authorize({
        adapter: 'feathers-objection',
      }),
    ],
    create: [
      authorize({
        adapter: 'feathers-objection',
      }),
    ],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      addWorkspaceDependencies
    ],
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
