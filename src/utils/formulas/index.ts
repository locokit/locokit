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
  // either a single parameter (which can be required or not, multiple or not)
  // either an array of related parameters (the array is required at least once and if one parameter of this array is specified,
  // then the other ones of this array also must be specified)
  params?: Array<IFormulaParameter | IFormulaBasicParameter[]>
  // The return type of the function.
  returnType: COLUMN_TYPE | COLUMN_TYPE[]
}

// The return type of the parser
interface IParsedFormula {
  type: COLUMN_TYPE // The estimated return type of the formula.
  value: string // The deduced result from the input formula (sql code as string).
}

export type ColumnsReferences = Record<string, FunctionBuilder>

// The list of the columns types that can be used as function text parameters.
export const TEXT_TYPES = [
  COLUMN_TYPE.GROUP,
  COLUMN_TYPE.MULTI_USER,
  COLUMN_TYPE.RELATION_BETWEEN_TABLES,
  COLUMN_TYPE.SINGLE_SELECT,
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

// The list of the columns types that can't be used in a formula.
export const notImplementedInFormulaColumnTypes = [
  COLUMN_TYPE.FILE,
  COLUMN_TYPE.FORMULA,
  COLUMN_TYPE.GEOMETRY_POINT,
  COLUMN_TYPE.GEOMETRY_POLYGON,
  COLUMN_TYPE.GEOMETRY_LINESTRING,
  COLUMN_TYPE.MULTI_GROUP,
  COLUMN_TYPE.MULTI_SELECT,
]

// The list of the columns types that can be used in a formula
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
export function getFormattedColumn (column: TableColumn): ReferenceBuilder {
  if (!column.settings.formula_type_id) throw Error('The original type of the column is not specified')
  switch (column.column_type_id) {
    case COLUMN_TYPE.GROUP:
    case COLUMN_TYPE.LOOKED_UP_COLUMN:
    case COLUMN_TYPE.MULTI_USER:
    case COLUMN_TYPE.RELATION_BETWEEN_TABLES:
    case COLUMN_TYPE.USER:
      return castColumnReference(ref(`data:${column.id}.value`), column.settings.formula_type_id)
    default:
      return castColumnReference(ref(`data:${column.id}`), column.settings.formula_type_id)
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
      return columnReference.castTo('date')
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
  const regex = /(?<=COLUMN\.)([a-z0-9-]*)/g
  return [...new Set(formula.match(regex) ?? [])]
}

/**
 * Get an object containing the columns references to use placeholders in the sql query (objection.js format).
 * @param columns A list of columns which can be specified in the formula.
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
  // Only cast the result if it is a text
  const castResult = TEXT_TYPES.includes(formula.type) ? '::text' : ''
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
      pgsql: (date, number, unit) =>
        `case when ${unit} = ANY('{year,month,week,day,hour,minute,second}')
          then ${date} + interval '${number} ${unit}'
        end`,
      params: [
        {
          name: 'startDate',
          type: COLUMN_TYPE.DATE,
        },
        {
          name: 'number',
          type: COLUMN_TYPE.FLOAT,
        },
        {
          name: 'unit',
          type: COLUMN_TYPE.STRING,
        },
      ],
      returnType: COLUMN_TYPE.NUMBER,
    },
    DATEDIF: {
      pgsql: (startDate, endDate, unit) =>
        `case ${unit}
          when 'year' then date_part('year', age(${endDate}, ${startDate}))
          when 'month' then date_part('year', age(${endDate}, ${startDate})) * 12 +
                        date_part('month', age(${endDate}, ${startDate}))
          when 'day' then ${endDate} - ${startDate}
        end
        `,
      params: [
        {
          name: 'startDate',
          type: COLUMN_TYPE.DATE,
        },
        {
          name: 'endDate',
          type: COLUMN_TYPE.DATE,
        },
        {
          name: 'unit',
          type: COLUMN_TYPE.STRING,
        },
      ],
      returnType: COLUMN_TYPE.NUMBER,
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
      pgsql: (date1, date2) => `${date1} > ${date2}`,
      params: [
        {
          name: 'date1',
          type: COLUMN_TYPE.DATE,
        },
        {
          name: 'date2',
          type: COLUMN_TYPE.DATE,
        },
      ],
      returnType: COLUMN_TYPE.BOOLEAN,
    },
    EARLIER: {
      pgsql: (date1, date2) => `${date1} < ${date2}`,
      params: [
        {
          name: 'date1',
          type: COLUMN_TYPE.DATE,
        },
        {
          name: 'date2',
          type: COLUMN_TYPE.DATE,
        },
      ],
      returnType: COLUMN_TYPE.BOOLEAN,
    },
    EQUAL: {
      pgsql: (date1, date2) => `${date1} = ${date2}`,
      params: [
        {
          name: 'date1',
          type: COLUMN_TYPE.DATE,
        },
        {
          name: 'date2',
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
      pgsql: (date) => `date_part('dow', ${date})`,
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
      pgsql: (date) => `date_part('year', ${date})`,
      params: [
        {
          name: 'date',
          type: COLUMN_TYPE.DATE,
        },
      ],
      returnType: COLUMN_TYPE.NUMBER,
    },
  },
  LOGIC: {
    AND: {
      pgsql: (...args) => `${args.join(' and ')}`,
      params: [
        {
          name: 'first condition',
          type: COLUMN_TYPE.BOOLEAN,
        },
        {
          name: 'other conditions',
          type: COLUMN_TYPE.BOOLEAN,
          required: false,
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
      pgsql: (condition, resultIfTrue, resultIfFalse) => `case when ${condition} then ${resultIfTrue} else ${resultIfFalse} end`,
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
        let ifsRequest = 'case'
        for (let index = 0; index < args.length; index += 2) {
          const condition = args[index]
          const result = args[index + 1]
          ifsRequest += ` when ${condition} then ${result}`
        }
        ifsRequest += ' end'
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
    SWITCH: {
      pgsql: (expression, ...args) => {
        // Add expression
        let switchRequest = `case ${expression}`
        // Add the switch cases
        for (let index = 0; index < args.length; index += 2) {
          const condition = args[index]
          const result = args[index + 1]
          if (result) switchRequest += ` when ${condition} then ${result}`
        }
        // Add the default case if specified
        if (args.length % 2 === 1) {
          switchRequest += ` else ${args[args.length - 1]}`
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
          name: 'first condition',
          type: COLUMN_TYPE.BOOLEAN,
        },
        {
          name: 'other conditions',
          type: COLUMN_TYPE.BOOLEAN,
          required: false,
          multiple: true,
        },
      ],
      returnType: COLUMN_TYPE.BOOLEAN,
    },
  },
  NUMERIC: {
    ABS: {
      pgsql: (n) => `abs(${n})`,
      params: [
        {
          name: 'number',
          type: NUMERIC_TYPES,
        },
      ],
      returnType: COLUMN_TYPE.FLOAT,
    },
    AVERAGE: {
      pgsql: (...args) => `(${args.join('+')}) / ${args.length.toFixed(1)}`,
      params: [
        {
          name: 'first number',
          type: NUMERIC_TYPES,
        },
        {
          name: 'others numbers',
          type: NUMERIC_TYPES,
          required: false,
          multiple: true,
        },
      ],
      returnType: COLUMN_TYPE.FLOAT,
    },
    CEILING: {
      pgsql: (n) => `ceiling(${n})`,
      params: [
        {
          name: 'number',
          type: NUMERIC_TYPES,
        },
      ],
      returnType: COLUMN_TYPE.NUMBER,
    },
    DIVIDE: {
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      pgsql: (firstNumber, ...others) => firstNumber + others.map(nb => `/(case when ${nb} <> 0 then ${nb} end)`),
      params: [
        {
          name: 'first number',
          type: NUMERIC_TYPES,
        },
        {
          name: 'others numbers',
          type: NUMERIC_TYPES,
          required: false,
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
      pgsql: (n1, n2) => `${n1}=${n2}`,
      params: [
        {
          name: 'first number',
          type: NUMERIC_TYPES,
        },
        {
          name: 'second number',
          type: NUMERIC_TYPES,
        },
      ],
      returnType: COLUMN_TYPE.BOOLEAN,
    },
    // EXP: {
    //   pgsql: (n) => `exp(${n})`,
    //   params: [
    //     {
    //       name: 'number',
    //       type: NUMERIC_TYPES,
    //     },
    //   ],
    //   returnType: COLUMN_TYPE.FLOAT,
    // },
    FLOOR: {
      pgsql: (n) => `floor(${n})`,
      params: [
        {
          name: 'number',
          type: NUMERIC_TYPES,
        },
      ],
      returnType: COLUMN_TYPE.NUMBER,
    },
    GREATER: {
      pgsql: (n1, n2) => `${n1}>${n2}`,
      params: [
        {
          name: 'first number',
          type: NUMERIC_TYPES,
        },
        {
          name: 'second number',
          type: NUMERIC_TYPES,
        },
      ],
      returnType: COLUMN_TYPE.BOOLEAN,
    },
    GREATEREQ: {
      pgsql: (n1, n2) => `${n1}>=${n2}`,
      params: [
        {
          name: 'first number',
          type: NUMERIC_TYPES,
        },
        {
          name: 'second number',
          type: NUMERIC_TYPES,
        },
      ],
      returnType: COLUMN_TYPE.BOOLEAN,
    },
    INT: {
      pgsql: (n) => `round(${n})`,
      params: [
        {
          name: 'number',
          type: NUMERIC_TYPES,
        },
      ],
      returnType: COLUMN_TYPE.NUMBER,
    },
    LESS: {
      pgsql: (n1, n2) => `${n1}<${n2}`,
      params: [
        {
          name: 'first number',
          type: NUMERIC_TYPES,
        },
        {
          name: 'second number',
          type: NUMERIC_TYPES,
        },
      ],
      returnType: COLUMN_TYPE.BOOLEAN,
    },
    LESSEQ: {
      pgsql: (n1, n2) => `${n1}<=${n2}`,
      params: [
        {
          name: 'first number',
          type: NUMERIC_TYPES,
        },
        {
          name: 'second number',
          type: NUMERIC_TYPES,
        },
      ],
      returnType: COLUMN_TYPE.BOOLEAN,
    },
    LOG: {
      pgsql: (n, base) => `case when ${base} > 0 and ${n} > 0 then log(${base},${n}) else null end`,
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
          name: 'first number',
          type: NUMERIC_TYPES,
        },
        {
          name: 'others numbers',
          type: NUMERIC_TYPES,
          required: false,
          multiple: true,
        },
      ],
      returnType: COLUMN_TYPE.FLOAT,
    },
    MIN: {
      pgsql: (...numbers) => `least(${numbers.join(',')})`,
      params: [
        {
          name: 'first number',
          type: NUMERIC_TYPES,
        },
        {
          name: 'others numbers',
          type: NUMERIC_TYPES,
          required: false,
          multiple: true,
        },
      ],
      returnType: COLUMN_TYPE.FLOAT,
    },
    MOD: {
      pgsql: (n, divisor) => `case when ${divisor} <> 0 then mod(${n},${divisor})`,
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
    PI: {
      pgsql: () => 'pi()',
      returnType: COLUMN_TYPE.FLOAT,
    },
    // POWER: {
    //   pgsql: (n, power) => `power(${n}, ${power})`,
    //   params: [
    //     {
    //       name: 'number',
    //       type: NUMERIC_TYPES,
    //     },
    //     {
    //       name: 'power',
    //       type: NUMERIC_TYPES,
    //     },
    //   ],
    //   returnType: COLUMN_TYPE.FLOAT,
    // },
    PRODUCT: {
      pgsql: (...args) => args.join('*'),
      params: [
        {
          name: 'first number',
          type: NUMERIC_TYPES,
        },
        {
          name: 'others numbers',
          type: NUMERIC_TYPES,
          required: false,
          multiple: true,
        },
      ],
      returnType: COLUMN_TYPE.FLOAT,
    },
    ROUND: {
      pgsql: (n, digits) => `round(${n},${digits})`,
      params: [
        {
          name: 'number',
          type: NUMERIC_TYPES,
        },
        {
          name: 'digits number',
          type: COLUMN_TYPE.NUMBER,
        },
      ],
      returnType: COLUMN_TYPE.FLOAT,
    },
    SIGN: {
      pgsql: (n) => `sign(${n})`,
      params: [
        {
          name: 'number',
          type: NUMERIC_TYPES,
        },
      ],
      returnType: COLUMN_TYPE.NUMBER,
    },
    SQRT: {
      pgsql: (n) => `case when ${n} > 0 then sqrt(${n}) end`,
      params: [
        {
          name: 'number',
          type: NUMERIC_TYPES,
        },
      ],
      returnType: COLUMN_TYPE.FLOAT,
    },
    SUBTRACT: {
      pgsql: (...args) => args.join('-'),
      params: [
        {
          name: 'first number',
          type: NUMERIC_TYPES,
        },
        {
          name: 'others numbers',
          type: NUMERIC_TYPES,
          required: false,
          multiple: true,
        },
      ],
      returnType: COLUMN_TYPE.FLOAT,
    },
    SUM: {
      pgsql: (...args) => args.join('+'),
      params: [
        {
          name: 'first number',
          type: NUMERIC_TYPES,
        },
        {
          name: 'others numbers',
          type: NUMERIC_TYPES,
          required: false,
          multiple: true,
        },
      ],
      returnType: COLUMN_TYPE.FLOAT,
    },
    UNEQUAL: {
      pgsql: (n1, n2) => `${n1}<>${n2}`,
      params: [
        {
          name: 'first number',
          type: NUMERIC_TYPES,
        },
        {
          name: 'second number',
          type: NUMERIC_TYPES,
        },
      ],
      returnType: COLUMN_TYPE.BOOLEAN,
    },
  },
  TEXT: {
    CONCAT: {
      pgsql: (...args) => `concat(${args.join(',')})`,
      params: [
        {
          name: 'first string',
          type: TEXT_TYPES,
        },
        {
          name: 'other strings',
          type: TEXT_TYPES,
          required: false,
          multiple: true,
        },
      ],
      returnType: COLUMN_TYPE.TEXT,
    },
    EXACT: {
      pgsql: (str1, str2) => `${str1}=${str2}`,
      params: [
        {
          name: 'first string',
          type: TEXT_TYPES,
        },
        {
          name: 'second string',
          type: TEXT_TYPES,
        },
      ],
      returnType: COLUMN_TYPE.BOOLEAN,
    },
    FIND: {
      pgsql: (searchedString, searchAreaString) => `strpos(${searchAreaString},${searchedString})`,
      params: [
        {
          name: 'searched string',
          type: TEXT_TYPES,
        },
        {
          name: 'search area string',
          type: TEXT_TYPES,
        },
      ],
      returnType: COLUMN_TYPE.NUMBER,
    },
    LEFT: {
      pgsql: (str, n) => `left(${str},${n})`,
      params: [
        {
          name: 'string',
          type: TEXT_TYPES,
        },
        {
          name: 'count',
          type: COLUMN_TYPE.NUMBER,
        },
      ],
      returnType: COLUMN_TYPE.TEXT,
    },
    LEN: {
      pgsql: (str) => `length(${str})`,
      params: [
        {
          name: 'string',
          type: TEXT_TYPES,
        },
      ],
      returnType: COLUMN_TYPE.NUMBER,
    },
    LOWER: {
      pgsql: (str) => `lower(${str})`,
      params: [
        {
          name: 'string',
          type: TEXT_TYPES,
        },
      ],
      returnType: COLUMN_TYPE.TEXT,
    },
    MID: {
      pgsql: (str, startPos, count) => `case when ${count} > 0 then substr(${str},${startPos},${count}) end`,
      params: [
        {
          name: 'string',
          type: TEXT_TYPES,
        },
        {
          name: 'startPos',
          type: COLUMN_TYPE.NUMBER,
        },
        {
          name: 'count',
          type: COLUMN_TYPE.NUMBER,
        },
      ],
      returnType: COLUMN_TYPE.TEXT,
    },
    // NUMBERVALUE: {
    //   pgsql: (str, format) => `to_number(${str},${format})`,
    //   params: [
    //     {
    //       name: 'string',
    //       type: TEXT_TYPES,
    //     },
    //     {
    //       name: 'format',
    //       type: COLUMN_TYPE.STRING,
    //     },
    //   ],
    //   returnType: COLUMN_TYPE.FLOAT,
    // },
    REPLACE: {
      pgsql: (originalString, startPos, count, pattern) =>
        `case when ${startPos} > 0 then overlay(${originalString} placing ${pattern} from ${startPos} for ${count}) end`,
      params: [
        {
          name: 'string',
          type: TEXT_TYPES,
        },
        {
          name: 'startPos',
          type: COLUMN_TYPE.NUMBER,
        },
        {
          name: 'count',
          type: COLUMN_TYPE.NUMBER,
        },
        {
          name: 'pattern',
          type: TEXT_TYPES,
        },
      ],
      returnType: COLUMN_TYPE.TEXT,
    },
    REPT: {
      pgsql: (str, n) => `repeat(${str},${n})`,
      params: [
        {
          name: 'string',
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
      pgsql: (str, n) => `right(${str},${n})`,
      params: [
        {
          name: 'string',
          type: TEXT_TYPES,
        },
        {
          name: 'count',
          type: COLUMN_TYPE.NUMBER,
        },
      ],
      returnType: COLUMN_TYPE.TEXT,
    },
    SUBSTITUTE: {
      pgsql: (searchedString, originalString, newString) => `replace(${originalString},${searchedString},${newString})`,
      params: [
        {
          name: 'searchedString',
          type: TEXT_TYPES,
        },
        {
          name: 'originalString',
          type: TEXT_TYPES,
        },
        {
          name: 'newString',
          type: TEXT_TYPES,
        },
      ],
      returnType: COLUMN_TYPE.TEXT,
    },
    // TEXT: {
    //   pgsql: (number, format) => `to_char(${number},${format})`,
    //   params: [
    //     {
    //       name: 'number',
    //       type: NUMERIC_TYPES,
    //     },
    //     {
    //       name: 'string',
    //       type: COLUMN_TYPE.STRING,
    //     },
    //   ],
    //   returnType: COLUMN_TYPE.STRING,
    // },
    TEXTJOIN: {
      pgsql: (separator, ...strings) => `concat_ws(${separator},${strings.join(',')})`,
      params: [
        {
          name: 'separator',
          type: COLUMN_TYPE.STRING,
        },
        {
          name: 'first string',
          type: TEXT_TYPES,
        },
        {
          name: 'other strings',
          type: TEXT_TYPES,
          required: false,
          multiple: true,
        },
      ],
      returnType: COLUMN_TYPE.TEXT,
    },
    TRIM: {
      pgsql: (str) => `trim(from ${str})`,
      params: [
        {
          name: 'string',
          type: TEXT_TYPES,
        },
      ],
      returnType: COLUMN_TYPE.TEXT,
    },
    UPPER: {
      pgsql: (str) => `upper(${str})`,
      params: [
        {
          name: 'string',
          type: TEXT_TYPES,
        },
      ],
      returnType: COLUMN_TYPE.TEXT,
    },
  },
}
