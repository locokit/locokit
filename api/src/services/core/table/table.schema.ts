import { Type, Static, querySyntax } from '@feathersjs/typebox'
import { DatasourceSchema } from '../datasource/datasource.schema'

export const coreTableSchema = Type.Object(
  {
    id: Type.String({
      format: 'uuid',
    }),
    name: Type.String({
      description: 'Name of the table',
    }),
    slug: Type.String({
      description: 'Table name in the database',
    }),
    documentation: Type.Optional(
      Type.String({
        description: 'Explain what is this table',
      }),
    ),
    datasourceId: Type.String({
      format: 'uuid',
      description: 'Related datasource',
    }),
    datasource: Type.Optional(
      Type.Any({ description: 'Related datasource', $schema: 'DatasourceSchema' }),
    ),
  },
  {
    $id: 'TableSchema',
    additionalProperties: false,
  },
)

export type TableSchema = Static<typeof coreTableSchema>

// Schema for making partial updates
export const coreTablePatchSchema = Type.Omit(coreTableSchema, ['id', 'datasource'])

export type TablePatch = Static<typeof coreTablePatchSchema>

// Schema for the data that is being returned
export const coreTableResultSchema = coreTableSchema
export type TableResult = Static<typeof coreTableResultSchema> & {
  datasource?: DatasourceSchema
}

// Schema for allowed query properties
export const coreTableQuerySchema = Type.Intersect(
  [
    querySyntax(
      Type.Omit(coreTableSchema, [], { $id: 'TableQuery', additionalProperties: false }),
    ),
    Type.Object({
      $joinRelated: Type.Optional(
        Type.RegEx(/datasource/, {
          description: 'Join table to its datasource. Only `datasource` is accepted.',
        }),
      ),
      $joinEager: Type.Optional(
        Type.RegEx(/datasource/, {
          description: 'Join table to its datasource. Only `datasource` is accepted.',
        }),
      ),
      $eager: Type.Optional(
        Type.RegEx(/datasource/, {
          description: 'Join table to its datasource. Only `datasource` is accepted.',
        }),
      ),
    }),
  ],
  { additionalProperties: false, $id: 'TableQuery' },
)

export type TableQuery = Static<typeof coreTableQuerySchema>
