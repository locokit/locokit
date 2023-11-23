import { FIELD_TYPE } from '@locokit/definitions'
import PrimeInputText from 'primevue/inputtext'
import PrimeCalendar from 'primevue/calendar'
import PrimeInputNumber from 'primevue/inputnumber'
import PrimeMultiSelect from 'primevue/multiselect'
import { type Component } from 'vue'

type inputPatternType =
  | boolean
  | number
  | string
  | Array<string | number>
  | Date
  | null

export interface FilterAction {
  label: string
  featherKey: string
  predefinedPattern?: string | number | boolean | string[]
  patternPrefix?: string
  patternSuffix?: string
}

export interface Filter {
  operator: string
  column: null | {
    name: string
    field: string
    type: string
  }
  action: FilterAction | null
  motif: inputPatternType
}

export const OPERATORS = [
  {
    label: 'and',
    featherKey: '$and',
  },
  {
    label: 'or',
    featherKey: '$or',
  },
]

/**
 * All available action
 * "label" = used for translation
 * "value" = corresponding to the FeatherJS Query Operators.
 * "predefinedPattern" = used to give a value to an implicit pattern.
 */
export const ACTIONS: Record<string, FilterAction> = {
  MATCH: {
    label: 'match',
    featherKey: '$ilike',
    patternPrefix: '%',
    patternSuffix: '%',
  },
  NOT_MATCH: {
    label: 'doesNotMatch',
    featherKey: '$notILike',
    patternPrefix: '%',
    patternSuffix: '%',
  },
  EQUAL: {
    label: 'isEqualTo',
    featherKey: '$eq',
  },
  NOT_EQUAL: {
    label: 'isDifferentFrom',
    featherKey: '$ne',
  },
  IN: {
    label: 'in',
    featherKey: '$in',
  },
  NOT_IN: {
    label: 'notIn',
    featherKey: '$nin',
  },
  ALL: {
    label: 'all',
    featherKey: '$all',
  },
  ANY: {
    label: 'any',
    featherKey: '$any',
  },
  EMPTY: {
    label: 'isEmpty',
    featherKey: '$null',
    predefinedPattern: true,
  },
  NOT_EMPTY: {
    label: 'isNotEmpty',
    featherKey: '$notNull',
    predefinedPattern: true,
  },
  TRUE: {
    label: 'isTrue',
    featherKey: '$eq',
    predefinedPattern: true,
  },
  FALSE: {
    label: 'isFalse',
    featherKey: '$eq',
    predefinedPattern: false,
  },
  GREATER_THAN: {
    label: 'isGreaterThan',
    featherKey: '$gt',
  },
  LOWER_THAN: {
    label: 'isLowerThan',
    featherKey: '$lt',
  },
  GREATER_EQUAL_THAN: {
    label: 'isGreaterThanOrEqualTo',
    featherKey: '$gte',
  },
  LOWER_EQUAL_THAN: {
    label: 'isLowerThanOrEqualTo',
    featherKey: '$lte',
  },
  START_WITH: {
    label: 'startWith',
    featherKey: '$ilike',
    patternSuffix: '%',
  },
  END_WITH: {
    label: 'endWith',
    featherKey: '$ilike',
    patternPrefix: '%',
  },
  EARLIER_THAN: {
    label: 'isEarlierThan',
    featherKey: '$lt',
  },
  EARLIER_EQUAL_THAN: {
    label: 'isEarlierThanOrEqualTo',
    featherKey: '$lte',
  },
  LATER_THAN: {
    label: 'isLaterThan',
    featherKey: '$gt',
  },
  LATER_EQUAL_THAN: {
    label: 'isLaterThanOrEqualTo',
    featherKey: '$gte',
  },
  IS_LOGGED_USER: {
    label: 'isLoggedInUser',
    featherKey: '$eq',
    predefinedPattern: '{userId}',
  },
  IS_LOGGED_USER_GROUP: {
    label: 'isLoggedInUserGroup',
    featherKey: '$eq',
    predefinedPattern: '{groupId}',
  },
  CONTAINS_LOGGED_USER: {
    label: 'containsLoggedInUser',
    featherKey: '$contains',
    predefinedPattern: ['{userId}'],
  },
  CONTAINS_LOGGED_USER_GROUP: {
    label: 'containsLoggedInUserGroup',
    featherKey: '$contains',
    predefinedPattern: ['{groupId}'],
  },
}

/**
 *  Action allowed according to field's type
 *  Each one must have an "actions" array.
 *  "usedComponent" = component to display
 *  "patternComponentOptions" = can be added to customize component
 */
export const FILTER_CONFIG_TO_MATCH_FIELD: Record<
  string,
  {
    actions: FilterAction[]
    usedComponent?: Component
    patternComponentOptions?: Record<string, unknown>
  }
> = {
  [FIELD_TYPE.BOOLEAN]: {
    actions: [ACTIONS.TRUE, ACTIONS.FALSE, ACTIONS.EMPTY, ACTIONS.NOT_EMPTY],
  },
  [FIELD_TYPE.STRING]: {
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
    usedComponent: PrimeInputText,
    patternComponentOptions: {
      size: 'small',
      class: '!text-xs',
    },
  },
  [FIELD_TYPE.NUMBER]: {
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
    usedComponent: PrimeInputNumber,
    patternComponentOptions: {
      inputClass: '!text-xs !py-[0.4375rem] !px-[0.65625rem]',
      useGrouping: false,
    },
  },
  [FIELD_TYPE.FLOAT]: {
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
    usedComponent: PrimeInputNumber,
    patternComponentOptions: {
      minFractionDigits: 2,
      inputClass: '!text-xs !py-[0.4375rem] !px-[0.65625rem]',
    },
  },
  [FIELD_TYPE.RELATION]: {
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
    usedComponent: PrimeInputText,
    patternComponentOptions: {
      size: 'small',
      class: '!text-xs',
    },
  },
  [FIELD_TYPE.SINGLE_SELECT]: {
    actions: [ACTIONS.IN, ACTIONS.NOT_IN, ACTIONS.EMPTY, ACTIONS.NOT_EMPTY],
    usedComponent: PrimeMultiSelect,
    patternComponentOptions: {
      optionLabel: 'label',
      class: '!text-xs !py-0 w-56',
      panelClass: '!text-xs',
      showToggleAll: false,
      display: 'chip',
    },
  },
  [FIELD_TYPE.MULTI_SELECT]: {
    actions: [ACTIONS.ALL, ACTIONS.ANY, ACTIONS.EMPTY, ACTIONS.NOT_EMPTY],
    usedComponent: PrimeMultiSelect,
    patternComponentOptions: {
      optionLabel: 'label',
      class: '!text-xs !py-0 w-56',
      panelClass: '!text-xs',
      showToggleAll: false,
      display: 'chip',
    },
  },
  [FIELD_TYPE.LOOKUP]: {
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
    usedComponent: PrimeInputText,
    patternComponentOptions: {
      size: 'small',
      class: '!text-xs',
    },
  },
  [FIELD_TYPE.DATE]: {
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
    usedComponent: PrimeCalendar,
    patternComponentOptions: {
      showTime: false,
      inputClass: '!text-xs !py-[0.4375rem] !px-[0.65625rem]',
    },
  },
  [FIELD_TYPE.DATETIME]: {
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
    usedComponent: PrimeCalendar,
    patternComponentOptions: {
      showTime: true,
      inputClass: '!text-xs !py-[0.4375rem] !px-[0.65625rem]',
    },
  },
  [FIELD_TYPE.USER]: {
    actions: [ACTIONS.IS_LOGGED_USER],
  },
  [FIELD_TYPE.GROUP]: {
    actions: [ACTIONS.IS_LOGGED_USER_GROUP],
  },
  [FIELD_TYPE.MULTI_USER]: {
    actions: [ACTIONS.CONTAINS_LOGGED_USER],
  },
  [FIELD_TYPE.MULTI_GROUP]: {
    actions: [ACTIONS.CONTAINS_LOGGED_USER_GROUP],
  },
}
