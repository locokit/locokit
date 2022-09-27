import { querySyntax } from '@feathersjs/schema'
import type { Infer } from '@feathersjs/schema'
import { defaultDataSchema, lckSchema } from './default.schema'
// import ajv from './ajv'

// Schema for the basic data model (e.g. creating new entries)
export const usersDataSchema = lckSchema({
  $id: 'UsersData',
  type: 'object',
  additionalProperties: false,
  required: ['email', 'password'],
  properties: {
    ...defaultDataSchema.properties,
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
    },
    auth0Id: {
      type: 'string',
    },
  },
} as const)

export type UsersData = Infer<typeof usersDataSchema>

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

export type UsersPatch = Infer<typeof usersPatchSchema>

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

export type UsersResult = Infer<typeof usersResultSchema>

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

export type UsersQuery = Infer<typeof usersQuerySchema>
