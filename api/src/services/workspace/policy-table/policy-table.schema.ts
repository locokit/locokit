import { Type, querySyntax, Static, getValidator } from '@feathersjs/typebox'
import { dataValidator } from '@/commons/validators'
import { toEagerRegExp } from '@/utils/toEagerRegExp'

// Schema for the basic data model (e.g. creating new entries)
export const workspacePolicyTableSchema = Type.Object(
  {
    id: Type.String({ format: 'uuid' }),

    documentation: Type.Optional(
      Type.String({
        description: 'Explain what is this policy table',
      }),
    ),
    policyId: Type.String({
      format: 'uuid',
      description: 'Related policy',
    }),
    tableId: Type.String({
      format: 'uuid',
      description: 'Related table',
    }),
    read: Type.Object({
      allow: Type.Boolean({
        description: 'Allow read for this table, according to filters',
      }),
      filter: Type.Any({
        title:
          "Filter rules to apply for access control when group's users read the table. Can use any of the variables defined at the group / user level.",
      }),
    }),
    create: Type.Object({
      allow: Type.Boolean({
        description: 'Allow record creation for this table',
      }),
    }),
    patch: Type.Object({
      allow: Type.Boolean({
        description: 'Allow patch records for this table, according to filters',
      }),
      filter: Type.Any({
        title:
          "Filter rules to apply for access control when group's users patch a record of the table. Can use any of the variables defined at the group / user level.",
      }),
    }),
    remove: Type.Object({
      allow: Type.Boolean({
        description: 'Allow removal records for this table, according to filters',
      }),
      filter: Type.Any({
        title:
          "Filter rules to apply for access control when group's users remove a record of the table. Can use any of the variables defined at the group / user level.",
      }),
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

    policy: Type.Optional(Type.Any()),
    table: Type.Optional(Type.Any()),
  },
  {
    $id: 'WorkspacePolicyTableSchema',
    additionalProperties: false,
  },
)

export type WorkspacePolicyTableSchema = Static<typeof workspacePolicyTableSchema>

export const workspacePolicyTableDataSchema = Type.Omit(
  workspacePolicyTableSchema,
  ['id', 'policy'],
  {
    $id: 'WorkspacePolicyTableData',
    additionalProperties: false,
  },
)
export type WorkspacePolicyTableData = Static<typeof workspacePolicyTableDataSchema>

export const workspacePolicyTablePatchSchema = Type.Partial(workspacePolicyTableDataSchema, {
  $id: 'WorkspacePolicyTablePatch',
  additionalProperties: false,
})
export type WorkspacePolicyTablePatch = Static<typeof workspacePolicyTablePatchSchema>

export type WorkspacePolicyTableResult = Static<typeof workspacePolicyTableSchema>

const eagerRegExp = toEagerRegExp('policy')
export const workspacePolicyTableQuerySchema = Type.Intersect([
  querySyntax(workspacePolicyTableSchema),
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

export type WorkspacePolicyTableQuery = Static<typeof workspacePolicyTableQuerySchema>

export const workspacePolicyTableDataValidator = getValidator(
  workspacePolicyTableDataSchema,
  dataValidator,
)
