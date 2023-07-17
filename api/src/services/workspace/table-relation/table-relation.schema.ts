import { Type, Static, querySyntax, getValidator, StringEnum } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '@/commons/validators'
import { TableResult } from '../table/table.schema'
import { TableFieldResult } from '../table-field/table-field.schema'

export const tableRelationSchema = Type.Object(
  {
    id: Type.String({
      format: 'uuid',
    }),
    name: Type.String({
      description: 'Name of the relation',
    }),
    slug: Type.String({
      description: 'Slug of the relation, needed for joining relation',
    }),
    fromTableId: Type.String({
      format: 'uuid',
      description: 'From table',
    }),
    toTableId: Type.String({
      format: 'uuid',
      description: 'To table',
    }),
    throughTableId: Type.Optional(
      Type.String({
        format: 'uuid',
        description: 'Through table',
      }),
    ),
    fromFieldId: Type.String({
      format: 'uuid',
      description: 'From table field',
    }),
    toFieldId: Type.String({
      format: 'uuid',
      description: 'To table field',
    }),
    throughFieldId: Type.Optional(
      Type.String({
        format: 'uuid',
        description: 'Through table field',
      }),
    ),
    type: StringEnum(['1-n', 'n-m', '1-1']),
    settings: Type.Any({
      description: 'Relation settings',
    }),
    createdAt: Type.String({
      format: 'date-time',
      description: 'Creation date of the field',
    }),
    updatedAt: Type.String({
      format: 'date-time',
      description: 'Update date of the field',
    }),
  },
  {
    $id: 'TableRelationSchema',
    additionalProperties: false,
  },
)

interface TableRelationEager {
  fromField?: TableFieldResult
  fromTable?: TableResult
  toField?: TableFieldResult
  toTable?: TableResult
  throughTable?: TableResult
  throughField?: TableFieldResult
}

export type TableRelationSchema = Static<typeof tableRelationSchema> & TableRelationEager

export const tableRelationDataSchema = Type.Omit(
  tableRelationSchema,
  ['id', 'slug', 'createdAt', 'updatedAt'],
  {
    $id: 'TableRelationData',
    additionalProperties: false,
  },
)
export type TableRelationData = Static<typeof tableRelationDataSchema>
export const tableRelationDataValidator = getValidator(tableRelationDataSchema, dataValidator)

export const tableRelationDataInternalSchema = Type.Omit(
  tableRelationSchema,
  ['id', 'createdAt', 'updatedAt'],
  {
    $id: 'TableRelationDataInternal',
    additionalProperties: false,
  },
)
export type TableRelationDataInternal = Static<typeof tableRelationDataInternalSchema>
export const tableRelationDataInternalValidator = getValidator(
  tableRelationDataInternalSchema,
  dataValidator,
)

export const tableRelationPatchSchema = Type.Omit(
  tableRelationDataSchema,
  ['fromTableId', 'toTableId', 'throughTableId', 'fromFieldId', 'toFieldId', 'throughTableId'],
  {
    $id: 'TableRelationPatch',
    additionalProperties: false,
  },
)
export type TableRelationPatch = Static<typeof tableRelationPatchSchema>
export const tableRelationPatchValidator = getValidator(tableRelationPatchSchema, dataValidator)

// Schema for the data that is being returned
export const tableRelationResultSchema = Type.Omit(tableRelationSchema, [], {
  $id: 'TableRelationResult',
  additionalProperties: false,
})
export type TableRelationResult = Static<typeof tableRelationResultSchema> & TableRelationEager

// Schema for allowed query properties
export const tableRelationQuerySchema = Type.Intersect([
  querySyntax(
    Type.Omit(tableRelationSchema, [], {
      $id: 'TableRelationQuery',
      additionalProperties: false,
    }),
  ),
  Type.Object({
    $joinRelated: Type.Optional(
      Type.RegEx(/toTable/, {
        description: 'Join relation to the referenced table to',
      }),
    ),
    $joinEager: Type.Optional(
      Type.RegEx(/toTable/, {
        description: 'Join relation to the referenced table to',
      }),
    ),
    $eager: Type.Optional(
      Type.RegEx(/toTable/, {
        description: 'Join relation to the referenced table to',
      }),
    ),
  }),
])
export type TableRelationQuery = Static<typeof tableRelationQuerySchema>
export const tableRelationQueryValidator = getValidator(tableRelationQuerySchema, queryValidator)
