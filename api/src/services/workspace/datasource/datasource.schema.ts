import { Type, Static, StringEnum, querySyntax, getValidator } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '@/commons/validators'
import { TableResult } from '../table/table.schema'
import { DB_DIALECT } from '@locokit/definitions'
import { WorkspaceResult } from '@/services/core/workspace/core-workspace.schema'

export const datasourceSchema = Type.Object(
  {
    id: Type.String({
      format: 'uuid',
    }),
    name: Type.String({
      description: 'Name of the datasource',
    }),
    slug: Type.String({
      description: 'Slug to reference the datasource in URL, easier to read/memorize for end users',
    }),
    documentation: Type.Optional(
      Type.String({
        description: 'Explain what is this datasource',
      }),
    ),
    client: StringEnum(['pg', 'sqlite3']),
    type: StringEnum(['remote', 'local']),
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

    tables: Type.Optional(
      Type.Array(Type.Any(), {
        description: 'Related tables of the datasource',
      }),
    ),
  },
  {
    $id: 'DatasourceSchema',
    additionalProperties: false,
  },
)

interface DatasourceRelations {
  tables?: TableResult[]
}

export type DatasourceSchema = Static<typeof datasourceSchema> &
  DatasourceRelations & {
    client: DB_DIALECT
  }

// Schema for the data that is being returned
export const datasourceResultSchema = datasourceSchema
export type DatasourceResult = Static<typeof datasourceResultSchema> &
  DatasourceRelations & {
    client: DB_DIALECT
    workspace?: WorkspaceResult
  }

// Schema / validator for creation
export const datasourceDataSchema = Type.Omit(datasourceSchema, ['id', 'tables', 'slug'], {
  $id: 'DatasourceData',
  additionalProperties: false,
})
export type DatasourceData = Static<typeof datasourceDataSchema> & {
  client: DB_DIALECT
}
export const datasourceDataValidator = getValidator(datasourceDataSchema, dataValidator)

export const datasourceDataInternalSchema = Type.Omit(datasourceSchema, ['id', 'tables'], {
  $id: 'DatasourceDataInternal',
  additionalProperties: false,
})
export type DatasourceDataInternal = Static<typeof datasourceDataInternalSchema> & {
  client: DB_DIALECT
}
export const datasourceDataInternalValidator = getValidator(
  datasourceDataInternalSchema,
  dataValidator,
)

// Schema for making partial updates
export const datasourcePatchSchema = Type.Omit(datasourceSchema, ['id'])
export type DatasourcePatch = Static<typeof datasourcePatchSchema> & {
  client: DB_DIALECT
}

// Schema for allowed query properties
export const datasourceQuerySchema = Type.Intersect(
  [
    querySyntax(
      Type.Omit(
        datasourceSchema,
        [
          'credentialsRead',
          'credentialsReadWrite',
          'credentialsAlter',
          'connection',
          'workspaceId',
          'tables',
        ],
        { $id: 'DatasourceQuery', additionalProperties: false },
      ),
    ),
    Type.Object({
      workspaceId: Type.Optional(
        Type.String({
          format: 'uuid',
          description: 'Related workspace of the datasource',
        }),
      ),
      $joinRelated: Type.Optional(
        Type.RegEx(
          /tables|tables\.fields|tables\.relations\[tables\]|\[tables.\[fields\]\]|\[tables.\[relations\]\]|\[tables.\[fields,relations\]\]/,
          {
            description: 'Join datasource to its related ressources (and nested).',
          },
        ),
      ),
      $joinEager: Type.Optional(
        Type.RegEx(
          /tables|tables\.fields|tables\.relations\[tables\]|\[tables.\[fields\]\]|\[tables.\[relations\]\]|\[tables.\[fields,relations\]\]/,
          {
            description: 'Join datasource to its related ressources (and nested).',
          },
        ),
      ),
      $eager: Type.Optional(
        Type.RegEx(
          /tables|tables\.fields|tables\.relations\[tables\]|\[tables.\[fields\]\]|\[tables.\[relations\]\]|\[tables.\[fields,relations\]\]/,
          {
            description: 'Join datasource to its related ressources (and nested).',
          },
        ),
      ),
    }),
  ],
  { additionalProperties: false },
)
export type DatasourceQuery = Static<typeof datasourceQuerySchema>
export const datasourceQueryValidator = getValidator(datasourceQuerySchema, queryValidator)
