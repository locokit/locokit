import { TranslateResult } from 'vue-i18n'
import i18n from '@/plugins/i18n'

import { COLUMN_GEO_TYPE, COLUMN_TYPE } from '@locokit/lck-glossary'

import {
  LckTableColumn,
  LckTableRowData,
  LckTableRowDataComplex,
  LCKTableRowMultiDataComplex,
  LckTableViewColumn,
  SelectValue,
} from '@/services/lck-api/definitions'
import { formatDate } from '@/services/lck-utils/date'
import { PopupContent } from './map/transformWithOL'

/**
 * DataTable cells display & editor components
 */

/**
 * This function return editor component of column type, for DataTable cell use
 * @param columnTypeId ColumnType id
 * @returns component's name
 */
export function getComponentEditorCellForColumnType (columnTypeId: number) {
  switch (columnTypeId) {
    case COLUMN_TYPE.USER:
    case COLUMN_TYPE.GROUP:
    case COLUMN_TYPE.RELATION_BETWEEN_TABLES:
      return 'lck-autocomplete'
    case COLUMN_TYPE.MULTI_USER:
      return 'lck-multi-autocomplete'
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
    case COLUMN_TYPE.DATETIME:
      return 'p-calendar-time'
    case COLUMN_TYPE.STRING:
      return 'p-input-text'
    case COLUMN_TYPE.TEXT:
      return 'p-textarea'
    case COLUMN_TYPE.URL:
      return 'lck-url-input'
    case COLUMN_TYPE.BOOLEAN:
      return 'p-checkbox'
    default:
      return null
  }
}

/**
 * This function return display component of column type, for DataTable cell use
 * @param columnTypeId ColumnType id
 * @returns component's name
 */
export function getComponentDisplayCellForColumnType (columnTypeId: number) {
  switch (columnTypeId) {
    case COLUMN_TYPE.SINGLE_SELECT:
      return 'lck-badge'
    case COLUMN_TYPE.BOOLEAN:
      return 'p-checkbox'
    case COLUMN_TYPE.FILE:
      return 'lck-input-file'
    default:
      return null
  }
}

/**
 * DataDetail display & editor components
 */

/**
 * This function return editor component of column type, for DataDetail use
 * @param columnTypeId ColumnType id
 * @returns component's name
 */
export function getComponentEditorDetailForColumnType (columnTypeId: number) {
  switch (columnTypeId) {
    case COLUMN_TYPE.USER:
    case COLUMN_TYPE.GROUP:
    case COLUMN_TYPE.RELATION_BETWEEN_TABLES:
      return 'lck-autocomplete'
    case COLUMN_TYPE.MULTI_USER:
      return 'lck-multi-autocomplete'
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
    case COLUMN_TYPE.DATETIME:
      return 'p-calendar-time'
    case COLUMN_TYPE.STRING:
      return 'p-input-text'
    case COLUMN_TYPE.TEXT:
      return 'p-textarea'
    case COLUMN_TYPE.URL:
      return 'lck-url-input'
    case COLUMN_TYPE.BOOLEAN:
      return 'p-checkbox'
    case COLUMN_TYPE.GEOMETRY_POINT:
    case COLUMN_TYPE.GEOMETRY_LINESTRING:
    case COLUMN_TYPE.GEOMETRY_POLYGON:
    case COLUMN_TYPE.GEOMETRY_MULTIPOINT:
    case COLUMN_TYPE.GEOMETRY_MULTILINESTRING:
    case COLUMN_TYPE.GEOMETRY_MULTIPOLYGON:
      return 'lck-map'
    case COLUMN_TYPE.FILE:
      return 'lck-file-input'
    default:
      return null
  }
}

/**
 * This function return display component of column type, for DataDetail use
 * @param columnTypeId ColumnType id
 * @returns component's name
 */
export function getComponentDisplayDetailForColumnType (columnTypeId: number) {
  switch (columnTypeId) {
    case COLUMN_TYPE.SINGLE_SELECT:
      return 'lck-badge'
    case COLUMN_TYPE.BOOLEAN:
      return 'p-checkbox'
    case COLUMN_TYPE.GEOMETRY_POINT:
    case COLUMN_TYPE.GEOMETRY_LINESTRING:
    case COLUMN_TYPE.GEOMETRY_POLYGON:
    case COLUMN_TYPE.GEOMETRY_MULTIPOINT:
    case COLUMN_TYPE.GEOMETRY_MULTILINESTRING:
    case COLUMN_TYPE.GEOMETRY_MULTIPOLYGON:
      return 'lck-map'
    case COLUMN_TYPE.FILE:
      return 'lck-file-input'
    default:
      return null
  }
}

export const READ_ONLY_COLUMNS_TYPES = new Set([
  COLUMN_TYPE.LOOKED_UP_COLUMN,
  COLUMN_TYPE.VIRTUAL_LOOKED_UP_COLUMN,
  COLUMN_TYPE.FORMULA,
])

export function isEditableColumn (crudMode: boolean, column: LckTableViewColumn) {
  return !READ_ONLY_COLUMNS_TYPES.has(column.column_type_id) && (crudMode || column.editable)
}

export function getColumnTypeId (column: LckTableColumn): COLUMN_TYPE {
  if (column.column_type_id === COLUMN_TYPE.FORMULA) return column?.settings?.formula_type_id as COLUMN_TYPE
  if ((column.column_type_id !== COLUMN_TYPE.LOOKED_UP_COLUMN &&
    column.column_type_id !== COLUMN_TYPE.VIRTUAL_LOOKED_UP_COLUMN) ||
    (column.parents && column.parents.length === 0) ||
    !column.parents
  ) {
    return column.column_type_id
  }
  return getColumnTypeId(column.parents[0])
}

export function getOriginalColumn (column: LckTableColumn): LckTableColumn {
  if ((column.column_type_id !== COLUMN_TYPE.LOOKED_UP_COLUMN &&
    column.column_type_id !== COLUMN_TYPE.VIRTUAL_LOOKED_UP_COLUMN) ||
    (column.parents && column.parents.length === 0) ||
    !column.parents
  ) {
    return column
  }
  return getOriginalColumn(column.parents[0])
}

export function getColumnClass (column: LckTableViewColumn): string {
  const columnClass = getColumnTypeId(column)
  switch (columnClass) {
    case COLUMN_TYPE.BOOLEAN:
      return 'bi bi-check'
    case COLUMN_TYPE.STRING:
      return 'bi bi-type'
    case COLUMN_TYPE.NUMBER:
      return 'bi bi-hash'
    case COLUMN_TYPE.FLOAT:
      return 'bi bi-hash'
    case COLUMN_TYPE.DATE:
      return 'bi bi-calendar-date'
    case COLUMN_TYPE.DATETIME:
      return 'bi bi-clock'
    case COLUMN_TYPE.USER:
      return 'bi bi-person-fill'
    case COLUMN_TYPE.GROUP:
      return 'bi bi-people-fill'
    case COLUMN_TYPE.RELATION_BETWEEN_TABLES:
      return 'bi bi-text-indent-left'
    case COLUMN_TYPE.SINGLE_SELECT:
      return 'bi bi-check'
    case COLUMN_TYPE.MULTI_SELECT:
      return 'bi bi-list-check'
    case COLUMN_TYPE.FORMULA:
      return 'bi bi-calculator'
    case COLUMN_TYPE.FILE:
      return 'bi-file-earmark'
    case COLUMN_TYPE.MULTI_USER:
      return 'bi bi-people-fill'
    case COLUMN_TYPE.MULTI_GROUP:
      return 'bi bi-people-fill'
    case COLUMN_TYPE.TEXT:
      return 'bi bi-textarea-t'
    case COLUMN_TYPE.URL:
      return 'bi bi-link-45deg'
    case COLUMN_TYPE.GEOMETRY_POINT:
      return 'bi bi-geo'
    case COLUMN_TYPE.GEOMETRY_POLYGON:
      return 'bi bi-bounding-box-circles'
    case COLUMN_TYPE.GEOMETRY_LINESTRING:
      return 'bi bi-geo-fill'
    default:
      return ''
  }
}

/**
 * Return a list of the geographic column types
 */
export const GEOGRAPHIC_COLUMN_TYPES = Object.keys(COLUMN_GEO_TYPE).reduce((acc: number[], item: string) => {
  const columnTypeId = parseInt(item)
  if (!isNaN(columnTypeId)) acc.push(columnTypeId)
  return acc
}, [] as number[])

/**
 * Return the display value for a column.
 * By taking the backend data column value,
 * retrieve the good part of the data to be displayed.
 *
 * @param column
 * The column definition
 *
 * @param data
 * The data to be analyzed
 */
export function getColumnDisplayValue (
  column: LckTableColumn,
  data: LckTableRowData = '',
  onlyBaseValue = false,
  i18nOptions?: {
    dateFormat: string | TranslateResult;
    datetimeFormat: string | TranslateResult;
  },
): string | undefined | SelectValue {
  if (
    data === '' ||
    data === undefined ||
    data === null
  ) return ''
  try {
    switch (column.column_type_id) {
      case COLUMN_TYPE.USER:
      case COLUMN_TYPE.GROUP:
      case COLUMN_TYPE.RELATION_BETWEEN_TABLES:
        return (data as LckTableRowDataComplex).value as string
      case COLUMN_TYPE.LOOKED_UP_COLUMN:
        const originalColumn = getOriginalColumn(column)
        if ([
          COLUMN_TYPE.DATE,
          COLUMN_TYPE.DATETIME,
          COLUMN_TYPE.SINGLE_SELECT,
          COLUMN_TYPE.MULTI_SELECT,
        ].includes(originalColumn.column_type_id)) {
          return getColumnDisplayValue(originalColumn, (data as LckTableRowDataComplex).value, onlyBaseValue, i18nOptions)
        } else if (originalColumn.column_type_id === COLUMN_TYPE.MULTI_USER) {
          return getColumnDisplayValue(originalColumn, (data as LckTableRowDataComplex), onlyBaseValue, i18nOptions)
        } else {
          return (data as LckTableRowDataComplex).value as string
        }
      case COLUMN_TYPE.VIRTUAL_LOOKED_UP_COLUMN:
        const virtualOriginalColumn = getOriginalColumn(column)
        if (virtualOriginalColumn.column_type_id !== COLUMN_TYPE.VIRTUAL_LOOKED_UP_COLUMN) {
          return getColumnDisplayValue(virtualOriginalColumn, data, onlyBaseValue, i18nOptions)
        }
        return data as string
      case COLUMN_TYPE.MULTI_USER:
        return (data as LCKTableRowMultiDataComplex).value.join(', ')
      case COLUMN_TYPE.SINGLE_SELECT:
        const currentValue = (column.settings.values?.[data as string]) as SelectValue
        if (onlyBaseValue) {
          return currentValue?.label
        }
        return {
          value: currentValue?.value,
          label: currentValue?.label,
          color: currentValue?.color,
          backgroundColor: currentValue?.backgroundColor,
        }
      case COLUMN_TYPE.MULTI_SELECT:
        if ((data as string[]).length > 0) {
          return (data as string[]).map(d => column.settings.values?.[d]?.label).join(', ')
        } else {
          return ''
        }

      case COLUMN_TYPE.FORMULA:
        if (getColumnTypeId(column) === COLUMN_TYPE.DATE) {
          return formatDate(
            (data as Date),
            i18nOptions ? i18nOptions.dateFormat : i18n.t('date.dateFormat'),
          ) || ''
        } else {
          return data as string
        }
      case COLUMN_TYPE.DATE:
        return formatDate(
          (data as Date),
          i18nOptions ? i18nOptions.dateFormat : i18n.t('date.dateFormat'),
        ) || ''
      case COLUMN_TYPE.DATETIME:
        return formatDate(
          (data as Date),
          i18nOptions ? i18nOptions.datetimeFormat : i18n.t('date.datetimeFormat'),
        ) || ''
      default:
        return data as string
    }
  } catch (error) {
    // eslint-disable no-console
    console.error('Field with bad format', data, error)
    return ''
  }
}

export function getDataFromTableViewColumn (
  column: LckTableViewColumn,
  data: LckTableRowData,
  options: {
    dateFormat: string | TranslateResult;
    datetimeFormat: string | TranslateResult;
    noData: string | TranslateResult;
    noReference: string | TranslateResult;
  }): PopupContent['field'] {
  switch (column.column_type_id) {
    case COLUMN_TYPE.USER:
    case COLUMN_TYPE.GROUP:
    case COLUMN_TYPE.RELATION_BETWEEN_TABLES:
      return {
        label: column.text,
        value: (data as LckTableRowDataComplex | null)?.value as string || options.noData as string,
      }
    case COLUMN_TYPE.LOOKED_UP_COLUMN:
    case COLUMN_TYPE.VIRTUAL_LOOKED_UP_COLUMN:
      const lookedUpColumnValue = getColumnDisplayValue(
        column,
        data,
        true,
        { dateFormat: options.dateFormat, datetimeFormat: options.datetimeFormat },
      ) as string | number | boolean | undefined
      return {
        label: column.text,
        value: lookedUpColumnValue != null && lookedUpColumnValue !== ''
          ? lookedUpColumnValue
          : options.noData as string,
      }
    case COLUMN_TYPE.MULTI_USER:
      return {
        label: column.text,
        value: (data as LCKTableRowMultiDataComplex | null)?.value.join(', ') || options.noData as string,
      }
    case COLUMN_TYPE.SINGLE_SELECT:
      return {
        label: column.text,
        value: (column.settings?.values as Record<string, SelectValue>)[data as string]?.label || options.noData as string,
        color: (column.settings?.values as Record<string, SelectValue>)[data as string]?.color,
        backgroundColor: (column.settings?.values as Record<string, SelectValue>)[data as string]?.backgroundColor,
      }
    case COLUMN_TYPE.MULTI_SELECT:
      return {
        label: column.text,
        value: (data as string[]).length > 0 ? (data as string[]).map(d => (column.settings?.values as Record<string, SelectValue>)[d]?.label).join(', ') : options.noData as string,
      }
    case COLUMN_TYPE.FORMULA:
      const value = getColumnTypeId(column) === COLUMN_TYPE.DATE
        ? formatDate(data as Date, options.dateFormat)
        : data

      return {
        label: column.text,
        value: (value || options.noData) as string,
      }
    case COLUMN_TYPE.DATE:
      // eslint-disable-next-line no-case-declarations
      return {
        label: column.text,
        value: (data != null ? formatDate(data as Date, options.dateFormat) : options.noData) as string,
      }
    case COLUMN_TYPE.DATETIME:
      // eslint-disable-next-line no-case-declarations
      return {
        label: column.text,
        value: (data != null ? formatDate(data as Date, options.datetimeFormat) : options.noData) as string,
      }
    default:
      return { label: column.text, value: (data != null && data !== '' ? data : options.noData) as string }
  }
}

export default {
  getComponentDisplayCellForColumnType,
  getComponentEditorCellForColumnType,
  getComponentDisplayDetailForColumnType,
  getComponentEditorDetailForColumnType,
  isEditableColumn,
  getColumnTypeId,
  getOriginalColumn,
  getDataFromTableViewColumn,
  getColumnClass,
  getColumnDisplayValue,
  GEOGRAPHIC_COLUMN_TYPES,
  READ_ONLY_COLUMNS_TYPES,
}
