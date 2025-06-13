import { Type, querySyntax, Static, getValidator } from '@feathersjs/typebox'
import { dataValidator } from '@/commons/validators'
import { toEagerRegExp } from '@/utils/toEagerRegExp'

// Schema for the basic data model (e.g. creating new entries)
export const workspaceGroupPolicyVariableSchema = Type.Object(
  {
    id: Type.String({ format: 'uuid' }),
    documentation: Type.Optional(
      Type.String({
        description: 'Documentation if needed',
      }),
    ),
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
    policyVariableId: Type.String({
      format: 'uuid',
      description: 'Related policy variable',
    }),
    groupId: Type.String({
      format: 'uuid',
      description: 'Related group',
    }),

    /**
     * Dedicated policy configuration
     */
    policyVariable: Type.Optional(Type.Any()),
    group: Type.Optional(Type.Any()),

    /**
     * Date times
     */
    createdAt: Type.String({
      format: 'date-time',
    }),
    updatedAt: Type.String({
      format: 'date-time',
    }),
  },
  {
    $id: 'WorkspaceGroupPolicyVariableSchema',
    additionalProperties: false,
  },
)

export type WorkspaceGroupPolicyVariableSchema = Static<typeof workspaceGroupPolicyVariableSchema>

export const workspaceGroupPolicyVariableDataSchema = Type.Pick(
  workspaceGroupPolicyVariableSchema,
  ['documentation', 'value', 'policyVariableId', 'groupId'],
  {
    $id: 'WorkspaceGroupPolicyVariableData',
    additionalProperties: false,
  },
)
export type WorkspaceGroupPolicyVariableData = Static<typeof workspaceGroupPolicyVariableDataSchema>

export const workspaceGroupPolicyVariablePatchSchema = Type.Partial(
  workspaceGroupPolicyVariableDataSchema,
  {
    $id: 'WorkspaceGroupPolicyVariablePatch',
    additionalProperties: false,
  },
)
export type WorkspaceGroupPolicyVariablePatch = Static<
  typeof workspaceGroupPolicyVariablePatchSchema
>

export type WorkspaceGroupPolicyVariableResult = Static<typeof workspaceGroupPolicyVariableSchema>

const eagerRegExp = toEagerRegExp('policyVariable|group')
export const workspaceGroupPolicyVariableQuerySchema = Type.Intersect(
  [
    querySyntax(workspaceGroupPolicyVariableSchema),
    Type.Object({
      $joinRelated: Type.Optional(
        Type.RegEx(eagerRegExp, {
          description: 'Join group-policy-variable to its relations.',
        }),
      ),
      $joinEager: Type.Optional(
        Type.RegEx(eagerRegExp, {
          description: 'Join group-policy-variable to its relations.',
        }),
      ),
      $eager: Type.Optional(
        Type.RegEx(eagerRegExp, {
          description: 'Join group-policy-variable to its relations.',
        }),
      ),
    }),
  ],
  {
    $id: 'WorkspaceGroupPolicyVariableQuery',
  },
)

export type WorkspaceGroupPolicyVariableQuery = Static<
  typeof workspaceGroupPolicyVariableQuerySchema
>

export const workspaceGroupPolicyVariableDataValidator = getValidator(
  workspaceGroupPolicyVariableDataSchema,
  dataValidator,
)
