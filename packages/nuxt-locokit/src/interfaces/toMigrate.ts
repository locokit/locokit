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
