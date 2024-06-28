import { Type, querySyntax, Static, getValidator } from '@feathersjs/typebox'
import { dataValidator } from '@/commons/validators'
import { queryStringExtend } from '../../../feathers-objection'

// Schema for the basic data model (e.g. creating new entries)
export const policySchema = Type.Object(
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

    workspace: Type.Optional(Type.Any()),

    groups: Type.Optional(Type.Array(Type.Any())),
  },
  {
    $id: 'PolicySchema',
    additionalProperties: false,
  },
)

export type PolicySchema = Static<typeof policySchema>

export const policyDataSchema = Type.Omit(policySchema, ['id', 'workspace'], {
  $id: 'PolicyData',
})
export type PolicyData = Static<typeof policySchema>

export const policyPatchSchema = Type.Partial(Type.Omit(policyDataSchema, ['workspaceId']), {
  $id: 'PolicyPatch',
})
export type PolicyPatch = Static<typeof policyPatchSchema>

export type PolicyResult = Static<typeof policySchema>

export const policyQuerySchema = Type.Intersect([
  querySyntax(Type.Omit(policySchema, ['workspace']), {
    name: queryStringExtend,
  }),
  querySyntax(
    Type.Object({
      'workspace:owner.name': Type.Optional(
        Type.String({
          description: "Filter on related workspace, on the owner's name",
        }),
      ),
    }),
    {
      'workspace:owner.name': {
        $like: Type.String(),
        $ilike: Type.String(),
      },
    },
  ),
  Type.Object({
    $joinRelated: Type.Optional(
      Type.RegEx(/workspace|\[workspace.owner\]|\[workspace.owner,groups\]/, {
        description: 'Join policy to its relations (and nested).',
      }),
    ),
    $joinEager: Type.Optional(
      Type.RegEx(/workspace|\[workspace.owner\]|\[workspace.owner,groups\]/, {
        description: 'Join policy to its relations (and nested).',
      }),
    ),
    $eager: Type.Optional(
      Type.RegEx(/workspace|\[workspace.owner\]|\[workspace.owner,groups\]/, {
        description: 'Join policy to its relations (and nested).',
      }),
    ),
  }),
])

export type PolicyQuery = Static<typeof policyQuerySchema>

export const policyDataValidator = getValidator(policyDataSchema, dataValidator)
