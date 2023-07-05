import { Type, Static, querySyntax, getValidator } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '@/commons/validators'
import { DB_TYPE, FIELD_TYPE } from '@locokit/definitions'

export const tableFieldSchema = Type.Object(
  {
    id: Type.String({
      format: 'uuid',
    }),
    name: Type.String({
      description: 'Name of the field',
    }),
    type: Type.String({
      description: 'Type of the field',
    }),
    dbType: Type.Optional(
      Type.String({
        description: 'Database type of the field',
      }),
    ),
    slug: Type.String({
      description: 'Slug of the field (column name for the database)',
    }),
    tableId: Type.String({
      format: 'uuid',
      description: 'Related table of the tableField',
    }),
    settings: Type.Optional(
      Type.Any({
        description: 'Field settings',
      }),
    ),
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
    $id: 'TableFieldSchema',
    additionalProperties: false,
  },
)

interface TableFieldTypes {
  type: keyof typeof FIELD_TYPE
  dbType: DB_TYPE
}

export type TableFieldSchema = Static<typeof tableFieldSchema> & TableFieldTypes

export const tableFieldDataSchema = Type.Omit(
  tableFieldSchema,
  ['id', 'slug', 'createdAt', 'updatedAt'],
  {
    $id: 'TableFieldData',
    additionalProperties: false,
  },
)
export type TableFieldData = Static<typeof tableFieldDataSchema> & {
  type: keyof typeof FIELD_TYPE
}
export const tableFieldDataValidator = getValidator(tableFieldDataSchema, dataValidator)

export const tableFieldDataInternalSchema = Type.Omit(
  tableFieldSchema,
  ['id', 'createdAt', 'updatedAt'],
  {
    $id: 'TableFieldDataInternal',
    additionalProperties: false,
  },
)
export type TableFieldDataInternal = Static<typeof tableFieldDataInternalSchema> & TableFieldTypes
export const tableFieldDataInternalValidator = getValidator(
  tableFieldDataInternalSchema,
  dataValidator,
)

export const tableFieldPatchSchema = Type.Omit(tableFieldDataSchema, ['tableId'], {
  $id: 'TableFieldPatch',
  additionalProperties: false,
})
export type TableFieldPatch = Static<typeof tableFieldPatchSchema> & TableFieldTypes
export const tableFieldPatchValidator = getValidator(tableFieldPatchSchema, dataValidator)

// Schema for the data that is being returned
export const tableFieldResultSchema = Type.Omit(tableFieldSchema, [], {
  $id: 'TableFieldResult',
  additionalProperties: false,
})
export type TableFieldResult = Static<typeof tableFieldResultSchema> & TableFieldTypes

// Schema for allowed query properties
export const tableFieldQuerySchema = Type.Intersect([
  querySyntax(
    Type.Omit(tableFieldSchema, ['tableId'], {
      $id: 'TableFieldQuery',
      additionalProperties: false,
    }),
  ),
  Type.Object({
    tableId: Type.Optional(
      Type.String({
        format: 'uuid',
        description: 'Related table of the tableField',
      }),
    ),
  }),
])
export type TableFieldQuery = Static<typeof tableFieldQuerySchema>
export const tableFieldQueryValidator = getValidator(tableFieldQuerySchema, queryValidator)
