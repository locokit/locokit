import { Type, querySyntax, Static, getValidator } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '@/commons/validators'
import { toEagerRegExp } from '@/utils/toEagerRegExp'

// Schema for the basic data model (e.g. creating new entries)
export const workspaceUserGroupPolicyVariableSchema = Type.Object(
  {
    id: Type.String({ format: 'uuid' }),

    value: Type.Object(
      {
        string: Type.String({
          description: 'string value for this variable',
        }),
        number: Type.String({
          description: 'Number value for this variable',
        }),
        boolean: Type.Boolean({
          description: 'boolean value for this variable',
        }),
      },
      {
        additionalProperties: true,
      },
    ),

    userGroupId: Type.String({ format: 'uuid' }),
    policyVariableId: Type.String({
      format: 'uuid',
      description: 'Related policy variable',
    }),

    createdAt: Type.String({
      format: 'date-time',
      description: 'Creation date of the user-group',
    }),
    updatedAt: Type.String({
      format: 'date-time',
      description: 'Update date of the user-group',
    }),

    /**
     * Relations (not typed due to circular dependencies)
     */
    userGroup: Type.Optional(Type.Any()),
    policyVariable: Type.Optional(Type.Any()),
  },
  {
    $id: 'WorkspaceUserGroupPolicyVariableSchema',
    additionalProperties: false,
  },
)
dataValidator.addSchema(workspaceUserGroupPolicyVariableSchema)

export type UserGroupPolicyVariableSchema = Static<typeof workspaceUserGroupPolicyVariableSchema>

export const workspaceUserGroupPolicyVariableDataSchema = Type.Pick(
  workspaceUserGroupPolicyVariableSchema,
  ['userGroupId', 'policyVariableId', 'value'],
  {
    $id: 'WorkspaceUserGroupPolicyVariableData',
  },
)

export type UserGroupPolicyVariableData = Static<typeof workspaceUserGroupPolicyVariableDataSchema>

export const workspaceUserGroupPolicyVariablePatchSchema = Type.Pick(
  workspaceUserGroupPolicyVariableDataSchema,
  ['value'],
  {
    $id: 'WorkspaceUserGroupPolicyVariablePatch',
  },
)

export type UserGroupPolicyVariablePatch = Static<
  typeof workspaceUserGroupPolicyVariablePatchSchema
>

export type UserGroupPolicyVariableResult = Static<typeof workspaceUserGroupPolicyVariableSchema>

const eagerRegExp = toEagerRegExp('userGroup|policyVariable')
export const workspaceUserGroupPolicyVariableQuerySchema = Type.Intersect(
  [
    querySyntax(Type.Omit(workspaceUserGroupPolicyVariableSchema, ['userGroup', 'policyVariable'])),
    Type.Object({
      $joinRelated: Type.Optional(
        Type.RegEx(eagerRegExp, {
          description: 'Join to its relations.',
        }),
      ),
      $joinEager: Type.Optional(
        Type.RegEx(eagerRegExp, {
          description: 'Join to its relations.',
        }),
      ),
      $eager: Type.Optional(
        Type.RegEx(eagerRegExp, {
          description: 'Join to its relations.',
        }),
      ),
    }),
  ],
  {
    additionalProperties: false,
  },
)

export type UserGroupPolicyVariableQuery = Static<
  typeof workspaceUserGroupPolicyVariableQuerySchema
>

export const workspaceUserGroupPolicyVariableDataValidator = getValidator(
  workspaceUserGroupPolicyVariableDataSchema,
  dataValidator,
)
export const workspaceUserGroupPolicyVariablePatchValidator = getValidator(
  workspaceUserGroupPolicyVariablePatchSchema,
  dataValidator,
)

export const workspaceUserGroupPolicyVariableQueryValidator = getValidator(
  workspaceUserGroupPolicyVariableQuerySchema,
  queryValidator,
)
