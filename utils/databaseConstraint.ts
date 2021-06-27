// Github issue: https://github.com/knex/knex/issues/1699
/**
 * Allow to manage constraint for enum/enu
 * Useful when adding, deleting, editing an element of a enum/enu
 * @param tableName
 * @param columnName
 * @param enums
 */
export const formatAlterTableEnumSql = (
  tableName: string,
  columnName: string,
  enums: string[],
): string => {
  const constraintName = `${tableName}_${columnName}_check`
  return [
    `ALTER TABLE ${tableName} DROP CONSTRAINT IF EXISTS ${constraintName};`,
    `ALTER TABLE ${tableName} ADD CONSTRAINT ${constraintName} CHECK (${columnName} = ANY (ARRAY['${enums.join(
      '\'::text, \'',
    )}'::text]));`,
  ].join('\n')
}
