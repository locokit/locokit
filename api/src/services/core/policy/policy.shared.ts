// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { ClientApplication } from '@/client'
import { SERVICES } from '@locokit/definitions'
import { PolicyService } from './policy.class'
export type { PolicyData, PolicyPatch, PolicyResult, PolicyQuery } from './policy.schema'

export type PolicyClientService = Pick<PolicyService, (typeof policyMethods)[number]>

export const policyPath = SERVICES.CORE_POLICY

export const policyMethods = ['find', 'get', 'create', 'update', 'patch', 'remove'] as const

export const policyClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(policyPath, connection.service(policyPath), {
    methods: policyMethods,
  })
}

// Add this service to the client service type index
declare module '../../../client' {
  interface ServiceTypes {
    [policyPath]: PolicyClientService
  }
}
