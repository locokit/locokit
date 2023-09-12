// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { ClientApplication } from '@/client'
import { SERVICES } from '@locokit/definitions'
import type { WorkspaceService } from './workspace.class'
export type { WorkspaceData, WorkspacePatch, WorkspaceQuery } from './workspace.schema'

export type WorkspaceClientService = Pick<WorkspaceService, (typeof workspaceMethods)[number]>

export const workspacePath = SERVICES.CORE_WORKSPACE

export const workspaceMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const workspaceClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(workspacePath, connection.service(workspacePath), {
    methods: workspaceMethods,
  })
}

// Add this service to the client service type index
declare module '../../../client' {
  interface ServiceTypes {
    [workspacePath]: WorkspaceClientService
  }
}
