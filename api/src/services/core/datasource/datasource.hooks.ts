import { authenticate } from '@feathersjs/authentication'
import { transaction } from '@/feathers-objection'
import { disallow } from 'feathers-hooks-common'
import { isInternalCallOrInternalAndAdminProfile } from '@/hooks/profile.hooks'

export const coreDatasourceHooks = {
  around: {
    all: [authenticate('jwt')],
  },
  before: {
    all: [isInternalCallOrInternalAndAdminProfile, transaction.start()],
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
