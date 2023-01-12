import { PaginationOptions } from '@feathersjs/adapter-commons'
import {
  Paginated,
  ServiceMethods,
  Id,
  NullableId,
  Params,
} from '@feathersjs/feathers'
import { ObjectionAdapter } from './adapter'
import { ObjectionAdapterParams } from './declarations'

export * from './declarations'
export * from './adapter'
export * from './error-handler'
export * as transaction from './hooks'

export class ObjectionService<
    Result,
    Data = Partial<Result>,
    ServiceParams extends Params<any> = ObjectionAdapterParams,
    PatchData = Partial<Data>,
  >
  extends ObjectionAdapter<Result, Data, ServiceParams, PatchData>
  implements
    ServiceMethods<Result | Paginated<Result>, Data, ServiceParams, PatchData>
{
  async find(
    params?: ServiceParams & { paginate?: PaginationOptions },
  ): Promise<Paginated<Result>>
  async find(params?: ServiceParams & { paginate: false }): Promise<Result[]>
  async find(params?: ServiceParams): Promise<Paginated<Result> | Result[]>
  async find(params?: ServiceParams): Promise<Paginated<Result> | Result[]> {
    return this._find(params) as any
  }

  async get(id: Id, params?: ServiceParams): Promise<Result> {
    return await this._get(id, params)
  }

  async create(data: Data, params?: ServiceParams): Promise<Result>
  async create(data: Data[], params?: ServiceParams): Promise<Result[]>
  async create(
    data: Data | Data[],
    params?: ServiceParams,
  ): Promise<Result | Result[]> {
    return await this._create(data, params)
  }

  async update(id: Id, data: Data, params?: ServiceParams): Promise<Result> {
    return await this._update(id, data, params)
  }

  async patch(id: Id, data: PatchData, params?: ServiceParams): Promise<Result>
  async patch(
    id: null,
    data: PatchData,
    params?: ServiceParams,
  ): Promise<Result[]>
  async patch(
    id: NullableId,
    data: PatchData,
    params?: ServiceParams,
  ): Promise<Result | Result[]> {
    return await this._patch(id, data, params)
  }

  async remove(id: Id, params?: ServiceParams): Promise<Result>
  async remove(id: null, params?: ServiceParams): Promise<Result[]>
  async remove(
    id: NullableId,
    params?: ServiceParams,
  ): Promise<Result | Result[]> {
    return await this._remove(id, params)
  }
}
