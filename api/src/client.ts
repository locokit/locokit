import {
  Application,
  ClientService,
  feathers,
  Paginated,
} from '@feathersjs/feathers'
import type { Apikey, ApikeyData, ApikeyQuery } from './services/apikey/apikey'
import type { WData, WPatch, WResult, WQuery } from './services/w/w.schema'
import type {
  UsersData,
  UsersResult,
  UsersQuery,
} from './services/users/users.schema'
import type { Service, TransportConnection, Params } from '@feathersjs/feathers'

export type { Apikey, ApikeyData, ApikeyQuery }

export type { WData, WPatch, WResult, WQuery }

// A mapping of client side services
export interface ServiceTypes {
  apikey: ClientService<
    Apikey,
    ApikeyData,
    Partial<ApikeyData>,
    Paginated<Apikey>,
    Params<ApikeyQuery>
  > & {
    // Add custom methods here
  }
  w: ClientService<WResult, WData, WPatch, Paginated<WResult>, Params<WQuery>>
  users: Service<UsersData, UsersResult, Params<UsersQuery>>
}

export const createClient = <Configuration = any>(
  connection: TransportConnection<ServiceTypes>,
): Application<ServiceTypes, Configuration> => {
  const client = feathers<ServiceTypes, Configuration>()

  client.configure(connection)

  client.use('apikey', connection.service('apikey'), {
    // List all standard and custom methods
    methods: ['find', 'get', 'create', 'update', 'patch', 'remove'],
  })

  return client
}
