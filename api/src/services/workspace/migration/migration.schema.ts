import { Type, Static, StringEnum, querySyntax, getValidator } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '@/commons/validators'

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
    diffToApply: Type.Object(
      {
        datasource: Type.Array(
          Type.Object({
            action: StringEnum(['CREATE', 'UPDATE', 'REMOVE']),
            target: StringEnum(['TABLE', 'FIELD', 'RELATION']),
            settings: Type.Any({}),
          }),
        ),
        metamodel: Type.Array(
          Type.Object({
            action: StringEnum(['CREATE', 'UPDATE', 'REMOVE']),
            target: StringEnum(['TABLE', 'FIELD', 'RELATION']),
            settings: Type.Any({}),
          }),
        ),
      },
      {
        description: 'Diff to apply when migration is applied',
        default: [],
      },
    ),
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

export const migrationDataSchema = Type.Omit(
  migrationSchema,
  ['id', 'diffToApply', 'createdAt', 'updatedAt'],
  {
    $id: 'MigrationData',
    additionalProperties: false,
  },
)
export type MigrationData = Static<typeof migrationDataSchema>
export const migrationDataValidator = getValidator(migrationDataSchema, dataValidator)

export const migrationDataInternalSchema = Type.Omit(migrationSchema, ['id'], {
  $id: 'MigrationDataInternal',
  additionalProperties: false,
})
export type MigrationDataInternal = Static<typeof migrationDataInternalSchema>
export const migrationDataInternalValidator = getValidator(
  migrationDataInternalSchema,
  dataValidator,
)

export const migrationPatchSchema = Type.Pick(migrationSchema, ['name', 'applied', 'reverted'], {
  $id: 'MigrationPatch',
  additionalProperties: false,
})
export type MigrationPatch = Static<typeof migrationPatchSchema>
export const migrationPatchValidator = getValidator(migrationPatchSchema, dataValidator)

// Schema for allowed query properties
export const migrationQuerySchema = querySyntax(Type.Omit(migrationSchema, ['diffToApply']))
export type MigrationQuery = Static<typeof migrationQuerySchema>
export const migrationQueryValidator = getValidator(migrationQuerySchema, queryValidator)
