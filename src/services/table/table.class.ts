import { Service, ObjectionServiceOptions } from 'feathers-objection';
import { Application } from '../../declarations';

interface Options extends ObjectionServiceOptions {
  Model: any;
}

export class Table extends Service {
  constructor(options: Partial<Options>, app: Application) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
}
