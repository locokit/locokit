import { COLUMN_TYPE } from '@locokit/lck-glossary'
import lckClient, { lckServices } from '@/services/lck-api'

interface Column {
  column_type_id: number;
  editable: boolean;
}

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
      return 'lck-multiselect'
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

export function isEditableColumn (crudMode: boolean, column: Column) {
  if (crudMode) {
    switch (column.column_type_id) {
      case COLUMN_TYPE.LOOKED_UP_COLUMN:
      case COLUMN_TYPE.FORMULA:
        return false
      default:
        return true
    }
  } else {
    return column.editable
  }
}

export async function searchItems ({ columnTypeId, tableId, query }: { columnTypeId: number; tableId: string; query: object}) {
  let items = null
  if (columnTypeId === COLUMN_TYPE.USER) {
    const result = await lckServices.user.find({
      query: {
        blocked: false,
        name: {
          $ilike: `%${query}%`
        }
      }
    })
    items = result.data.map((d: { name: string; id: string }) => ({
      label: d.name,
      value: d.id
    }))
  } else if (columnTypeId === COLUMN_TYPE.GROUP) {
    const result = await lckServices.group.find({
      query: {
        name: {
          $ilike: `%${query}%`
        }
      }
    })
    items = result.data.map((d: { name: string; id: string }) => ({
      label: d.name,
      value: d.id
    }))
    // eslint-disable-next-line @typescript-eslint/camelcase
  } else if (columnTypeId === COLUMN_TYPE.RELATION_BETWEEN_TABLES) {
    const result = await lckServices.tableRow.find({
      query: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        table_id: tableId,
        text: {
          $ilike: `%${query}%`
        }
      }
    })
    items = result.data.map((d: { text: string; id: string }) => ({
      label: d.text,
      value: d.id
    }))
  }
  return items
}
