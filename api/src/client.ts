import { Application, feathers } from '@feathersjs/feathers'
import type {
  UsersData,
  UsersResult,
  UsersQuery,
} from './schemas/users.schema'
import type { Service, TransportConnection, Params } from '@feathersjs/feathers'

// A mapping of client side services
export interface ServiceTypes {
  'users': Service<UsersData, UsersResult, Params<UsersQuery>>
}

export const createClient = <Configuration = any> (connection: TransportConnection<ServiceTypes>): Application<ServiceTypes, Configuration> => {
  const client = feathers<ServiceTypes, Configuration>()

  client.configure(connection)

  return client
}
