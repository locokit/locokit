import { Application, ClientService, feathers, Paginated } from '@feathersjs/feathers'
// import type { Apikey, ApikeyData, ApikeyQuery } from './services/apikey/apikey'
import type {
  WorkspaceData,
  WorkspacePatch,
  WorkspaceResult,
  WorkspaceQuery,
} from './services/workspace/workspace.schema'
import type { UserData, UserResult, UserQuery } from './services/auth/user/user.schema'
import type { Service, TransportConnection, Params } from '@feathersjs/feathers'

// export type { Apikey, ApikeyData, ApikeyQuery }

export type { WorkspaceData, WorkspacePatch, WorkspaceResult, WorkspaceQuery }

// A mapping of client side services
export interface ServiceTypes {
  // apikey: ClientService<
  //   Apikey,
  //   ApikeyData,
  //   Partial<ApikeyData>,
  //   Paginated<Apikey>,
  //   Params<ApikeyQuery>
  // > & {
  //   // Add custom methods here
  // }
  workspace: ClientService<
    WorkspaceResult,
    WorkspaceData,
    WorkspacePatch,
    Paginated<WorkspaceResult>,
    Params<WorkspaceQuery>
  >
  user: Service<UserData, UserResult, Params<UserQuery>>
}

export const createClient = <Configuration = any>(
  connection: TransportConnection<ServiceTypes>,
): Application<ServiceTypes, Configuration> => {
  const client = feathers<ServiceTypes, Configuration>()

  client.configure(connection)

  // client.use('apikey', connection.service('apikey'), {
  //   // List all standard and custom methods
  //   methods: ['find', 'get', 'create', 'update', 'patch', 'remove'],
  // })

  return client
}
