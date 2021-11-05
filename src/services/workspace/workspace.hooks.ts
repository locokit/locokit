import * as authentication from '@feathersjs/authentication'
import { authorize } from 'feathers-casl/dist/hooks'
import { defineAbilitiesIffHook } from '../../abilities/workspace.abilities'
import filterChapterAccordingPermissions from './filterChapter.hook'
import { disablePagination, required } from 'feathers-hooks-common'
import { addWorkspaceDependencies } from './addWorkspaceDependencies.hook'
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks

export default {
  before: {
    all: [
      authenticate('jwt'),
      defineAbilitiesIffHook(),
    ],
    find: [
      disablePagination(),
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
      required('text'),
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
      addWorkspaceDependencies,
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
