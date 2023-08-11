import { Application } from '@/declarations'
import { NotImplemented } from '@feathersjs/errors/lib'
import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers'
import { Validator } from '@feathersjs/schema'
import { TSchema } from '@feathersjs/typebox'

import { GenericAdapter } from '@locokit/engine'

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
  $$adapter: GenericAdapter
  /**
   * LocoKit table / endpoint
   */
  $$lckTable: string
}

export class TableRecord<T = any, Data = Partial<T>, PatchData = Partial<Data>>
  implements ServiceMethods<T | Paginated<T>, Data, EngineParams, PatchData>
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
    const adapter = params.$$adapter as GenericAdapter
    return await adapter.query<T>(params.$$lckTable as string, {
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
    const adapter = params.$$adapter as GenericAdapter
    return await adapter.get(params.$$lckTable, id, {
      ...params,
      query: {
        ...params.query,
        $joinRelated: Array.isArray(params.query?.$joinRelated)
          ? params.query?.$joinRelated
          : [params.query?.$joinRelated],
      },
    })
  }

  async create(data: Data, params: EngineParams): Promise<T>
  async create(data: Data[], params: EngineParams): Promise<T[]>
  async create(data: Data | Data[], params: EngineParams): Promise<T | T[]> {
    if (Array.isArray(data)) throw new NotImplemented('Multi creation is not yet implemented.')
    const adapter = params.$$adapter as GenericAdapter

    // @ts-expect-error
    return await adapter.create<T>(params.$$lckTable, data)
  }

  async update(id: Id, data: Data, params: EngineParams): Promise<T>
  async update(id: null, data: Data, params: EngineParams): Promise<T[]>
  async update(id: NullableId, data: Data, params: EngineParams): Promise<T | T[]> {
    if (!id) throw new NotImplemented('Multi update is not yet implemented')
    const adapter = params.$$adapter as GenericAdapter

    // @ts-expect-error
    return await adapter.update<T>(params.$$lckTable, id, data)
  }

  async patch(id: Id, data: PatchData, params: EngineParams): Promise<T>
  async patch(id: null, data: PatchData, params: EngineParams): Promise<T[]>
  async patch(id: NullableId, data: PatchData, params: EngineParams): Promise<T | T[]> {
    if (!id) throw new NotImplemented('Multi patch is not yet implemented')
    const adapter = params.$$adapter as GenericAdapter

    // @ts-expect-error
    return await adapter.patch<T>(params.$$lckTable, id, data)
  }

  async remove(id: Id, params: EngineParams): Promise<T>
  async remove(id: null, params: EngineParams): Promise<T[]>
  async remove(id: NullableId, params: EngineParams): Promise<null | T | T[]> {
    if (!id)
      throw new NotImplemented('Id for removal is mandatory. Multi remove are not yet implemented.')
    const adapter = params.$$adapter as GenericAdapter

    return await adapter.delete(params.$$lckTable, id)
  }
}
