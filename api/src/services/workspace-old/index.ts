// /* eslint-disable @typescript-eslint/explicit-function-return-type */
// import { LocoKitEngine } from '@locokit/engine'
// import { SwaggerService as LocokitSwaggerService } from 'feathers-locokit'
// import { schema } from '@feathersjs/schema'
// import { HookContext, Id, Params } from '@feathersjs/feathers'
// import type { Application } from '../../declarations'
// import { app } from '../../app'

// class TableService {
//   async find(params: Params) {
//     console.log('find', params)
//     const slugDP = params.route?.slug_dp as string
//     const dpParams = app
//       .get('locokit-providers')
//       ?.find((dp: any) => dp.name === slugDP) as {
//       type: 'pg' | 'sqlite3' | 'baserow'
//       name: string
//       options: any
//     }
//     const adapter = await LocoKitEngine.createAdapter(dpParams)
//     return await adapter.retrieveTables()
//   }

//   async get(id: Id, params: Params) {
//     console.log('get', params)
//     const slugDP = params.route?.slug_dp as string
//     const dpParams = app
//       .get('locokit-providers')
//       ?.find((dp: any) => dp.name === slugDP) as {
//       type: 'pg' | 'sqlite3' | 'baserow'
//       name: string
//       options: any
//     }
//     const adapter = await LocoKitEngine.createAdapter(dpParams)
//     return await adapter.retrieveTableSchema(id as string)
//   }
// }

// class RecordService {
//   async get(id: string | number, params: Params) {
//     console.log('get', id, params)
//     const slugDP = params.route?.slug_dp as string
//     const slugTable = params.route?.slug_t as string
//     const dpParams = app
//       .get('locokit-providers')
//       ?.find((dp: any) => dp.name === slugDP) as {
//       type: 'pg' | 'sqlite3' | 'baserow'
//       name: string
//       options: any
//     }
//     const dbAdapter = await LocoKitEngine.createAdapter(dpParams)
//     const results = await dbAdapter.getRecord(slugTable, id)
//     return results
//   }

//   async find(params: Params) {
//     console.log('find', params)
//     const slugDP = params.route?.slug_dp as string
//     const slugTable = params.route?.slug_t as string
//     const dpParams = app
//       .get('locokit-providers')
//       ?.find((dp: any) => dp.name === slugDP) as {
//       type: 'pg' | 'sqlite3' | 'baserow'
//       name: string
//       options: any
//     }
//     const dbAdapter = await LocoKitEngine.createAdapter(dpParams)
//     const results = await dbAdapter.queryTable(slugTable, params)
//     return results
//   }

//   async create(data: any, params: Params) {
//     console.log('create', data, params)
//     const slugDP = params.route?.slug_dp as string
//     const slugTable = params.route?.slug_t as string
//     console.log(slugDP, slugTable)
//     const dpParams = app
//       .get('locokit-providers')
//       ?.find((dp: any) => dp.name === slugDP) as {
//       type: 'pg' | 'sqlite3' | 'baserow'
//       name: string
//       options: any
//     }
//     const dbAdapter = await LocoKitEngine.createAdapter(dpParams)
//     return await dbAdapter.createRecord(slugTable, data)
//   }

//   async patch(id: string, data: any, params: Params) {
//     console.log('patch', id, data, params)
//     const slugDP = params.route?.slug_dp as string
//     const slugTable = params.route?.slug_t as string
//     console.log(slugDP, slugTable)
//     const dpParams = app
//       .get('locokit-providers')
//       ?.find((dp: any) => dp.name === slugDP) as {
//       type: 'pg' | 'sqlite3' | 'baserow'
//       name: string
//       options: any
//     }
//     const dbAdapter = await LocoKitEngine.createAdapter(dpParams)
//     return await dbAdapter.patchRecord(slugTable, id, data)
//   }

//   async update(id: string, data: any, params: Params) {
//     console.log('update', id, data, params)
//     const slugDP = params.route?.slug_dp as string
//     const slugTable = params.route?.slug_t as string
//     console.log(slugDP, slugTable)
//     const dpParams = app
//       .get('locokit-providers')
//       ?.find((dp: any) => dp.name === slugDP) as {
//       type: 'pg' | 'sqlite3' | 'baserow'
//       name: string
//       options: any
//     }
//     const dbAdapter = await LocoKitEngine.createAdapter(dpParams)
//     return await dbAdapter.updateRecord(slugTable, id, data)
//   }

//   async remove(id: string, params: Params) {
//     console.log('remove', id, params)
//     const slugDP = params.route?.slug_dp as string
//     const slugTable = params.route?.slug_t as string
//     console.log(slugDP, slugTable)
//     const dpParams = app
//       .get('locokit-providers')
//       ?.find((dp: any) => dp.name === slugDP) as {
//       type: 'pg' | 'sqlite3' | 'baserow'
//       name: string
//       options: any
//     }
//     const dbAdapter = await LocoKitEngine.createAdapter(dpParams)
//     return await dbAdapter.deleteRecord(slugTable, id)
//   }
// }

// class SwaggerService {
//   async find(params: Params) {
//     console.log('find', params)
//     const slugWS = params.route?.slug_ws as string
//     const slugDP = params.route?.slug_dp as string
//     const dpParams = app
//       .get('locokit-providers')
//       ?.find((dp: any) => dp.name === slugDP) as {
//       type: 'pg' | 'sqlite3' | 'baserow'
//       name: string
//       options: any
//     }
//     const swaggerGenerator = new LocokitSwaggerService(
//       dpParams,
//       `/w/${slugWS}/dp/${slugDP}`,
//     )
//     const apiSpec = await swaggerGenerator.generateOpenAPISpec()

//     return apiSpec
//   }
// }

// class GraphQLService {
//   async find(params: Params) {
//     console.log('find', params)
//     const slugWS = params.route?.slug_ws as string
//     const slugDP = params.route?.slug_dp as string
//     const dpParams = app
//       .get('locokit-providers')
//       ?.find((dp: any) => dp.name === slugDP) as {
//       type: 'pg' | 'sqlite3' | 'baserow'
//       name: string
//       options: any
//     }
//     const swaggerGenerator = new LocokitSwaggerService(
//       dpParams,
//       `/w/${slugWS}/dp/${slugDP}`,
//     )
//     return await swaggerGenerator.generateGraphQLSpec()
//   }
// }

// export function workspaces(app: Application) {
//   app.use('w/:slug_ws/dp/:slug_dp/swagger.json', new SwaggerService(), {
//     methods: ['find'],
//   })
//   app.use('w/:slug_ws/dp/:slug_dp/graphql.json', new GraphQLService(), {
//     methods: ['find'],
//   })
//   app.use('w/:slug_ws/dp/:slug_dp/t/:slug_t/r', new RecordService(), {
//     methods: ['get', 'find', 'create', 'patch', 'update', 'remove'],
//   })
//   app.service('w/:slug_ws/dp/:slug_dp/t/:slug_t/r').hooks({
//     before: {
//       create: [
//         async function checkSchema(
//           context: HookContext<Application, RecordService>,
//         ) {
//           console.log('checkSchema', context.data, context.params)
//           const slugDP = context.params.route?.slug_dp as string
//           const slugTable = context.params.route?.slug_t as string
//           const dpParams = app
//             .get('locokit-providers')
//             ?.find((dp: any) => dp.name === slugDP) as {
//             type: 'pg' | 'sqlite3' | 'baserow'
//             name: string
//             options: any
//           }
//           const dbAdapter = await LocoKitEngine.createAdapter(dpParams)
//           const { fields } = await dbAdapter.retrieveTableSchema(slugTable)
//           const properties: Record<string, any> = {}
//           fields.forEach(function (c) {
//             properties[c.name] = {
//               type: 'string',
//             }
//             if (c.foreign_key_column) {
//               properties[c.foreign_key_table as string] = {
//                 type: 'object',
//                 additionalProperties: true,
//               }
//             }
//           })
//           const recordSchema = schema({
//             $id: slugTable,
//             type: 'object',
//             additionalProperties: false,
//             properties,
//           } as const)
//           context.data = await recordSchema.validate(context.data)
//           console.log('sortie', context.data)
//           return context
//           // return resolveAll({
//           //   data: {
//           //     create: resolve<UsersQuery, HookContext>({
//           //       schema: usersQuerySchema,
//           //       validate: 'before',
//           //       properties: {
//           //         // If there is a user (e.g. with authentication), they are only allowed to see their own data
//           //         id: async (value, user, context) => {
//           //           if (context.params.user) {
//           //             return context.params.user.id
//           //           }

//           //           return value
//           //         }
//           //       }
//           //     })
//           //   }
//           // })
//         },
//       ],
//     },
//   })
// }
