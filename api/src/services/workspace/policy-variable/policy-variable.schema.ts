import { Type, querySyntax, Static, getValidator, StringEnum } from '@feathersjs/typebox'
import { dataValidator } from '@/commons/validators'
import { queryStringExtend } from '../../../feathers-objection'
import { toEagerRegExp } from '@/utils/toEagerRegExp'

// Schema for the basic data model (e.g. creating new entries)
export const workspacePolicyVariableSchema = Type.Object(
  {
    id: Type.String({ format: 'uuid' }),
    name: Type.String({
      description: 'Name of the policy variable',
    }),
    slug: Type.String({
      description: 'Slug used in policy table rules. Please use snakeCase.',
    }),
    documentation: Type.Optional(
      Type.String({
        description: 'Documentation',
      }),
    ),
    level: StringEnum(['user', 'group', 'user+group'], {
      default: 'group',
    }),
    policyId: Type.String({
      format: 'uuid',
      description: 'Related policy',
    }),
    tableId: Type.String({
      format: 'uuid',
      description: 'Related table',
    }),
    tableFieldId: Type.String({
      format: 'uuid',
      description: 'Related table field',
    }),
    defaultValue: Type.Object(
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
        description: 'Default value for this variable',
      },
    ),
    /**
     * Date times
     */
    createdAt: Type.String({
      format: 'date-time',
    }),
    updatedAt: Type.String({
      format: 'date-time',
    }),

    /**
     * Dedicated policy configuration
     */
    policy: Type.Optional(Type.Any()),
  },
  {
    $id: 'WorkspacePolicyVariableSchema',
    additionalProperties: false,
  },
)

export type WorkspacePolicyVariableSchema = Static<typeof workspacePolicyVariableSchema>

export const workspacePolicyVariableDataSchema = Type.Omit(
  workspacePolicyVariableSchema,
  ['id', 'policy'],
  {
    $id: 'WorkspacePolicyVariableData',
    additionalProperties: false,
  },
)
export type WorkspacePolicyVariableData = Static<typeof workspacePolicyVariableDataSchema>

export const workspacePolicyVariablePatchSchema = Type.Partial(workspacePolicyVariableDataSchema, {
  $id: 'WorkspacePolicyVariablePatch',
  additionalProperties: false,
})
export type WorkspacePolicyVariablePatch = Static<typeof workspacePolicyVariablePatchSchema>

export type WorkspacePolicyVariableResult = Static<typeof workspacePolicyVariableSchema>

const eagerRegExp = toEagerRegExp('policy')
export const workspacePolicyVariableQuerySchema = Type.Intersect(
  [
    querySyntax(workspacePolicyVariableSchema, {
      name: queryStringExtend,
    }),
    Type.Object({
      $joinRelated: Type.Optional(
        Type.RegEx(eagerRegExp, {
          description: 'Join policy to its relations.',
        }),
      ),
      $joinEager: Type.Optional(
        Type.RegEx(eagerRegExp, {
          description: 'Join policy to its relations.',
        }),
      ),
      $eager: Type.Optional(
        Type.RegEx(eagerRegExp, {
          description: 'Join policy to its relations.',
        }),
      ),
    }),
  ],
  {
    $id: 'WorkspacePolicyVariableQuery',
  },
)

export type WorkspacePolicyVariableQuery = Static<typeof workspacePolicyVariableQuerySchema>

export const workspacePolicyVariableDataValidator = getValidator(
  workspacePolicyVariableDataSchema,
  dataValidator,
)
