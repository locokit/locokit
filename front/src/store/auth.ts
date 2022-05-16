import lckAbilities from '@/services/lck-abilities'
import { lckClient } from '@/services/lck-api'
import { LckGroup } from '@/services/lck-api/definitions'
import {
  USER_PROFILE,
} from '@locokit/lck-glossary'
import { BaseState } from './state'

class User {
  id!: number;
  email!: string;
  name!: string;
  createdAt!: string;
  isVerified!: boolean
  profile!: USER_PROFILE
  groups?: LckGroup[]
}

class AuthData {
  isAuthenticated = false
  user: User | null = null
  currentGroupId: string | null = null
  expiredToken = false
}

export class AuthDTO {
  email = ''
  password = ''
}

export class AuthState extends BaseState<AuthData> {}

export const authState: AuthState = {
  loading: false,
  error: null,
  data: {
    isAuthenticated: false,
    user: null,
    currentGroupId: null,
    expiredToken: false,
  },
}

export async function retrieveUserGroupsAndWorkspacesAndDatabases (id: string) {
  authState.data.user = await lckClient.service('user').get(id, {
    query: {
      $eager: 'groups.[aclset.[workspace.[databases]]]',
    },
  })
}

export async function reAuthenticate () {
  authState.loading = true
  authState.data.expiredToken = false
  try {
    const result = await lckClient.reAuthenticate()
    lckAbilities.update(result.user.rules)
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
  authState.data.expiredToken = false
  try {
    const result = await lckClient.authenticate({
      strategy: 'local',
      email: data.email,
      password: data.password,
    })
    if (result.user.rules) lckAbilities.update(result.user.rules)
    authState.data.isAuthenticated = true
    await retrieveUserGroupsAndWorkspacesAndDatabases(result.user?.id)
  } catch (error) {
    authState.data.isAuthenticated = false
    authState.error = error as Error
  }
  authState.loading = false
}

export function logout () {
  authState.data = {
    isAuthenticated: false,
    user: null,
    currentGroupId: null,
    expiredToken: false,
  }
  lckAbilities.update([])
  return lckClient.logout()
}

export function updateUsername (username: string) {
  if (authState.data.user) {
    authState.data.user.name = username
  }
}
