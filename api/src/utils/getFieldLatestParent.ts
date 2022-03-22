import { TableColumn } from '../models/tablecolumn.model'

/**
 * Retrieve recursively the last parent of a field
 */
export function getLatestParent (field: TableColumn): TableColumn {
  if (field.parents && field.parents.length > 0) {
    return getLatestParent((field.parents as TableColumn[])[0])
  } else {
    return field
  }
}
