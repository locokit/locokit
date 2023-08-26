import { Type, Static, StringEnum, querySyntax, getValidator } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '@/commons/validators'
import { TableResult } from '../table/table.schema'
import { DB_DIALECT } from '@locokit/definitions'
import { WorkspaceResult } from '@/services/core/workspace/workspace.schema'

export const workspaceDatasourceSchema = Type.Object(
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
    $id: 'WorkspaceDatasourceSchema',
    additionalProperties: false,
  },
)

interface WorkspaceDatasourceRelations {
  tables?: TableResult[]
}

export type WorkspaceDatasourceSchema = Static<typeof workspaceDatasourceSchema> &
  WorkspaceDatasourceRelations & {
    client: DB_DIALECT
  }

// Schema for the data that is being returned
export const workspaceDatasourceResultSchema = workspaceDatasourceSchema
export type WorkspaceDatasourceResult = Static<typeof workspaceDatasourceResultSchema> &
  WorkspaceDatasourceRelations & {
    client: DB_DIALECT
    workspace?: WorkspaceResult
  }

// Schema / validator for creation
export const workspaceDatasourceDataSchema = Type.Omit(workspaceDatasourceSchema, ['id', 'tables', 'slug'], {
  $id: 'WorkspaceDatasourceData',
  additionalProperties: false,
})
export type WorkspaceDatasourceData = Static<typeof workspaceDatasourceDataSchema> & {
  client: DB_DIALECT
}
export const workspaceDatasourceDataValidator = getValidator(workspaceDatasourceDataSchema, dataValidator)

export const workspaceDatasourceDataInternalSchema = Type.Omit(workspaceDatasourceSchema, ['id', 'tables'], {
  $id: 'WorkspaceDatasourceDataInternal',
  additionalProperties: false,
})
export type WorkspaceDatasourceDataInternal = Static<typeof workspaceDatasourceDataInternalSchema> & {
  client: DB_DIALECT
}
export const workspaceDatasourceDataInternalValidator = getValidator(
  workspaceDatasourceDataInternalSchema,
  dataValidator,
)

// Schema for making partial updates
export const workspaceDatasourcePatchSchema = Type.Omit(workspaceDatasourceSchema, ['id'])
export type WorkspaceDatasourcePatch = Static<typeof workspaceDatasourcePatchSchema> & {
  client: DB_DIALECT
}

// Schema for allowed query properties
export const workspaceDatasourceQuerySchema = Type.Intersect(
  [
    querySyntax(
      Type.Omit(
        workspaceDatasourceSchema,
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
export type WorkspaceDatasourceQuery = Static<typeof workspaceDatasourceQuerySchema>
export const workspaceDatasourceQueryValidator = getValidator(workspaceDatasourceQuerySchema, queryValidator)
