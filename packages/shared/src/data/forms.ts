import { FormFieldProps, FormFieldState, FormInstance } from '@primevue/forms'
import {
  LocoKitFieldTypeId,
  LocoKitFieldComponentId,
  LocoKitTableFieldValue,
  FIELD_COMPONENT,
} from './fields'
import { LocoKitTableRecord } from './records'

export type LocoKitFormFieldRuleCondition =
  | {
      fieldId: string
      operator: '$eq' | '$neq'
      value: string | number
    }
  | {
      fieldId: string
      operator: '$in' | '$nin'
      value: string[] | number[]
    }

/**
 * Validation rules managed by LocoKit forms
 */
export type LocoKitFormFieldValidation = {
  /**
   * Field must be set
   */
  required?: boolean
  /**
   * Field maximum length
   */
  maxLength?: number
  /**
   * Field minimum length
   */
  minLength?: number
  /**
   * Field value need to match another field value
   * (name of the matching field)
   */
  match?: string
  /**
   * Regular expression the field value must match
   */
  regex?: RegExp
}

export type LocoKitFormFieldState = {
  /**
   * Dedicated attributes that will bound to the input field
   *
   * Can be function like the onChange one,
   * or other properties needed by the field / component field itself
   */
  attrs?:
    | ((
        field: FormFieldProps,
        currentRecord: {
          [key: string]: FormFieldState
        },
        relatedRecords: Record<string, LocoKitTableRecord[]>,
        primeForm: FormInstance,
      ) => Record<string, any>)
    | Record<string, any>

  validation?: LocoKitFormFieldValidation

  display?: {
    visible?: boolean
  }
}

export type LocoKitFormFieldRule = {
  conditions: LocoKitFormFieldRuleCondition[]
  impact: LocoKitFormFieldState
}

type LocoKitFormFieldDefaultType = {
  /**
   * Id allowing the form to have unique input ids,
   * ideal for accessibility / label purposes.
   */
  id: string
  /**
   * Label displayed near the input field
   */
  label: string
  /**
   * Description is displayed under the input field
   */
  description?: string | string[]
  /**
   * Class to apply on the input field
   */
  class?: string
  /**
   * Class to apply on the wrapping <div>
   */
  wrapperClass?: string
  /**
   * What type of data this field is
   */
  type: LocoKitFieldTypeId
  /**
   * Which component to use for display and input purpose
   */
  component: LocoKitFieldComponentId
  /**
   * In the case of `FIELD_COMPONENT.SPECIFIC_COMPONENT`,
   * which component vue to use
   */
  specificComponent?: any
  /**
   * Is the input disabled?
   */
  disabled?: boolean
  /**
   * Is the field a read only one ?
   * (displayed but not editable)
   */
  readonly?: boolean
  /**
   * Is the input hidden ?
   * (the field is still present in the DOM,
   * so it will be present in form values)
   */
  hidden?: boolean
  /**
   * Settings for the current field,
   * with default settings applied,
   * and settings applied through conditional rules
   */
  settings?: {
    default?: LocoKitFormFieldState
    rules?: LocoKitFormFieldRule[]
  }

  /**
   * Display value, depending the field value itself
   */
  displayValue?: (
    value: LocoKitTableFieldValue[] | LocoKitTableFieldValue,
    record?: LocoKitTableRecord | LocoKitTableRecord[],
    relatedRecords?: Record<string, LocoKitTableRecord[]>,
  ) => string

  /**
   * Default value for the field,
   * can be a function (eg. for date) or a static value
   */
  defaultValue?: Function | LocoKitTableFieldValue
}

export type LocoKitFormFieldHidden = LocoKitFormFieldDefaultType & {
  /**
   * Is the input hidden ?
   */
  hidden: true
  /**
   * Optional type, component
   */
  type?: LocoKitFieldTypeId
  component?: LocoKitFieldComponentId
}

export type LocoKitFormFieldBase = LocoKitFormFieldDefaultType | LocoKitFormFieldHidden

export type LocoKitFormFieldAutocomplete = LocoKitFormFieldBase & {
  component: typeof FIELD_COMPONENT.AUTOCOMPLETE
  /**
   * Indicates if the component accepts an arbitrary value or not. If not,
   * a value must be chosen among the list of suggestions (true by default).
   */
  freeInput?: boolean
  /**
   * Data source to use for the auto-completion
   */
  source: {
    table: string
    label: string
    value: string
    /**
     * Color fields to use for font & background
     */
    colorFields?: {
      text: string
      background?: string
    }
  }
}

export type LocoKitFormFieldTextual = LocoKitFormFieldBase & {
  /**
   * Is the input readable only?
   */
  readonly?: boolean
}

export type LocoKitFormFieldInputCurrency = LocoKitFormFieldTextual & {
  component: typeof FIELD_COMPONENT.INPUT_CURRENCY
}
export type LocoKitFormFieldInputDate = LocoKitFormFieldTextual & {
  component: typeof FIELD_COMPONENT.INPUT_DATE
}
export type LocoKitFormFieldInputDateTime = LocoKitFormFieldTextual & {
  component: typeof FIELD_COMPONENT.INPUT_DATETIME
}
export type LocoKitFormFieldInputEmail = LocoKitFormFieldTextual & {
  component: typeof FIELD_COMPONENT.INPUT_EMAIL
}
export type LocoKitFormFieldInputFloat = LocoKitFormFieldTextual & {
  component: typeof FIELD_COMPONENT.INPUT_FLOAT
}
export type LocoKitFormFieldInputNumber = LocoKitFormFieldTextual & {
  component: typeof FIELD_COMPONENT.INPUT_NUMBER
}
export type LocoKitFormFieldInputPassword = LocoKitFormFieldTextual & {
  component: typeof FIELD_COMPONENT.INPUT_PASSWORD
}
export type LocoKitFormFieldInputText = LocoKitFormFieldTextual & {
  component: typeof FIELD_COMPONENT.INPUT_TEXT
}
export type LocoKitFormFieldInputUuid = LocoKitFormFieldTextual & {
  component: typeof FIELD_COMPONENT.INPUT_UUID
}

export type LocoKitFormFieldTextarea = LocoKitFormFieldTextual & {
  component: typeof FIELD_COMPONENT.TEXTAREA
  /**
   * Number of visible rows (6 by default).
   */
  rows?: number
  /**
   * Number of visible columns. If undefined, the component will take up
   * all the available width.
   */
  cols?: number
}

export type LocoKitFormFieldSingleSelect = LocoKitFormFieldBase & {
  component: typeof FIELD_COMPONENT.SINGLE_SELECT
  /**
   * Source for the data component
   */
  source: {
    options: unknown[]
    label?: string
    value?: string
    /**
     * Color fields to use for font & background
     */
    colorFields?: {
      text: string
      background?: string
    }
  }
}

export type LocoKitFormField =
  | LocoKitFormFieldBase
  | LocoKitFormFieldAutocomplete
  | LocoKitFormFieldInputCurrency
  | LocoKitFormFieldInputDate
  | LocoKitFormFieldInputDateTime
  | LocoKitFormFieldInputEmail
  | LocoKitFormFieldInputFloat
  | LocoKitFormFieldInputNumber
  | LocoKitFormFieldInputPassword
  | LocoKitFormFieldInputText
  | LocoKitFormFieldInputUuid
  | LocoKitFormFieldSingleSelect
  | LocoKitFormFieldTextarea

type LocoKitFormBase = {
  label: string
  placeholder?: string
  description?: string[]
}

/**
 * Display element for a form
 */
// interface FormRecordBlock extends LocoKitFormBase {
//   class: string
//   /**
//    * fields to be displayed in the block,
//    * referencing fields of the current step
//    */
//   fields: {
//     name: string
//     class: string
//   }[]
// }

export type LocoKitFormStep = LocoKitFormBase & {
  /**
   * All fields needed for this step
   *
   * Can be empty if the step
   * is for display purpose
   */
  fields?: LocoKitFormField[]

  /**
   * How the fields are displayed to the user
   *
   * Blocks are also for display purpose
   */
  // blocks?: FormRecordBlock[]

  /**
   * Property name of the bounded value
   * where to store the fields' values
   *
   * If undefined / null,
   * all fields' values will be set
   * at the root level of the bounded value form
   */
  property?: string

  /**
   * Do this property a multiple one,
   * and if so, we store values in an array.
   *
   * Min records can be set to pregenerate forms.
   * Max records can be set too to limit the number of records.
   */
  array?: boolean
  minRecords?: number
  maxRecords?: number
  recordTitle?: (
    record: {
      [key: string]: FormFieldState
    },
    idx: number,
  ) => string

  /**
   * Is this step a summary ?
   *
   * Sum up all data field by user
   */
  summary?: boolean
}

/**
 * Global definition for a LocoKit form
 */
export type LocoKitForm = LocoKitFormBase & {
  /**
   * Is the form a multistep one ?
   *
   * if so, steps will be an array of more
   * than 1 element.
   *
   * may not be useful if we can compute
   * it directly from the steps array's length
   */
  multisteps: boolean

  /**
   * Set of all steps
   * making the form
   */
  steps: LocoKitFormStep[]
}

export type FormValues = Record<
  string,
  string | number | boolean | Object | null | string[] | number[] | boolean[]
>

export type GenericFormField = LocoKitFormField & {
  validationRules?: LocoKitFormFieldValidation
}
