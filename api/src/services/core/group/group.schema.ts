import { Type, querySyntax, Static, getValidator } from '@feathersjs/typebox'
import { workspaceSchema } from '@/services/core/workspace/core-workspace.schema'
import { queryStringExtend } from '@/feathers-objection'
import { dataValidator, queryValidator } from '@/commons/validators'
import { workspaceOwnerSchema } from '@/services/core/user/user.schema'
import { roleSchema } from '../role/role.schema'

// Schema for the basic data model (e.g. creating new entries)
export const groupSchema = Type.Object(
  {
    id: Type.String({ format: 'uuid' }),
    name: Type.String({
      description: 'Name of the group',
    }),
    documentation: Type.Optional(
      Type.String({
        description: 'Documentation',
      }),
    ),
    workspaceId: Type.String({
      format: 'uuid',
      description: 'Related workspace',
    }),
    roleId: Type.String({
      format: 'uuid',
      description: 'Related role of the workspace',
    }),

    workspace: Type.Optional(
      Type.Object(
        {
          ...workspaceSchema.properties,
        },
        {
          description: 'Related workspace',
        },
      ),
    ),
    role: Type.Optional(
      Type.Object(
        {
          ...roleSchema.properties,
        },
        {
          description: 'Related role',
        },
      ),
    ),
    users: Type.Optional(
      Type.Array(
        Type.Object(
          {
            ...workspaceOwnerSchema.properties,
          },
          {
            description: 'Related users of the group',
          },
        ),
      ),
    ),
    // role: Type.Ref(),
  },
  {
    $id: 'GroupSchema',
    additionalProperties: true,
  },
)
dataValidator.addSchema(groupSchema)

export type GroupSchema = Static<typeof groupSchema>

export const groupDataSchema = Type.Omit(groupSchema, ['id', 'workspace', 'users'], {
  $id: 'GroupData',
})
export type GroupData = Static<typeof groupSchema>

export const groupPatchSchema = Type.Partial(Type.Omit(groupDataSchema, ['workspaceId']))
export type GroupPatch = Static<typeof groupPatchSchema>

export type GroupResult = Static<typeof groupSchema>

export const groupQuerySchema = Type.Intersect(
  [
    querySyntax(
      Type.Intersect([
        Type.Omit(groupSchema, ['workspace', 'users']),
        Type.Object({
          'workspace:owner.name': Type.Optional(
            Type.String({
              description: "Filter on related workspace, on the owner's name",
            }),
          ),
          'workspace.name': Type.Optional(
            Type.String({
              description: "Filter on workspace's name, on the owner's name",
            }),
          ),
        }),
      ]),
      {
        name: queryStringExtend,
        'workspace:owner.name': queryStringExtend,
        'workspace.name': queryStringExtend,
      },
    ),
    Type.Object({
      $joinRelated: Type.Optional(
        Type.RegEx(
          /workspace|users|policy|\[workspace.owner\]|\[workspace,users\]|\[workspace,users,policy\]|\[workspace.owner,users\]|\[workspace.owner,users,policy\]/,
          {
            description: 'Join role to its relations (and nested).',
          },
        ),
      ),
      $joinEager: Type.Optional(
        Type.RegEx(
          /workspace|users|policy|\[workspace.owner\]|\[workspace,users\]|\[workspace,users,policy\]|\[workspace.owner,users\]|\[workspace.owner,users,policy\]/,
          {
            description: 'Join role to its relations (and nested).',
          },
        ),
      ),
      $eager: Type.Optional(
        Type.RegEx(
          /workspace|users|policy|\[workspace.owner\]|\[workspace,users\]|\[workspace,policy\]|\[workspace,users,policy\]|\[workspace.owner,users\]|\[workspace.owner,users,policy\]/,
          {
            description: 'Join role to its relations (and nested).',
          },
        ),
      ),
    }),
  ],
  {
    additionalProperties: false,
  },
)

export type GroupQuery = Static<typeof groupQuerySchema>

export const groupDataValidator = getValidator(groupDataSchema, dataValidator)

export const groupQueryValidator = getValidator(groupQuerySchema, queryValidator)
