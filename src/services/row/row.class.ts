import { Service, ObjectionServiceOptions } from 'feathers-objection'
import { Application } from '../../declarations'
// import { Params, NullableId } from '@feathersjs/feathers';
// import { row } from '../../models/row.model';

interface Options extends ObjectionServiceOptions {
  Model: any
}

export class Row extends Service {
  constructor (options: Partial<Options>, app: Application) {
    const { Model, ...otherOptions } = options

    super({
      ...otherOptions,
      model: Model,
    })
  }

  // async patch(id: NullableId, data: Partial<row>, params?: Params) {
  //   // Call the original `create` method with existing `params` and new data
  //   return super.patch(id, data, params);
  // }
}
