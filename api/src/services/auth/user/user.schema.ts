import { querySyntax } from '@feathersjs/schema'
import { PROFILE } from '@locokit/definitions'
import type { Infer } from '@feathersjs/schema'
import { defaultDataSchema, lckSchema } from '../../../schemas/default.schema'

// Schema for the basic data model (e.g. creating new entries)
export const userDataSchema = lckSchema({
  $id: 'UserData',
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
      type: ['string', 'number'],
      anyOf: [
        {
          type: 'string',
          format: 'date-time',
        },
        {
          type: 'number',
        },
      ],
      nullable: true,
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
      type: ['string', 'number'],
      anyOf: [
        {
          type: 'string',
          format: 'date-time',
        },
        {
          type: 'number',
        },
      ],
      nullable: true,
    },
    resetAttempts: {
      readOnly: true,
      type: 'number',
    },
  },
} as const)

export type UserData = Infer<typeof userDataSchema> & {
  profile: PROFILE
}

// Schema for making partial updates
export const userPatchSchema = lckSchema({
  $id: 'UserPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...userDataSchema.properties,
  },
} as const)

export type UserPatch = Infer<typeof userPatchSchema> & {
  profile: PROFILE
}

// Schema for the data that is being returned
export const userResultSchema = lckSchema({
  $id: 'UserResult',
  type: 'object',
  additionalProperties: false,
  required: ['id'],
  properties: {
    ...userDataSchema.properties,
    id: {
      type: 'string',
    },
  },
} as const)

export type UserResult = Infer<typeof userResultSchema> & {
  profile: PROFILE
}

// Queries shouldn't allow doing anything with the password
const { password, ...userQueryProperties } = userResultSchema.properties

// Schema for allowed query properties
export const userQuerySchema = lckSchema({
  $id: 'UserQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(userQueryProperties),
  },
} as const)

export type UserQuery = Infer<typeof userQuerySchema> & {
  profile: PROFILE
}
