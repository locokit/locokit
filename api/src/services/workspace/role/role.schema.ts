import { querySyntax } from '@feathersjs/schema'
import type { Infer } from '@feathersjs/schema'
import { defaultDataSchema, lckSchema } from '../../../schemas/default.schema'

export const roleDataSchema = lckSchema({
  $id: 'Role',
  type: 'object',
  additionalProperties: false,
  required: ['name'],
  properties: {
    ...defaultDataSchema.properties,
    name: {
      type: 'string',
      description: 'Name of the role',
    },
    manager: {
      type: 'boolean',
      description:
        'Role is a manager role of the related workspace. Users with this role can manage this workspace.',
    },
    documentation: {
      type: 'string',
      description: 'Documentation of the role',
    },
    workspaceId: {
      type: 'string',
      format: 'uuid',
      description: 'Related workspace',
    },
  },
} as const)

export type RoleData = Infer<typeof roleDataSchema>

// Schema for making partial updates
export const rolePatchSchema = lckSchema({
  $id: 'RolePatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...roleDataSchema.properties,
  },
} as const)

export type RolePatch = Infer<typeof rolePatchSchema>

// Schema for the data that is being returned
export const roleResultSchema = lckSchema({
  $id: 'RoleResult',
  type: 'object',
  additionalProperties: false,
  required: [...roleDataSchema.required, 'id'],
  properties: {
    ...roleDataSchema.properties,
    id: {
      type: 'number',
    },
  },
} as const)

export type RoleResult = Infer<typeof roleResultSchema>

// Schema for allowed query properties
export const roleQuerySchema = lckSchema({
  $id: 'RoleQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(roleResultSchema.properties),
  },
} as const)

export type RoleQuery = Infer<typeof roleQuerySchema>
