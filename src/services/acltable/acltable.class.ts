import { Service, ObjectionServiceOptions } from 'feathers-objection'
import { ServiceSwaggerOptions } from 'feathers-swagger'
import { Application } from '../../declarations'
import { LckAclTable } from '../../models/acltable.model'

interface Options extends ObjectionServiceOptions {
  Model: any
}

export class ServiceAclTable extends Service {
  public docs: ServiceSwaggerOptions

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor (options: Partial<Options>, app: Application) {
    const { Model, ...otherOptions } = options

    super({
      ...otherOptions,
      model: Model,
    })

    this.docs = {
      description: `
This service give access to ACL linked to tables.

Each table-acl combination offers abilities to the aclset related :
* create_rows give users permission to create new rows in this table
* read_rows give users permission to read some or all rows in this table, according read_filters
* update_rows give users permission to update some or all rows in this table, according update_filters
* delete_rows give users permission to delete some or all rows in this table, according delete_filters
* read_filters are filters applied to the rows to allow access only to the rows respecting filters
* update_filters are filters applied to the rows to allow update only to the rows respecting filters
* delete_filters are filters applied to the rows to allow delete only to the rows respecting filters
`,
      definition: LckAclTable.jsonSchema,
    }
  }
}
