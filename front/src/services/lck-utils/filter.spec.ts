/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/camelcase */
import { COLUMN_TYPE } from '@locokit/lck-glossary'
import { parseISO } from 'date-fns'
import { LckTableColumn } from '../lck-api/definitions'
import { ACTIONS, convertFiltersFromDatabase, convertFiltersToDatatabase, getCurrentFilters } from './filter'

// Mock variables
const defaultParamsColumn = {
  createdAt: '2020-11-02T16:11:03.109Z',
  locked: false,
  position: 0,
  reference: false,
  reference_position: 0,
  settings: {},
  table_id: 'T1',
  updatedAt: '2020-11-02T16:11:03.109Z',
}

const mockColumns: Record<string, LckTableColumn> = {
  number: {
    id: 'C10',
    text: 'Number',
    slug: 'number',
    column_type_id: COLUMN_TYPE.NUMBER,
    ...defaultParamsColumn,
  },
  firstName: {
    id: 'C11',
    text: 'First name',
    slug: 'first_name',
    column_type_id: COLUMN_TYPE.STRING,
    ...defaultParamsColumn,
  },
  lastName: {
    id: 'C12',
    text: 'Last name',
    slug: 'last_name',
    column_type_id: COLUMN_TYPE.STRING,
    ...defaultParamsColumn,
  },
  boolean: {
    id: 'C13',
    text: 'Boolean',
    slug: 'boolean',
    column_type_id: COLUMN_TYPE.BOOLEAN,
    ...defaultParamsColumn,
  },
  date: {
    id: 'C14',
    text: 'Date',
    slug: 'date',
    column_type_id: COLUMN_TYPE.DATE,
    ...defaultParamsColumn,
  },
  datetime: {
    id: 'C15',
    text: 'Datetime',
    slug: 'datetime',
    column_type_id: COLUMN_TYPE.DATETIME,
    ...defaultParamsColumn,
  },
  luc: {
    id: 'C16',
    text: 'Looked up column',
    slug: 'looked_up_column',
    column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
    ...defaultParamsColumn,
    parents: [
      {
        id: 'C22',
        text: 'Not supported column',
        slug: 'not_supported_column',
        createdAt: '2020-11-02T16:11:03.109Z',
        updatedAt: '2020-11-02T16:11:03.109Z',
        settings: {},
        table_id: 'T2',
        column_type_id: -1,
        reference: false,
        position: 0,
        reference_position: 0,
        locked: false,
      },
    ],
  },
  rbt: {
    id: 'C17',
    text: 'Relation between tables',
    slug: 'relation_between_tables',
    column_type_id: COLUMN_TYPE.RELATION_BETWEEN_TABLES,
    ...defaultParamsColumn,
  },
  user: {
    id: 'C18',
    text: 'User',
    slug: 'user',
    column_type_id: COLUMN_TYPE.USER,
    ...defaultParamsColumn,
  },
  group: {
    id: 'C19',
    text: 'Group',
    slug: 'group',
    column_type_id: COLUMN_TYPE.GROUP,
    ...defaultParamsColumn,
  },
  multiUser: {
    id: 'C20',
    text: 'Multi user',
    slug: 'multi_user',
    column_type_id: COLUMN_TYPE.MULTI_USER,
    ...defaultParamsColumn,
  },
  userLuc: {
    id: 'C21',
    text: 'User looked up column',
    slug: 'user_looked_up_column',
    column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
    ...defaultParamsColumn,
    parents: [
      {
        id: 'C23',
        text: 'Other user column',
        slug: 'other_user_column',
        createdAt: '2020-11-02T16:11:03.109Z',
        updatedAt: '2020-11-02T16:11:03.109Z',
        settings: {},
        table_id: 'T2',
        column_type_id: COLUMN_TYPE.USER,
        reference: false,
        position: 0,
        reference_position: 0,
        locked: false,
      },
    ],
  },
  multiGroup: {
    id: 'C24',
    text: 'Multi group',
    slug: 'multi_group',
    column_type_id: COLUMN_TYPE.MULTI_GROUP,
    ...defaultParamsColumn,
  },
}

const mockAllColumns = [
  mockColumns.number,
  mockColumns.firstName,
  mockColumns.lastName,
  mockColumns.boolean,
  mockColumns.date,
  mockColumns.datetime,
  mockColumns.luc,
  mockColumns.rbt,
  mockColumns.user,
  mockColumns.group,
  mockColumns.multiUser,
  mockColumns.multiGroup,
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
            // Valid string value
            {
              column: mockColumns.firstName.id,
              action: ACTIONS.EQUAL.label,
              dbAction: ACTIONS.EQUAL.value,
              pattern: 'John',
            },
            // Valid string value with truthy predefined pattern
            {
              column: mockColumns.firstName.id,
              action: ACTIONS.EMPTY.label,
              dbAction: ACTIONS.EMPTY.value,
              pattern: true,
            },
            // Valid boolean value with falsy predefined pattern
            {
              column: mockColumns.boolean.id,
              action: ACTIONS.FALSE.label,
              dbAction: ACTIONS.FALSE.value,
              pattern: false,
            },
            // Valid number value
            {
              column: mockColumns.number.id,
              action: ACTIONS.EQUAL.label,
              dbAction: ACTIONS.EQUAL.value,
              pattern: 100,
            },
            // Valid string value with pattern prefix
            {
              column: mockColumns.firstName.id,
              action: ACTIONS.END_WITH.label,
              dbAction: ACTIONS.END_WITH.value,
              pattern: '%o',
            },
            // Valid string value with pattern suffix
            {
              column: mockColumns.firstName.id,
              action: ACTIONS.START_WITH.label,
              dbAction: ACTIONS.START_WITH.value,
              pattern: 'o%',
            },
            // Valid string value with pattern prefix and suffix
            {
              column: mockColumns.firstName.id,
              action: ACTIONS.MATCH.label,
              dbAction: ACTIONS.MATCH.value,
              pattern: '%o%',
            },
            // Valid date value
            {
              column: mockColumns.date.id,
              action: ACTIONS.EQUAL.label,
              dbAction: ACTIONS.EQUAL.value,
              pattern: '2021-07-14',
            },
            // Valid date time value
            {
              column: mockColumns.datetime.id,
              action: ACTIONS.EQUAL.label,
              dbAction: ACTIONS.EQUAL.value,
              pattern: '2021-07-14T10:00:00+02:00',
            },
            // Valid looked up column value
            {
              column: mockColumns.luc.id,
              action: ACTIONS.EQUAL.label,
              dbAction: ACTIONS.EQUAL.value,
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
              action: ACTIONS.EMPTY.label,
              dbAction: ACTIONS.EMPTY.value,
              pattern: 'Jane',
            },
          ],
        },
      })
      expect(resultFilters).toHaveLength(10)
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
      // Check string filter with truthy predefined pattern
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
      // Check boolean filter with falsy predefined pattern
      expect(resultFilters[2]).toStrictEqual({
        operator: '$and',
        column: {
          label: mockColumns.boolean.text,
          originalType: mockColumns.boolean.column_type_id,
          type: mockColumns.boolean.column_type_id,
          value: mockColumns.boolean.id,
        },
        action: ACTIONS.FALSE,
        pattern: false,
      })
      // Check number filter
      expect(resultFilters[3]).toStrictEqual({
        operator: '$and',
        column: {
          label: mockColumns.number.text,
          originalType: mockColumns.number.column_type_id,
          type: mockColumns.number.column_type_id,
          value: mockColumns.number.id,
        },
        action: ACTIONS.EQUAL,
        pattern: 100,
      })
      // Check string filter with pattern prefix
      expect(resultFilters[4]).toStrictEqual({
        operator: '$and',
        column: {
          label: mockColumns.firstName.text,
          originalType: mockColumns.firstName.column_type_id,
          type: mockColumns.firstName.column_type_id,
          value: mockColumns.firstName.id,
        },
        action: ACTIONS.END_WITH,
        pattern: 'o',
      })
      // Check string filter with pattern suffix
      expect(resultFilters[5]).toStrictEqual({
        operator: '$and',
        column: {
          label: mockColumns.firstName.text,
          originalType: mockColumns.firstName.column_type_id,
          type: mockColumns.firstName.column_type_id,
          value: mockColumns.firstName.id,
        },
        action: ACTIONS.START_WITH,
        pattern: 'o',
      })
      // Check string filter with pattern prefix and suffix
      expect(resultFilters[6]).toStrictEqual({
        operator: '$and',
        column: {
          label: mockColumns.firstName.text,
          originalType: mockColumns.firstName.column_type_id,
          type: mockColumns.firstName.column_type_id,
          value: mockColumns.firstName.id,
        },
        action: ACTIONS.MATCH,
        pattern: 'o',
      })
      // Check date filter
      expect(resultFilters[7]).toStrictEqual({
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
      expect(resultFilters[8]).toStrictEqual({
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
      expect(resultFilters[9]).toStrictEqual({
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
        // Valid value (datetime column)
        {
          operator: '$and',
          column: {
            label: mockColumns.datetime.text,
            originalType: mockColumns.datetime.column_type_id,
            type: mockColumns.datetime.column_type_id,
            value: mockColumns.datetime.id,
          },
          action: ACTIONS.EQUAL,
          pattern: parseISO('2021-07-14T10:00:00Z'),
        },
        // Valid value (string column with pattern prefix)
        {
          operator: '$and',
          column: {
            label: mockColumns.firstName.text,
            originalType: mockColumns.firstName.column_type_id,
            type: mockColumns.firstName.column_type_id,
            value: mockColumns.firstName.id,
          },
          action: ACTIONS.START_WITH,
          pattern: 'John',
        },
        // Valid value (string column with pattern suffix)
        {
          operator: '$and',
          column: {
            label: mockColumns.firstName.text,
            originalType: mockColumns.firstName.column_type_id,
            type: mockColumns.firstName.column_type_id,
            value: mockColumns.firstName.id,
          },
          action: ACTIONS.END_WITH,
          pattern: 'John',
        },
        // Valid value (string column with pattern prefix and suffix)
        {
          operator: '$and',
          column: {
            label: mockColumns.firstName.text,
            originalType: mockColumns.firstName.column_type_id,
            type: mockColumns.firstName.column_type_id,
            value: mockColumns.firstName.id,
          },
          action: ACTIONS.MATCH,
          pattern: 'John',
        },
        // Valid value (string column with the use of a specific key in the pattern)
        {
          operator: '$and',
          column: {
            label: mockColumns.firstName.text,
            originalType: mockColumns.firstName.column_type_id,
            type: mockColumns.firstName.column_type_id,
            value: mockColumns.firstName.id,
          },
          action: ACTIONS.EQUAL,
          pattern: '{userId}',
        },
        // Valid value (multi user column with the use of a specific key in the pattern)
        {
          operator: '$and',
          column: {
            label: mockColumns.multiUser.text,
            originalType: mockColumns.multiUser.column_type_id,
            type: mockColumns.multiUser.column_type_id,
            value: mockColumns.multiUser.id,
          },
          action: ACTIONS.EQUAL,
          pattern: ['1', '{userId}', '2'],
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
        // Valid value (multi group column with the use of a specific key in the pattern)
        {
          operator: '$and',
          column: {
            label: mockColumns.multiGroup.text,
            originalType: mockColumns.multiGroup.column_type_id,
            type: mockColumns.multiGroup.column_type_id,
            value: mockColumns.multiGroup.id,
          },
          action: ACTIONS.EQUAL,
          pattern: ['another', '{groupId}'],
        },
      ])

      expect(resultFilters).toBeDefined()
      expect(resultFilters!.operator).toBe('$and')
      expect(resultFilters!.values).toHaveLength(9)
      // Valid value (string column)
      expect(resultFilters!.values[0]).toEqual({
        action: ACTIONS.EQUAL.label,
        column: mockColumns.firstName.id,
        dbAction: ACTIONS.EQUAL.value,
        pattern: 'John',
      })
      // Valid value (date column)
      expect(resultFilters!.values[1]).toEqual({
        action: ACTIONS.EQUAL.label,
        column: mockColumns.date.id,
        dbAction: ACTIONS.EQUAL.value,
        pattern: '2021-07-14',
      })
      // Valid value (datetime column)
      expect(resultFilters!.values[2]).toEqual({
        action: ACTIONS.EQUAL.label,
        column: mockColumns.datetime.id,
        dbAction: ACTIONS.EQUAL.value,
        pattern: '2021-07-14T10:00:00Z',
      })
      // Valid value (string column with pattern prefix)
      expect(resultFilters!.values[3]).toEqual({
        action: ACTIONS.START_WITH.label,
        column: mockColumns.firstName.id,
        dbAction: ACTIONS.START_WITH.value,
        pattern: 'John%',
      })
      // Valid value (string column with pattern suffix)
      expect(resultFilters!.values[4]).toEqual({
        action: ACTIONS.END_WITH.label,
        column: mockColumns.firstName.id,
        dbAction: ACTIONS.END_WITH.value,
        pattern: '%John',
      })
      // Valid value (string column with pattern prefix and suffix)
      expect(resultFilters!.values[5]).toEqual({
        action: ACTIONS.MATCH.label,
        column: mockColumns.firstName.id,
        dbAction: ACTIONS.MATCH.value,
        pattern: '%John%',
      })
      // Valid value (string column with the use of a specific key in the pattern)
      expect(resultFilters!.values[6]).toEqual({
        action: ACTIONS.EQUAL.label,
        column: mockColumns.firstName.id,
        dbAction: ACTIONS.EQUAL.value,
        pattern: '{userId}',
      })
      // Valid value (multi user column with the use of a specific key in the pattern)
      expect(resultFilters!.values[7]).toEqual({
        action: ACTIONS.EQUAL.label,
        column: mockColumns.multiUser.id,
        dbAction: ACTIONS.EQUAL.value,
        pattern: ['1', '{userId}', '2'],
      })
      // Valid value (multi group column with the use of a specific key in the pattern)
      expect(resultFilters!.values[8]).toEqual({
        action: ACTIONS.EQUAL.label,
        column: mockColumns.multiGroup.id,
        dbAction: ACTIONS.EQUAL.value,
        pattern: ['another', '{groupId}'],
      })
    })
  })

  it('getCurrentFilters', () => {
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
      // Looked-up column - String
      {
        operator: '$and',
        column: {
          label: mockColumns.luc.text,
          originalType: mockColumns.luc.column_type_id,
          type: mockColumns.luc.column_type_id,
          value: mockColumns.luc.id,
        },
        action: ACTIONS.EQUAL,
        pattern: 'John',
      },
      // Relation between tables
      {
        operator: '$and',
        column: {
          label: mockColumns.rbt.text,
          originalType: mockColumns.rbt.column_type_id,
          type: mockColumns.rbt.column_type_id,
          value: mockColumns.rbt.id,
        },
        action: ACTIONS.EQUAL,
        pattern: 'John',
      },
      // User column
      {
        operator: '$and',
        column: {
          label: mockColumns.user.text,
          originalType: mockColumns.user.column_type_id,
          type: mockColumns.user.column_type_id,
          value: mockColumns.user.id,
        },
        action: ACTIONS.EQUAL,
        pattern: 1,
      },
      // User column with specific key ({userId}) to select the log-in user
      {
        operator: '$and',
        column: {
          label: mockColumns.user.text,
          originalType: mockColumns.user.column_type_id,
          type: mockColumns.user.column_type_id,
          value: mockColumns.user.id,
        },
        action: ACTIONS.IS_LOGGED_USER,
        pattern: '{userId}',
      },
      // Group column
      {
        operator: '$and',
        column: {
          label: mockColumns.group.text,
          originalType: mockColumns.group.column_type_id,
          type: mockColumns.group.column_type_id,
          value: mockColumns.group.id,
        },
        action: ACTIONS.EQUAL,
        pattern: '1',
      },
      // Group column with specific key ({groupId}) to select the group of the log-in user
      {
        operator: '$and',
        column: {
          label: mockColumns.group.text,
          originalType: mockColumns.group.column_type_id,
          type: mockColumns.group.column_type_id,
          value: mockColumns.group.id,
        },
        action: ACTIONS.IS_LOGGED_USER_GROUP,
        pattern: '{groupId}',
      },
      // Multi user column
      {
        operator: '$and',
        column: {
          label: mockColumns.multiUser.text,
          originalType: mockColumns.multiUser.column_type_id,
          type: mockColumns.multiUser.column_type_id,
          value: mockColumns.multiUser.id,
        },
        action: ACTIONS.CONTAINS_LOGGED_USER,
        pattern: [1, '{userId}', 2],
      },
      // Looked-up column - User
      {
        operator: '$and',
        column: {
          label: mockColumns.userLuc.text,
          originalType: COLUMN_TYPE.USER,
          type: mockColumns.userLuc.column_type_id,
          value: mockColumns.userLuc.id,
        },
        action: ACTIONS.EQUAL,
        pattern: 1,
      },
      // Multi group column
      {
        operator: '$and',
        column: {
          label: mockColumns.multiGroup.text,
          originalType: mockColumns.multiGroup.column_type_id,
          type: mockColumns.multiGroup.column_type_id,
          value: mockColumns.multiGroup.id,
        },
        action: ACTIONS.CONTAINS_LOGGED_USER_GROUP,
        pattern: ['another', '{groupId}'],
      },

    ], {
      '{userId}': 10,
      '{groupId}': 'group-1',
    })
    expect(currentFilters).toEqual({
      '$and[0][data][C11][$ilike]': '%John%',
      '$and[10][data][C11][$eq]': true,
      '$and[11][data][C11][$eq]': true,
      '$and[12][data][C11][$gt]': true,
      '$and[13][data][C11][$lte]': 'John',
      '$and[14][data][C11][$ilike]': 'John%',
      '$and[15][data][C11][$ilike]': '%John',
      '$and[16][data][C16.value][$eq]': 'John',
      '$and[17][data][C17.value][$eq]': 'John',
      '$and[18][data][C18.reference][$eq]': 1,
      '$and[19][data][C18.reference][$eq]': 10,
      '$and[1][data][C11][$notILike]': '%John%',
      '$and[2][data][C11][$eq]': 'John',
      '$and[20][data][C19.reference][$eq]': '1',
      '$and[21][data][C19.reference][$eq]': 'group-1',
      '$and[22][data][C20.reference][$contains]': [1, 10, 2],
      '$and[24][data][C24.reference][$contains]': ['another', 'group-1'],
      '$and[23][data][C21.reference][$eq]': 1,
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
