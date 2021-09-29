/* eslint-disable @typescript-eslint/camelcase */
import { COLUMN_TYPE } from '@locokit/lck-glossary'
import { parseISO } from 'date-fns'
import { LckTableColumn } from '../lck-api/definitions'
import { ACTIONS, convertFiltersFromDatabase, convertFiltersToDatatabase, getCurrentFilters } from './filter'

// Mock variables
const mockColumns: Record<string, LckTableColumn> = {
  firstName: {
    id: 'C11',
    text: 'First name',
    createdAt: '2020-11-02T16:11:03.109Z',
    updatedAt: '2020-11-02T16:11:03.109Z',
    settings: {},
    table_id: 'T1',
    column_type_id: COLUMN_TYPE.STRING,
  },
  lastName: {
    id: 'C12',
    text: 'Last name',
    createdAt: '2020-11-02T16:11:03.109Z',
    updatedAt: '2020-11-02T16:11:03.109Z',
    settings: {},
    table_id: 'T1',
    column_type_id: COLUMN_TYPE.STRING,
  },
  date: {
    id: 'C13',
    text: 'Date',
    createdAt: '2020-11-02T16:11:03.109Z',
    updatedAt: '2020-11-02T16:11:03.109Z',
    settings: {},
    table_id: 'T1',
    column_type_id: COLUMN_TYPE.DATE,
  },
  datetime: {
    id: 'C14',
    text: 'Datetime',
    createdAt: '2020-11-02T16:11:03.109Z',
    updatedAt: '2020-11-02T16:11:03.109Z',
    settings: {},
    table_id: 'T1',
    column_type_id: COLUMN_TYPE.DATETIME,
  },
  luc: {
    id: 'C15',
    text: 'Looked up column',
    createdAt: '2020-11-02T16:11:03.109Z',
    updatedAt: '2020-11-02T16:11:03.109Z',
    settings: {},
    table_id: 'T1',
    column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
    parents: [
      {
        id: 'C21',
        text: 'Not supported column',
        createdAt: '2020-11-02T16:11:03.109Z',
        updatedAt: '2020-11-02T16:11:03.109Z',
        settings: {},
        table_id: 'T2',
        column_type_id: -1,
      },
    ],
  },
}

const mockAllColumns = [
  mockColumns.firstName,
  mockColumns.lastName,
  mockColumns.date,
  mockColumns.datetime,
  mockColumns.luc,
]

describe('Filter utils', () => {
  describe('convertFiltersFromDatabase', () => {
    it('Return an empty array if there is no column', () => {
      const resultFilters = convertFiltersFromDatabase({
        columns: [],
        filter: {
          operator: '$and',
          values: [],
        },
      })
      expect(resultFilters).toHaveLength(0)
    })
    it('Return an empty array if there is no filter', () => {
      const resultFilters = convertFiltersFromDatabase({
        columns: [mockColumns.firstName],
        filter: null,
      })
      expect(resultFilters).toHaveLength(0)
    })
    it('Return an empty array if there is no filter value', () => {
      const resultFilters = convertFiltersFromDatabase({
        columns: [mockColumns.firstName],
        filter: {
          operator: '$and',
          values: [],
        },
      })
      expect(resultFilters).toHaveLength(0)
    })
    it('Return the desired filters from the API ones', () => {
      const resultFilters = convertFiltersFromDatabase({
        columns: mockAllColumns,
        filter: {
          operator: '$and',
          values: [
            // Valid value
            {
              column: mockColumns.firstName.id,
              action: 'isEqualTo',
              dbAction: '$eq',
              pattern: 'John',
            },
            // Valid value with predefined pattern
            {
              column: mockColumns.firstName.id,
              action: 'isEmpty',
              dbAction: '$eq',
              pattern: true,
            },
            // Valid date value
            {
              column: mockColumns.date.id,
              action: 'isEqualTo',
              dbAction: '$eq',
              pattern: '2021-07-14',
            },
            // Valid date time value
            {
              column: mockColumns.datetime.id,
              action: 'isEqualTo',
              dbAction: '$eq',
              pattern: '2021-07-14T10:00:00+02:00',
            },
            // Valid looked up column value
            {
              column: mockColumns.luc.id,
              action: 'isEqualTo',
              dbAction: '$eq',
              pattern: 'ABC',
            },
            // Unknown action
            {
              column: mockColumns.firstName.id,
              action: 'unknown action',
              dbAction: '$ua',
              pattern: 'John',
            },
            // Unknown column
            {
              column: 'unknownColumnId',
              action: 'isEqualTo',
              dbAction: '$eq',
              pattern: 'Jane',
            },
          ],
        },
      })
      expect(resultFilters).toHaveLength(5)
      // Check string filter
      expect(resultFilters[0]).toStrictEqual({
        operator: '$and',
        column: {
          label: mockColumns.firstName.text,
          originalType: mockColumns.firstName.column_type_id,
          type: mockColumns.firstName.column_type_id,
          value: mockColumns.firstName.id,
        },
        action: ACTIONS.EQUAL,
        pattern: 'John',
      })
      // Check string filter with predefined pattern
      expect(resultFilters[1]).toStrictEqual({
        operator: '$and',
        column: {
          label: mockColumns.firstName.text,
          originalType: mockColumns.firstName.column_type_id,
          type: mockColumns.firstName.column_type_id,
          value: mockColumns.firstName.id,
        },
        action: ACTIONS.EMPTY,
        pattern: true,
      })
      // Check date filter
      expect(resultFilters[2]).toStrictEqual({
        operator: '$and',
        column: {
          label: mockColumns.date.text,
          originalType: mockColumns.date.column_type_id,
          type: mockColumns.date.column_type_id,
          value: mockColumns.date.id,
        },
        action: ACTIONS.EQUAL,
        pattern: parseISO('2021-07-14'),
      })
      // Check datetime filter
      expect(resultFilters[3]).toStrictEqual({
        operator: '$and',
        column: {
          label: mockColumns.datetime.text,
          originalType: mockColumns.datetime.column_type_id,
          type: mockColumns.datetime.column_type_id,
          value: mockColumns.datetime.id,
        },
        action: ACTIONS.EQUAL,
        pattern: parseISO('2021-07-14T10:00:00+02:00'),
      })
      // Check luc filter
      expect(resultFilters[4]).toStrictEqual({
        operator: '$and',
        column: {
          label: mockColumns.luc.text,
          originalType: -1,
          type: mockColumns.luc.column_type_id,
          value: mockColumns.luc.id,
        },
        action: ACTIONS.EQUAL,
        pattern: 'ABC',
      })
    })
  })
  describe('convertFiltersToDatatabase', () => {
    it('Return null if there is no input filter', () => {
      const resultFilters = convertFiltersToDatatabase([])
      expect(resultFilters).toBeNull()
    })
    it('Return the desired output filters if the input one are valid', () => {
      const resultFilters = convertFiltersToDatatabase([
        // Valid value (string column)
        {
          operator: '$and',
          column: {
            label: mockColumns.firstName.text,
            originalType: mockColumns.firstName.column_type_id,
            type: mockColumns.firstName.column_type_id,
            value: mockColumns.firstName.id,
          },
          action: ACTIONS.EQUAL,
          pattern: 'John',
        },
        // Valid value (date column)
        {
          operator: '$and',
          column: {
            label: mockColumns.date.text,
            originalType: mockColumns.date.column_type_id,
            type: mockColumns.date.column_type_id,
            value: mockColumns.date.id,
          },
          action: ACTIONS.EQUAL,
          pattern: parseISO('2021-07-14'),
        },
        // Invalid value (column is null)
        {
          operator: '$and',
          column: null,
          action: ACTIONS.EQUAL,
          pattern: 'John',
        },
        // Invalid value (action is null)
        {
          operator: '$and',
          column: {
            label: mockColumns.firstName.text,
            originalType: mockColumns.firstName.column_type_id,
            type: mockColumns.firstName.column_type_id,
            value: mockColumns.firstName.id,
          },
          action: null,
          pattern: 'John',
        },
        // Invalid value (pattern is null)
        {
          operator: '$and',
          column: {
            label: mockColumns.firstName.text,
            originalType: mockColumns.firstName.column_type_id,
            type: mockColumns.firstName.column_type_id,
            value: mockColumns.firstName.id,
          },
          action: ACTIONS.EQUAL,
          pattern: null,
        },

      ])
      expect(resultFilters).toStrictEqual({
        operator: '$and',
        values: [
          {
            action: ACTIONS.EQUAL.label,
            column: mockColumns.firstName.id,
            dbAction: ACTIONS.EQUAL.value,
            pattern: 'John',
          },
          {
            action: ACTIONS.EQUAL.label,
            column: mockColumns.date.id,
            dbAction: ACTIONS.EQUAL.value,
            pattern: '2021-07-14',
          },
        ],
      })
    })
  })

  describe('getCurrentFilters', () => {
    const column = {
      operator: '$and',
      column: {
        label: mockColumns.firstName.text,
        originalType: mockColumns.firstName.column_type_id,
        type: mockColumns.firstName.column_type_id,
        value: mockColumns.firstName.id,
      },
    }
    const currentFilters = getCurrentFilters([
      {
        ...column,
        action: ACTIONS.MATCH,
        pattern: 'John',
      },
      {
        ...column,
        action: ACTIONS.NOT_MATCH,
        pattern: 'John',
      },
      {
        ...column,
        action: ACTIONS.EQUAL,
        pattern: 'John',
      },
      {
        ...column,
        action: ACTIONS.NOT_EQUAL,
        pattern: 'John',
      },
      {
        ...column,
        action: ACTIONS.IN,
        pattern: 'John',
      },
      {
        ...column,
        action: ACTIONS.NOT_IN,
        pattern: ['test'],
      },
      {
        ...column,
        action: ACTIONS.ALL,
        pattern: true,
      },
      {
        ...column,
        action: ACTIONS.ANY,
        pattern: true,
      },
      {
        ...column,
        action: ACTIONS.EMPTY,
        pattern: true,
      },
      {
        ...column,
        action: ACTIONS.NOT_EMPTY,
        pattern: true,
      },
      {
        ...column,
        action: ACTIONS.TRUE,
        pattern: true,
      },
      {
        ...column,
        action: ACTIONS.FALSE,
        pattern: true,
      },
      {
        ...column,
        action: ACTIONS.GREATER_THAN,
        pattern: true,
      },
      {
        ...column,
        action: ACTIONS.LOWER_EQUAL_THAN,
        pattern: 'John',
      },
      {
        ...column,
        action: ACTIONS.START_WITH,
        pattern: 'John',
      },
      {
        ...column,
        action: ACTIONS.END_WITH,
        pattern: 'John',
      },
    ])
    expect(currentFilters).toEqual({
      '$and[0][data][C11][$ilike]': '%John%',
      '$and[10][data][C11][$eq]': true,
      '$and[11][data][C11][$eq]': true,
      '$and[12][data][C11][$gt]': true,
      '$and[13][data][C11][$lte]': 'John',
      '$and[14][data][C11][$ilike]': 'John%',
      '$and[15][data][C11][$ilike]': '%John',
      '$and[1][data][C11][$notILike]': '%John%',
      '$and[2][data][C11][$eq]': 'John',
      '$and[3][data][C11][$ne]': 'John',
      '$and[4][data][C11][$in]': 'John',
      '$and[5][data][C11][$nin]': [
        'test',
      ],
      '$and[6][data][C11][$all]': true,
      '$and[7][data][C11][$any]': true,
      '$and[8][data][C11][$null]': true,
      '$and[9][data][C11][$notNull]': true,
    })
  })
})
