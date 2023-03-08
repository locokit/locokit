import { Type, querySyntax, Static, getValidator } from '@feathersjs/typebox'
import { dataValidator } from '@/commons/validators'
import { workspaceOwnerSchema } from '@/services/auth/user/user.schema'

import { queryStringExtend } from '@/feathers-objection'

export const workspaceSchema = Type.Object(
  {
    id: Type.String({
      format: 'uuid',
    }),
    name: Type.String({
      description: 'Name of the workspace',
    }),
    slug: Type.String({
      description: 'Slug to reference the workspace in URL, easier to read/memorize for end users',
    }),
    public: Type.Optional(
      Type.Boolean({
        description: 'Allow the workspace to be findable/visible publicly',
        default: false,
      }),
    ),
    documentation: Type.Optional(
      Type.String({
        description: 'Explain what is this workspace',
      }),
    ),
    settings: Type.Optional(
      Type.Object(
        {
          color: Type.String({
            description: 'Main color for this workspace',
          }),
          backgroundColor: Type.String({
            description: 'Main background color for this workspace',
          }),
          icon: Type.String({
            description: 'Icon displayed in the workspace list',
          }),
        },
        {
          description: "Workspace's settings",
          default: { color: null, backgroundColor: null, icon: null },
        },
      ),
    ),
    createdBy: Type.Number({
      description: "Workspace's user creator",
    }),
    // owner: Type.Optional(Type.Ref(workspaceOwnerSchema)),
    owner: Type.Optional(
      Type.Object(
        {
          ...workspaceOwnerSchema.properties,
        },
        {
          description: 'User owner of this workspace',
        },
      ),
    ),
    groups: Type.Optional(Type.Array(Type.Any())),
    roles: Type.Optional(Type.Array(Type.Any())),
    datasources: Type.Optional(Type.Array(Type.Any())),
    // medias: Type.Optional(Type.Array(Type.Any())),
  },
  {
    $id: 'WorkspaceSchema',
    additionalProperties: false,
  },
)
export type WorkspaceSchema = Static<typeof workspaceSchema>

export const workspaceDataSchema = Type.Omit(workspaceSchema, [
  'id',
  'createdBy',
  'slug',
  'owner',
  'groups',
  'datasources',
])
export type WorkspaceData = Static<typeof workspaceDataSchema>

// Schema for making partial updates
export const workspacePatchSchema = Type.Omit(workspaceSchema, [
  'id',
  'createdBy',
  'slug',
  'owner',
  'groups',
  'datasources',
])

export type WorkspacePatch = Static<typeof workspacePatchSchema>

// Schema for the data that is being returned
export const workspaceResultSchema = workspaceSchema
export type WorkspaceResult = Static<typeof workspaceResultSchema>

// Schema for allowed query properties
export const workspaceQuerySchema = Type.Intersect(
  [
    querySyntax(Type.Omit(workspaceSchema, ['owner', 'groups', 'roles', 'datasources']), {
      name: queryStringExtend,
    }),
    querySyntax(
      Type.Object({
        'owner.username': Type.Optional(
          Type.String({
            description: "Filter workspaces on the owner's name",
          }),
        ),
      }),
      {
        'owner.username': {
          // @ts-expect-error
          $like: {
            type: 'string',
          },
          // @ts-expect-error
          $ilike: {
            type: 'string',
          },
        },
      },
    ),

    Type.Object({
      $joinRelated: Type.Optional(
        Type.RegEx(/owner|groups|roles|\[owner,groups\]|\[owner,roles\]|\[owner,groups,roles\]/, {
          description: 'Join workspace to its relation. Only `owner` is accepted.',
        }),
      ),
      $joinEager: Type.Optional(
        Type.RegEx(/owner|groups|roles|\[owner,groups\]|\[owner,roles\]|\[owner,groups,roles\]/, {
          description: 'Join workspace to its relation. Only `owner` is accepted.',
        }),
      ),
      $eager: Type.Optional(
        Type.RegEx(/owner|groups|roles|\[owner,groups\]|\[owner,roles\]|\[owner,groups,roles\]/, {
          description: 'Join workspace to its relation. Only `owner` is accepted.',
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
  { additionalProperties: false },
)
export type WorkspaceQuery = Static<typeof workspaceQuerySchema>

export const workspaceDataValidator = getValidator(workspaceDataSchema, dataValidator)
