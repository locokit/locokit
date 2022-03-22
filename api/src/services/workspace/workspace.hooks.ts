import * as authentication from '@feathersjs/authentication'
import { authorize } from 'feathers-casl/dist/hooks'
import { defineAbilitiesIffHook } from '../../abilities/workspace.abilities'
import filterChapterAccordingPermissions from './filterChapter.hook'
import { disablePagination, iff, iffElse, required } from 'feathers-hooks-common'
import { addWorkspaceDependencies } from './addWorkspaceDependencies.hook'
import { setModifierDefaultValues } from './setModifierDefaultValue'
import { createWorkspaceSQLSchema, dropWorkspaceSQLSchema } from './createSQLSchema'
import { HookContext } from '@feathersjs/feathers'
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
      filterChapterAccordingPermissions(),
      setModifierDefaultValues({
        ofUser: '{userId}',
      }),
      authorize({
        adapter: 'feathers-objection',
      }),
    ],
    get: [
      filterChapterAccordingPermissions(),
      setModifierDefaultValues({
        ofUser: '{userId}',
      }),
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
      iff(
        (context: HookContext) => context.result.generate_sql === true,
        createWorkspaceSQLSchema,
      ),
      addWorkspaceDependencies,
    ],
    update: [
      iffElse(
        (context: HookContext) => context.result.generate_sql === true,
        [createWorkspaceSQLSchema],
        [dropWorkspaceSQLSchema],
      ),
    ],
    patch: [
      iffElse(
        (context: HookContext) => context.result.generate_sql === true,
        [createWorkspaceSQLSchema],
        [dropWorkspaceSQLSchema],
      ),
    ],
    remove: [
      dropWorkspaceSQLSchema,
    ],
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
