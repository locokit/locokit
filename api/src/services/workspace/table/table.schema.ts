import { Type, Static, querySyntax, getValidator } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '@/commons/validators'
import { WorkspaceDatasourceSchema } from '../datasource/datasource.schema'
import { TableFieldSchema } from '../table-field/table-field.schema'
import { TableRelationSchema } from '../table-relation/table-relation.schema'
import { OptionalNullable } from '@locokit/definitions'

/**
 * Main schema
 */
export const tableSchema = Type.Object(
  {
    id: Type.String({
      format: 'uuid',
    }),
    name: Type.String({
      description: 'Name of the table',
    }),
    slug: Type.String({
      description: 'Table name in the database',
    }),
    documentation: OptionalNullable(
      Type.String({
        description: 'Explain what is this table',
      }),
    ),
    datasourceId: Type.String({
      format: 'uuid',
      description: 'Related datasource',
    }),

    datasource: Type.Optional(
      Type.Any({ description: 'Related datasource', $schema: 'WorkspaceDatasourceSchema' }),
    ),
    fields: Type.Optional(
      Type.Array(
        Type.Any({
          description: 'Related fields',
          $schema: 'TableFieldSchema',
        }),
      ),
    ),
  },
  {
    $id: 'TableSchema',
    additionalProperties: false,
  },
)

interface TableRelations {
  datasource?: WorkspaceDatasourceSchema
  fields?: TableFieldSchema[]
  relations?: TableRelationSchema[]
  lookups?: TableRelationSchema[]
}

export type TableSchema = Static<typeof tableSchema> & TableRelations
export const tableResultSchema = tableSchema
export type TableResult = Static<typeof tableResultSchema> & TableRelations

/**
 * Creation
 */
export const tableDataSchema = Type.Omit(tableSchema, ['id', 'slug', 'datasource', 'fields'], {
  $id: 'TableDataSchema',
  additionalProperties: false,
})
export type TableData = Static<typeof tableDataSchema>
export const tableDataValidator = getValidator(tableDataSchema, dataValidator)

export const tableDataInternalSchema = Type.Omit(tableSchema, ['id', 'datasource', 'fields'], {
  $id: 'TableDataInternalSchema',
  additionalProperties: false,
})
export type TableDataInternal = Static<typeof tableDataInternalSchema>
export const tableDataInternalValidator = getValidator(tableDataInternalSchema, dataValidator)

/**
 * Patch
 */
export const tablePatchSchema = Type.Partial(tableDataSchema, {
  additionalProperties: false,
  $id: 'TablePatchSchema',
})
export type TablePatch = Static<typeof tablePatchSchema>

/**
 * Query
 */
export const tableQuerySchema = Type.Intersect(
  [
    querySyntax(Type.Omit(tableSchema, ['datasource', 'fields', 'datasourceId'])),
    Type.Object({
      datasourceId: Type.Optional(
        Type.String({
          format: 'uuid',
          description: 'Related datasource',
        }),
      ),
      $joinRelated: Type.Optional(
        // Type.RegEx(
        //   /(^(datasource|fields|relations(\.\[toTable\])?)$)|(^\[(datasource|fields|relations(\.\[toTable\])?)(,(datasource|fields|relations(\.\[toTable\])?)(?!.*\5))*\]$)/,
        Type.String({
          description: 'Join table to its datasource / relations / fields.',
        }),
      ),
      $joinEager: Type.Optional(
        // Type.RegEx(
        //   /(^(datasource|fields|relations(\.\[toTable\])?)$)|(^\[(datasource|fields|relations(\.\[toTable\])?)(,(datasource|fields|relations(\.\[toTable\])?)(?!.*\5))*\]$)/,
        Type.String({
          description: 'Join table to its datasource / relations / fields.',
        }),
      ),
      $eager: Type.Optional(
        // Type.RegEx(
        //   /(^(datasource|fields|relations(\.\[toTable\])?)$)|(^\[(datasource|fields|relations(\.\[toTable\])?)(,(datasource|fields|relations(\.\[toTable\])?)(?!.*\5))*\]$)/,
        Type.String({
          description: 'Join table to its datasource / relations / fields.',
        }),
      ),
    }),
  ],
  { $id: 'TableQuery', additionalProperties: false },
)
export type TableQuery = Static<typeof tableQuerySchema>
export const tableQueryValidator = getValidator(tableQuerySchema, queryValidator)