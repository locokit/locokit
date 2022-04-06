import * as authentication from '@feathersjs/authentication'
import { NotAcceptable } from '@feathersjs/errors'
import { HookContext } from '@feathersjs/feathers'
import { USER_PROFILE } from '@locokit/lck-glossary'
import commonHooks from 'feathers-hooks-common'
import { defineAbilitiesIffHook } from '../../abilities/attachment.abilities'
import { isUserProfile } from '../../hooks/lck-hooks/isUserProfile'
import { queryContainsKeys } from '../../hooks/lck-hooks/queryContainsKeys'
import { authorize } from 'feathers-casl/dist/hooks'

const { authenticate } = authentication.hooks

export default {
  before: {
    all: [
      authenticate('jwt'),
    ],
    find: [
      commonHooks.disablePagination(),
      // if no workspace id is given, only ADMIN / SUPERADMIN can find
      commonHooks.iff(
        (context: HookContext) => {
          return !queryContainsKeys(['workspace_id'])(context) && !isUserProfile([USER_PROFILE.SUPERADMIN, USER_PROFILE.ADMIN])(context)
        },
        () => {
          throw new NotAcceptable('You cannot find attachment without setting a workspace_id query param.')
        },
      ).else(
        defineAbilitiesIffHook(),
        authorize({
          adapter: 'feathers-objection',
        }),
      ),
    ],
    get: [
      defineAbilitiesIffHook(),
      authorize({
        adapter: 'feathers-objection',
      }),
    ],
    create: [
      defineAbilitiesIffHook(),
      authorize({
        adapter: 'feathers-objection',
      }),
    ],
    update: [
      defineAbilitiesIffHook(),
      authorize({
        adapter: 'feathers-objection',
      }),
    ],
    patch: [
      defineAbilitiesIffHook(),
      authorize({
        adapter: 'feathers-objection',
      }),
    ],
    remove: [
      // only CREATOR / ADMIN / SUPERADMIN can remove attachments
      // if force is given in parameter,
      // related rows are dereferenced
      // if not, we check that no rows are using this attachment
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
