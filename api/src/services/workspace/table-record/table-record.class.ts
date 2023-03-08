import { Application } from '@/declarations'
import { Id, Paginated, Params, ServiceMethods } from '@feathersjs/feathers'
import { Validator } from '@feathersjs/schema'
import { TSchema } from '@feathersjs/typebox'
import { EngineAdapter } from '@locokit/engine'

type EngineParams = Partial<Params> & {
  $$validator: Validator
  $$schema: TSchema
  $$adapter: EngineAdapter
  $$lckTable: string
}

export class TableRecord<T = any, D = Partial<T>>
  implements ServiceMethods<T | Paginated<T>, D, EngineParams>
{
  app!: Application

  async setup(app: Application) {
    this.app = app
  }

  find(
    params: EngineParams & {
      paginate?: PositionOptions
    },
  ): Promise<Paginated<T>>
  find(
    params: EngineParams & {
      paginate: false
    },
  ): Promise<T[]>
  async find(params: EngineParams): Promise<Paginated<T> | T[]> {
    /**
     * * know the user (it can be public)
     * * check the user have access to this table
     * * retrieve acls
     * * compute which records the user has access
     * * filter records before retrieving them
     * * compute allowed query params, according to the acls (with the group) or retrieve them from a cache (key : ws/group/ds/table)
     * * validate query params (adjust by field)
     * * resolve query params (with filter previously computed)
     * * apply query params with a $and
     * * retrieve result
     * * resolve result according to acls
     * * validate result
     * * return result
     */
    const adapter = params.$$adapter as EngineAdapter
    return await adapter.queryTable<T>(params.$$lckTable as string, {
      ...params,
      query: {
        ...params.query,
        $joinRelated: Array.isArray(params.query?.$joinRelated) ? params.query?.$joinRelated : [params.query?.$joinRelated]
      }
    })
  }

  async get(id: Id, params: EngineParams): Promise<T>
  async get(id: Id, params: EngineParams): Promise<null | T> {
    console.log('get', id, params)
    const adapter = params.$$adapter as EngineAdapter
    return await adapter.getRecord(params.$$lckTable, id)
  }

  async create(data: D, params: EngineParams): Promise<T>
  async create(data: D[], params: EngineParams): Promise<T[]>
  async create(data: D | D[], params: EngineParams): Promise<null | T | T[]> {
    console.log('create', data, params)
    const adapter = params.$$adapter as EngineAdapter

    return await adapter.createRecord(params.$$lckTable, data)
  }

  async update(id: Id, data: D, params: EngineParams): Promise<T>
  async update(id: Id, data: D, params: EngineParams): Promise<null | T> {
    console.log('update', id, data, params)
    const adapter = params.$$adapter as EngineAdapter

    return await adapter.patchRecord(params.$$lckTable, id, data)
  }

  async patch(id: Id, data: Partial<D>, params: EngineParams): Promise<T>
  async patch(id: null, data: Partial<D>, params: EngineParams): Promise<T[]>
  async patch(id: Id | null, data: Partial<D>, params: EngineParams): Promise<null | T | T[]> {
    console.log('patch', id, data, params)
    const adapter = params.$$adapter as EngineAdapter

    return await adapter.updateRecord(params.$$lckTable, id, data)
  }

  async remove(id: Id, params: EngineParams): Promise<T>
  async remove(id: null, params: EngineParams): Promise<T[]>
  async remove(id: Id | null, params: EngineParams): Promise<null | T | T[]> {
    console.log('remove', id, params)
    const adapter = params.$$adapter as EngineAdapter

    return await adapter.deleteRecord(params.$$lckTable, id)
  }
}