import { Type, Static, querySyntax, getValidator, StringEnum } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '@/commons/validators'

export const tableRelationSchema = Type.Object(
  {
    id: Type.String({
      format: 'uuid',
    }),
    name: Type.Optional(Type.String({
      description: 'Name of the relation',
    })),
    slug: Type.Optional(Type.String({
      description: 'Slug of the relation, needed for joining relation',
    })),
    fromTableId: Type.String({
      format: 'uuid',
      description: 'From table',
    }),
    toTableId: Type.String({
      format: 'uuid',
      description: 'To table',
    }),
    throughTableId: Type.Optional(Type.String({
      format: 'uuid',
      description: 'Through table',
    })),
    fromFieldId: Type.String({
      format: 'uuid',
      description: 'From table field',
    }),
    toFieldId: Type.String({
      format: 'uuid',
      description: 'To table field',
    }),
    throughFieldId: Type.Optional(Type.String({
      format: 'uuid',
      description: 'Through table field',
    })),
    type: StringEnum(['1-n', 'n-1', 'n-m', '1-1']),
    settings: Type.Any({
      description: 'Relation settings'
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

export type TableRelationSchema = Static<typeof tableRelationSchema>

export const tableRelationDataSchema = Type.Omit(tableRelationSchema, ['id', 'createdAt', 'updatedAt'], {
  $id: 'TableRelationData',
  additionalProperties: false,
})
export type TableRelationData = Static<typeof tableRelationDataSchema>
export const tableRelationDataValidator = getValidator(tableRelationDataSchema, dataValidator)

export const tableRelationPatchSchema = Type.Omit(tableRelationDataSchema, ['fromTableId', 'toTableId', 'throughTableId', 'fromFieldId', 'toFieldId', 'throughTableId'], {
  $id: 'TableRelationPatch',
  additionalProperties: false
})
export type TableRelationPatch = Static<typeof tableRelationPatchSchema>
export const tableRelationPatchValidator = getValidator(tableRelationPatchSchema, dataValidator)

// Schema for the data that is being returned
export const tableRelationResultSchema = Type.Omit(tableRelationSchema, [], {
  $id: 'TableRelationResult',
  additionalProperties: false
})
export type TableRelationResult = Static<typeof tableRelationResultSchema>

// Schema for allowed query properties
export const tableRelationQuerySchema = querySyntax(Type.Omit(tableRelationSchema, [], {
  $id: 'TableRelationQuery',
  additionalProperties: false
}))
export type TableRelationQuery = Static<typeof tableRelationQuerySchema>
export const tableRelationQueryValidator = getValidator(tableRelationQuerySchema, queryValidator)
