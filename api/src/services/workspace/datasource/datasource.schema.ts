import { querySyntax } from '@feathersjs/schema'
import type { Infer } from '@feathersjs/schema'
import { defaultDataSchema, lckSchema } from '../../../schemas/default.schema'

// Schema for the basic data model (e.g. creating new entries)
// export const datasourceDataJSONSchema: JSONSchemaDefinition =

export const datasourceDataSchema = lckSchema({
  $id: 'DatasourceData',
  type: 'object',
  additionalProperties: false,
  required: ['name', 'client', 'connection'],
  properties: {
    ...defaultDataSchema.properties,
    name: {
      type: 'string',
      description: 'Name of the datasource',
    },
    slug: {
      type: 'string',
      description:
        'Slug to reference the datasource in URL, easier to read/memorize for end users',
    },
    documentation: {
      type: 'string',
      description: 'Explain what is this datasource',
    },
    client: {
      type: 'string',
      description: 'Datasource client : sqlite3, pg, legacy',
      enum: ['pg', 'sqlite3'],
    },
    connection: {
      type: 'string',
      description: 'Connexion string to your datasource',
    },
    credentialsRead: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          description: 'User for read access on datasource',
        },
        password: {
          type: 'string',
          description: 'Password for read access on datasource',
        },
      },
    },
    credentialsReadWrite: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          description: 'User for read/write access on datasource',
        },
        password: {
          type: 'string',
          description: 'Password for read/write access on datasource',
        },
      },
    },
    credentialsAlter: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          description: 'User for alter access on datasource',
        },
        password: {
          type: 'string',
          description: 'Password for alter access on datasource',
        },
      },
    },
    workspaceId: {
      type: 'string',
      format: 'uuid',
      description: 'Id of the related workspace',
    },
  },
} as const)

export type DatasourceData = Infer<typeof datasourceDataSchema>

// Schema for making partial updates
export const datasourcePatchSchema = lckSchema({
  $id: 'DatasourcePatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...datasourceDataSchema.properties,
  },
} as const)

export type DatasourcePatch = Infer<typeof datasourcePatchSchema>

// Schema for the data that is being returned
export const datasourceResultSchema = lckSchema({
  $id: 'DatasourceResult',
  type: 'object',
  additionalProperties: false,
  required: [...datasourceDataSchema.required, 'id'],
  properties: {
    ...datasourceDataSchema.properties,
    id: {
      type: 'number',
    },
  },
} as const)

export type DatasourceResult = Infer<typeof datasourceResultSchema>

// Schema for allowed query properties
export const datasourceQuerySchema = lckSchema({
  $id: 'DatasourceQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(datasourceResultSchema.properties),
  },
} as const)

export type DatasourceQuery = Infer<typeof datasourceQuerySchema>
