import { Type, Static, querySyntax, getValidator, StringEnum } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '@/commons/validators'
import { diffSchema } from '@locokit/definitions'

export const migrationSchema = Type.Object(
  {
    id: Type.String({
      format: 'uuid',
    }),
    name: Type.String({
      description: 'Name of the datasource',
    }),
    datasourceId: Type.String({
      format: 'uuid',
      description: 'Related datasource of the migration',
    }),
    direction: StringEnum(
      ['from-datasource-to-metamodel', 'from-metamodel-to-datasource', 'both'],
      {
        default: 'both',
      },
    ),
    applied: Type.Optional(
      Type.String({
        format: 'date-time',
        description: 'Date of the application of the migration',
      }),
    ),
    reverted: Type.Optional(
      Type.String({
        format: 'date-time',
        description: 'Date of the revert of the migration',
      }),
    ),
    /**
     * We use an object and not an array of migration,
     * as there is an issue for postgres adapter
     * confusing between native arrays and jsonb arrays
     *
     * https://stackoverflow.com/questions/60526168/how-to-create-a-column-that-can-store-an-array-of-objects-using-knex-postgres
     */
    diffToApply: Type.Ref(diffSchema),
    createdAt: Type.String({
      format: 'date-time',
      description: 'Creation date of the migration',
    }),
    updatedAt: Type.String({
      format: 'date-time',
      description: 'Update date of the migration',
    }),
  },
  {
    $id: 'MigrationSchema',
    additionalProperties: false,
  },
)

export type MigrationSchema = Static<typeof migrationSchema>

// Schema for the data that is being returned
export const migrationResultSchema = migrationSchema
export type MigrationResult = Static<typeof migrationResultSchema>

export const migrationDataExternalSchema = Type.Object(
  {
    name: Type.String({
      description: 'Name of the datasource',
    }),
    datasourceId: Type.String({
      format: 'uuid',
      description: 'Related datasource of the migration',
    }),
    direction: Type.Optional(
      StringEnum(['from-datasource-to-metamodel', 'from-metamodel-to-datasource', 'both'], {
        default: 'both',
      }),
    ),
  },
  {
    $id: 'MigrationDataExternal',
    additionalProperties: false,
  },
)

export type MigrationDataExternal = Static<typeof migrationDataExternalSchema>
export const migrationDataExternalValidator = getValidator(
  migrationDataExternalSchema,
  dataValidator,
)

export const migrationDataInternalSchema = Type.Omit(
  migrationSchema,
  ['id', 'applied', 'reverted'],
  {
    $id: '#/locokit/MigrationDataInternal',
    additionalProperties: false,
  },
)
export type MigrationDataInternal = Static<typeof migrationDataInternalSchema>

export const migrationDataInternalValidator = getValidator(
  migrationDataInternalSchema,
  dataValidator,
)

export const migrationPatchSchema = Type.Pick(
  migrationSchema,
  ['applied', 'reverted', 'updatedAt'],
  {
    $id: 'MigrationPatch',
    additionalProperties: false,
  },
)
export type MigrationPatch = Static<typeof migrationPatchSchema>
export const migrationPatchValidator = getValidator(migrationPatchSchema, dataValidator)

// Schema for allowed query properties
export const migrationQuerySchema = querySyntax(Type.Omit(migrationSchema, ['diffToApply']))
export type MigrationQuery = Static<typeof migrationQuerySchema>
export const migrationQueryValidator = getValidator(migrationQuerySchema, queryValidator)

export const migrationDiffInternalSchema = Type.Object(
  {
    datasourceId: Type.String({
      format: 'uuid',
      description: 'Related datasource of the migration',
    }),
  },
  {
    $id: 'MigrationDiffInternal',
    additionalProperties: false,
  },
)

export type MigrationDiffInternal = Static<typeof migrationDiffInternalSchema>
export const migrationDiffInternalValidator = getValidator(
  migrationDiffInternalSchema,
  dataValidator,
)

export const migrationDataApplySchema = Type.Object(
  {
    id: Type.String({
      format: 'uuid',
      description: 'Id of the migration',
    }),
    datasourceId: Type.String({
      format: 'uuid',
      description: 'Related datasource of the migration',
    }),
  },
  {
    $id: 'MigrationApply',
    additionalProperties: false,
  },
)

export type MigrationApply = Static<typeof migrationDataApplySchema>
export const migrationApplyValidator = getValidator(migrationDataApplySchema, dataValidator)
