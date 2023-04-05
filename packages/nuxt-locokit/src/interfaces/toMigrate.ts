// Todo: to retrieve from definition

export const PROFILE = [
  { label: 'member', value: 'MEMBER' },
  { label: 'creator', value: 'CREATOR' },
  { label: 'admin', value: 'ADMIN' },
]

export interface ProfileType {
  label: string
  value: string
}

export type inputPatternType =
  | boolean
  | number
  | string
  | Array<string | number>
  | Date
  | null

export type LckTableViewFilterPattern =
  | boolean
  | number
  | string
  | Array<string | number>

export interface LckTableViewFilterValue {
  action: string
  column: string
  dbAction: string
  pattern: LckTableViewFilterPattern
}

export interface LckTableViewFilter {
  operator: string
  values: LckTableViewFilterValue[]
}

export interface FilterAction {
  label: string
  value: string
  predefinedPattern?: string | number | boolean | string[]
  patternPrefix?: string
  patternSuffix?: string
}

export interface Filter {
  operator: string
  column: null | {
    name: string
    slug: string
    original_type_id: number
    column_type_id: number
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

export interface UserGroup {
  userId: string
  groupId: string
}

export interface Group {
  id: string
  name: string
  documentation: string | null
  workspaceId: string
  roleId: string
  workspace?: Workspace | null
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

export interface ApiUserGroup extends Pagination<UserGroup> {}

export interface ApiGroup extends Pagination<Group> {}

export interface ApiUser extends Pagination<User> {}
