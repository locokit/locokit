import { Type, Static, StringEnum, querySyntax, getValidator } from '@feathersjs/typebox'
import { dataValidator } from '@/commons/validators'

import { WorkspaceResult } from '../workspace/workspace.schema'
import { queryStringExtend } from '@/feathers-objection'

export const coreDatasourceSchema = Type.Object(
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
  },
  {
    $id: 'DatasourceSchema',
    additionalProperties: false,
  },
)

export type DatasourceSchema = Static<typeof coreDatasourceSchema>

// Schema for making partial updates
export const coreDatasourcePatchSchema = Type.Omit(coreDatasourceSchema, ['id'], {
  additionalProperties: false,
  $id: 'DatasourcePatchSchema',
})

export type DatasourcePatch = Static<typeof coreDatasourcePatchSchema>
export const coreDatasourcePatchValidator = getValidator(coreDatasourcePatchSchema, dataValidator)

// Schema for the data that is being returned
export const coreDatasourceResultSchema = coreDatasourceSchema
export type DatasourceResult = Static<typeof coreDatasourceResultSchema> & {
  workspace?: WorkspaceResult
}

// Schema for creating datasource
export const coreDatasourceDataSchema = Type.Omit(coreDatasourceSchema, ['id', 'slug'], {
  additionalProperties: false,
  $id: 'DatasourceDataSchema',
})
export type DatasourceData = Static<typeof coreDatasourceDataSchema>
export const coreDatasourceDataValidator = getValidator(coreDatasourceDataSchema, dataValidator)

// Schema for allowed query properties
export const coreDatasourceQuerySchema = Type.Intersect(
  [
    querySyntax(
      Type.Omit(
        coreDatasourceSchema,
        ['credentialsRead', 'credentialsReadWrite', 'credentialsAlter', 'connection'],
        { $id: 'DatasourceQuery', additionalProperties: false },
      ),
    ),
    querySyntax(
      Type.Object({
        'workspace.slug': Type.Optional(
          Type.String({
            description: "Filter datasource on the workspace's slug",
          }),
        ),
      }),
      {
        'workspace.slug': queryStringExtend,
      },
    ),

    Type.Object({
      $joinRelated: Type.Optional(
        Type.RegEx(/workspace/, {
          description: 'Join datasource to its workspace. Only `workspace` is accepted.',
        }),
      ),
      $joinEager: Type.Optional(
        Type.RegEx(/workspace/, {
          description: 'Join datasource to its workspace. Only `workspace` is accepted.',
        }),
      ),
      $eager: Type.Optional(
        Type.RegEx(/workspace/, {
          description: 'Join datasource to its workspace. Only `workspace` is accepted.',
        }),
      ),
      // $select: Type.Optional(
      //   Type.Array(
      //     Type.String({
      //       description: 'Join workspace to its relation. Only `owner` is accepted.',
      //     }),
      //   ),
      // ),
    }),
  ],
  { additionalProperties: false, $id: 'DatasourceQuery' },
)

export type DatasourceQuery = Static<typeof coreDatasourceQuerySchema>