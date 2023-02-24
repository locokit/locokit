import { createDebug } from '@feathersjs/commons'
import { HookContext } from '@feathersjs/feathers'
import { Model } from 'objection'
import { ObjectionAdapterTransaction } from './declarations'

const debug = createDebug('feathers-knex-transaction')

const ROLLBACK = { rollback: true }

export const getKnex = (context: HookContext): Model => {
  const knex = context.service.Model

  return knex && typeof knex.transaction === 'function' ? knex : undefined
}

export const start =
  () =>
  async (context: HookContext): Promise<void> => {
    const { transaction } = context.params
    const parent = transaction
    const knex: Model = transaction ? transaction.trx : getKnex(context)

    if (!knex) {
      return
    }

    await new Promise<void>((resolve, reject) => {
      const transaction: ObjectionAdapterTransaction = {
        starting: true,
      }

      if (parent) {
        transaction.parent = parent
        transaction.committed = parent.committed
      } else {
        transaction.committed = new Promise((resolve) => {
          transaction.resolve = resolve
        })
      }

      transaction.starting = true
      // transaction.promise = knex
      //   .transaction((trx: any) => {
      //     transaction.trx = trx
      //     transaction.id = Date.now()

      //     context.params = { ...context.params, transaction }

      //     debug('started a new transaction %s', transaction.id)

      //     resolve()
      //   })
      //   .catch((error: any) => {
      //     if (transaction.starting) {
      //       reject(error)
      //     } else if (error !== ROLLBACK) {
      //       throw error
      //     }
      //   })
    })
  }

export const end = () => (context: HookContext) => {
  const { transaction } = context.params

  if (!transaction) {
    return
  }

  const { trx, id, promise, parent } = transaction

  context.params = { ...context.params, transaction: parent }
  transaction.starting = false

  return trx
    .commit()
    .then(() => promise)
    .then(() => transaction.resolve?.(true))
    .then(() => {
      debug('ended transaction %s', id)
    })
    .then(() => context)
}

export const rollback = () => (context: HookContext) => {
  const { transaction } = context.params

  if (!transaction) {
    return
  }

  const { trx, id, promise, parent } = transaction

  context.params = { ...context.params, transaction: parent }
  transaction.starting = false

  return trx
    .rollback(ROLLBACK)
    .then(() => promise)
    .then(() => transaction.resolve?.(false))
    .then(() => {
      debug('rolled back transaction %s', id)
    })
    .then(() => context)
}
