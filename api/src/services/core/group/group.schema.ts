import { Type, querySyntax, Static, getValidator } from '@feathersjs/typebox'
import { workspaceSchema } from '@/services/core/workspace/workspace.schema'
import { dataValidator, queryValidator } from '@/commons/validators'
import { workspaceOwnerSchema } from '@/services/core/user/user.schema'
import { policySchema } from '../policy/policy.schema'
import { queryStringExtend } from '@/feathers-objection'
import { userGroupSchema } from '../user-group/user-group.schema'

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
    policyId: Type.String({
      format: 'uuid',
      description: 'Related policy of the workspace',
    }),
    createdAt: Type.String({
      format: 'date-time',
      description: 'Creation date of the group',
    }),
    updatedAt: Type.String({
      format: 'date-time',
      description: 'Update date of the group',
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
    policy: Type.Optional(
      Type.Object(
        {
          ...policySchema.properties,
        },
        {
          description: 'Related policy',
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
    usergroups: Type.Optional(
      Type.Array(
        Type.Object(
          { ...userGroupSchema.properties },
          {
            description: 'Related user groups',
          },
        ),
      ),
    ),
    // policy: Type.Ref(),
  },
  {
    $id: 'GroupSchema',
    additionalProperties: true,
  },
)
dataValidator.addSchema(groupSchema)

export type GroupSchema = Static<typeof groupSchema>

export const groupDataSchema = Type.Omit(
  groupSchema,
  ['id', 'workspace', 'users', 'createdAt', 'updatedAt'],
  { $id: 'GroupData' },
)
export type GroupData = Static<typeof groupSchema>

export const groupUpdateSchema = Type.Omit(groupDataSchema, ['workspaceId'], {
  $id: 'GroupUpdate',
})
export type GroupUpdate = Static<typeof groupUpdateSchema>

export const groupPatchSchema = Type.Partial(groupUpdateSchema, { $id: 'GroupPatch' })
export type GroupPatch = Static<typeof groupPatchSchema>

export type GroupResult = Static<typeof groupSchema>

export const groupQuerySchema = Type.Intersect(
  [
    querySyntax(
      Type.Intersect([
        Type.Omit(groupSchema, ['workspace', 'users']),
        Type.Object({
          'workspace:owner.username': Type.Optional(
            Type.String({
              description: "Filter on related workspace, on the owner's username",
            }),
          ),
          'workspace.name': Type.Optional(
            Type.String({
              description: "Filter on workspace's name",
            }),
          ),
        }),
      ]),
      {
        name: queryStringExtend,
        'workspace:owner.username': queryStringExtend,
        'workspace.name': queryStringExtend,
      },
    ),
    Type.Object({
      $joinRelated: Type.Optional(
        Type.RegEx(
          /workspace|users|policy|\[workspace.owner\]|\[workspace,users\]|\[workspace,users,policy\]|\[workspace.owner,users\]|\[workspace.owner,users,policy\]/,
          {
            description: 'Join policy to its relations (and nested).',
          },
        ),
      ),
      $joinEager: Type.Optional(
        Type.RegEx(
          /workspace|users|policy|\[workspace.owner\]|\[workspace,users\]|\[workspace,users,policy\]|\[workspace.owner,users\]|\[workspace.owner,users,policy\]/,
          {
            description: 'Join policy to its relations (and nested).',
          },
        ),
      ),
      $eager: Type.Optional(
        Type.RegEx(
          /workspace|users|policy|\[workspace.owner\]|\[workspace,users\]|\[workspace,policy\]|\[workspace,users,policy\]|\[workspace.owner,users\]|\[workspace.owner,users,policy\]/,
          {
            description: 'Join policy to its relations (and nested).',
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
export const groupUpdateValidator = getValidator(groupUpdateSchema, dataValidator)
export const groupPatchValidator = getValidator(groupPatchSchema, dataValidator)

export const groupQueryValidator = getValidator(groupQuerySchema, queryValidator)
