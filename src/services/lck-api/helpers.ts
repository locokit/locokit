import { COLUMN_TYPE } from '@locokit/lck-glossary'

class LckDataComplex {
  reference!: string;
  value!: string;
}

export class LckColumn {
  /**
   * Column id, UUID v4
   */
  id!: string;
  /**
   * Text / Title of the column
   */
  text!: string;
  column_type_id!: COLUMN_TYPE;
  settings!: {
    values: Record<string, { label: string}>;
  }
}

export class LckColumnView extends LckColumn {
  /**
   * Display position
   */
  position!: number;
  /**
   * Sort properties
   */
  sort!: object;
  /**
   * Filters
   */
  filters?: object[]
}

export class LckRow {
  id!: string;
  data!: Record<string, string[] | string | LckDataComplex>;
}

export function getValue (column: LckColumn, data: string[] | string | LckDataComplex = '') {
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
      case COLUMN_TYPE.LOOKED_UP_COLUMN:
      case COLUMN_TYPE.FORMULA:
        return (data as LckDataComplex).value
      case COLUMN_TYPE.SINGLE_SELECT:
        return column.settings.values[data as string]?.label
      case COLUMN_TYPE.MULTI_SELECT:
        if ((data as string[]).length > 0) {
          return (data as string[]).map(d => column.settings.values[d]?.label).join(', ')
        } else {
          return ''
        }
      case COLUMN_TYPE.DATE:
      default:
        return data
    }
  } catch (error) {
    // eslint-disable no-console
    console.error('Field with bad format', data, error)
    return ''
  }
}
