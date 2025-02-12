import { authenticate } from '@feathersjs/authentication'
import { transaction } from '@/feathers-objection'
import { disallow } from 'feathers-hooks-common'
import { checkUserHasAccess } from '@/hooks/profile.hooks'
import { USER_PROFILE } from '@locokit/definitions'

export const coreDatasourceHooks = {
  around: {
    all: [authenticate('jwt')],
  },
  before: {
    all: [
      checkUserHasAccess({
        userProfile: [USER_PROFILE.ADMIN],
        internalProvider: true,
        internalProviderProfileCheck: 'IF_USER_PROVIDED',
      }),
      transaction.start(),
    ],
    create: [disallow()],
    update: [disallow()],
    remove: [disallow()],
    patch: [disallow()],
  },
  after: {
    all: [transaction.end()],
  },
  error: {
    all: [transaction.rollback()],
  },
}
