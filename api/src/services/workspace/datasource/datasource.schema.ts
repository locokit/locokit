import { Type, Static, StringEnum, querySyntax } from '@feathersjs/typebox'

// Schema for the basic data model (e.g. creating new entries)
// export const datasourceDataJSONSchema: JSONSchemaDefinition =

export const datasourceSchema = Type.Object(
  {
    id: Type.String({
      format: 'uuid',
    }),
    name: Type.String({
      description: 'Name of the datasource',
    }),
    slug: Type.String({
      description:
        'Slug to reference the datasource in URL, easier to read/memorize for end users',
    }),
    documentation: Type.Optional(
      Type.String({
        description: 'Explain what is this datasource',
      }),
    ),
    client: StringEnum(['pg', 'sqlite3']),
    connection: Type.String({
      description: 'Connexion string to your datasource',
    }),
    credentialsRead: Type.Optional(
      Type.Object({
        username: Type.String({
          description: 'User for read access on datasource',
        }),
        password: Type.String({
          description: 'Password for read access on datasource',
        }),
      }),
    ),
    credentialsReadWrite: Type.Optional(
      Type.Object({
        username: Type.String({
          description: 'User for read/write access on datasource',
        }),
        password: Type.String({
          description: 'Password for read/write access on datasource',
        }),
      }),
    ),
    credentialsAlter: Type.Optional(
      Type.Object({
        username: Type.String({
          description: 'User for alter access on datasource',
        }),
        password: Type.String({
          description: 'Password for alter access on datasource',
        }),
      }),
    ),
    workspaceId: Type.String({
      format: 'uuid',
      description: 'Related workspace of the datasource',
    }),
  },
  {
    $id: 'DatasourceSchema',
    additionalProperties: false,
  },
)

export type DatasourceSchema = Static<typeof datasourceSchema>

export const datasourceDataSchema = Type.Omit(datasourceSchema, ['id'])
export type DatasourceData = Static<typeof datasourceDataSchema>

// Schema for making partial updates
export const datasourcePatchSchema = Type.Omit(datasourceSchema, ['id'])

export type DatasourcePatch = Static<typeof datasourcePatchSchema>

// Schema for the data that is being returned
export const datasourceResultSchema = datasourceSchema
export type DatasourceResult = Static<typeof datasourceResultSchema>

// Schema for allowed query properties
export const datasourceQuerySchema = querySyntax(
  Type.Omit(
    datasourceSchema,
    [
      'credentialsRead',
      'credentialsReadWrite',
      'credentialsAlter',
      'connection',
    ],
    { $id: 'DatasourceQuery', additionalProperties: false },
  ),
)

export type DatasourceQuery = Static<typeof datasourceQuerySchema>
