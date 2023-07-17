import { Type, Static, StringEnum } from '@feathersjs/typebox'
import Ajv from 'ajv'
import { DB_TYPE } from '../fieldType'
import { OptionalNullable, Nullable } from './typebox'

export const diffItemTableSettingsSchema = Type.Object(
  {
    name: Type.String(),
    schema: OptionalNullable(Type.String()),
    documentation: OptionalNullable(Type.String()),
  },
  {
    $id: 'DiffItemTableSettings',
    additionalProperties: false,
  },
)
export type DiffItemTableSettings = Static<typeof diffItemTableSettingsSchema>

export const diffItemTableSchema = Type.Object(
  {
    action: StringEnum(['CREATE', 'UPDATE', 'REMOVE']),
    target: Type.Literal('TABLE'),
    settings: Type.Ref(diffItemTableSettingsSchema),
  },
  {
    $id: 'DiffItemTable',
    additionalProperties: false,
  },
)
export type DiffItemTable = Static<typeof diffItemTableSchema>

export const diffItemFieldSettingsSchema = Type.Object(
  {
    name: Type.String(),
    table: Type.String(),
    schema: Type.Optional(Type.String()),
    documentation: OptionalNullable(Type.String()),
    dbType: Type.String(),
    primary: Type.Boolean({
      default: false,
    }),
    unique: Type.Boolean({
      default: false,
    }),
    foreign: Type.Boolean({
      default: false,
    }),
    nullable: Type.Boolean({
      default: true,
    }),
    default: Nullable(Type.String({ default: null })),
    maxLength: Nullable(
      Type.Number({
        maximum: 255,
        default: null,
      }),
    ),
  },
  {
    $id: 'DiffItemFieldSettings',
    additionalProperties: false,
  },
)
export type DiffItemFieldSettings = Static<typeof diffItemFieldSettingsSchema> & {
  dbType: DB_TYPE
}

export const diffItemFieldSchema = Type.Object(
  {
    action: StringEnum(['CREATE', 'UPDATE', 'REMOVE']),
    target: Type.Literal('FIELD'),
    settings: Type.Ref(diffItemFieldSettingsSchema),
  },
  {
    $id: 'DiffItemField',
    additionalProperties: false,
  },
)
export type DiffItemField = Static<typeof diffItemFieldSchema> & {
  settings: DiffItemFieldSettings
}

export const diffItemRelationSettingsSchema = Type.Object(
  {
    name: Type.String(),

    fromField: Type.String(),
    fromTable: Type.String(),
    fromSchema: OptionalNullable(Type.String()),

    toField: Type.String(),
    toTable: OptionalNullable(Type.String()),
    toSchema: OptionalNullable(Type.String()),

    throughTable: OptionalNullable(Type.String()),
    throughField: OptionalNullable(Type.String()),
    throughSchema: OptionalNullable(Type.String()),

    type: StringEnum(['1-1', '1-n', 'n-m']),
  },
  {
    $id: 'DiffItemRelationSettings',
  },
)
export type DiffItemRelationSettings = Static<typeof diffItemRelationSettingsSchema>

export const diffItemRelationSchema = Type.Object(
  {
    action: StringEnum(['CREATE', 'UPDATE', 'REMOVE']),
    target: Type.Literal('RELATION'),
    settings: Type.Ref(diffItemRelationSettingsSchema),
  },
  {
    $id: 'DiffItemRelation',
    additionalProperties: false,
  },
)
export type DiffItemRelation = Static<typeof diffItemRelationSchema>

export const diffItemSchema = Type.Union(
  [Type.Ref(diffItemTableSchema), Type.Ref(diffItemFieldSchema), Type.Ref(diffItemRelationSchema)],
  {
    $id: 'DiffItem',
  },
)

export type DiffItem = Static<typeof diffItemSchema>

export const diffSchema = Type.Object(
  {
    datasource: Type.Array(Type.Ref(diffItemSchema)),
    metamodel: Type.Array(Type.Ref(diffItemSchema)),
  },
  {
    $id: 'Diff',
    description: 'Diff to apply when migration is applied',
  },
)

export type Diff = Static<typeof diffSchema>

export function addDiffSchemaToValidator(validator: Ajv) {
  validator.addSchema(diffItemTableSettingsSchema)
  validator.addSchema(diffItemTableSchema)
  validator.addSchema(diffItemFieldSettingsSchema)
  validator.addSchema(diffItemFieldSchema)
  validator.addSchema(diffItemRelationSettingsSchema)
  validator.addSchema(diffItemRelationSchema)
  validator.addSchema(diffItemSchema)
  validator.addSchema(diffSchema)
}
