import lckClient from '@/services/lck-api'
import {
  USER_PROFILE,
  GROUP_ROLE,
  WORKSPACE_ROLE
} from '@locokit/lck-glossary'
import { BaseState } from './state'

class Workspace {
  id!: string;
  text!: string;
}

class Group {
  id!: string;
  name!: string;
  workspace?: Workspace;
  workspace_id?: string;
  workspace_role?: typeof WORKSPACE_ROLE;
  uhg_role!: GROUP_ROLE;
}

class User {
  id!: number;
  email!: string;
  name!: string;
  isVerified!: boolean
  profile!: typeof USER_PROFILE
  groups?: Group[]
}

class AuthData {
  isAuthenticated = false
  user: User | null = null
}

export class AuthDTO {
  email = ''
  password = ''
}

class AuthState extends BaseState<AuthData> {}

export const authState: AuthState = {
  loading: false,
  error: null,
  data: {
    isAuthenticated: false,
    user: null
  }
}

export async function retrieveUserGroupsAndWorkspacesAndDatabases (id: string) {
  authState.loading = true
  try {
    authState.data.user = await lckClient.service('user').get(id, {
      query: {
        $eager: 'groups.[workspace.[databases]]'
      }
    })
  } catch (error) {
    authState.error = error
  }
  authState.loading = false
}

export async function reAuthenticate () {
  authState.loading = true
  try {
    const result = await lckClient.reAuthenticate()
    authState.data.isAuthenticated = true
    await retrieveUserGroupsAndWorkspacesAndDatabases(result.user?.id)
  } catch (error) {
    authState.data.isAuthenticated = false
  }
  authState.loading = false
}

export async function authenticate (data: AuthDTO) {
  authState.loading = true
  authState.error = null
  try {
    const result = await lckClient.authenticate({
      strategy: 'local',
      email: data.email,
      password: data.password
    })
    authState.data.isAuthenticated = true
    await retrieveUserGroupsAndWorkspacesAndDatabases(result.user?.id)
  } catch (error) {
    authState.data.isAuthenticated = false
    authState.error = error
  }
  authState.loading = false
}

export function logout () {
  authState.data = {
    isAuthenticated: false,
    user: null
  }
  return lckClient.logout()
}
