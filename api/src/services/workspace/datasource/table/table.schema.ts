import { querySyntax } from '@feathersjs/schema'
import type { Infer } from '@feathersjs/schema'
import { defaultDataSchema, lckSchema } from '../../../../commons/default.schema'

// Schema for the basic data model (e.g. creating new entries)
// export const datasourceDataJSONSchema: JSONSchemaDefinition =

export const tableDataSchema = lckSchema({
  $id: 'TableData',
  type: 'object',
  additionalProperties: false,
  required: ['name'],
  properties: {
    ...defaultDataSchema.properties,
    name: {
      type: 'string',
      description: 'Name of the datasource',
    },
    slug: {
      type: 'string',
      description: 'Slug to reference the datasource in URL, easier to read/memorize for end users',
    },
    documentation: {
      type: 'string',
      description: 'Explain what is this datasource',
    },
    datasourceId: {
      type: 'string',
      format: 'uuid',
      description: 'Id of the related datasource',
    },
  },
} as const)

export type TableData = Infer<typeof tableDataSchema>

// Schema for making partial updates
export const tablePatchSchema = lckSchema({
  $id: 'TablePatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...tableDataSchema.properties,
  },
} as const)

export type TablePatch = Infer<typeof tablePatchSchema>

// Schema for the data that is being returned
export const tableResultSchema = lckSchema({
  $id: 'TableResult',
  type: 'object',
  additionalProperties: false,
  required: [...tableDataSchema.required, 'id'],
  properties: {
    ...tableDataSchema.properties,
    id: {
      type: 'number',
    },
  },
} as const)

export type TableResult = Infer<typeof tableResultSchema>

// Schema for allowed query properties
export const tableQuerySchema = lckSchema({
  $id: 'TableQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(tableResultSchema.properties),
  },
} as const)

export type TableQuery = Infer<typeof tableQuerySchema>
