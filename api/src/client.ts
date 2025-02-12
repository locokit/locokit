// import { Application, ClientService, feathers, Paginated } from '@feathersjs/feathers'
// // import type { Apikey, ApikeyData, ApikeyQuery } from './services/apikey/apikey'
// // export type { Apikey, ApikeyData, ApikeyQuery }

// For more information about this file see https://dove.feathersjs.com/guides/cli/client.html
import { feathers } from '@feathersjs/feathers'
import type { TransportConnection, Application } from '@feathersjs/feathers'
import authenticationClient from '@feathersjs/authentication-client'
import type { AuthenticationClientOptions } from '@feathersjs/authentication-client'

import { signupClient } from './services/auth/signup/signup.shared'
import './services/auth/authentication/authentication.shared'
import { authManagementClient } from './services/auth/authmanagement/authmanagement.shared'

import { userClient } from './services/core/user/user.shared'
import { groupClient } from './services/core/group/group.shared'
import { userGroupClient } from './services/core/user-group/user-group.shared'
import { workspaceClient } from './services/core/workspace/workspace.shared'
import { datasourceClient } from './services/core/datasource/datasource.shared'
import { policyClient } from './services/core/policy/policy.shared'

import { SERVICES } from '@locokit/definitions'
import { workspaceDatasourceClient } from './services/workspace/datasource/datasource.shared'

export type { SignUpData } from './services/auth/signup/signup.shared'

export type { User, UserData, UserQuery, UserPatch } from './services/core/user/user.shared'
export type { GroupData, GroupPatch, GroupQuery } from './services/core/group/group.shared'
export type {
  UserGroupData,
  UserGroupPatch,
  UserGroupQuery,
} from './services/core/user-group/user-group.shared'
export type {
  WorkspaceData,
  WorkspacePatch,
  WorkspaceQuery,
  WorkspaceResult,
} from './services/core/workspace/workspace.shared'
export type {
  DatasourceData,
  DatasourcePatch,
  DatasourceQuery,
} from './services/core/datasource/datasource.shared'
export type {
  PolicyData,
  PolicyPatch,
  PolicyQuery,
  PolicyResult,
} from './services/core/policy/policy.shared'

export interface Configuration {
  connection: TransportConnection<ServiceTypes>
}

export interface ServiceTypes {}

export type ClientApplication = Application<ServiceTypes, Configuration>

/**
 * Returns a typed client for the feathers-chat app.
 *
 * @param connection The REST or Socket.io Feathers client connection
 * @param authenticationOptions Additional settings for the authentication client
 * @see https://dove.feathersjs.com/api/client.html
 * @returns The Feathers client application
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createClient = <Configuration = any>(
  connection: TransportConnection<ServiceTypes>,
  authenticationOptions: Partial<Omit<AuthenticationClientOptions, 'path'>> = {},
) => {
  const client: ClientApplication = feathers()

  client.configure(connection)
  client.configure(
    authenticationClient({
      ...authenticationOptions,
      path: SERVICES.AUTH_AUTHENTICATION,
    }),
  )
  client.set('connection', connection)

  /**
   * Auth services configuration
   */
  client.configure(signupClient)
  client.configure(authManagementClient)

  /**
   * Core services configuration
   */
  client.configure(userClient)
  client.configure(groupClient)
  client.configure(userGroupClient)
  client.configure(workspaceClient)
  client.configure(datasourceClient)
  client.configure(policyClient)

  /**
   * Workspace services configuration
   */
  client.configure(workspaceDatasourceClient)

  return client
}
