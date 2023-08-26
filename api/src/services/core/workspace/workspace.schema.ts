import { Type, querySyntax, Static, getValidator } from '@feathersjs/typebox'
import { dataValidator } from '@/commons/validators'
import { workspaceOwnerSchema } from '@/services/core/user/user.schema'
import { queryStringExtend } from '@/feathers-objection'
import { toEagerRegExp } from '@/utils/toEagerRegExp'

export const workspaceSchema = Type.Object(
  {
    id: Type.String({
      format: 'uuid',
    }),
    name: Type.String({
      description: 'Name of the workspace (limited to 50 chars)',
      maxLength: 50,
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
    createdBy: Type.String({
      description: "Workspace's user creator id",
    }),
    softDeletedAt: Type.Union([
      Type.Optional(
        Type.String({
          format: 'date-time',
          description: 'Is the workspace and when has it been soft-deleted ?',
        }),
      ),
      Type.Null(),
    ]),
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
    policies: Type.Optional(Type.Array(Type.Any())),
    datasources: Type.Optional(Type.Array(Type.Any())),
    // medias: Type.Optional(Type.Array(Type.Any())),
  },
  {
    $id: 'WorkspaceSchema',
    additionalProperties: false,
  },
)
export type WorkspaceSchema = Static<typeof workspaceSchema>

/**
 * Schema for creating workspace from internal calls
 * We authorized the createdBy field
 */
export const workspaceDataInternalSchema = Type.Omit(
  workspaceSchema,
  ['id', 'slug', 'softDeletedAt', 'owner', 'groups', 'datasources', 'policies'],
  {
    $id: 'WorkspaceDataInternalSchema',
  },
)
export type WorkspaceDataInternal = Static<typeof workspaceDataInternalSchema>
export const workspaceDataInternalValidator = getValidator(
  workspaceDataInternalSchema,
  dataValidator,
)

/**
 * Schema for creating workspace from external calls
 * We forbid the createdBy field
 */
export const workspaceDataSchema = Type.Omit(workspaceDataInternalSchema, ['createdBy'], {
  $id: 'WorkspaceDataSchema',
})
export type WorkspaceData = Static<typeof workspaceDataSchema>
export const workspaceDataValidator = getValidator(workspaceDataSchema, dataValidator)

// Schema for making partial updates
export const workspacePatchSchema = Type.Partial(
  Type.Omit(workspaceSchema, ['id', 'createdBy', 'name', 'slug', 'owner', 'groups', 'datasources']),
  {
    $id: 'WorkspacePatchSchema',
  },
)

export type WorkspacePatch = Static<typeof workspacePatchSchema>
export const workspacePatchValidator = getValidator(workspacePatchSchema, dataValidator)

// Schema for the data that is being returned
export const workspaceResultSchema = Type.Intersect(
  [
    Type.Omit(workspaceSchema, ['softDeletedAt']),
    Type.Object({
      softDeletedAt: Type.Optional(
        Type.Date({
          description: 'Is the workspace soft-deleted and when was it soft-deleted',
        }),
      ),
      createdAt: Type.Date({
        description: 'When the workspace has been created',
      }),
      updatedAt: Type.Date({
        description: 'Last time the workspace has been updated',
      }),
    }),
  ],
  {
    $id: 'WorkspaceResultSchema',
  },
)
export type WorkspaceResult = Static<typeof workspaceResultSchema>

// Schema for allowed query properties
const eagerRegExp = toEagerRegExp('owner|groups|policies|datasources')
export const workspaceQuerySchema = Type.Intersect(
  [
    querySyntax(
      Type.Intersect([
        Type.Omit(workspaceSchema, ['owner', 'groups', 'policies', 'datasources'], {
          name: queryStringExtend,
        }),
        Type.Object({
          'owner.username': Type.Optional(
            Type.String({
              description: "Filter workspaces on the owner's name",
            }),
          ),
        }),
      ]),
      {
        'owner.username': queryStringExtend,
      },
    ),

    Type.Object({
      $joinRelated: Type.Optional(
        Type.RegEx(eagerRegExp, {
          description: 'Join workspace to its relation. Only `owner` is accepted.',
        }),
      ),
      $joinEager: Type.Optional(
        Type.RegEx(eagerRegExp, {
          description: 'Join workspace to its relation. Only `owner` is accepted.',
        }),
      ),
      $eager: Type.Optional(
        Type.RegEx(eagerRegExp, {
          description: 'Join workspace to its relation. Only `owner` is accepted.',
        }),
      ),
    }),
  ],
  { additionalProperties: false },
)
export type WorkspaceQuery = Static<typeof workspaceQuerySchema>
