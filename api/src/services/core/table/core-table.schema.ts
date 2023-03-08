import { Type, Static, querySyntax } from '@feathersjs/typebox'

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
  },
  {
    $id: 'CoreTableSchema',
    additionalProperties: false,
  },
)

export type CoreTableSchema = Static<typeof coreTableSchema>

// Schema for making partial updates
export const coreTablePatchSchema = Type.Omit(coreTableSchema, ['id'])

export type CoreTablePatch = Static<typeof coreTablePatchSchema>

// Schema for the data that is being returned
export const coreTableResultSchema = coreTableSchema
export type CoreTableResult = Static<typeof coreTableResultSchema>

// Schema for allowed query properties
export const coreTableQuerySchema = Type.Intersect([
  querySyntax(
    Type.Omit(
      coreTableSchema, [],
      { $id: 'CoreTableQuery', additionalProperties: false },
    ),
  ),
  Type.Object({
    $joinRelated: Type.Optional(
      Type.RegEx(
        /datasource/,
        {
          description: 'Join table to its datasource. Only `datasource` is accepted.',
        },
      ),
    ),
    $joinEager: Type.Optional(
      Type.RegEx(
        /datasource/,
        {
          description: 'Join table to its datasource. Only `datasource` is accepted.',
        },
      ),
    ),
    $eager: Type.Optional(
      Type.RegEx(
        /datasource/,
        {
          description: 'Join table to its datasource. Only `datasource` is accepted.',
        },
      ),
    ),
  }),
],
  { additionalProperties: false, $id: 'CoreTableQuery' },
)

export type CoreTableQuery = Static<typeof coreTableQuerySchema>
