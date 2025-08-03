export const USER_PROFILE = Object.freeze({
  MEMBER: 'MEMBER',
  CREATOR: 'CREATOR',
  ADMIN: 'ADMIN',
})

export const GROUP_ROLE = Object.freeze({
  MEMBER: 'MEMBER',
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
})

export type LocoKitUser = {
  id: string
  username: string
  email: string
  firstName?: string
  lastName?: string
  profile?: string
  avatarURL?: string
  createdAt?: Date
  updatedAt?: Date
  lastConnection?: Date
}
