// import { createDebug } from '@feathersjs/commons'
import { HookContext } from '@feathersjs/feathers'
import { ObjectionAdapterTransaction } from './declarations'
import { Knex } from 'knex'
import { objectionLogger } from './logger'

const ROLLBACK = { rollback: true }

export const getKnex = (context: HookContext): Knex => {
  const knex = context.service.Model.knex()

  return knex && typeof knex.transaction === 'function' ? knex : undefined
}

export const start =
  () =>
    async (context: HookContext): Promise<void> => {
      const { transaction } = context.params
      const parent = transaction
      const knex: Knex = transaction ? transaction.trx : getKnex(context)

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
        transaction.promise = knex
          .transaction((trx) => {
            transaction.trx = trx
            transaction.id = Date.now()

            context.params = { ...context.params, transaction }
            objectionLogger.info('[%s] new transaction [%s] %s', transaction.id, context.method, context.path)

            resolve()
          })
          .catch((error) => {
            if (transaction.starting) {
              reject(error)
            } else if (error !== ROLLBACK) {
              throw error
            }
          })
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

  objectionLogger.info('[%s] commiting...', id)

  return trx
    .commit()
    .then(() => promise)
    .then(() => transaction.resolve?.(true))
    .then(() => {
      objectionLogger.info('[%s] transaction end', id)
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
      objectionLogger.error('[%s] transaction rolled back', id)
    })
    .then(() => context)
}
