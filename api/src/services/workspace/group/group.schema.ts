import { Type, querySyntax, Static, getValidator } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '@/commons/validators'
import { workspaceOwnerSchema } from '@/services/core/user/user.schema'
import { workspacePolicySchema } from '../policy/policy.schema'
import { queryStringExtend } from '@/feathers-objection'
import { workspaceUserGroupSchema } from '../user-group/user-group.schema'
import { toEagerRegExp } from '@/utils/toEagerRegExp'

// Schema for the basic data model (e.g. creating new entries)
export const workspaceGroupSchema = Type.Object(
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

    policy: Type.Optional(
      Type.Object(
        {
          ...workspacePolicySchema.properties,
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
          { ...workspaceUserGroupSchema.properties },
          {
            description: 'Related user groups',
          },
        ),
      ),
    ),
  },
  {
    $id: 'WorkspaceGroupSchema',
    additionalProperties: false,
  },
)
dataValidator.addSchema(workspaceGroupSchema)

export type WorkspaceGroupSchema = Static<typeof workspaceGroupSchema>

export const workspaceGroupDataSchema = Type.Pick(
  workspaceGroupSchema,
  ['name', 'documentation', 'policyId'],
  {
    $id: 'WorkspaceGroupData',
    additionalProperties: false,
  },
)
export type WorkspaceGroupData = Static<typeof workspaceGroupDataSchema>

export const workspaceGroupPatchSchema = Type.Partial(workspaceGroupDataSchema, {
  $id: 'WorkspaceGroupPatch',
  additionalProperties: false,
})
export type WorkspaceGroupPatch = Static<typeof workspaceGroupPatchSchema>

export type WorkspaceGroupResult = Static<typeof workspaceGroupSchema>

const eagerRegExp = toEagerRegExp('users|policy|groupPolicyVariable')
export const workspaceGroupQuerySchema = Type.Intersect(
  [
    querySyntax(Type.Omit(workspaceGroupSchema, ['policy', 'users', 'usergroups']), {
      name: queryStringExtend,
    }),
    Type.Object({
      $joinRelated: Type.Optional(
        Type.RegEx(eagerRegExp, {
          description: 'Join group to its relations (and nested).',
        }),
      ),
      $joinEager: Type.Optional(
        Type.RegEx(eagerRegExp, {
          description: 'Join group to its relations (and nested).',
        }),
      ),
      $eager: Type.Optional(
        Type.RegEx(eagerRegExp, {
          description: 'Join group to its relations (and nested).',
        }),
      ),
    }),
  ],
  {
    additionalProperties: false,
  },
)

export type WorkspaceGroupQuery = Static<typeof workspaceGroupQuerySchema>

export const workspaceGroupDataValidator = getValidator(workspaceGroupDataSchema, dataValidator)
export const workspaceGroupPatchValidator = getValidator(workspaceGroupPatchSchema, dataValidator)

export const workspaceGroupQueryValidator = getValidator(workspaceGroupQuerySchema, queryValidator)
