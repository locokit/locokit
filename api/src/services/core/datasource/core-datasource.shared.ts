// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { ClientApplication } from '@/client'
import { SERVICES } from '@locokit/definitions'
import type { CoreDatasourceService } from './core-datasource.class'
export type {
  CoreDatasourceData,
  CoreDatasourcePatch,
  CoreDatasourceQuery,
} from './core-datasource.schema'

export type DatasourceClientService = Pick<
  CoreDatasourceService,
  (typeof datasourceMethods)[number]
>

export const datasourcePath = SERVICES.CORE_DATASOURCE

export const datasourceMethods = ['find', 'get', 'patch'] as const

export const datasourceClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(datasourcePath, connection.service(datasourcePath), {
    methods: datasourceMethods,
  })
}

// Add this service to the client service type index
declare module '../../../client' {
  interface ServiceTypes {
    [datasourcePath]: DatasourceClientService
  }
}
