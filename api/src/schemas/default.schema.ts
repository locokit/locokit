import { JSONSchemaDefinition, schema, SchemaWrapper } from '@feathersjs/schema'
import type { Infer } from '@feathersjs/schema'
import ajv from './ajv'

// Schema for the basic data model (e.g. creating new entries)
export const defaultDataSchema = schema(
  {
    $id: 'DefaultData',
    type: 'object',
    properties: {
      createdAt: {
        type: 'string',
        format: 'date-time',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
      },
    },
  } as const,
  ajv,
)

export type DefaultData = Infer<typeof defaultDataSchema>

export function lckSchema<S extends JSONSchemaDefinition>(
  definition: S,
): SchemaWrapper<S> {
  // @ts-expect-error
  return new SchemaWrapper(definition, ajv)
}