import { querySyntax } from '@feathersjs/schema'
import { PROFILE } from '@locokit/definitions'
import type { Infer } from '@feathersjs/schema'
import { defaultDataSchema, lckSchema } from '../../schemas/default.schema'

// Schema for the basic data model (e.g. creating new entries)
export const usersDataSchema = lckSchema({
  $id: 'UsersData',
  type: 'object',
  additionalProperties: false,
  required: ['email'],
  properties: {
    ...defaultDataSchema.properties,
    email: {
      type: 'string',
      format: 'email',
    },
    name: {
      type: 'string',
    },
    password: {
      type: 'string',
    },
    auth0Id: {
      type: 'string',
    },
    profile: {
      type: 'string',
      format: 'user-profile',
    },
    blocked: {
      type: 'boolean',
      default: false,
    },
    isVerified: {
      readOnly: true,
      type: 'boolean',
      default: false,
    },
    verifyToken: {
      readOnly: true,
      type: 'string',
    },
    verifyShortToken: {
      readOnly: true,
      type: 'string',
    },
    verifyExpires: {
      readOnly: true,
      type: 'number',
      format: 'date-time',
    },
    verifyChanges: {
      readOnly: true,
      type: 'object',
    },
    resetToken: {
      readOnly: true,
      type: 'string',
    },
    resetShortToken: {
      readOnly: true,
      type: 'string',
    },
    resetExpires: {
      readOnly: true,
      type: 'number',
      format: 'date-time',
    },
    resetAttempts: {
      readOnly: true,
      type: 'number',
    },
  },
} as const)

export type UsersData = Infer<typeof usersDataSchema> & {
  profile: PROFILE
}

// Schema for making partial updates
export const usersPatchSchema = lckSchema({
  $id: 'UsersPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...usersDataSchema.properties,
  },
} as const)

export type UsersPatch = Infer<typeof usersPatchSchema> & {
  profile: PROFILE
}

// Schema for the data that is being returned
export const usersResultSchema = lckSchema({
  $id: 'UsersResult',
  type: 'object',
  additionalProperties: false,
  required: ['id'],
  properties: {
    ...usersDataSchema.properties,
    id: {
      type: 'string',
    },
  },
} as const)

export type UsersResult = Infer<typeof usersResultSchema> & {
  profile: PROFILE
}

// Queries shouldn't allow doing anything with the password
const { password, ...usersQueryProperties } = usersResultSchema.properties

// Schema for allowed query properties
export const usersQuerySchema = lckSchema({
  $id: 'UsersQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(usersQueryProperties),
  },
} as const)

export type UsersQuery = Infer<typeof usersQuerySchema> & {
  profile: PROFILE
}
