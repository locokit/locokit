import { Type, querySyntax, Static, getDataValidator } from '@feathersjs/typebox'
import { dataValidator } from '../../commons/validators'
// import { groupSchema } from '../auth/group/group.schema'
import { workspaceOwnerSchema } from '../auth/user/user.schema'

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
    legacy: Type.Optional(
      Type.Boolean({
        description: 'Does this workspace use the legacy mode for storing data',
        default: false,
      }),
    ),
    public: Type.Optional(
      Type.Boolean({
        description: 'Allow the workspace to be findable/visible publicly',
        default: false,
      }),
    ),
    documentation: Type.String({
      description: 'Explain what is this workspace',
    }),
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
    // datasources: Type.Optional(Type.Array(Type.Any())),
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
])
export type WorkspaceData = Static<typeof workspaceDataSchema>

// Schema for making partial updates
export const workspacePatchSchema = Type.Omit(workspaceSchema, [
  'id',
  'createdBy',
  'slug',
  'owner',
  'groups',
])

export type WorkspacePatch = Static<typeof workspacePatchSchema>

// Schema for the data that is being returned
export const workspaceResultSchema = workspaceSchema
export type WorkspaceResult = Static<typeof workspaceResultSchema>

// Schema for allowed query properties
export const workspaceQuerySchema = Type.Intersect(
  [
    querySyntax(Type.Omit(workspaceSchema, ['owner', 'groups'])),
    querySyntax(
      Type.Object({
        'owner.name': Type.Optional(
          Type.String({
            description: "Filter workspaces on the owner's name",
          }),
        ),
      }),
      {
        'owner.name': {
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
      $select: Type.Optional(
        Type.Array(
          Type.String({
            description: 'Join workspace to its relation. Only `owner` is accepted.',
          }),
        ),
      ),
    }),
  ],
  { additionalProperties: false },
)
export type WorkspaceQuery = Static<typeof workspaceQuerySchema>

export const workspaceDataValidator = getDataValidator(workspaceDataSchema, dataValidator)
