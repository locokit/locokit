import type { Application } from '../../declarations'
import { HookContext, Id, NullableId, Params, Service } from '@feathersjs/feathers';
import { app } from '../../app';
import LckDBAdapter from '../../adapters';
import { resolveAll, resolve, schema } from '@feathersjs/schema'

class WorkspaceService {
  async find(params: Params) {
    console.log('find', params)
    return []
  }
  async get(id: Id, params: Params) {
    console.log('get', id, params)
    return {}
  }
}

class DataProviderService {
  async find (params: Params) {
    console.log('pouet', params)
    return app.get('locokit-providers')
  }

  async get (id: Id, params: Params) {
    const dpParams = app.get('locokit-providers')?.find((dp: any) => dp.name === id) as {
      type: 'pg' | 'sqlite3' | 'baserow',
      name: string,
      options: any
    }
    const adapter = new LckDBAdapter(dpParams.type, dpParams.options)
    return await adapter.retrieveSchema()
  }
}

class TableService {
  async find (params: Params) {
    console.log('find', params)
    const slugDP = params.route?.slug_dp as string
    const dpParams = app.get('locokit-providers')?.find((dp: any) => dp.name === slugDP) as {
      type: 'pg' | 'sqlite3' | 'baserow',
      name: string,
      options: any
    }
    const adapter = new LckDBAdapter(dpParams.type, dpParams.options)
    return await adapter.retrieveTables()
  }
  async get (id: Id, params: Params) {
    console.log('get', params)
    const slugDP = params.route?.slug_dp as string
    const dpParams = app.get('locokit-providers')?.find((dp: any) => dp.name === slugDP) as {
      type: 'pg' | 'sqlite3' | 'baserow',
      name: string,
      options: any
    }
    const adapter = new LckDBAdapter(dpParams.type, dpParams.options)
    return await adapter.retrieveTable(id as string)
  }
}

class RecordService {
  async find (params: Params) {
    console.log('find', params)
    const slugDP = params.route?.slug_dp as string
    const slugTable = params.route?.slug_t as string
    const dpParams = app.get('locokit-providers')?.find((dp: any) => dp.name === slugDP) as {
      type: 'pg' | 'sqlite3' | 'baserow',
      name: string,
      options: any
    }
    const dbAdapter = new LckDBAdapter(dpParams.type, dpParams.options)
    const results = await dbAdapter.queryTable(slugTable, params)
    return results
  }

  async create (data: any, params: Params) {
    console.log('create', data, params)
    const slugDP = params.route?.slug_dp as string
    const slugTable = params.route?.slug_t as string
    console.log(slugDP, slugTable)
    const dpParams = app.get('locokit-providers')?.find((dp: any) => dp.name === slugDP) as {
      type: 'pg' | 'sqlite3' | 'baserow',
      name: string,
      options: any
    }
    const dbAdapter = new LckDBAdapter(dpParams.type, dpParams.options)
    return await dbAdapter.createRecord(slugTable, data)
  }
}

export function workspaces (app: Application) {
  app.use('w', new WorkspaceService(), {
    methods: ['find', 'get']
  })
  app.use('w/:slug_ws/dp', new DataProviderService(), {
    methods: ['find', 'get']
  })
  app.use('w/:slug_ws/dp/:slug_dp/t', new TableService(), {
    methods: ['find', 'get']
  })
  app.use('w/:slug_ws/dp/:slug_dp/t/:slug_t/r', new RecordService(), {
    methods: ['find', 'create']
  })
  app.service('w/:slug_ws/dp/:slug_dp/t/:slug_t/r').hooks({
    before: {
      create: [
        async function checkSchema(context: HookContext<Application, RecordService>) {
          console.log('checkSchema', context.data, context.params)
          const slugDP = context.params.route?.slug_dp as string
          const slugTable = context.params.route?.slug_t as string
          const dpParams = app.get('locokit-providers')?.find((dp: any) => dp.name === slugDP) as {
            type: 'pg' | 'sqlite3' | 'baserow',
            name: string,
            options: any
          }
          const dbAdapter = new LckDBAdapter(dpParams.type, dpParams.options)
          const { columns } = await dbAdapter.retrieveTableSchema(slugTable)
          const properties: Record<string, any> = {}
          columns.forEach(function (c) {
            properties[c.name] = {
              type: 'string'
            }
            if (c.foreign_key_column) {
              properties[c.foreign_key_table as string] = {
                type: 'object',
                additionalProperties: true
              }
            }
          })
          const recordSchema = schema({
            $id: slugTable,
            type: 'object',
            additionalProperties: false,
            properties
          } as const)
          context.data = await recordSchema.validate(context.data)
          console.log('sortie', context.data)
          return context
          // return resolveAll({
          //   data: {
          //     create: resolve<UsersQuery, HookContext>({
          //       schema: usersQuerySchema,
          //       validate: 'before',
          //       properties: {
          //         // If there is a user (e.g. with authentication), they are only allowed to see their own data
          //         id: async (value, user, context) => {
          //           if (context.params.user) {
          //             return context.params.user.id
          //           }
              
          //           return value
          //         }
          //       }
          //     })
          //   }
          // })
        }
      ]
    }
  })

}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'w': WorkspaceService
    'w/:slug_ws/dp': DataProviderService
    // 'w/:slug_ws/dp/:slug_dp/sync': SyncDPService
    'w/:slug_ws/dp/:slug_dp/t': TableService
    'w/:slug_ws/dp/:slug_dp/t/:slug_t/r': RecordService
    // 'w/:slug_ws/dp/:slug_dp/t/:slug_t/f': FieldService
    // 'w/:slug_ws/dp/:slug_dp/t/:slug_t/v': ViewService
    // 'w/:slug_ws/dp/:slug_dp/t/:slug_t/v/:slug_v/f': FieldService
    // 'w/:slug_ws/dp/:slug_dp/t/:slug_t/v/:slug_v/r': RecordService
    // 'w/:slug_ws/sdk': SDKService
    // 'w/:slug_ws/graphql': GraphQLService
    // 'w/:slug_ws/swagger': SwaggerService
  }
}
