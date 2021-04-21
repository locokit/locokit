import { COLUMN_TYPE } from '@locokit/lck-glossary'
import { fn, FunctionBuilder, raw, ref, ReferenceBuilder } from 'objection'
import { TableColumn } from '../../models/tablecolumn.model'

interface IFormulaBasicParameter {
  // The name of the parameter
  name: string
  // The possible type(s) for the current parameter.
  type: COLUMN_TYPE | COLUMN_TYPE[]
}

interface IFormulaParameter extends IFormulaBasicParameter {
  // Indicate if the parameter is required (used in the parser to check the parameters functions, true by default)
  required?: boolean
  // Indicate if the parameter is single or multiple (used in the parser to check the parameters functions, false by default)
  multiple?: boolean
}

interface IFormula {
  // A function that have as input the function parameters as string and which returns the postgresql code to execute as formula.
  pgsql: (...args: string[]) => string
  // A list of the parameters configurations : we can use
  // either a single parameter which can be required or not, multiple or not (if a parameter is both required and multiple, then it's required once)
  // either an array of related parameters (the array is required at least once and if one parameter of this
  // array is specified, then the other ones of this array also must be specified)
  // NOTE THAT A REQUIRED PARAMETER CAN'T BE PLACED AFTER A FACULTATIVE, MULTIPLE OR RELATED ONES IF THEY HAVE THE SAME TYPE
  params?: Array<IFormulaParameter | IFormulaBasicParameter[]>
  // The return type of the function.
  returnType: COLUMN_TYPE | COLUMN_TYPE[]
}

// The return type of the parser
interface IParsedFormula {
  type: COLUMN_TYPE // The estimated return type of the formula.
  value: string // The deduced result from the input formula (sql code as string).
  stringValues: Record<string, string> // The strings contained in the formula
}

export type ColumnsReferences = Record<string, FunctionBuilder>

// The list of the columns types assimiled to strings to use them in the formulas
export const EQUATED_TO_STRING_TYPES = [
  COLUMN_TYPE.SINGLE_SELECT,
]

// The list of the columns types that can be used as function text parameters.
export const TEXT_TYPES = [
  ...EQUATED_TO_STRING_TYPES,
  COLUMN_TYPE.GROUP,
  COLUMN_TYPE.RELATION_BETWEEN_TABLES,
  COLUMN_TYPE.STRING,
  COLUMN_TYPE.TEXT,
  COLUMN_TYPE.URL,
  COLUMN_TYPE.USER,
]

// The list of the columns types that can be used as function numeric parameters.
const NUMERIC_TYPES = [
  COLUMN_TYPE.FLOAT,
  COLUMN_TYPE.NUMBER,
]

// The list of the original columns types that can be used in a formula
export const implementedInFormulaColumnTypes = [
  ...TEXT_TYPES,
  ...NUMERIC_TYPES,
  COLUMN_TYPE.DATE,
  COLUMN_TYPE.BOOLEAN,
]

/**
 * Get the reference of a column to use it in a SQL objection query.
 * @param column The column that we want to use in a SQL query.
 * @returns The SQL reference of the input column with the correct type.
 */
function getFormattedColumn (column: TableColumn): ReferenceBuilder {
  switch (column.column_type_id) {
    case COLUMN_TYPE.GROUP:
    case COLUMN_TYPE.LOOKED_UP_COLUMN:
    case COLUMN_TYPE.RELATION_BETWEEN_TABLES:
    case COLUMN_TYPE.USER:
      return castColumnReference(ref(`data:${column.id}.value`), column.originalTypeId())
    default:
      return castColumnReference(ref(`data:${column.id}`), column.originalTypeId())
  }
}

/**
 * Cast the column reference depending of the original column type (text by default).
 * @param columnReference The column reference.
 * @param columnType The original column type.
 * @returns The SQL reference with the correct type.
 */
function castColumnReference (columnReference: ReferenceBuilder, originalColumnType: COLUMN_TYPE): ReferenceBuilder {
  switch (originalColumnType) {
    case COLUMN_TYPE.BOOLEAN:
      return columnReference.castBool()
    case COLUMN_TYPE.DATE:
      return columnReference.castTo('timestamp')
    case COLUMN_TYPE.FLOAT:
      return columnReference.castDecimal()
    case COLUMN_TYPE.NUMBER:
      return columnReference.castInt()
    default:
      return columnReference.castText()
  }
}

/**
 * Get the columns ids specified in a formula.
 * @param formula The input formula as a string.
 * @returns An array containing the list of the columns ids.
 */
export function getColumnIdsFromFormula (formula: string): string[] {
  const regex = /(?<=COLUMN\.{)([a-z0-9-]+)(?=})/g
  return [...new Set(formula.match(regex) ?? [])]
}

/**
 * Get an object containing the columns references to use placeholders in the sql query (objection.js format).
 * @param columns An object containing the columns which can be specified in the formula, with the columns ids as keys.
 * @returns An object containing the columns ids as keys and the corresponding references.
 */
export function getColumnsReferences (columns: Record<string, TableColumn> = {}): ColumnsReferences {
  const columnsReferences: ColumnsReferences = {}
  for (const columnId in columns) {
    // Need to replace '-' by '_' because '-' is not a valid char in an alias
    columnsReferences[columnId.replace(/-/g, '_')] = getFormattedColumn(columns[columnId])
  }
  return columnsReferences
}

/**
 * Get a SQL request to compute the input formula or to return the json null value if the formula result is the SQL NULL value.
 * @param formula The parsed formula.
 * @param columnsReferences An object containing the columns ids as keys and the corresponding references (objection.js format).
 * @returns A SQL request (FunctionBuilder format).
 */
export function getSQLRequestFromFormula (formula: IParsedFormula, columnsReferences: ColumnsReferences): FunctionBuilder {
  let castResult = ''
  // Cast the result if it is a text
  if (TEXT_TYPES.includes(formula.type)) {
    castResult = '::text'
  } else if (formula.type === COLUMN_TYPE.DATE) {
    // Cast the result if it is a date
    castResult = '::date'
  }
  // Add the string values to the columns references to use placeholders in both cases
  Object.assign(columnsReferences, formula.stringValues ?? {})
  // Return the sql request
  return fn.coalesce(
    raw(`to_jsonb(${formula.value}${castResult})`, columnsReferences),
    raw("jsonb 'null'"),
  )
}

// Fonctions

enum FUNCTION_CATEGORY {
  DATE = 'DATE',
  LOGIC = 'LOGIC',
  NUMERIC = 'NUMERIC',
  TEXT = 'TEXT',
}

export const functions: Record<FUNCTION_CATEGORY, Record<string, IFormula>> = {
  DATE: {
    DATEADD: {
      pgsql: (date, number, unit) => {
        return `case when ${unit} = any('{year,month,week,day,hour,minute,second}') then ${date} + cast((${number}||${unit}) as interval) end`
      },
      params: [
        {
          name: 'startDate',
          type: COLUMN_TYPE.DATE,
        },
        {
          name: 'number',
          type: NUMERIC_TYPES,
        },
        {
          name: 'unit',
          type: COLUMN_TYPE.STRING,
        },
      ],
      returnType: COLUMN_TYPE.DATE,
    },
    DAY: {
      pgsql: (date) => `date_part('day', ${date})`,
      params: [
        {
          name: 'date',
          type: COLUMN_TYPE.DATE,
        },
      ],
      returnType: COLUMN_TYPE.NUMBER,
    },
    DAYS: {
      pgsql: (startDate, endDate) => `date_part('day', ${endDate} - ${startDate})`,
      params: [
        {
          name: 'startDate',
          type: COLUMN_TYPE.DATE,
        },
        {
          name: 'endDate',
          type: COLUMN_TYPE.DATE,
        },
      ],
      returnType: COLUMN_TYPE.NUMBER,
    },
    EARLIER: {
      pgsql: (firstDate, secondDate) => `${firstDate} < ${secondDate}`,
      params: [
        {
          name: 'firstDate',
          type: COLUMN_TYPE.DATE,
        },
        {
          name: 'secondDate',
          type: COLUMN_TYPE.DATE,
        },
      ],
      returnType: COLUMN_TYPE.BOOLEAN,
    },
    EQUAL: {
      pgsql: (firstDate, secondDate) => `${firstDate} = ${secondDate}`,
      params: [
        {
          name: 'firstDate',
          type: COLUMN_TYPE.DATE,
        },
        {
          name: 'secondDate',
          type: COLUMN_TYPE.DATE,
        },
      ],
      returnType: COLUMN_TYPE.BOOLEAN,
    },
    EOMONTH: {
      pgsql: (date, numMonths) => `date_trunc('month', ${date}) + cast((${numMonths} + 1 || 'month -1 day') as interval)`,
      params: [
        {
          name: 'date',
          type: COLUMN_TYPE.DATE,
        },
        {
          name: 'numMonths',
          type: COLUMN_TYPE.NUMBER,
        },
      ],
      returnType: COLUMN_TYPE.DATE,
    },
    HOUR: {
      pgsql: (date) => `date_part('hour', ${date})`,
      params: [
        {
          name: 'date',
          type: COLUMN_TYPE.DATE,
        },
      ],
      returnType: COLUMN_TYPE.NUMBER,
    },
    LATER: {
      pgsql: (firstDate, secondDate) => `${firstDate} > ${secondDate}`,
      params: [
        {
          name: 'firstDate',
          type: COLUMN_TYPE.DATE,
        },
        {
          name: 'secondDate',
          type: COLUMN_TYPE.DATE,
        },
      ],
      returnType: COLUMN_TYPE.BOOLEAN,
    },
    MINUTE: {
      pgsql: (date) => `date_part('minute', ${date})`,
      params: [
        {
          name: 'date',
          type: COLUMN_TYPE.DATE,
        },
      ],
      returnType: COLUMN_TYPE.NUMBER,
    },
    MONTH: {
      pgsql: (date) => `date_part('month', ${date})`,
      params: [
        {
          name: 'date',
          type: COLUMN_TYPE.DATE,
        },
      ],
      returnType: COLUMN_TYPE.NUMBER,
    },
    MONTHS: {
      pgsql: (startDate, endDate) => `select date_part('year', diffAge) * 12 + date_part('month', diffAge) from age(${endDate}, ${startDate}) as diffAge`,
      params: [
        {
          name: 'startDate',
          type: COLUMN_TYPE.DATE,
        },
        {
          name: 'endDate',
          type: COLUMN_TYPE.DATE,
        },
      ],
      returnType: COLUMN_TYPE.NUMBER,
    },
    SECOND: {
      pgsql: (date) => `date_part('second', ${date})`,
      params: [
        {
          name: 'date',
          type: COLUMN_TYPE.DATE,
        },
      ],
      returnType: COLUMN_TYPE.NUMBER,
    },
    WEEKDAY: {
      pgsql: (date) => `date_part('isodow', ${date})`,
      params: [
        {
          name: 'date',
          type: COLUMN_TYPE.DATE,
        },
      ],
      returnType: COLUMN_TYPE.NUMBER,
    },
    WEEKNUM: {
      pgsql: (date) => `date_part('week', ${date})`,
      params: [
        {
          name: 'date',
          type: COLUMN_TYPE.DATE,
        },
      ],
      returnType: COLUMN_TYPE.NUMBER,
    },
    YEAR: {
      pgsql: (date) => `date_part('isoyear', ${date})`,
      params: [
        {
          name: 'date',
          type: COLUMN_TYPE.DATE,
        },
      ],
      returnType: COLUMN_TYPE.NUMBER,
    },
    YEARS: {
      pgsql: (startDate, endDate) => `date_part('year', age(${endDate}, ${startDate}))`,
      params: [
        {
          name: 'startDate',
          type: COLUMN_TYPE.DATE,
        },
        {
          name: 'endDate',
          type: COLUMN_TYPE.DATE,
        },
      ],
      returnType: COLUMN_TYPE.NUMBER,
    },
  },
  LOGIC: {
    AND: {
      pgsql: (...conditions) => `${conditions.join(' and ')}`,
      params: [
        {
          name: 'condition',
          type: COLUMN_TYPE.BOOLEAN,
          multiple: true,
        },
      ],
      returnType: COLUMN_TYPE.BOOLEAN,
    },
    FALSE: {
      pgsql: () => 'false',
      returnType: COLUMN_TYPE.BOOLEAN,
    },
    IF: {
      pgsql: (condition, resultIfTrue, resultIfFalse) => `case when ${condition} then cast(${resultIfTrue} as text) else cast(${resultIfFalse} as text) end`,
      params: [
        {
          name: 'condition',
          type: COLUMN_TYPE.BOOLEAN,
        },
        {
          name: 'resultIfTrue',
          type: implementedInFormulaColumnTypes,
        },
        {
          name: 'resultIfFalse',
          type: implementedInFormulaColumnTypes,
        },
      ],
      returnType: COLUMN_TYPE.TEXT,
    },
    IFS: {
      pgsql: (...args) => {
        let ifsRequest = 'case '
        for (let index = 0; index < args.length; index += 2) {
          ifsRequest += `when ${args[index]} then cast(${args[index + 1]} as text) `
        }
        ifsRequest += 'end'
        return ifsRequest
      },
      params: [
        [
          {
            name: 'condition',
            type: COLUMN_TYPE.BOOLEAN,
          },
          {
            name: 'resultIfTrue',
            type: implementedInFormulaColumnTypes,
          },
        ],
      ],
      returnType: COLUMN_TYPE.TEXT,
    },
    NOT: {
      pgsql: (condition) => `not(${condition})`,
      params: [
        {
          name: 'condition',
          type: COLUMN_TYPE.BOOLEAN,
        },
      ],
      returnType: COLUMN_TYPE.BOOLEAN,
    },
    OR: {
      pgsql: (...args) => `${args.join(' or ')}`,
      params: [
        {
          name: 'condition',
          type: COLUMN_TYPE.BOOLEAN,
          multiple: true,
        },
      ],
      returnType: COLUMN_TYPE.BOOLEAN,
    },
    SWITCH: {
      pgsql: (expression, ...args) => {
        const numArgs = args.length
        // Add expression
        let switchRequest = `case ${expression}`
        // Add the switch cases
        for (let index = 0; index < numArgs; index += 2) {
          const result = args[index + 1]
          if (result) switchRequest += ` when ${args[index]} then cast(${result} as text)`
        }
        // Add the default case if specified
        if (numArgs % 2 === 1) {
          switchRequest += ` else cast(${args[numArgs - 1]} as text)`
        }
        switchRequest += ' end'
        return switchRequest
      },
      params: [
        {
          name: 'expression',
          type: implementedInFormulaColumnTypes,
        },
        [
          {
            name: 'pattern',
            type: implementedInFormulaColumnTypes,
          },
          {
            name: 'resultIfMatching',
            type: implementedInFormulaColumnTypes,
          },
        ],
        {
          name: 'defaultResult',
          type: implementedInFormulaColumnTypes,
          required: false,
        },
      ],
      returnType: COLUMN_TYPE.TEXT,
    },
    TRUE: {
      pgsql: () => 'true',
      returnType: COLUMN_TYPE.BOOLEAN,
    },
  },
  NUMERIC: {
    ABS: {
      pgsql: (number) => `abs(${number})`,
      params: [
        {
          name: 'number',
          type: NUMERIC_TYPES,
        },
      ],
      returnType: COLUMN_TYPE.FLOAT,
    },
    AVERAGE: {
      pgsql: (...numbers) => `(${numbers.join('+')}) / ${numbers.length.toFixed(1)}`,
      params: [
        {
          name: 'number',
          type: NUMERIC_TYPES,
          multiple: true,
        },
      ],
      returnType: COLUMN_TYPE.FLOAT,
    },
    CEILING: {
      pgsql: (number) => `ceiling(${number})`,
      params: [
        {
          name: 'number',
          type: NUMERIC_TYPES,
        },
      ],
      returnType: COLUMN_TYPE.NUMBER,
    },
    DIVIDE: {
      pgsql: (firstNumber, ...others) => firstNumber + others.map(nb => `/(case when ${nb} <> 0 then ${nb} end)`).join(''),
      params: [
        {
          name: 'number',
          type: NUMERIC_TYPES,
          multiple: true,
        },
      ],
      returnType: COLUMN_TYPE.FLOAT,
    },
    E: {
      pgsql: () => 'exp(1)',
      returnType: COLUMN_TYPE.FLOAT,
    },
    EQUAL: {
      pgsql: (firstNumber, secondNumber) => `${firstNumber}=${secondNumber}`,
      params: [
        {
          name: 'firstNumber',
          type: NUMERIC_TYPES,
        },
        {
          name: 'secondNumber',
          type: NUMERIC_TYPES,
        },
      ],
      returnType: COLUMN_TYPE.BOOLEAN,
    },
    FLOOR: {
      pgsql: number => `floor(${number})`,
      params: [
        {
          name: 'number',
          type: NUMERIC_TYPES,
        },
      ],
      returnType: COLUMN_TYPE.NUMBER,
    },
    GREATER: {
      pgsql: (firstNumber, secondNumber) => `${firstNumber}>${secondNumber}`,
      params: [
        {
          name: 'firstNumber',
          type: NUMERIC_TYPES,
        },
        {
          name: 'secondNumber',
          type: NUMERIC_TYPES,
        },
      ],
      returnType: COLUMN_TYPE.BOOLEAN,
    },
    GREATEREQ: {
      pgsql: (firstNumber, secondNumber) => `${firstNumber}>=${secondNumber}`,
      params: [
        {
          name: 'firstNumber',
          type: NUMERIC_TYPES,
        },
        {
          name: 'secondNumber',
          type: NUMERIC_TYPES,
        },
      ],
      returnType: COLUMN_TYPE.BOOLEAN,
    },
    INT: {
      pgsql: number => `round(${number})`,
      params: [
        {
          name: 'number',
          type: NUMERIC_TYPES,
        },
      ],
      returnType: COLUMN_TYPE.NUMBER,
    },
    LESS: {
      pgsql: (firstNumber, secondNumber) => `${firstNumber}<${secondNumber}`,
      params: [
        {
          name: 'firstNumber',
          type: NUMERIC_TYPES,
        },
        {
          name: 'secondNumber',
          type: NUMERIC_TYPES,
        },
      ],
      returnType: COLUMN_TYPE.BOOLEAN,
    },
    LESSEQ: {
      pgsql: (firstNumber, secondNumber) => `${firstNumber}<=${secondNumber}`,
      params: [
        {
          name: 'firstNumber',
          type: NUMERIC_TYPES,
        },
        {
          name: 'secondNumber',
          type: NUMERIC_TYPES,
        },
      ],
      returnType: COLUMN_TYPE.BOOLEAN,
    },
    LOG: {
      pgsql: (number, base) => `case when ${base} > 0 and ${number} > 0 then log(${base},${number}) else null end`,
      params: [
        {
          name: 'number',
          type: NUMERIC_TYPES,
        },
        {
          name: 'base',
          type: NUMERIC_TYPES,
        },
      ],
      returnType: COLUMN_TYPE.FLOAT,
    },
    MAX: {
      pgsql: (...numbers) => `greatest(${numbers.join(',')})`,
      params: [
        {
          name: 'number',
          type: NUMERIC_TYPES,
          multiple: true,
        },
      ],
      returnType: COLUMN_TYPE.FLOAT,
    },
    MIN: {
      pgsql: (...numbers) => `least(${numbers.join(',')})`,
      params: [
        {
          name: 'number',
          type: NUMERIC_TYPES,
          multiple: true,
        },
      ],
      returnType: COLUMN_TYPE.FLOAT,
    },
    MOD: {
      pgsql: (number, divisor) => `case when ${divisor} <> 0 then mod(${number},${divisor}) end`,
      params: [
        {
          name: 'number',
          type: NUMERIC_TYPES,
        },
        {
          name: 'divisor',
          type: NUMERIC_TYPES,
        },
      ],
      returnType: COLUMN_TYPE.FLOAT,
    },
    PI: {
      pgsql: () => 'pi()',
      returnType: COLUMN_TYPE.FLOAT,
    },
    PRODUCT: {
      pgsql: (...numbers) => numbers.join('*'),
      params: [
        {
          name: 'number',
          type: NUMERIC_TYPES,
          multiple: true,
        },
      ],
      returnType: COLUMN_TYPE.FLOAT,
    },
    ROUND: {
      pgsql: (number, numDigits) => `round(${number},${numDigits})`,
      params: [
        {
          name: 'number',
          type: NUMERIC_TYPES,
        },
        {
          name: 'numDigits',
          type: COLUMN_TYPE.NUMBER,
        },
      ],
      returnType: COLUMN_TYPE.FLOAT,
    },
    SIGN: {
      pgsql: (number) => `sign(${number})`,
      params: [
        {
          name: 'number',
          type: NUMERIC_TYPES,
        },
      ],
      returnType: COLUMN_TYPE.NUMBER,
    },
    SQRT: {
      pgsql: (number) => `case when ${number} >= 0 then sqrt(${number}) end`,
      params: [
        {
          name: 'number',
          type: NUMERIC_TYPES,
        },
      ],
      returnType: COLUMN_TYPE.FLOAT,
    },
    SUBTRACT: {
      pgsql: (...numbers) => numbers.join('-'),
      params: [
        {
          name: 'number',
          type: NUMERIC_TYPES,
          multiple: true,
        },
      ],
      returnType: COLUMN_TYPE.FLOAT,
    },
    SUM: {
      pgsql: (...numbers) => numbers.join('+'),
      params: [
        {
          name: 'number',
          type: NUMERIC_TYPES,
          multiple: true,
        },
      ],
      returnType: COLUMN_TYPE.FLOAT,
    },
    UNEQUAL: {
      pgsql: (firstNumber, secondNumber) => `${firstNumber}<>${secondNumber}`,
      params: [
        {
          name: 'firstNumber',
          type: NUMERIC_TYPES,
        },
        {
          name: 'secondNumber',
          type: NUMERIC_TYPES,
        },
      ],
      returnType: COLUMN_TYPE.BOOLEAN,
    },
  },
  TEXT: {
    CONCAT: {
      pgsql: (...texts) => `concat(${texts.join(',')})`,
      params: [
        {
          name: 'text',
          type: TEXT_TYPES,
          multiple: true,
        },
      ],
      returnType: COLUMN_TYPE.TEXT,
    },
    EXACT: {
      pgsql: (firstText, secondText) => `${firstText}=${secondText}`,
      params: [
        {
          name: 'firstText',
          type: TEXT_TYPES,
        },
        {
          name: 'secondText',
          type: TEXT_TYPES,
        },
      ],
      returnType: COLUMN_TYPE.BOOLEAN,
    },
    FIND: {
      pgsql: (findText, withinText) => `strpos(${withinText},${findText})`,
      params: [
        {
          name: 'findText',
          type: TEXT_TYPES,
        },
        {
          name: 'withinText',
          type: TEXT_TYPES,
        },
      ],
      returnType: COLUMN_TYPE.NUMBER,
    },
    LEFT: {
      pgsql: (text, numChars) => `left(${text},${numChars})`,
      params: [
        {
          name: 'text',
          type: TEXT_TYPES,
        },
        {
          name: 'numChars',
          type: COLUMN_TYPE.NUMBER,
        },
      ],
      returnType: COLUMN_TYPE.TEXT,
    },
    LEN: {
      pgsql: (text) => `length(${text})`,
      params: [
        {
          name: 'text',
          type: TEXT_TYPES,
        },
      ],
      returnType: COLUMN_TYPE.NUMBER,
    },
    LOWER: {
      pgsql: (text) => `lower(${text})`,
      params: [
        {
          name: 'text',
          type: TEXT_TYPES,
        },
      ],
      returnType: COLUMN_TYPE.TEXT,
    },
    MID: {
      pgsql: (text, startPos, numChars) => `case when ${numChars} > 0 then substr(${text},${startPos},${numChars}) end`,
      params: [
        {
          name: 'text',
          type: TEXT_TYPES,
        },
        {
          name: 'startPos',
          type: COLUMN_TYPE.NUMBER,
        },
        {
          name: 'numChars',
          type: COLUMN_TYPE.NUMBER,
        },
      ],
      returnType: COLUMN_TYPE.TEXT,
    },
    REPLACE: {
      pgsql: (text, startPos, numChars, newText) =>
        `case when ${startPos} > 0 then overlay(${text} placing ${newText} from ${startPos} for ${numChars}) end`,
      params: [
        {
          name: 'text',
          type: TEXT_TYPES,
        },
        {
          name: 'startPos',
          type: COLUMN_TYPE.NUMBER,
        },
        {
          name: 'numChars',
          type: COLUMN_TYPE.NUMBER,
        },
        {
          name: 'newText',
          type: TEXT_TYPES,
        },
      ],
      returnType: COLUMN_TYPE.TEXT,
    },
    REPT: {
      pgsql: (text, number) => `repeat(${text},${number})`,
      params: [
        {
          name: 'text',
          type: TEXT_TYPES,
        },
        {
          name: 'number',
          type: COLUMN_TYPE.NUMBER,
        },
      ],
      returnType: COLUMN_TYPE.TEXT,
    },
    RIGHT: {
      pgsql: (text, numChars) => `right(${text},${numChars})`,
      params: [
        {
          name: 'text',
          type: TEXT_TYPES,
        },
        {
          name: 'numChars',
          type: COLUMN_TYPE.NUMBER,
        },
      ],
      returnType: COLUMN_TYPE.TEXT,
    },
    SUBSTITUTE: {
      pgsql: (text, searchedText, newText) => `replace(${text},${searchedText},${newText})`,
      params: [
        {
          name: 'text',
          type: TEXT_TYPES,
        },
        {
          name: 'searchedText',
          type: TEXT_TYPES,
        },
        {
          name: 'newText',
          type: TEXT_TYPES,
        },
      ],
      returnType: COLUMN_TYPE.TEXT,
    },
    TEXTJOIN: {
      pgsql: (separator, ...texts) => `concat_ws(${separator},${texts.join(',')})`,
      params: [
        {
          name: 'separator',
          type: COLUMN_TYPE.STRING,
        },
        {
          name: 'text',
          type: TEXT_TYPES,
          multiple: true,
        },
      ],
      returnType: COLUMN_TYPE.TEXT,
    },
    TRIM: {
      pgsql: (text) => `trim(from ${text})`,
      params: [
        {
          name: 'text',
          type: TEXT_TYPES,
        },
      ],
      returnType: COLUMN_TYPE.TEXT,
    },
    UPPER: {
      pgsql: (text) => `upper(${text})`,
      params: [
        {
          name: 'text',
          type: TEXT_TYPES,
        },
      ],
      returnType: COLUMN_TYPE.TEXT,
    },
  },
}
