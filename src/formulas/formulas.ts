import { COLUMN_TYPE } from '@locokit/lck-glossary'
import { fn, FunctionBuilder, raw, ref } from 'objection'
import { TableColumn } from '../models/tablecolumn.model'

interface IFormulaParameter {
  name: string;
  type: COLUMN_TYPE | COLUMN_TYPE[];
  required?: boolean; // true by default in the parser
  multiple?: boolean; // false by default in the parser
}

interface IFormula {
  pgsql: (...args : string[]) => string;
  params?: IFormulaParameter[];
  returnType: COLUMN_TYPE | COLUMN_TYPE[];
}

interface IParsedFormula {
  type: COLUMN_TYPE;
  value: string;
}

export type ColumnsReferences = Record<string, FunctionBuilder>

export const TEXT_TYPES = [
  COLUMN_TYPE.TEXT,
  COLUMN_TYPE.STRING,
  COLUMN_TYPE.GEOMETRY_POINT,
  COLUMN_TYPE.GEOMETRY_POLYGON,
  COLUMN_TYPE.GEOMETRY_LINESTRING,
  COLUMN_TYPE.URL,
  COLUMN_TYPE.USER,
  COLUMN_TYPE.GROUP,
  COLUMN_TYPE.RELATION_BETWEEN_TABLES,
  COLUMN_TYPE.MULTI_USER,
  COLUMN_TYPE.LOOKED_UP_COLUMN
]

const NUMERIC_TYPES = [COLUMN_TYPE.FLOAT, COLUMN_TYPE.NUMBER]

export const notImplementedInFormulaColumnTypes = [
  COLUMN_TYPE.FILE,
  COLUMN_TYPE.MULTI_GROUP,
  COLUMN_TYPE.SINGLE_SELECT,
  COLUMN_TYPE.MULTI_SELECT,
  COLUMN_TYPE.GEOMETRY_POINT,
  COLUMN_TYPE.GEOMETRY_POLYGON,
  COLUMN_TYPE.GEOMETRY_LINESTRING
]

export function getFormattedColumn (column: TableColumn) {
  const columnType = column.column_type_id === COLUMN_TYPE.FORMULA
    ? column.settings?.formula_type_id
    : column.column_type_id

  switch (columnType) {
    case COLUMN_TYPE.BOOLEAN:
      return ref(`data:${column.id}`).castBool()
    case COLUMN_TYPE.NUMBER:
      return ref(`data:${column.id}`).castInt()
    case COLUMN_TYPE.FLOAT:
      return ref(`data:${column.id}`).castDecimal()
    case COLUMN_TYPE.TEXT:
    case COLUMN_TYPE.STRING:
    case COLUMN_TYPE.URL:
      return ref(`data:${column.id}`).castText()
    case COLUMN_TYPE.DATE:
      return ref(`data:${column.id}`).castTo('date')
    case COLUMN_TYPE.USER:
    case COLUMN_TYPE.GROUP:
    case COLUMN_TYPE.RELATION_BETWEEN_TABLES:
    case COLUMN_TYPE.LOOKED_UP_COLUMN: // TODO get original type
    case COLUMN_TYPE.MULTI_USER:
      return ref(`data:${column.id}.value`).castText()
    default:
      return ref(`data:${column.id}`).castText()
  }
}

export function getColumnIdsFromFormula (formula: string): string[] {
  const regex = /(?<=COLUMN\.)([a-z0-9-]*)/g
  return formula.match(regex) || []
}

export function getColumnsReferences (columns: TableColumn[] = []): ColumnsReferences {
  // Create an object containing the columns references to use placeholders in the sql query
  const columnsReferences: ColumnsReferences = {}
  columns.forEach(column => {
    // Need to replace '-' by '_' because '-' is not a valid char in an alias
    columnsReferences[column.id.replace(/-/g, '_')] = getFormattedColumn(column)
  })
  return columnsReferences
}

export function getSQLRequestFromFormula (formula: IParsedFormula, columnsReferences: ColumnsReferences): FunctionBuilder {
  // Only cast the result if the result is a text
  const castResult = TEXT_TYPES.includes(formula.type) ? '::text' : ''
  return fn.coalesce(
    raw(`to_jsonb(${formula.value}${castResult})`, columnsReferences),
    raw("jsonb 'null'")
  )
}

// Formula
// A param is required and single by default
export const functions:Record<string, Record<string, IFormula>> = {
  NUMERIC: {
    ABS: {
      pgsql: (n) => `abs(${n})`,
      params: [
        {
          name: 'number',
          type: NUMERIC_TYPES
        }
      ],
      returnType: COLUMN_TYPE.FLOAT
    },
    CEILING: {
      pgsql: (n) => `ceiling(${n})`,
      params: [
        {
          name: 'number',
          type: NUMERIC_TYPES
        }
      ],
      returnType: COLUMN_TYPE.NUMBER
    },
    DIVIDE: {
      pgsql: (firstNumber, ...others) => {
        if (others.length === 0) {
          return firstNumber
        } else {
          return firstNumber + '/' + others.map(nb => `(case ${nb} when 0 then null else ${nb} end)`).join('/')
        }
      },
      params: [
        {
          name: 'first number',
          type: NUMERIC_TYPES
        },
        {
          name: 'others numbers',
          type: NUMERIC_TYPES,
          required: false,
          multiple: true
        }
      ],
      returnType: COLUMN_TYPE.FLOAT
    },
    E: {
      pgsql: () => 'exp(1)',
      returnType: COLUMN_TYPE.FLOAT
    },
    EQUAL: {
      pgsql: (n1, n2) => `${n1}=${n2}`,
      params: [
        {
          name: 'first number',
          type: NUMERIC_TYPES
        },
        {
          name: 'second number',
          type: NUMERIC_TYPES
        }
      ],
      returnType: COLUMN_TYPE.BOOLEAN
    },
    EXP: {
      pgsql: (n) => `exp(${n})`,
      params: [
        {
          name: 'number',
          type: NUMERIC_TYPES
        }
      ],
      returnType: COLUMN_TYPE.FLOAT
    },
    FLOOR: {
      pgsql: (n) => `floor(${n})`,
      params: [
        {
          name: 'number',
          type: NUMERIC_TYPES
        }
      ],
      returnType: COLUMN_TYPE.NUMBER
    },
    GREATERTHAN: {
      pgsql: (n1, n2) => `${n1}>${n2}`,
      params: [
        {
          name: 'first number',
          type: NUMERIC_TYPES
        },
        {
          name: 'second number',
          type: NUMERIC_TYPES
        }
      ],
      returnType: COLUMN_TYPE.BOOLEAN
    },
    GREATERTHANEQ: {
      pgsql: (n1, n2) => `${n1}>=${n2}`,
      params: [
        {
          name: 'first number',
          type: NUMERIC_TYPES
        },
        {
          name: 'second number',
          type: NUMERIC_TYPES
        }
      ],
      returnType: COLUMN_TYPE.BOOLEAN
    },
    INT: {
      pgsql: (n) => `round(${n})`,
      params: [
        {
          name: 'number',
          type: NUMERIC_TYPES
        }
      ],
      returnType: COLUMN_TYPE.NUMBER
    },
    LESSTHAN: {
      pgsql: (n1, n2) => `${n1}<${n2}`,
      params: [
        {
          name: 'first number',
          type: NUMERIC_TYPES
        },
        {
          name: 'second number',
          type: NUMERIC_TYPES
        }
      ],
      returnType: COLUMN_TYPE.BOOLEAN
    },
    LESSTHANEQ: {
      pgsql: (n1, n2) => `${n1}<=${n2}`,
      params: [
        {
          name: 'first number',
          type: NUMERIC_TYPES
        },
        {
          name: 'second number',
          type: NUMERIC_TYPES
        }
      ],
      returnType: COLUMN_TYPE.BOOLEAN
    },
    LOG: {
      pgsql: (n, base) => `log(${base},${n})`,
      params: [
        {
          name: 'number',
          type: NUMERIC_TYPES
        },
        {
          name: 'base',
          type: NUMERIC_TYPES
        }
      ],
      returnType: COLUMN_TYPE.FLOAT
    },
    MOD: {
      pgsql: (n, divisor) => `mod(${n},${divisor})`,
      params: [
        {
          name: 'number',
          type: NUMERIC_TYPES
        },
        {
          name: 'base',
          type: NUMERIC_TYPES
        }
      ],
      returnType: COLUMN_TYPE.FLOAT
    },
    PI: {
      pgsql: () => 'pi()',
      returnType: COLUMN_TYPE.FLOAT
    },
    POWER: {
      pgsql: (n, power) => `power(${n}, ${power})`,
      params: [
        {
          name: 'number',
          type: NUMERIC_TYPES
        },
        {
          name: 'power',
          type: NUMERIC_TYPES
        }
      ],
      returnType: COLUMN_TYPE.FLOAT
    },
    PRODUCT: {
      pgsql: (...args) => args.join('*'),
      params: [
        {
          name: 'first number',
          type: NUMERIC_TYPES
        },
        {
          name: 'second number',
          type: NUMERIC_TYPES
        },
        {
          name: 'others numbers',
          type: NUMERIC_TYPES,
          required: false,
          multiple: true
        }
      ],
      returnType: COLUMN_TYPE.FLOAT
    },
    ROUND: {
      pgsql: (n, digits) => `round(${n},${digits})`,
      params: [
        {
          name: 'number',
          type: NUMERIC_TYPES
        },
        {
          name: 'digits number',
          type: COLUMN_TYPE.NUMBER
        }
      ],
      returnType: COLUMN_TYPE.FLOAT
    },
    SIGN: {
      pgsql: (n) => `sign(${n})`,
      params: [
        {
          name: 'number',
          type: NUMERIC_TYPES
        }
      ],
      returnType: COLUMN_TYPE.NUMBER
    },
    SQRT: {
      pgsql: (n) => `sqrt(${n})`,
      params: [
        {
          name: 'number',
          type: NUMERIC_TYPES
        }
      ],
      returnType: [COLUMN_TYPE.NUMBER, COLUMN_TYPE.FLOAT]
    },
    SUBTRACT: {
      pgsql: (...args) => args.join('-'),
      params: [
        {
          name: 'first number',
          type: NUMERIC_TYPES
        },
        {
          name: 'second number',
          type: NUMERIC_TYPES
        },
        {
          name: 'others numbers',
          type: NUMERIC_TYPES,
          required: false,
          multiple: true
        }
      ],
      returnType: COLUMN_TYPE.FLOAT
    },
    SUM: {
      pgsql: (...args) => args.join('+'),
      params: [
        {
          name: 'first number',
          type: NUMERIC_TYPES
        },
        {
          name: 'second number',
          type: NUMERIC_TYPES
        },
        {
          name: 'others numbers',
          type: NUMERIC_TYPES,
          required: false,
          multiple: true
        }
      ],
      returnType: COLUMN_TYPE.FLOAT
    },
    UNEQUAL: {
      pgsql: (n1, n2) => `${n1}<>${n2}`,
      params: [
        {
          name: 'first number',
          type: NUMERIC_TYPES
        },
        {
          name: 'second number',
          type: NUMERIC_TYPES
        }
      ],
      returnType: COLUMN_TYPE.BOOLEAN
    }
  },
  TEXT: {
    CONCAT: {
      pgsql: (...args) => `concat(${args.join(',')})`,
      params: [
        {
          name: 'first string',
          type: TEXT_TYPES
        },
        {
          name: 'second string',
          type: TEXT_TYPES
        },
        {
          name: 'other strings',
          type: TEXT_TYPES,
          required: false,
          multiple: true
        }
      ],
      returnType: COLUMN_TYPE.TEXT
    },
    EXACT: {
      pgsql: (str1, str2) => `${str1}=${str2}`,
      params: [
        {
          name: 'first string',
          type: TEXT_TYPES
        },
        {
          name: 'second string',
          type: TEXT_TYPES
        }
      ],
      returnType: COLUMN_TYPE.BOOLEAN
    },
    FIND: {
      pgsql: (searchedString, searchAreaString) => `strpos(${searchAreaString},${searchedString})`,
      params: [
        {
          name: 'searched string',
          type: TEXT_TYPES
        },
        {
          name: 'search area string',
          type: TEXT_TYPES
        }
      ],
      returnType: COLUMN_TYPE.NUMBER
    },
    LEFT: {
      pgsql: (str, n) => `left(${str},${n})`,
      params: [
        {
          name: 'string',
          type: TEXT_TYPES
        },
        {
          name: 'count',
          type: COLUMN_TYPE.NUMBER
        }
      ],
      returnType: COLUMN_TYPE.TEXT
    },
    LEN: {
      pgsql: (str) => `length(${str})`,
      params: [
        {
          name: 'string',
          type: TEXT_TYPES
        }
      ],
      returnType: COLUMN_TYPE.NUMBER
    },
    LOWER: {
      pgsql: (str) => `lower(${str})`,
      params: [
        {
          name: 'string',
          type: TEXT_TYPES
        }
      ],
      returnType: COLUMN_TYPE.TEXT
    },
    MID: {
      pgsql: (str, startPos, count) => `substr(${str},${startPos},${count})`,
      params: [
        {
          name: 'string',
          type: TEXT_TYPES
        },
        {
          name: 'startPos',
          type: COLUMN_TYPE.NUMBER
        },
        {
          name: 'count',
          type: COLUMN_TYPE.NUMBER
        }
      ],
      returnType: COLUMN_TYPE.TEXT
    },
    NUMBERVALUE: {
      pgsql: (str, format) => `to_number(${str},${format})`,
      params: [
        {
          name: 'string',
          type: TEXT_TYPES
        },
        {
          name: 'format',
          type: COLUMN_TYPE.STRING
        }
      ],
      returnType: [COLUMN_TYPE.NUMBER, COLUMN_TYPE.FLOAT]
    },
    REPLACE: {
      pgsql: (originalString, startPos, count, pattern) => `overlay(${originalString} placing ${pattern} from ${startPos} for ${count})`,
      params: [
        {
          name: 'string',
          type: TEXT_TYPES
        },
        {
          name: 'startPos',
          type: COLUMN_TYPE.NUMBER
        },
        {
          name: 'count',
          type: COLUMN_TYPE.NUMBER
        },
        {
          name: 'pattern',
          type: TEXT_TYPES
        }
      ],
      returnType: COLUMN_TYPE.TEXT
    },
    REPT: {
      pgsql: (str, n) => `repeat(${str},${n})`,
      params: [
        {
          name: 'string',
          type: TEXT_TYPES
        },
        {
          name: 'number',
          type: COLUMN_TYPE.NUMBER
        }
      ],
      returnType: COLUMN_TYPE.TEXT
    },
    RIGHT: {
      pgsql: (str, n) => `right(${str},${n})`,
      params: [
        {
          name: 'string',
          type: TEXT_TYPES
        },
        {
          name: 'count',
          type: COLUMN_TYPE.NUMBER
        }
      ],
      returnType: COLUMN_TYPE.TEXT
    },
    SUBSTITUTE: {
      pgsql: (searchedString, originalString, newString) => `replace(${originalString},${searchedString},${newString})`,
      params: [
        {
          name: 'searchedString',
          type: TEXT_TYPES
        },
        {
          name: 'originalString',
          type: TEXT_TYPES
        },
        {
          name: 'newString',
          type: TEXT_TYPES
        }
      ],
      returnType: COLUMN_TYPE.TEXT
    },
    TEXT: {
      pgsql: (number, format) => `to_char(${number},${format})`,
      params: [
        {
          name: 'number',
          type: NUMERIC_TYPES
        },
        {
          name: 'string',
          type: COLUMN_TYPE.STRING
        }
      ],
      returnType: COLUMN_TYPE.STRING
    },
    TEXTJOIN: {
      pgsql: (separator, ...strings) => `concat_ws(${separator},${strings.join(',')})`,
      params: [
        {
          name: 'separator',
          type: COLUMN_TYPE.STRING
        },
        {
          name: 'first string',
          type: TEXT_TYPES
        },
        {
          name: 'second string',
          type: TEXT_TYPES
        },
        {
          name: 'other strings',
          type: TEXT_TYPES,
          required: false,
          multiple: true
        }
      ],
      returnType: COLUMN_TYPE.TEXT
    },
    TRIM: {
      pgsql: (str) => `trim(from ${str})`,
      params: [
        {
          name: 'string',
          type: TEXT_TYPES
        }
      ],
      returnType: COLUMN_TYPE.TEXT
    },
    UPPER: {
      pgsql: (str) => `upper(${str})`,
      params: [
        {
          name: 'string',
          type: TEXT_TYPES
        }
      ],
      returnType: COLUMN_TYPE.TEXT
    }
  },
  BOOLEAN: {
    AND: {
      pgsql: (...args) => `${args.join(' and ')}`,
      params: [
        {
          name: 'first condition',
          type: COLUMN_TYPE.BOOLEAN
        },
        {
          name: 'second condition',
          type: COLUMN_TYPE.BOOLEAN
        },
        {
          name: 'other conditions',
          type: COLUMN_TYPE.BOOLEAN,
          required: false,
          multiple: true
        }
      ],
      returnType: COLUMN_TYPE.BOOLEAN
    },
    NOT: {
      pgsql: (condition) => `not(${condition})`,
      params: [
        {
          name: 'condition',
          type: COLUMN_TYPE.BOOLEAN
        }
      ],
      returnType: COLUMN_TYPE.BOOLEAN
    }
  },
  DATE: {
    DATEADD: {
      pgsql: (date, number, unit) => `${date} + interval ''`,
      params: [
        {
          name: 'date',
          type: COLUMN_TYPE.DATE
        },
        {
          name: 'number',
          type: COLUMN_TYPE.NUMBER
        },
        {
          name: 'unit',
          type: COLUMN_TYPE.STRING
        }
      ],
      returnType: COLUMN_TYPE.DATE
    },
    DAY: {
      pgsql: (date) => `date_part('day', ${date})`,
      params: [
        {
          name: 'date',
          type: COLUMN_TYPE.DATE
        }
      ],
      returnType: COLUMN_TYPE.NUMBER
    }
  }
}
