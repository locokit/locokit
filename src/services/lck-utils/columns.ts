import {
  Column,
  COLUMN_TYPE
} from '@locokit/lck-glossary'

export function getComponentEditableColumn (columnTypeId: number) {
  switch (columnTypeId) {
    case COLUMN_TYPE.USER:
    case COLUMN_TYPE.GROUP:
    case COLUMN_TYPE.RELATION_BETWEEN_TABLES:
      return 'lck-autocomplete'
    case COLUMN_TYPE.MULTI_USER:
      return 'lck-multi-autocomplete'
    case COLUMN_TYPE.BOOLEAN:
      return 'p-input-switch'
    case COLUMN_TYPE.NUMBER:
      return 'p-input-number'
    case COLUMN_TYPE.FLOAT:
      return 'p-input-float' // not a real component
    case COLUMN_TYPE.MULTI_SELECT:
      return 'lck-multiselect'
    case COLUMN_TYPE.SINGLE_SELECT:
      return 'p-dropdown'
    case COLUMN_TYPE.DATE:
      return 'p-calendar'
    case COLUMN_TYPE.TEXT:
      return 'p-textarea'
    case COLUMN_TYPE.URL:
      return 'lck-input-url'
    case COLUMN_TYPE.GEOMETRY_POINT:
    case COLUMN_TYPE.GEOMETRY_LINESTRING:
    case COLUMN_TYPE.GEOMETRY_POLYGON:
      return 'lck-map'
    default:
      return 'p-input-text'
  }
}

export function isEditableColumn (crudMode: boolean, column: Column) {
  switch (column.column_type_id) {
    case COLUMN_TYPE.LOOKED_UP_COLUMN:
    case COLUMN_TYPE.FORMULA:
      return false
    default:
      return crudMode || column.editable
  }
}

export function columnAncestor (column: Column): COLUMN_TYPE {
  if (column.column_type_id === COLUMN_TYPE.FORMULA) return column?.settings?.formula_type_id as COLUMN_TYPE
  if (column.column_type_id !== COLUMN_TYPE.LOOKED_UP_COLUMN || (column.parents && column.parents.length === 0) || !column.parents) {
    return column.column_type_id
  }
  return columnAncestor(column.parents[0])
}

export default { getComponentEditableColumn, isEditableColumn, columnAncestor }
