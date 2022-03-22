/* eslint-disable @typescript-eslint/camelcase */
import { COLUMN_TYPE } from '@locokit/lck-glossary'
import { LckTableViewColumn, SORT_COLUMN } from '../lck-api/definitions'
import { getDataFromTableViewColumn } from './columns'
import { LckPopupI18nOptions } from './map/transformWithOL'

function getDefaultColumnParameters (columnId: string, columnType: COLUMN_TYPE): LckTableViewColumn {
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
  }
}

// Mock columns
const booleanColumn = getDefaultColumnParameters('boolean', COLUMN_TYPE.BOOLEAN)
const numberColumn = getDefaultColumnParameters('number', COLUMN_TYPE.NUMBER)
const stringColumn = getDefaultColumnParameters('string', COLUMN_TYPE.STRING)
const floatColumn = getDefaultColumnParameters('float', COLUMN_TYPE.FLOAT)
const dateColumn = getDefaultColumnParameters('date', COLUMN_TYPE.DATE)
const datetimeColumn = getDefaultColumnParameters('datetime', COLUMN_TYPE.DATETIME)

const lookedUpColumn: LckTableViewColumn = {
  ...getDefaultColumnParameters('luc', COLUMN_TYPE.LOOKED_UP_COLUMN),
  settings: {
    localField: 'rbt',
    foreignField: dateColumn.id,
  },
  parents: [dateColumn],
}

describe('Column utils', () => {
  describe('getDataFromTableViewColumn return the right value to display (label + value + ...)', () => {
    // Default options
    const defaultOptions: LckPopupI18nOptions = {
      noReference: 'noReference',
      noData: 'noRowData',
      dateFormat: 'dd/MM/yyyy',
      datetimeFormat: 'dd/MM/yyyy HH:mm',
    }

    describe('BOOLEAN', () => {
      it('True', () => {
        expect(getDataFromTableViewColumn(booleanColumn, true, defaultOptions))
          .toStrictEqual({
            label: booleanColumn.text,
            value: true,
          })
      })
      it('False', () => {
        expect(getDataFromTableViewColumn(booleanColumn, false, defaultOptions))
          .toStrictEqual({
            label: booleanColumn.text,
            value: false,
          })
      })
      it('With a null value', () => {
        expect(getDataFromTableViewColumn(booleanColumn, null, defaultOptions))
          .toStrictEqual({
            label: booleanColumn.text,
            value: 'noRowData',
          })
      })
    })
    describe('NUMBER', () => {
      it('Non-zero number', () => {
        expect(getDataFromTableViewColumn(numberColumn, 1, defaultOptions))
          .toStrictEqual({
            label: numberColumn.text,
            value: 1,
          })
      })
      it('Zero', () => {
        expect(getDataFromTableViewColumn(numberColumn, 0, defaultOptions))
          .toStrictEqual({
            label: numberColumn.text,
            value: 0,
          })
      })
      it('With a null value', () => {
        expect(getDataFromTableViewColumn(numberColumn, null, defaultOptions))
          .toStrictEqual({
            label: numberColumn.text,
            value: 'noRowData',
          })
      })
    })
    describe('STRING', () => {
      it('Not-empty string', () => {
        expect(getDataFromTableViewColumn(stringColumn, 'lorem ipsum', defaultOptions))
          .toStrictEqual({
            label: stringColumn.text,
            value: 'lorem ipsum',
          })
      })
      it('Empty string', () => {
        expect(getDataFromTableViewColumn(stringColumn, '', defaultOptions))
          .toStrictEqual({
            label: stringColumn.text,
            value: 'noRowData',
          })
      })
      it('With a null value', () => {
        expect(getDataFromTableViewColumn(stringColumn, null, defaultOptions))
          .toStrictEqual({
            label: stringColumn.text,
            value: 'noRowData',
          })
      })
    })
    describe('FLOAT', () => {
      it('Non-zero number', () => {
        expect(getDataFromTableViewColumn(floatColumn, 1.5, defaultOptions))
          .toStrictEqual({
            label: floatColumn.text,
            value: 1.5,
          })
      })
      it('Zero', () => {
        expect(getDataFromTableViewColumn(floatColumn, 0, defaultOptions))
          .toStrictEqual({
            label: floatColumn.text,
            value: 0.0,
          })
      })
      it('With a null value', () => {
        expect(getDataFromTableViewColumn(floatColumn, null, defaultOptions))
          .toStrictEqual({
            label: floatColumn.text,
            value: 'noRowData',
          })
      })
    })
    describe('DATE', () => {
      it('Valid value', () => {
        expect(getDataFromTableViewColumn(dateColumn, new Date(2018, 8, 22), defaultOptions))
          .toStrictEqual({
            label: dateColumn.text,
            value: '22/09/2018',
          })
      })
      it('With a null value', () => {
        expect(getDataFromTableViewColumn(dateColumn, null, defaultOptions))
          .toStrictEqual({
            label: dateColumn.text,
            value: 'noRowData',
          })
      })
    })
    describe('DATETIME', () => {
      it('Valid value', () => {
        expect(getDataFromTableViewColumn(datetimeColumn, new Date(2018, 8, 22, 12, 0), defaultOptions))
          .toStrictEqual({
            label: datetimeColumn.text,
            value: '22/09/2018 12:00',
          })
      })
      it('With a null value', () => {
        expect(getDataFromTableViewColumn(datetimeColumn, null, defaultOptions))
          .toStrictEqual({
            label: datetimeColumn.text,
            value: 'noRowData',
          })
      })
    })
    describe('LOOKED_UP_COLUMN', () => {
      it('From a date column with a valid value', () => {
        expect(
          getDataFromTableViewColumn(lookedUpColumn, {
            reference: 'ref',
            value: new Date(2018, 8, 22),
          }, defaultOptions),
        ).toStrictEqual({
          label: lookedUpColumn.text,
          value: '22/09/2018',
        })
      })
      it('With a null value', () => {
        expect(getDataFromTableViewColumn(lookedUpColumn, null, defaultOptions))
          .toStrictEqual({
            label: lookedUpColumn.text,
            value: 'noRowData',
          })
      })
    })
  })
})
