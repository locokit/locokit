type inputPatternType =
  | boolean
  | number
  | string
  | Array<string | number>
  | Date
  | null

export interface FilterAction {
  label: string
  value: string
  predefinedPattern?: string | number | boolean | string[]
  patternPrefix?: string
  patternSuffix?: string
}

export interface Filter {
  operator: string
  column: null | {
    name: string
    field: string
    original_type_id: number
    column_type_id: number
  }
  action: FilterAction | null
  motif: inputPatternType
}

export const OPERATORS = [
  {
    label: 'and',
    value: '$and',
  },
  {
    label: 'or',
    value: '$or',
  },
]

export const COLUMN_TYPE = {
  BOOLEAN: 1,
  STRING: 2,
  NUMBER: 3,
  FLOAT: 4,
  DATE: 5,
  USER: 6,
  GROUP: 7,
  RELATION_BETWEEN_TABLES: 8,
  LOOKED_UP_COLUMN: 9,
  SINGLE_SELECT: 10,
  MULTI_SELECT: 11,
  FORMULA: 12,
  FILE: 13,
  MULTI_USER: 14,
  MULTI_GROUP: 15,
  TEXT: 16,
  URL: 17,
  GEOMETRY_POINT: 18,
  GEOMETRY_POLYGON: 19,
  GEOMETRY_LINESTRING: 20,
  DATETIME: 21,
  GEOMETRY_MULTIPOINT: 22,
  GEOMETRY_MULTIPOLYGON: 23,
  GEOMETRY_MULTILINESTRING: 24,
  VIRTUAL_LOOKED_UP_COLUMN: 25,
}

// Available actions
// Each one must have a "label" used for translation and a "value" corresponding to the FeatherJS Query Operators.
// The "predefinedPattern" attribute is used to give a value to an implicit pattern.
export const ACTIONS: Record<string, FilterAction> = {
  MATCH: {
    label: 'match',
    value: '$ilike',
    patternPrefix: '%',
    patternSuffix: '%',
  },
  NOT_MATCH: {
    label: 'doesNotMatch',
    value: '$notILike',
    patternPrefix: '%',
    patternSuffix: '%',
  },
  EQUAL: {
    label: 'isEqualTo',
    value: '$eq',
  },
  NOT_EQUAL: {
    label: 'isDifferentFrom',
    value: '$ne',
  },
  IN: {
    label: 'in',
    value: '$in',
  },
  NOT_IN: {
    label: 'notIn',
    value: '$nin',
  },
  ALL: {
    label: 'all',
    value: '$all',
  },
  ANY: {
    label: 'any',
    value: '$any',
  },
  EMPTY: {
    label: 'isEmpty',
    value: '$null',
    predefinedPattern: true,
  },
  NOT_EMPTY: {
    label: 'isNotEmpty',
    value: '$notNull',
    predefinedPattern: true,
  },
  TRUE: {
    label: 'isTrue',
    value: '$eq',
    predefinedPattern: true,
  },
  FALSE: {
    label: 'isFalse',
    value: '$eq',
    predefinedPattern: false,
  },
  GREATER_THAN: {
    label: 'isGreaterThan',
    value: '$gt',
  },
  LOWER_THAN: {
    label: 'isLowerThan',
    value: '$lt',
  },
  GREATER_EQUAL_THAN: {
    label: 'isGreaterThanOrEqualTo',
    value: '$gte',
  },
  LOWER_EQUAL_THAN: {
    label: 'isLowerThanOrEqualTo',
    value: '$lte',
  },
  START_WITH: {
    label: 'startWith',
    value: '$ilike',
    patternSuffix: '%',
  },
  END_WITH: {
    label: 'endWith',
    value: '$ilike',
    patternPrefix: '%',
  },
  EARLIER_THAN: {
    label: 'isEarlierThan',
    value: '$lt',
  },
  EARLIER_EQUAL_THAN: {
    label: 'isEarlierThanOrEqualTo',
    value: '$lte',
  },
  LATER_THAN: {
    label: 'isLaterThan',
    value: '$gt',
  },
  LATER_EQUAL_THAN: {
    label: 'isLaterThanOrEqualTo',
    value: '$gte',
  },
  IS_LOGGED_USER: {
    label: 'isLoggedInUser',
    value: '$eq',
    predefinedPattern: '{userId}',
  },
  IS_LOGGED_USER_GROUP: {
    label: 'isLoggedInUserGroup',
    value: '$eq',
    predefinedPattern: '{groupId}',
  },
  CONTAINS_LOGGED_USER: {
    label: 'containsLoggedInUser',
    value: '$contains',
    predefinedPattern: ['{userId}'],
  },
  CONTAINS_LOGGED_USER_GROUP: {
    label: 'containsLoggedInUserGroup',
    value: '$contains',
    predefinedPattern: ['{groupId}'],
  },
}

// Filterable types
// Each one must have an "actions" array.
// A "patternComponent" attribute (string) can be added to replace the default pattern component (coming from "getComponentEditorCellForColumnType")
// A "patternComponentOptions" attribute (object) can be added to customize the pattern component
export const COLUMN_FILTERS_CONFIG: Record<
  number,
  {
    actions: FilterAction[]
    patternComponent?: string
    patternComponentOptions?: Record<string, unknown>
  }
> = {
  [COLUMN_TYPE.BOOLEAN]: {
    actions: [ACTIONS.TRUE, ACTIONS.FALSE, ACTIONS.EMPTY, ACTIONS.NOT_EMPTY],
  },
  [COLUMN_TYPE.STRING]: {
    actions: [
      ACTIONS.EQUAL,
      ACTIONS.NOT_EQUAL,
      ACTIONS.MATCH,
      ACTIONS.NOT_MATCH,
      ACTIONS.EMPTY,
      ACTIONS.NOT_EMPTY,
      ACTIONS.START_WITH,
      ACTIONS.END_WITH,
    ],
  },
  [COLUMN_TYPE.NUMBER]: {
    actions: [
      ACTIONS.EQUAL,
      ACTIONS.NOT_EQUAL,
      ACTIONS.LOWER_THAN,
      ACTIONS.LOWER_EQUAL_THAN,
      ACTIONS.GREATER_THAN,
      ACTIONS.GREATER_EQUAL_THAN,
      ACTIONS.EMPTY,
      ACTIONS.NOT_EMPTY,
    ],
  },
  [COLUMN_TYPE.FLOAT]: {
    actions: [
      ACTIONS.EQUAL,
      ACTIONS.NOT_EQUAL,
      ACTIONS.LOWER_THAN,
      ACTIONS.LOWER_EQUAL_THAN,
      ACTIONS.GREATER_THAN,
      ACTIONS.GREATER_EQUAL_THAN,
      ACTIONS.EMPTY,
      ACTIONS.NOT_EMPTY,
    ],
    patternComponent: 'p-input-number',
    patternComponentOptions: { minFractionDigits: 2 },
  },
  [COLUMN_TYPE.RELATION_BETWEEN_TABLES]: {
    actions: [
      ACTIONS.EQUAL,
      ACTIONS.NOT_EQUAL,
      ACTIONS.MATCH,
      ACTIONS.NOT_MATCH,
      ACTIONS.EMPTY,
      ACTIONS.NOT_EMPTY,
      ACTIONS.START_WITH,
      ACTIONS.END_WITH,
    ],
    patternComponent: 'p-input-text',
  },
  [COLUMN_TYPE.SINGLE_SELECT]: {
    actions: [ACTIONS.IN, ACTIONS.NOT_IN, ACTIONS.EMPTY, ACTIONS.NOT_EMPTY],
    patternComponentOptions: {
      optionLabel: 'label',
      optionValue: 'value',
      appendTo: null,
    },
    patternComponent: 'lck-multiselect',
  },
  [COLUMN_TYPE.MULTI_SELECT]: {
    actions: [ACTIONS.ALL, ACTIONS.ANY, ACTIONS.EMPTY, ACTIONS.NOT_EMPTY],
    patternComponentOptions: {
      optionLabel: 'label',
      optionValue: 'value',
      appendTo: null,
    },
  },
  [COLUMN_TYPE.LOOKED_UP_COLUMN]: {
    actions: [
      ACTIONS.EQUAL,
      ACTIONS.NOT_EQUAL,
      ACTIONS.MATCH,
      ACTIONS.NOT_MATCH,
      ACTIONS.EMPTY,
      ACTIONS.NOT_EMPTY,
      ACTIONS.START_WITH,
      ACTIONS.END_WITH,
    ],
    patternComponent: 'p-input-text',
  },
  [COLUMN_TYPE.DATE]: {
    actions: [
      ACTIONS.EQUAL,
      ACTIONS.NOT_EQUAL,
      ACTIONS.EARLIER_THAN,
      ACTIONS.EARLIER_EQUAL_THAN,
      ACTIONS.LATER_THAN,
      ACTIONS.LATER_EQUAL_THAN,
      ACTIONS.EMPTY,
      ACTIONS.NOT_EMPTY,
    ],
    patternComponentOptions: {
      // dateFormat: t('date.dateFormatPrime'),
      showTime: false,
    },
  },
  [COLUMN_TYPE.DATETIME]: {
    actions: [
      ACTIONS.EQUAL,
      ACTIONS.NOT_EQUAL,
      ACTIONS.EARLIER_THAN,
      ACTIONS.EARLIER_EQUAL_THAN,
      ACTIONS.LATER_THAN,
      ACTIONS.LATER_EQUAL_THAN,
      ACTIONS.EMPTY,
      ACTIONS.NOT_EMPTY,
    ],
    patternComponent: 'p-calendar',
    patternComponentOptions: {
      // dateFormat: t('date.dateFormatPrime'),
      showTime: true,
    },
  },
  [COLUMN_TYPE.USER]: {
    actions: [ACTIONS.IS_LOGGED_USER],
  },
  [COLUMN_TYPE.GROUP]: {
    actions: [ACTIONS.IS_LOGGED_USER_GROUP],
  },
  [COLUMN_TYPE.MULTI_USER]: {
    actions: [ACTIONS.CONTAINS_LOGGED_USER],
  },
  [COLUMN_TYPE.MULTI_GROUP]: {
    actions: [ACTIONS.CONTAINS_LOGGED_USER_GROUP],
  },
}
