import { Type, querySyntax, Static, getValidator } from '@feathersjs/typebox'
import { dataValidator } from '@/commons/validators'
import { queryStringExtend } from '../../../feathers-objection'
import { toEagerRegExp } from '@/utils/toEagerRegExp'

// Schema for the basic data model (e.g. creating new entries)
export const workspacePolicySchema = Type.Object(
  {
    id: Type.String({ format: 'uuid' }),
    name: Type.String({
      description: 'Name of the policy',
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
    manager: Type.Boolean({
      default: false,
      description: 'Is the policy able to manage all the workspace ?',
    }),
    public: Type.Boolean({
      default: false,
      description: 'Is this policy a public one, and could be used anonymously ?',
    }),
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
    variables: Type.Optional(Type.Array(Type.Any())),
    fields: Type.Optional(Type.Array(Type.Any())),
    tables: Type.Optional(Type.Array(Type.Any())),
    groups: Type.Optional(Type.Array(Type.Any())),
  },
  {
    $id: 'WorkspacePolicySchema',
    additionalProperties: false,
  },
)

export type WorkspacePolicySchema = Static<typeof workspacePolicySchema>

export const workspacePolicyDataSchema = Type.Pick(
  workspacePolicySchema,
  ['name', 'documentation', 'manager', 'public'],
  {
    $id: 'WorkspacePolicyData',
    additionalProperties: false,
  },
)
export type WorkspacePolicyData = Static<typeof workspacePolicyDataSchema>

export const workspacePolicyDataInternalSchema = Type.Intersect(
  [
    workspacePolicyDataSchema,
    Type.Pick(workspacePolicySchema, ['createdAt', 'updatedAt', 'workspaceId']),
  ],
  {
    $id: 'WorkspacePolicyDataInternalSchema',
    additionalProperties: false,
  },
)
export type WorkspacePolicyInternalData = Static<typeof workspacePolicyDataInternalSchema>

export const workspacePolicyPatchSchema = Type.Partial(
  Type.Omit(workspacePolicyDataInternalSchema, ['createdAt']),
  {
    $id: 'WorkspacePolicyPatch',
    additionalProperties: false,
  },
)
export type WorkspacePolicyPatch = Static<typeof workspacePolicyPatchSchema>

export type WorkspacePolicyResult = Static<typeof workspacePolicySchema>

const eagerRegExp = toEagerRegExp('groups|variables|tables|fields')
export const workspacePolicyQuerySchema = Type.Intersect([
  querySyntax(workspacePolicySchema, {
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
])

export type WorkspacePolicyQuery = Static<typeof workspacePolicyQuerySchema>

export const workspacePolicyDataValidator = getValidator(workspacePolicyDataSchema, dataValidator)
export const workspacePolicyPatchValidator = getValidator(workspacePolicyPatchSchema, dataValidator)
export const workspacePolicyDataInternalValidator = getValidator(
  workspacePolicyDataInternalSchema,
  dataValidator,
)
