import { convertDateInRecords } from './helpers'
import { LckTableRow, LckTableColumn, LckTableRowDataComplex } from './definitions'
import { COLUMN_TYPE } from '@locokit/lck-glossary'

describe('LCK API helpers utilities', () => {
  describe('convertDateInRecords', () => {
    it('Convert all date fields in a record', () => {
      const record: LckTableRow = {
        id: 'uuid',
        text: 'record-test',
        data: {
          'date-field': '2021-06-12Z',
          'datetime-field': '2021-06-12T12:00:00',
          'non-date-field': '2021-06-12'
        }
      }
      const definitions: LckTableColumn[] = [{
        id: 'date-field',
        column_type_id: COLUMN_TYPE.DATE,
        settings: {},
        text: 'date field',
        table_id: 'table1'
      }, {
        id: 'datetime-field',
        column_type_id: COLUMN_TYPE.DATETIME,
        settings: {},
        text: 'datetime field',
        table_id: 'table1'
      }, {
        id: 'non-date-field',
        column_type_id: COLUMN_TYPE.STRING,
        settings: {},
        text: 'non date field',
        table_id: 'table1'
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
        }
      }
      const definitions: LckTableColumn[] = [{
        id: 'formula-date-field',
        column_type_id: COLUMN_TYPE.FORMULA,
        text: 'date field',
        table_id: 'table1',
        settings: {
          formula_type_id: COLUMN_TYPE.DATE
        }
      }, {
        id: 'formula-date-time-field',
        column_type_id: COLUMN_TYPE.FORMULA,
        text: 'datetime field',
        table_id: 'table1',
        settings: {
          formula_type_id: COLUMN_TYPE.DATETIME
        }
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
        }
      }
      const definitions: LckTableColumn[] = [{
        id: 'lkdp-date-field',
        column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
        settings: {},
        text: 'date field',
        table_id: 'table1',
        parents: [{
          id: 'date-field',
          column_type_id: COLUMN_TYPE.DATE,
          settings: {},
          text: 'date field',
          table_id: 'table1'
        }]
      }, {
        id: 'lkdp-date-time-field',
        column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
        settings: {},
        text: 'datetime field',
        table_id: 'table1',
        parents: [{
          id: 'datetime-field',
          column_type_id: COLUMN_TYPE.DATETIME,
          settings: {},
          text: 'datetime field',
          table_id: 'table1'
        }]
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
        }
      }
      const definitions: LckTableColumn[] = [{
        id: 'date-field',
        column_type_id: COLUMN_TYPE.DATE,
        settings: {},
        text: 'date field',
        table_id: 'table1'
      }, {
        id: 'datetime-field',
        column_type_id: COLUMN_TYPE.DATETIME,
        settings: {},
        text: 'datetime field',
        table_id: 'table1'
      }, {
        id: 'lkdp-date-field',
        column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
        settings: {},
        text: 'date field',
        table_id: 'table1',
        parents: [{
          id: 'date-field',
          column_type_id: COLUMN_TYPE.DATE,
          settings: {},
          text: 'date field',
          table_id: 'table1'
        }]
      }, {
        id: 'lkdp-date-time-field',
        column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
        settings: {},
        text: 'datetime field',
        table_id: 'table1',
        parents: [{
          id: 'datetime-field',
          column_type_id: COLUMN_TYPE.DATETIME,
          settings: {},
          text: 'datetime field',
          table_id: 'table1'
        }]
      }, {
        id: 'lkdp-date-field1',
        column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
        settings: {},
        text: 'date field',
        table_id: 'table1',
        parents: [{
          id: 'date-field',
          column_type_id: COLUMN_TYPE.DATE,
          settings: {},
          text: 'date field',
          table_id: 'table1'
        }]
      }, {
        id: 'lkdp-date-time-field1',
        column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
        settings: {},
        text: 'datetime field',
        table_id: 'table1',
        parents: [{
          id: 'datetime-field',
          column_type_id: COLUMN_TYPE.DATETIME,
          settings: {},
          text: 'datetime field',
          table_id: 'table1'
        }]
      }, {
        id: 'formula-date-field',
        column_type_id: COLUMN_TYPE.FORMULA,
        text: 'date field',
        table_id: 'table1',
        settings: {
          formula_type_id: COLUMN_TYPE.DATE
        }
      }, {
        id: 'formula-date-time-field',
        column_type_id: COLUMN_TYPE.FORMULA,
        text: 'datetime field',
        table_id: 'table1',
        settings: {
          formula_type_id: COLUMN_TYPE.DATETIME
        }
      }]
      convertDateInRecords(record, definitions)
      expect.assertions(8)
      expect(record.data['date-field']).toBeNull()
      expect(record.data['datetime-field'] ).toBeNull()
      expect((record.data['lkdp-date-field'] as LckTableRowDataComplex).value).toBeNull()
      expect((record.data['lkdp-date-time-field'] as LckTableRowDataComplex).value).toBeNull()
      expect((record.data['lkdp-date-field1'] as LckTableRowDataComplex)).toBeNull()
      expect((record.data['lkdp-date-time-field1'] as LckTableRowDataComplex)).toBeNull()
      expect(record.data['formula-date-field']).toBeNull()
      expect(record.data['formula-date-time-field'] ).toBeNull()
    })
  })
})
