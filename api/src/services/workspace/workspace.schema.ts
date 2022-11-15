import { querySyntax } from '@feathersjs/schema'
import type { Infer } from '@feathersjs/schema'
import { defaultDataSchema, lckSchema } from '../../schemas/default.schema'

// Schema for the basic data model (e.g. creating new entries)
// export const workspaceDataJSONSchema: JSONSchemaDefinition =

export const workspaceDataSchema = lckSchema({
  $id: 'Workspace',
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
    createdBy: {
      type: 'number',
      description: "Workspace's user creator",
    },
  },
} as const)

export type WorkspaceData = Infer<typeof workspaceDataSchema>

// Schema for making partial updates
export const workspacePatchSchema = lckSchema({
  $id: 'WPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...workspaceDataSchema.properties,
  },
} as const)

export type WorkspacePatch = Infer<typeof workspacePatchSchema>

// Schema for the data that is being returned
export const workspaceResultSchema = lckSchema({
  $id: 'WResult',
  type: 'object',
  additionalProperties: false,
  required: [...workspaceDataSchema.required, 'id'],
  properties: {
    ...workspaceDataSchema.properties,
    id: {
      type: 'number',
    },
  },
} as const)

export type WorkspaceResult = Infer<typeof workspaceResultSchema>

// Schema for allowed query properties
export const workspaceQuerySchema = lckSchema({
  $id: 'WQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(workspaceResultSchema.properties),
  },
} as const)

export type WorkspaceQuery = Infer<typeof workspaceQuerySchema>
