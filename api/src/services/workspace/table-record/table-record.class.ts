import { Application } from '@/declarations'
import { NotImplemented } from '@feathersjs/errors/lib'
import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers'
import { Validator } from '@feathersjs/schema'
import { TSchema } from '@feathersjs/typebox'

import { EngineAdapter } from '@locokit/engine'

type nullTArrayT<T> = null | T | T[]

type EngineParams = Partial<Params> & {
  /**
   * Id of the TypeboxSchema / AJV compilation $id
   */
  $$id: string
  /**
   * AJV Validator
   */
  $$validator: Validator
  /**
   * TypeboxSchema
   */
  $$schema?: TSchema
  /**
   * LocoKit Engine adapter to the datasource
   */
  $$adapter: EngineAdapter
  /**
   * LocoKit table / endpoint
   */
  $$lckTable: string
}

export class TableRecord<T = any, D = Partial<T>>
  implements ServiceMethods<T | Paginated<T>, D, EngineParams, D>
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
        $joinRelated: Array.isArray(params.query?.$joinRelated)
          ? params.query?.$joinRelated
          : [params.query?.$joinRelated],
      },
    })
  }

  async get(id: Id, params: EngineParams): Promise<T>
  async get(id: Id, params: EngineParams): Promise<null | T> {
    const adapter = params.$$adapter as EngineAdapter
    return await adapter.getRecord(params.$$lckTable, id, {
      ...params,
      query: {
        ...params.query,
        $joinRelated: Array.isArray(params.query?.$joinRelated)
          ? params.query?.$joinRelated
          : [params.query?.$joinRelated],
      },
    })
  }

  async create(data: D, params: EngineParams): Promise<T>
  async create(data: D[], params: EngineParams): Promise<T[]>
  async create(data: D | D[], params: EngineParams): Promise<nullTArrayT<T>> {
    if (Array.isArray(data)) throw new NotImplemented('Multi creation is not yet implemented.')
    const adapter = params.$$adapter as EngineAdapter

    return await adapter.createRecord<T>(params.$$lckTable, data)
  }

  async update(id: Id, data: Partial<D>, params: EngineParams): Promise<T>
  async update(id: null, data: Partial<D>, params: EngineParams): Promise<T[]>
  async update(id: NullableId, data: Partial<D>, params: EngineParams): Promise<nullTArrayT<T>> {
    if (!id) throw new NotImplemented('Multi update is not yet implemented')
    const adapter = params.$$adapter as EngineAdapter

    return await adapter.updateRecord<D>(params.$$lckTable, id, data)
  }

  async patch(id: Id, data: Partial<D>, params: EngineParams): Promise<T>
  async patch(id: null, data: Partial<D>, params: EngineParams): Promise<T[]>
  async patch(id: NullableId, data: Partial<D>, params: EngineParams): Promise<nullTArrayT<T>> {
    if (!id) throw new NotImplemented('Multi patch is not yet implemented')
    const adapter = params.$$adapter as EngineAdapter

    return await adapter.patchRecord<D>(params.$$lckTable, id, data)
  }

  async remove(id: Id, params: EngineParams): Promise<T>
  async remove(id: null, params: EngineParams): Promise<T[]>
  async remove(id: NullableId, params: EngineParams): Promise<nullTArrayT<T>> {
    if (!id)
      throw new NotImplemented('Id for removal is mandatory. Multi remove are not yet implemented.')
    const adapter = params.$$adapter as EngineAdapter

    return await adapter.deleteRecord(params.$$lckTable, id)
  }
}
