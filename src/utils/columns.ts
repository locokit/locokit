import { COLUMN_TYPE } from '@locokit/lck-glossary'

export function getComponentEditableColumn (columnTypeId: number) {
  switch (columnTypeId) {
    case COLUMN_TYPE.USER:
    case COLUMN_TYPE.GROUP:
    case COLUMN_TYPE.RELATION_BETWEEN_TABLES:
      return 'lck-autocomplete'
    case COLUMN_TYPE.BOOLEAN:
      return 'p-input-switch'
    case COLUMN_TYPE.NUMBER:
      return 'p-input-number'
    case COLUMN_TYPE.FLOAT:
      return 'p-input-float' // not a real component
    case COLUMN_TYPE.MULTI_SELECT:
    case COLUMN_TYPE.SINGLE_SELECT:
      return 'p-dropdown'
    case COLUMN_TYPE.DATE:
      return 'p-calendar'
    case COLUMN_TYPE.TEXT:
      return 'p-textarea'
    default:
      return 'p-input-text'
  }
}
