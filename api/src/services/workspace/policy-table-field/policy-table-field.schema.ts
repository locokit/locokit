import { Type, querySyntax, Static, getValidator } from '@feathersjs/typebox'
import { dataValidator } from '@/commons/validators'
import { toEagerRegExp } from '@/utils/toEagerRegExp'

// Schema for the basic data model (e.g. creating new entries)
export const workspacePolicyTableFieldSchema = Type.Object(
  {
    id: Type.String({ format: 'uuid' }),

    documentation: Type.Optional(
      Type.String({
        description: 'Documentation',
      }),
    ),
    policyId: Type.String({
      format: 'uuid',
      description: 'Related policy',
    }),
    tableFieldId: Type.String({
      format: 'uuid',
      description: 'Related table field',
    }),
    read: Type.Boolean({
      description: 'Allow to read this field',
    }),
    write: Type.Boolean({
      description: 'Allow to write this field',
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
    policy: Type.Optional(Type.Any()),
  },
  {
    $id: 'WorkspacePolicyTableFieldSchema',
    additionalProperties: false,
  },
)

export type WorkspacePolicyTableFieldSchema = Static<typeof workspacePolicyTableFieldSchema>

export const workspacePolicyTableFieldDataSchema = Type.Omit(
  workspacePolicyTableFieldSchema,
  ['id', 'policy'],
  {
    $id: 'WorkspacePolicyTableFieldData',
    additionalProperties: false,
  },
)
export type WorkspacePolicyTableFieldData = Static<typeof workspacePolicyTableFieldDataSchema>

export const workspacePolicyTableFieldPatchSchema = Type.Partial(
  workspacePolicyTableFieldDataSchema,
  {
    $id: 'WorkspacePolicyTableFieldPatch',
    additionalProperties: false,
  },
)
export type WorkspacePolicyTableFieldPatch = Static<typeof workspacePolicyTableFieldPatchSchema>

export type WorkspacePolicyTableFieldResult = Static<typeof workspacePolicyTableFieldSchema>

const eagerRegExp = toEagerRegExp('policy')
export const workspacePolicyTableFieldQuerySchema = Type.Intersect([
  querySyntax(workspacePolicyTableFieldSchema),
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

export type WorkspacePolicyTableFieldQuery = Static<typeof workspacePolicyTableFieldQuerySchema>

export const workspacePolicyTableFieldDataValidator = getValidator(
  workspacePolicyTableFieldDataSchema,
  dataValidator,
)
