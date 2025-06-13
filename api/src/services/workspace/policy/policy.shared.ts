// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { ClientApplication } from '@/client'
import { SERVICES } from '@locokit/definitions'
import { WorkspacePolicyService } from './policy.class'
export type {
  WorkspacePolicyData,
  WorkspacePolicyPatch,
  WorkspacePolicyResult,
  WorkspacePolicyQuery,
} from './policy.schema'

export type WorkspacePolicyClientService = Pick<
  WorkspacePolicyService,
  (typeof workspacePolicyMethods)[number]
>

export const workspacePolicyPath = SERVICES.WORKSPACE_POLICY

export const workspacePolicyMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const workspacePolicyClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(workspacePolicyPath, connection.service(workspacePolicyPath), {
    methods: workspacePolicyMethods,
  })
}

// Add this service to the client service type index
declare module '../../../client' {
  interface ServiceTypes {
    [workspacePolicyPath]: WorkspacePolicyClientService
  }
}
