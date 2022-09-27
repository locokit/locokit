import { querySyntax } from '@feathersjs/schema'
import type { Infer } from '@feathersjs/schema'
import { defaultDataSchema, lckSchema } from '../../schemas/default.schema'
// import ajv from '../../schemas/ajv'

// Schema for the basic data model (e.g. creating new entries)
export const wDataSchema = lckSchema({
  $id: 'WData',
  type: 'object',
  additionalProperties: false,
  required: ['name'],
  properties: {
    ...defaultDataSchema.properties,
    name: {
      type: 'string',
      description: 'Name of the workspace',
    },
    slug: {
      type: 'string',
      description:
        'Slug to reference the workspace in URL, easier to read/memorize for end users',
    },
    legacy: {
      type: 'boolean',
      description: 'Does this workspace use the legacy mode for storing data',
    },
    public: {
      type: 'boolean',
      description: 'Allow the workspace to be findable/visible publicly',
    },
    documentation: {
      type: 'string',
      description: 'Explain what is this workspace',
    },
    settings: {
      type: 'object',
      description: "Workspace's settings",
      properties: {
        color: {
          type: 'string',
          description: 'Main color for this workspace',
        },
        backgroundColor: {
          type: 'string',
          description: 'Main background color for this workspace',
        },
        icon: {
          type: 'string',
          description: 'Icon displayed in the workspace list',
        },
      },
    },
  },
} as const)

export type WData = Infer<typeof wDataSchema>

// Schema for making partial updates
export const wPatchSchema = lckSchema({
  $id: 'WPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...wDataSchema.properties,
  },
} as const)

export type WPatch = Infer<typeof wPatchSchema>

// Schema for the data that is being returned
export const wResultSchema = lckSchema({
  $id: 'WResult',
  type: 'object',
  additionalProperties: false,
  required: [...wDataSchema.required, 'id'],
  properties: {
    ...wDataSchema.properties,
    id: {
      type: 'number',
    },
  },
} as const)

export type WResult = Infer<typeof wResultSchema>

// Schema for allowed query properties
export const wQuerySchema = lckSchema({
  $id: 'WQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(wResultSchema.properties),
  },
} as const)

export type WQuery = Infer<typeof wQuerySchema>
