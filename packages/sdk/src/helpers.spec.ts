/* eslint-disable @typescript-eslint/camelcase */
import { convertDateInRecords, formatRowData } from './helpers'
import { LckTableRow, LckTableColumn, LckTableRowDataComplex, LckTableViewColumn, SORT_COLUMN } from './definitions'
import { COLUMN_TYPE } from '@locokit/lck-glossary'

function getDefaultColumnParameters (columnId: string, columnType: COLUMN_TYPE, params: Partial<LckTableViewColumn> = {}): LckTableViewColumn {
  return {
    id: columnId,
    column_type_id: columnType,
    displayed: true,
    editable: false,
    position: 1,
    required: false,
    settings: {},
    sort: SORT_COLUMN.ASC,
    style: {},
    table_column_id: columnId,
    table_id: 'table',
    table_view_id: 'table_view',
    text: columnId,
    slug: columnId,
    transmitted: true,
    reference: false,
    reference_position: 0,
    locked: false,
    ...params,
  }
}

// Mock columns
const numberColumn = getDefaultColumnParameters('number', COLUMN_TYPE.NUMBER)
const dateColumn = getDefaultColumnParameters('date', COLUMN_TYPE.DATE)
const datetimeColumn = getDefaultColumnParameters('datetime', COLUMN_TYPE.DATETIME)
const fileColumn = getDefaultColumnParameters('file', COLUMN_TYPE.FILE)
const relationBetweenTablesColumn = getDefaultColumnParameters('rbt', COLUMN_TYPE.RELATION_BETWEEN_TABLES)
const refFormulaColumn = getDefaultColumnParameters('refformula', COLUMN_TYPE.FORMULA, {
  reference: true,
})
const formulaColumn = getDefaultColumnParameters('formula', COLUMN_TYPE.FORMULA)
const lookedUpColumn = getDefaultColumnParameters('luc', COLUMN_TYPE.LOOKED_UP_COLUMN)
const virtualLookedUpColumn = getDefaultColumnParameters('vluc', COLUMN_TYPE.VIRTUAL_LOOKED_UP_COLUMN)

const tableColumns = {
  [numberColumn.id]: numberColumn,
  [datetimeColumn.id]: datetimeColumn,
  [dateColumn.id]: dateColumn,
  [fileColumn.id]: fileColumn,
  [relationBetweenTablesColumn.id]: relationBetweenTablesColumn,
  [refFormulaColumn.id]: refFormulaColumn,
  [formulaColumn.id]: formulaColumn,
  [lookedUpColumn.id]: lookedUpColumn,
  [virtualLookedUpColumn.id]: virtualLookedUpColumn,
}

describe('LCK API helpers utilities', () => {
  describe('convertDateInRecords', () => {
    it('Convert all date fields in a record', () => {
      const record: LckTableRow = {
        id: 'uuid',
        text: 'record-test',
        data: {
          'date-field': '2021-06-12Z',
          'datetime-field': '2021-06-12T12:00:00',
          'non-date-field': '2021-06-12',
        },
      }
      const definitions: LckTableColumn[] = [{
        id: 'date-field',
        column_type_id: COLUMN_TYPE.DATE,
        settings: {},
        text: 'date field',
        slug: 'date field',
        table_id: 'table1',
        reference: false,
        position: 0,
        reference_position: 0,
        locked: false,
      }, {
        id: 'datetime-field',
        column_type_id: COLUMN_TYPE.DATETIME,
        settings: {},
        text: 'datetime field',
        slug: 'datetime field',
        table_id: 'table1',
        reference: false,
        position: 1,
        reference_position: 0,
        locked: false,
      }, {
        id: 'non-date-field',
        column_type_id: COLUMN_TYPE.STRING,
        settings: {},
        text: 'non date field',
        slug: 'non date field',
        table_id: 'table1',
        reference: false,
        position: 2,
        reference_position: 0,
        locked: false,
      }]
      convertDateInRecords(record, definitions)
      expect.assertions(6)
      expect(record.data['date-field'] instanceof Date).toBe(true)
      expect(record.data['date-field']).toStrictEqual(new Date('2021-06-12'))
      expect(record.data['datetime-field'] instanceof Date).toBe(true)
      expect(record.data['datetime-field']).toStrictEqual(new Date('2021-06-12T12:00:00'))
      expect(record.data['non-date-field'] instanceof Date).toBe(false)
      expect(record.data['non-date-field']).toStrictEqual('2021-06-12')
    })
    it('Convert all formula date fields in a record', () => {
      const record: LckTableRow = {
        id: 'uuid',
        text: 'record-test',
        data: {
          'formula-date-field': '2021-06-12Z',
          'formula-date-time-field': '2021-06-12T12:00:00',
        },
      }
      const definitions: LckTableColumn[] = [{
        id: 'formula-date-field',
        column_type_id: COLUMN_TYPE.FORMULA,
        text: 'date field',
        slug: 'date field',
        table_id: 'table1',
        settings: {
          formula_type_id: COLUMN_TYPE.DATE,
        },
        reference: false,
        position: 0,
        reference_position: 0,
        locked: false,
      }, {
        id: 'formula-date-time-field',
        column_type_id: COLUMN_TYPE.FORMULA,
        text: 'datetime field',
        slug: 'datetime field',
        table_id: 'table1',
        settings: {
          formula_type_id: COLUMN_TYPE.DATETIME,
        },
        reference: false,
        position: 1,
        reference_position: 0,
        locked: false,
      }]
      convertDateInRecords(record, definitions)
      expect.assertions(4)
      expect(record.data['formula-date-field'] instanceof Date).toBe(true)
      expect(record.data['formula-date-field']).toStrictEqual(new Date('2021-06-12'))
      expect(record.data['formula-date-time-field'] instanceof Date).toBe(true)
      expect(record.data['formula-date-time-field']).toStrictEqual(new Date('2021-06-12T12:00:00'))
    })
    it('Convert all looked up column date fields in a record', () => {
      const record: LckTableRow = {
        id: 'uuid',
        text: 'record-test',
        data: {
          'lkdp-date-field': {
            reference: 'foreign-uuid',
            value: '2021-06-12Z',
          },
          'lkdp-date-time-field': {
            reference: 'foreign-uuid',
            value: '2021-06-12T12:00:00',
          },
        },
      }
      const definitions: LckTableColumn[] = [{
        id: 'lkdp-date-field',
        column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
        settings: {},
        text: 'date field',
        slug: 'date field',
        table_id: 'table1',
        parents: [{
          id: 'date-field',
          column_type_id: COLUMN_TYPE.DATE,
          settings: {},
          text: 'date field',
          slug: 'date field',
          table_id: 'table1',
          reference: false,
          position: 0,
          reference_position: 0,
          locked: false,
        }],
        reference: false,
        position: 0,
        reference_position: 0,
        locked: false,
      }, {
        id: 'lkdp-date-time-field',
        column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
        settings: {},
        text: 'datetime field',
        slug: 'datetime field',
        table_id: 'table1',
        parents: [{
          id: 'datetime-field',
          column_type_id: COLUMN_TYPE.DATETIME,
          settings: {},
          text: 'datetime field',
          slug: 'datetime field',
          table_id: 'table1',
          reference: false,
          position: 1,
          reference_position: 0,
          locked: false,
        }],
        reference: false,
        position: 1,
        reference_position: 0,
        locked: false,
      }]
      convertDateInRecords(record, definitions)
      expect.assertions(4)
      expect((record.data['lkdp-date-field'] as LckTableRowDataComplex).value instanceof Date).toBe(true)
      expect((record.data['lkdp-date-field'] as LckTableRowDataComplex).value).toStrictEqual(new Date('2021-06-12'))
      expect((record.data['lkdp-date-time-field'] as LckTableRowDataComplex).value instanceof Date).toBe(true)
      expect((record.data['lkdp-date-time-field'] as LckTableRowDataComplex).value).toStrictEqual(new Date('2021-06-12T12:00:00'))
    })
    it('Do not convert any null values', () => {
      const record: LckTableRow = {
        id: 'uuid',
        text: 'record-test',
        data: {
          'date-field': null,
          'datetime-field': null,
          'lkdp-date-field': {
            reference: 'foreign-uuid',
            value: null,
          },
          'lkdp-date-time-field': {
            reference: 'foreign-uuid',
            value: null,
          },
          'lkdp-date-field1': null,
          'lkdp-date-time-field1': null,
          'formula-date-field': null,
          'formula-date-time-field': null,
        },
      }
      const definitions: LckTableColumn[] = [{
        id: 'date-field',
        column_type_id: COLUMN_TYPE.DATE,
        settings: {},
        text: 'date field',
        slug: 'date field',
        table_id: 'table1',
        reference: false,
        position: 0,
        reference_position: 0,
        locked: false,
      }, {
        id: 'datetime-field',
        column_type_id: COLUMN_TYPE.DATETIME,
        settings: {},
        text: 'datetime field',
        slug: 'datetime field',
        table_id: 'table1',
        reference: false,
        position: 1,
        reference_position: 0,
        locked: false,
      }, {
        id: 'lkdp-date-field',
        column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
        settings: {},
        text: 'date field',
        slug: 'date field',
        table_id: 'table1',
        reference: false,
        parents: [{
          id: 'date-field',
          column_type_id: COLUMN_TYPE.DATE,
          settings: {},
          text: 'date field',
          slug: 'date field',
          table_id: 'table1',
          reference: false,
          position: 0,
          reference_position: 0,
          locked: false,
        }],
        position: 2,
        reference_position: 0,
        locked: false,
      }, {
        id: 'lkdp-date-time-field',
        column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
        settings: {},
        text: 'datetime field',
        slug: 'datetime field',
        table_id: 'table1',
        reference: false,
        parents: [{
          id: 'datetime-field',
          column_type_id: COLUMN_TYPE.DATETIME,
          settings: {},
          text: 'datetime field',
          slug: 'datetime field',
          table_id: 'table1',
          reference: false,
          position: 1,
          reference_position: 0,
          locked: false,
        }],
        position: 3,
        reference_position: 0,
        locked: false,
      }, {
        id: 'lkdp-date-field1',
        column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
        settings: {},
        text: 'date field',
        slug: 'date field',
        table_id: 'table1',
        reference: false,
        parents: [{
          id: 'date-field',
          column_type_id: COLUMN_TYPE.DATE,
          settings: {},
          text: 'date field',
          slug: 'date field',
          table_id: 'table1',
          reference: false,
          position: 0,
          reference_position: 0,
          locked: false,
        }],
        position: 4,
        reference_position: 0,
        locked: false,
      }, {
        id: 'lkdp-date-time-field1',
        column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
        settings: {},
        text: 'datetime field',
        slug: 'datetime field',
        table_id: 'table1',
        reference: false,
        parents: [{
          id: 'datetime-field',
          column_type_id: COLUMN_TYPE.DATETIME,
          settings: {},
          text: 'datetime field',
          slug: 'datetime field',
          table_id: 'table1',
          reference: false,
          position: 1,
          reference_position: 0,
          locked: false,
        }],
        position: 5,
        reference_position: 0,
        locked: false,
      }, {
        id: 'formula-date-field',
        column_type_id: COLUMN_TYPE.FORMULA,
        text: 'date field',
        slug: 'date field',
        table_id: 'table1',
        settings: {
          formula_type_id: COLUMN_TYPE.DATE,
        },
        reference: false,
        position: 6,
        reference_position: 0,
        locked: false,
      }, {
        id: 'formula-date-time-field',
        column_type_id: COLUMN_TYPE.FORMULA,
        text: 'datetime field',
        slug: 'datetime field',
        table_id: 'table1',
        settings: {
          formula_type_id: COLUMN_TYPE.DATETIME,
        },
        reference: false,
        position: 7,
        reference_position: 0,
        locked: false,
      }]
      convertDateInRecords(record, definitions)
      expect.assertions(8)
      expect(record.data['date-field']).toBeNull()
      expect(record.data['datetime-field']).toBeNull()
      expect((record.data['lkdp-date-field'] as LckTableRowDataComplex).value).toBeNull()
      expect((record.data['lkdp-date-time-field'] as LckTableRowDataComplex).value).toBeNull()
      expect((record.data['lkdp-date-field1'] as LckTableRowDataComplex)).toBeNull()
      expect((record.data['lkdp-date-time-field1'] as LckTableRowDataComplex)).toBeNull()
      expect(record.data['formula-date-field']).toBeNull()
      expect(record.data['formula-date-time-field']).toBeNull()
    })
  })
  describe('formatRowData', () => {
    it('Convert a number value into the right format (no change)', () => {
      const data = { [numberColumn.id]: 10 }
      const result = formatRowData(
        data,
        tableColumns,
      )
      expect(result).toEqual({
        [numberColumn.id]: 10,
      })
    })
    it('Convert a valid date value into the ISO format', () => {
      const data = { [dateColumn.id]: new Date(2021, 6, 14) }
      const result = formatRowData(
        data,
        tableColumns,
      )
      expect(result).toEqual({
        [dateColumn.id]: '2021-07-14',
      })
    })
    it('Convert an empty string for a date into the null value', () => {
      const data = { [dateColumn.id]: '' }
      const result = formatRowData(
        data,
        tableColumns,
      )
      expect(result).toEqual({
        [dateColumn.id]: null,
      })
    })
    it('Convert a datetime value into the ISO format', () => {
      const data = { [datetimeColumn.id]: new Date(2021, 6, 14, 12, 30, 30) }
      const result = formatRowData(
        data,
        tableColumns,
      )
      expect(result).toEqual({
        [datetimeColumn.id]: '2021-07-14T12:30:30Z',
      })
    })
    it('Convert an empty string for a datetime into the null value', () => {
      const data = { [datetimeColumn.id]: '' }
      const result = formatRowData(
        data,
        tableColumns,
      )
      expect(result).toEqual({
        [datetimeColumn.id]: null,
      })
    })
    it('Convert a file value into the right format', () => {
      const data = {
        [fileColumn.id]: [
          {
            id: 1,
            ext: 'json',
            filename: 'file1.pdf',
            filepath: 'file1-path',
            mime: 'application/pdf',
            thumbnail: true,
            size: 12300,
            workspace_id: 'w1',
          },
          {
            id: 2,
            ext: 'json',
            filename: 'file2.pdf',
            filepath: 'file2-path',
            mime: 'application/pdf',
            thumbnail: true,
            size: 12300,
            workspace_id: 'w1',
          },
        ],
      }
      const result = formatRowData(
        data,
        tableColumns,
      )
      expect(result).toEqual({
        [fileColumn.id]: [1, 2],
      })
    })
    it('Convert a null value for a file into an array', () => {
      const data = {
        [fileColumn.id]: null,
      }
      const result = formatRowData(
        data,
        tableColumns,
      )
      expect(result).toEqual({
        [fileColumn.id]: [],
      })
    })
    it('Convert a relation between tables value into the right format if only the reference is transmitted', () => {
      const data = { [relationBetweenTablesColumn.id]: 'row1-ref' }
      const result = formatRowData(
        data,
        tableColumns,
      )
      expect(result).toEqual({
        [relationBetweenTablesColumn.id]: 'row1-ref',
      })
    })
    it('Convert a relation between tables value into the right format if the value and the reference is transmitted', () => {
      const data = {
        [relationBetweenTablesColumn.id]: {
          value: 'my first row',
          reference: 'row1-ref',
        },
      }
      const result = formatRowData(
        data,
        tableColumns,
      )
      expect(result).toEqual({
        [relationBetweenTablesColumn.id]: 'row1-ref',
      })
    })
    it('When duplicating, only return the write only fields and the formula which is used as reference', () => {
      const data = {
        [numberColumn.id]: 5,
        [dateColumn.id]: new Date(2263, 6, 14),
        [relationBetweenTablesColumn.id]: 'row1-ref',
        [refFormulaColumn.id]: 'The 5th',
        [formulaColumn.id]: 10,
        [virtualLookedUpColumn.id]: 'My very long text...',
        [lookedUpColumn.id]: {
          reference: 'foreign-row-id',
          value: '20',
        },
        'unknown-column': '10',
      }
      const result = formatRowData(
        data,
        tableColumns,
        true,
      )
      expect(result).toEqual({
        [numberColumn.id]: 5,
        [dateColumn.id]: '2263-07-14',
        [relationBetweenTablesColumn.id]: 'row1-ref',
        [refFormulaColumn.id]: 'The 5th',
      })
    })
  })
})
