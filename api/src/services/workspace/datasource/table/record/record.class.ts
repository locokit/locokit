import { HookContext } from '../../../../../declarations'
import { authenticate } from '@feathersjs/authentication'
import { Id, Paginated, Params, ServiceMethods } from '@feathersjs/feathers'
import { API_PATH } from '@locokit/definitions'
import { createAdapter, EngineAdapter } from '@locokit/engine'
import { BaserowAdapter } from '@locokit/engine/adapters/baserow'
import { SQLAdapter } from '@locokit/engine/adapters/sql'

// class EngineParams implements Params<any> {
//   $$lckTable: string | null = null
//   $$adapter: BaserowAdapter | SQLAdapter | null = null
// }

type EngineParams = Params & {
  $$adapter: EngineAdapter
  $$lckTable: string
}

const adapters: Record<string, BaserowAdapter | SQLAdapter> = {}

export const recordHooks = {
  around: {
    all: [authenticate('jwt')],
  },
  before: {
    all: [
      async function checkPermission(context: HookContext) {},
      async function createAdapterIfNeeded(context: HookContext) {
        console.log('[createAdapterIfNeeded]', context.params.route)
        const {
          workspaceSlug,
          datasourceSlug,
          tableSlug,
        }: {
          workspaceSlug: string
          datasourceSlug: string
          tableSlug: string
        } = context.params.route

        console.log('[createAdapterIfNeeded]', workspaceSlug, datasourceSlug)

        const adapterKey = 'w_' + workspaceSlug + '__ds_' + datasourceSlug
        /**
         * Check if the adapter already exist
         */
        if (adapters[adapterKey]) {
          console.log('[createAdapterIfNeeded] Already created. Skip creation.')
          return
        }

        /**
         * Find the datasource
         */
        const datasource = await context.app.service(API_PATH.WORKSPACE.DATASOURCE.ROOT).find({
          query: {
            slug: datasourceSlug,
          },
        })
        if (datasource.total === 1) {
          console.log('[createAdapterIfNeeded] Adapter being created...')

          /**
           * Create the adapter
           */
          adapters[adapterKey] = await createAdapter({
            type: datasource.data[0].client,
            options: datasource.data[0].connection,
          })
        }

        context.params.$$lckTable = tableSlug
        context.params.$$adapter = adapters[adapterKey]
      },
    ],
  },
  after: {},
  error: {},
}

// export interface TableParams extends KnexAdapterParams<TableQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
// export class Record {}
export class EngineService<T = any, D = Partial<T>>
  implements ServiceMethods<T | Paginated<T>, D, EngineParams>
{
  find(
    params?: EngineParams & {
      paginate?: PositionOptions
    },
  ): Promise<Paginated<T>>
  find(
    params?: EngineParams & {
      paginate: false
    },
  ): Promise<T[]>
  async find(params?: EngineParams): Promise<Paginated<T> | T[]> {
    console.log('find', params)
    const adapter = params?.$$adapter as EngineAdapter
    return await adapter.queryTable<T>(params?.$$lckTable as string, params)
  }

  async get(id: Id, params?: EngineParams): Promise<T>
  async get(id: Id, params?: EngineParams): Promise<null | T> {
    console.log('get', id, params)
    return await new Promise((resolve) => {
      resolve(null)
    })
  }

  async create(data: D, params?: EngineParams): Promise<T>
  async create(data: D[], params?: EngineParams): Promise<T[]>
  async create(data: D | D[], params?: EngineParams): Promise<null | T | T[]> {
    console.log('create', data, params)
    return await new Promise((resolve) => {
      resolve(null)
    })
  }

  async update(id: Id, data: D, params?: EngineParams): Promise<T>
  async update(id: Id, data: D, params?: EngineParams): Promise<null | T> {
    console.log('update', id, data, params)
    return await new Promise((resolve) => {
      resolve(null)
    })
  }

  async patch(id: Id, data: Partial<D>, params?: EngineParams): Promise<T>
  async patch(id: null, data: Partial<D>, params?: EngineParams): Promise<T[]>
  async patch(id: Id | null, data: Partial<D>, params?: EngineParams): Promise<null | T | T[]> {
    console.log('patch', id, data, params)
    return await new Promise((resolve) => {
      resolve(null)
    })
  }

  async remove(id: Id, params?: EngineParams): Promise<T>
  async remove(id: null, params?: EngineParams): Promise<T[]>
  async remove(id: Id | null, params?: EngineParams): Promise<null | T | T[]> {
    console.log('remove', id, params)
    return await new Promise((resolve) => {
      resolve(null)
    })
  }
}
