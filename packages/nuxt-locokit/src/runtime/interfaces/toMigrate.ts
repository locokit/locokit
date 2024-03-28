// Todo: to retrieve from definition

export const PROFILE = [
  { name: 'member', value: 'MEMBER' },
  { name: 'creator', value: 'CREATOR' },
  { name: 'admin', value: 'ADMIN' },
]

export const TYPE_DATASOURCE = [
  { name: 'local', value: 'local' },
  { name: 'remote', value: 'remote' },
]
export const CLIENT_DATASOURCE = [
  { name: 'pg', value: 'pg' },
  { name: 'sqlite3', value: 'sqlite3' },
]

export interface LabelValueType {
  name: string
  value: string
}

// Double with design-system (filter)
export type inputPatternType =
  | boolean
  | number
  | string
  | Array<string | number>
  | Date
  | null

// Double with design-system (filter)
export interface FilterAction {
  label: string
  featherKey: string
  predefinedPattern?: string | number | boolean | string[]
  patternPrefix?: string
  patternSuffix?: string
}

// Double with design-system (filter)
export interface Filter {
  operator: string
  column: null | {
    name: string
    field: string
    type: string
  }
  action: FilterAction | null
  motif: inputPatternType
}

interface Pagination<data> {
  total: number
  limit: number
  skip: number
  data: data[]
}

export interface Policy {
  id: string
  name: string
  documentation: string | null
}

export interface Datasource {
  id: string
  name: string
  slug: string
  documentation: string | null
  client: string
  type: string
  connection: string
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface Workspace {
  id: string
  name: string
  slug: string
  public: boolean
  documentation: string | null
  settings: {
    color: string
    backgroundColor: string
    icon: string
  } | null
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface User {
  id: string
  username: string
  lastName: string | null
  firstName: string | null
  email: string
  profile: string
  isBlocked: boolean
  isVerified: boolean
}

export interface UserGroup {
  userId: string
  groupId: string
}

export interface Group {
  id: string
  name: string
  documentation: string | null
  workspaceId: string
  policyId: string
  workspace?: Workspace | null
  policy?: Policy | null
  users?: User[] | null
}

export type ApiPolicy = Pagination<Policy>

export type ApiWorkspace = Pagination<Workspace>

export type ApiUserGroup = Pagination<UserGroup>

export type ApiGroup = Pagination<Group>

export type ApiUser = Pagination<User>
