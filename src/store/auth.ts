import lckClient from '@/services/lck-api'
import { BaseState } from './state'

class User {
  email = ''
  name = ''
  profile = ''
  id = ''
}

class Group {
  name = ''
  permissions: string[] = []
}

class AuthData {
  isAuthenticated = false
  user: User | null = null
  groups: Group[] = []
}

class AuthDTO {
  email = ''
  password = ''
}

class AuthState extends BaseState<AuthData> {}

export const authState: AuthState = {
  loading: false,
  error: null,
  data: {
    isAuthenticated: false,
    user: null,
    groups: []
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
    user: null,
    groups: []
  }
  return lckClient.logout()
}
