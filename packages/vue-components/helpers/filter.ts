import { FIELD_TYPE, type LocoKitFieldTypeId } from '@locokit/definitions'
import PrimeDatePicker from 'primevue/datepicker'
import PrimeInputNumber from 'primevue/inputnumber'
import PrimeInputText from 'primevue/inputtext'
import PrimeMultiSelect from 'primevue/multiselect'
import { type Component } from 'vue'

export type FilterValue =
  | boolean
  | number
  | string
  | Array<string | number>
  | Date
  | null

export interface FilterField {
  name: string
  slug: string
  type: LocoKitFieldTypeId
}

export interface FilterRule {
  label: string
  operator: string
  predefinedValue?: string | number | boolean | string[]
  valuePrefix?: string
  valueSuffix?: string
}

export interface Filter {
  field: FilterField | null
  rule: FilterRule | null
  value: FilterValue
  logicalOperator: string
}

export interface FilteringParameters {
  rules: FilterRule[]
  valueComponent?: Component
  valueComponentProps?: Record<string, unknown>
}

export const LOGICAL_OPERATORS = [
  {
    label: 'and',
    operator: '$and',
  },
  {
    label: 'or',
    operator: '$or',
  },
]

/**
 * All available rules
 * "label" = used for translation
 * "value" = corresponding to the FeatherJS Query Operators.
 * "predefinedPattern" = used to give a value to an implicit pattern.
 */
export const RULES: Record<string, FilterRule> = {
  MATCH: {
    label: 'match',
    operator: '$ilike',
    valuePrefix: '%',
    valueSuffix: '%',
  },
  NOT_MATCH: {
    label: 'doesNotMatch',
    operator: '$notILike',
    valuePrefix: '%',
    valueSuffix: '%',
  },
  EQUAL: {
    label: 'isEqualTo',
    operator: '$eq',
  },
  NOT_EQUAL: {
    label: 'isDifferentFrom',
    operator: '$ne',
  },
  IN: {
    label: 'in',
    operator: '$in',
  },
  NOT_IN: {
    label: 'notIn',
    operator: '$nin',
  },
  ALL: {
    label: 'all',
    operator: '$all',
  },
  ANY: {
    label: 'any',
    operator: '$any',
  },
  EMPTY: {
    label: 'isEmpty',
    operator: '$null',
    predefinedValue: true,
  },
  NOT_EMPTY: {
    label: 'isNotEmpty',
    operator: '$notNull',
    predefinedValue: true,
  },
  TRUE: {
    label: 'isTrue',
    operator: '$eq',
    predefinedValue: true,
  },
  FALSE: {
    label: 'isFalse',
    operator: '$eq',
    predefinedValue: false,
  },
  GREATER_THAN: {
    label: 'isGreaterThan',
    operator: '$gt',
  },
  LOWER_THAN: {
    label: 'isLowerThan',
    operator: '$lt',
  },
  GREATER_EQUAL_THAN: {
    label: 'isGreaterThanOrEqualTo',
    operator: '$gte',
  },
  LOWER_EQUAL_THAN: {
    label: 'isLowerThanOrEqualTo',
    operator: '$lte',
  },
  START_WITH: {
    label: 'startWith',
    operator: '$ilike',
    valueSuffix: '%',
  },
  END_WITH: {
    label: 'endWith',
    operator: '$ilike',
    valuePrefix: '%',
  },
  EARLIER_THAN: {
    label: 'isEarlierThan',
    operator: '$lt',
  },
  EARLIER_EQUAL_THAN: {
    label: 'isEarlierThanOrEqualTo',
    operator: '$lte',
  },
  LATER_THAN: {
    label: 'isLaterThan',
    operator: '$gt',
  },
  LATER_EQUAL_THAN: {
    label: 'isLaterThanOrEqualTo',
    operator: '$gte',
  },
  IS_LOGGED_USER: {
    label: 'isLoggedInUser',
    operator: '$eq',
    predefinedValue: '{userId}',
  },
  IS_LOGGED_USER_GROUP: {
    label: 'isLoggedInUserGroup',
    operator: '$eq',
    predefinedValue: '{groupId}',
  },
  CONTAINS_LOGGED_USER: {
    label: 'containsLoggedInUser',
    operator: '$contains',
    predefinedValue: ['{userId}'],
  },
  CONTAINS_LOGGED_USER_GROUP: {
    label: 'containsLoggedInUserGroup',
    operator: '$contains',
    predefinedValue: ['{groupId}'],
  },
}

/**
 * Rules allowed for each field type.
 *
 * Aside the required "rules" array, here are the other optional configuration
 * elements:
 * - valueComponent: component to present to the user for entering a filtering
 *   value when necessary.
 * - valueComponentProps: properties to transmit to the component.
 */
export const FIELD_TYPE_TO_FILTERING_PARAMS: Partial<Record<LocoKitFieldTypeId, FilteringParameters>> = {
  [FIELD_TYPE.BOOLEAN]: {
    rules: [RULES.TRUE, RULES.FALSE, RULES.EMPTY, RULES.NOT_EMPTY],
  },
  [FIELD_TYPE.STRING]: {
    rules: [
      RULES.EQUAL,
      RULES.NOT_EQUAL,
      RULES.MATCH,
      RULES.NOT_MATCH,
      RULES.EMPTY,
      RULES.NOT_EMPTY,
      RULES.START_WITH,
      RULES.END_WITH,
    ],
    valueComponent: PrimeInputText,
    valueComponentProps: {
      class: 'w-full !text-xs',
    },
  },
  [FIELD_TYPE.NUMBER]: {
    rules: [
      RULES.EQUAL,
      RULES.NOT_EQUAL,
      RULES.LOWER_THAN,
      RULES.LOWER_EQUAL_THAN,
      RULES.GREATER_THAN,
      RULES.GREATER_EQUAL_THAN,
      RULES.EMPTY,
      RULES.NOT_EMPTY,
    ],
    valueComponent: PrimeInputNumber,
    valueComponentProps: {
      class: 'w-full',
      inputClass: '!text-xs !py-[0.4375rem] !px-[0.65625rem]',
      useGrouping: false,
    },
  },
  [FIELD_TYPE.FLOAT]: {
    rules: [
      RULES.EQUAL,
      RULES.NOT_EQUAL,
      RULES.LOWER_THAN,
      RULES.LOWER_EQUAL_THAN,
      RULES.GREATER_THAN,
      RULES.GREATER_EQUAL_THAN,
      RULES.EMPTY,
      RULES.NOT_EMPTY,
    ],
    valueComponent: PrimeInputNumber,
    valueComponentProps: {
      minFractionDigits: 2,
      inputClass: 'w-full !text-xs !py-[0.4375rem] !px-[0.65625rem]',
    },
  },
  [FIELD_TYPE.RELATION]: {
    rules: [
      RULES.EQUAL,
      RULES.NOT_EQUAL,
      RULES.MATCH,
      RULES.NOT_MATCH,
      RULES.EMPTY,
      RULES.NOT_EMPTY,
      RULES.START_WITH,
      RULES.END_WITH,
    ],
    valueComponent: PrimeInputText,
    valueComponentProps: {
      class: 'w-full !text-xs',
    },
  },
  [FIELD_TYPE.SINGLE_SELECT]: {
    rules: [RULES.IN, RULES.NOT_IN, RULES.EMPTY, RULES.NOT_EMPTY],
    valueComponent: PrimeMultiSelect,
    valueComponentProps: {
      optionLabel: 'label',
      class: 'w-full !text-xs !py-0 w-56',
      panelClass: '!text-xs',
      showToggleAll: false,
      display: 'chip',
    },
  },
  [FIELD_TYPE.MULTI_SELECT]: {
    rules: [RULES.ALL, RULES.ANY, RULES.EMPTY, RULES.NOT_EMPTY],
    valueComponent: PrimeMultiSelect,
    valueComponentProps: {
      optionLabel: 'label',
      class: 'w-full !text-xs !py-0 w-56',
      panelClass: '!text-xs',
      showToggleAll: false,
      display: 'chip',
    },
  },
  [FIELD_TYPE.LOOKUP]: {
    rules: [
      RULES.EQUAL,
      RULES.NOT_EQUAL,
      RULES.MATCH,
      RULES.NOT_MATCH,
      RULES.EMPTY,
      RULES.NOT_EMPTY,
      RULES.START_WITH,
      RULES.END_WITH,
    ],
    valueComponent: PrimeInputText,
    valueComponentProps: {
      size: 'small',
      class: '!text-xs',
    },
  },
  [FIELD_TYPE.DATE]: {
    rules: [
      RULES.EQUAL,
      RULES.NOT_EQUAL,
      RULES.EARLIER_THAN,
      RULES.EARLIER_EQUAL_THAN,
      RULES.LATER_THAN,
      RULES.LATER_EQUAL_THAN,
      RULES.EMPTY,
      RULES.NOT_EMPTY,
    ],
    valueComponent: PrimeDatePicker,
    valueComponentProps: {
      showTime: false,
      inputClass: '!text-xs !py-[0.4375rem] !px-[0.65625rem]',
    },
  },
  [FIELD_TYPE.DATETIME]: {
    rules: [
      RULES.EQUAL,
      RULES.NOT_EQUAL,
      RULES.EARLIER_THAN,
      RULES.EARLIER_EQUAL_THAN,
      RULES.LATER_THAN,
      RULES.LATER_EQUAL_THAN,
      RULES.EMPTY,
      RULES.NOT_EMPTY,
    ],
    valueComponent: PrimeDatePicker,
    valueComponentProps: {
      showTime: true,
      inputClass: '!text-xs !py-[0.4375rem] !px-[0.65625rem]',
    },
  },
  [FIELD_TYPE.USER]: {
    rules: [RULES.IS_LOGGED_USER],
  },
  [FIELD_TYPE.GROUP]: {
    rules: [RULES.IS_LOGGED_USER_GROUP],
  },
  [FIELD_TYPE.MULTI_USER]: {
    rules: [RULES.CONTAINS_LOGGED_USER],
  },
  [FIELD_TYPE.MULTI_GROUP]: {
    rules: [RULES.CONTAINS_LOGGED_USER_GROUP],
  },
}

export function getFilteringParamsFor(fieldType: LocoKitFieldTypeId): FilteringParameters {
  if (fieldType in FIELD_TYPE_TO_FILTERING_PARAMS) {
    return FIELD_TYPE_TO_FILTERING_PARAMS[fieldType]!
  }

  throw new Error(`No defined filtering parameters for the ${fieldType} field type`)
}
