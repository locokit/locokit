// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { ClientApplication } from '@/client'
import { SERVICES } from '@locokit/definitions'
import type { WorkspaceDatasourceService } from './datasource.class'
export type {
  WorkspaceDatasourceData,
  WorkspaceDatasourcePatch,
  WorkspaceDatasourceQuery,
} from './datasource.schema'

export type WorkspaceDatasourceClientService = Pick<
  WorkspaceDatasourceService,
  (typeof workspaceDatasourceMethods)[number]
>

export const workspaceDatasourcePath = SERVICES.WORKSPACE_DATASOURCE

export const workspaceDatasourceMethods = ['find', 'get', 'create', 'remove', 'patch'] as const

export const workspaceDatasourceClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(workspaceDatasourcePath, connection.service(workspaceDatasourcePath), {
    methods: workspaceDatasourceMethods,
  })
}

// Add this service to the client service type index
declare module '../../../client' {
  interface ServiceTypes {
    [workspaceDatasourcePath]: WorkspaceDatasourceClientService
  }
}
