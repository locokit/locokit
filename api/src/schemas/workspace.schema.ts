import { schema, querySyntax } from '@feathersjs/schema'
import type { Infer } from '@feathersjs/schema'

// Schema for the basic data model (e.g. creating new entries)
export const workspacesDataSchema = schema({
  $id: 'WorkspacesData',
  type: 'object',
  additionalProperties: false,
  required: ['name'],
  properties: {
    name: {
      type: 'string',
    },
    slug: {
      type: 'string',
    },
    documentation: {
      type: 'string',
    },
    settings: {
      type: 'object',
      properties: {
        color: {
          type: 'string',
        },
        backgroundColor: {
          type: 'string',
        },
        icon: {
          type: 'string',
        },
      },
    },
  },
} as const)

export type WorkspacesData = Infer<typeof workspacesDataSchema>

// Schema for making partial updates
export const workspacesPatchSchema = schema({
  $id: 'WorkspacesPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...workspacesDataSchema.properties,
  },
} as const)

export type WorkspacesPatch = Infer<typeof workspacesPatchSchema>

// Schema for the data that is being returned
export const workspacesResultSchema = schema({
  $id: 'WorkspacesResult',
  type: 'object',
  additionalProperties: false,
  required: ['id'],
  properties: {
    ...workspacesDataSchema.properties,
    id: {
      type: 'string',
    },
  },
} as const)

export type WorkspacesResult = Infer<typeof workspacesResultSchema>

// Schema for allowed query properties
export const workspacesQuerySchema = schema({
  $id: 'WorkspacesQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(workspacesResultSchema.properties),
  },
} as const)

export type WorkspacesQuery = Infer<typeof workspacesQuerySchema>
