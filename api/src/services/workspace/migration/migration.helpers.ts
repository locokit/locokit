import {
  DB_TYPE,
  DiffItemFieldSettings,
  DiffItemRelationSettings,
  DiffItemTableSettings,
} from '@locokit/definitions'
import { Field, Table } from '@locokit/engine'
import { Value } from '@sinclair/typebox/value'
import { type ForeignKey } from '@directus/schema'
import { TableFieldResult } from '../table-field/table-field.schema'
import { TableRelationResult } from '../table-relation/table-relation.schema'
import { TableResult } from '../table/table.schema'

export function getTableSettingsFromDatasource(tableDatasource: Table): DiffItemTableSettings {
  return {
    name: tableDatasource.name,
    schema: tableDatasource.schema,
    documentation: tableDatasource.comment,
  }
}
export function getTableSettingsFromMetaModel(tableMetaModel: TableResult): DiffItemTableSettings {
  return {
    name: tableMetaModel.slug,
    schema: `ds_${tableMetaModel.datasourceId as string}`,
    documentation: tableMetaModel.documentation,
  }
}

/**
 * Compute a diff between a table from the "true" datasource
 * and a table defined in the metamodel
 *
 * Returns a { diff, tableSettingsFromDatasource, tableSettingsFromMetaModel } object
 * to be used for storing actions to do for migration
 */
export function computeDiffTableSettings(tableDatasource: Table, tableMetaModel: TableResult) {
  const tableSettingsFromDatasource = getTableSettingsFromDatasource(tableDatasource)
  const tableSettingsFromMetaModel = getTableSettingsFromMetaModel(tableMetaModel)

  return {
    diff: Value.Diff(tableSettingsFromDatasource, tableSettingsFromMetaModel) ?? [],
    tableSettingsFromDatasource,
    tableSettingsFromMetaModel,
  }
}

export function getFieldSettingsFromDatasource(
  fieldDatasource: Field,
  tableDatasource: Table,
): DiffItemFieldSettings {
  return {
    name: fieldDatasource.name,
    table: tableDatasource.name,
    schema: tableDatasource.schema,
    documentation: fieldDatasource.comment,
    dbType: fieldDatasource.data_type as DB_TYPE,
    unique: fieldDatasource.is_unique,
    nullable: fieldDatasource.is_nullable,
    primary: fieldDatasource.is_primary_key,
    default: fieldDatasource.default_value,
    foreign: !!fieldDatasource.foreign_key_column,
    maxLength: fieldDatasource.max_length,
  }
}

export function getFieldSettingsFromMetaModel(
  fieldMetaModel: TableFieldResult,
  tableMetaModel: TableResult,
): DiffItemFieldSettings {
  return {
    name: fieldMetaModel.slug,
    table: tableMetaModel.slug,
    schema: `ds_${tableMetaModel.datasourceId}`,
    documentation: fieldMetaModel.documentation,
    dbType: fieldMetaModel.dbType,
    unique: fieldMetaModel.settings.unique,
    nullable: fieldMetaModel.settings.nullable,
    primary: fieldMetaModel.settings.primary,
    default: fieldMetaModel.settings.default,
    foreign: fieldMetaModel.settings.foreign,
    maxLength: fieldMetaModel.settings.maxLength,
  }
}

/**
 * Compute a diff between a field from the "true" datasource
 * and a field defined in the metamodel
 *
 * Returns a { diff, fieldSettingsFromDatasource, fieldSettingsFromMetamodel } object
 * to be used for storing actions to do for migration
 */
export function computeDiffFieldSettings(
  fieldDatasource: Field,
  tableDatasource: Table,
  fieldMetaModel: TableFieldResult,
  tableMetaModel: TableResult,
) {
  const fieldSettingsFromDatasource = getFieldSettingsFromDatasource(
    fieldDatasource,
    tableDatasource,
  )

  const fieldSettingsFromMetamodel = getFieldSettingsFromMetaModel(fieldMetaModel, tableMetaModel)

  return {
    diff: Value.Diff(fieldSettingsFromDatasource, fieldSettingsFromMetamodel) ?? [],
    fieldSettingsFromDatasource,
    fieldSettingsFromMetamodel,
  }
}

/**
 * Compute settings for a relation,
 * from datasource foreign key & table metadata
 *
 * By default, set the relation type to '1-n'
 */
export function getRelationSettingsFromDatasource(
  foreignKeyDatasource: ForeignKey,
  tableDatasource: Table,
): DiffItemRelationSettings {
  return {
    name:
      foreignKeyDatasource.constraint_name ??
      `FK_${foreignKeyDatasource.table}_${foreignKeyDatasource.column}_${foreignKeyDatasource.foreign_key_table}_${foreignKeyDatasource.foreign_key_column}`,
    fromField: foreignKeyDatasource.column,
    fromTable: foreignKeyDatasource.table,
    fromSchema: tableDatasource.schema,
    toField: foreignKeyDatasource.foreign_key_column as string,
    toTable: foreignKeyDatasource.foreign_key_table,
    toSchema: foreignKeyDatasource.foreign_key_schema,
    type: '1-n',
  }
}

/**
 * Compute settings for a relation,
 * from metamodel relation & table metadata
 */
export function getRelationSettingsFromMetaModel(
  relationMetaModel: TableRelationResult,
  tableMetaModel: TableResult,
): DiffItemRelationSettings {
  return {
    name: relationMetaModel.slug,
    fromTable: tableMetaModel.slug,
    fromSchema: `ds_${tableMetaModel.datasourceId as string}`,
    fromField: relationMetaModel.fromField?.slug as string,
    toTable: relationMetaModel.toTable?.slug,
    toField: relationMetaModel.toField?.slug as string,
    toSchema: `ds_${relationMetaModel.toTable?.datasourceId as string}`,
    type: relationMetaModel.type,
  }
}
/**
 * Compute a diff between a relation from the "true" datasource
 * and a relation defined in the metamodel
 *
 * Returns a { diff, relationSettingsFromDatasource, relationSettingsFromMetamodel } object
 * to be used for storing actions to do for migration
 */
export function computeDiffRelationsSettings(
  foreignKeyDatasource: ForeignKey,
  tableDatasource: Table,
  relationMetaModel: TableRelationResult,
  tableMetaModel: TableResult,
) {
  const relationSettingsFromDatasource = getRelationSettingsFromDatasource(
    foreignKeyDatasource,
    tableDatasource,
  )

  const relationSettingsFromMetamodel = getRelationSettingsFromMetaModel(
    relationMetaModel,
    tableMetaModel,
  )

  return {
    diff: Value.Diff(relationSettingsFromDatasource, relationSettingsFromMetamodel) ?? [],
    relationSettingsFromDatasource,
    relationSettingsFromMetamodel,
  }
}
