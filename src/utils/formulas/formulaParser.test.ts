import { COLUMN_TYPE } from '@locokit/lck-glossary'
import { TableColumn } from '../../models/tablecolumn.model'
import { database } from '../../models/database.model'
import { Table } from '../../models/table.model'
import { workspace } from '../../models/workspace.model'
import app from '../../app'
import { parse } from './formulaParser'

describe('Formula parser', () => {
  describe('integer values', () => {
    it('positive number', () => {
      const parsedFormula = parse('10', { columnsTypes: COLUMN_TYPE })
      expect(parsedFormula.value).toBe('10')
      expect(parsedFormula.type).toBe(COLUMN_TYPE.NUMBER)
    })
    it('negative number', () => {
      const parsedFormula = parse('-10', { columnsTypes: COLUMN_TYPE })
      expect(parsedFormula.value).toBe('-10')
      expect(parsedFormula.type).toBe(COLUMN_TYPE.NUMBER)
    })
    it('throw an error if the number has no digit', () => {
      expect(() => {
        parse('-')
      }).toThrow()
    })
  })
  describe('decimal values', () => {
    it('positive number', () => {
      const parsedFormula = parse('10.0', { columnsTypes: COLUMN_TYPE })
      expect(parsedFormula.value).toBe('10.0')
      expect(parsedFormula.type).toBe(COLUMN_TYPE.FLOAT)
    })
    it('negative number', () => {
      const parsedFormula = parse('-10.0', { columnsTypes: COLUMN_TYPE })
      expect(parsedFormula.value).toBe('-10.0')
      expect(parsedFormula.type).toBe(COLUMN_TYPE.FLOAT)
    })
    it('throw an error if the decimal part has no digit', () => {
      expect(() => {
        parse('10.')
      }).toThrow()
    })
  })
  describe('string values', () => {
    it('can contain lowercase letters', () => {
      const parsedFormula = parse('"abc"', { columnsTypes: COLUMN_TYPE })
      expect(parsedFormula.value).toBe("'abc'")
      expect(parsedFormula.type).toBe(COLUMN_TYPE.STRING)
    })
    it('can contain uppercase letters', () => {
      const parsedFormula = parse('"ABC"', { columnsTypes: COLUMN_TYPE })
      expect(parsedFormula.value).toBe("'ABC'")
      expect(parsedFormula.type).toBe(COLUMN_TYPE.STRING)
    })
    it('can contain numbers', () => {
      const parsedFormula = parse('"-10.2"', { columnsTypes: COLUMN_TYPE })
      expect(parsedFormula.value).toBe("'-10.2'")
      expect(parsedFormula.type).toBe(COLUMN_TYPE.STRING)
    })
    it('can contain some special characters', () => {
      const specialChars = '€!#$%&()*{}+,-./:;<=>?@[\\]^_`|~'
      const parsedFormula = parse(`"${specialChars}"`, { columnsTypes: COLUMN_TYPE })
      expect(parsedFormula.value).toBe(`'${specialChars}'`)
      expect(parsedFormula.type).toBe(COLUMN_TYPE.STRING)
    })
    it('can contain whitespace', () => {
      const parsedFormula = parse('" "', { columnsTypes: COLUMN_TYPE })
      expect(parsedFormula.value).toBe("' '")
      expect(parsedFormula.type).toBe(COLUMN_TYPE.STRING)
    })
    it('can contain \\n', () => {
      const parsedFormula = parse('"\n"', { columnsTypes: COLUMN_TYPE })
      expect(parsedFormula.value).toBe("'\n'")
      expect(parsedFormula.type).toBe(COLUMN_TYPE.STRING)
    })
    it('can contain \\t', () => {
      const parsedFormula = parse('"\t"', { columnsTypes: COLUMN_TYPE })
      expect(parsedFormula.value).toBe("'\t'")
      expect(parsedFormula.type).toBe(COLUMN_TYPE.STRING)
    })
    it('can contain \\r', () => {
      const parsedFormula = parse('"\r"', { columnsTypes: COLUMN_TYPE })
      expect(parsedFormula.value).toBe("'\r'")
      expect(parsedFormula.type).toBe(COLUMN_TYPE.STRING)
    })
    it('can contain single quote', () => {
      const parsedFormula = parse('"\'"', { columnsTypes: COLUMN_TYPE })
      expect(parsedFormula.value).toBe("''''")
      expect(parsedFormula.type).toBe(COLUMN_TYPE.STRING)
    })
    it('can contain a mix of the previous elements', () => {
      const parsedFormula = parse('"Aa- 1+\n\t\r\'"', { columnsTypes: COLUMN_TYPE })
      expect(parsedFormula.value).toBe("'Aa- 1+\n\t\r'''")
      expect(parsedFormula.type).toBe(COLUMN_TYPE.STRING)
    })
    it('can not contain a double quote', () => {
      expect(() => {
        parse('"""')
      }).toThrow()
    })
  })
  describe('column values', () => {
    let workspace: workspace
    let database: database
    let table: Table
    let stringColumn: TableColumn
    let singleSelectColumn: TableColumn
    let singleSelectColumnWithoutSettings: TableColumn
    let allColumns: Record<string, TableColumn>

    beforeAll(async () => {
      // Create workspace and database
      workspace = await app.service('workspace').create({ text: 'workspace1' })
      database = await app.service('database').create({ text: 'database1', workspace_id: workspace.id })
      // Create tables
      table = await app.service('table').create({
        text: 'table',
        database_id: database.id,
      })
      // Create columns
      // String column
      stringColumn = await app.service('column').create({
        text: 'string_column',
        column_type_id: COLUMN_TYPE.STRING,
        table_id: table.id,
      })
      // Single select column
      singleSelectColumn = await app.service('column').create({
        text: 'single_select_column',
        column_type_id: COLUMN_TYPE.SINGLE_SELECT,
        table_id: table.id,
        settings: {
          values: {
            idA: { label: 'mylabelA', color: 'white', backgroundColor: 'black' },
            idB: { label: 'mylabelB', color: 'white', backgroundColor: 'black' },
          },
        },
      })
      singleSelectColumnWithoutSettings = await app.service('column').create({
        text: 'single_select_column_without_settings',
        column_type_id: COLUMN_TYPE.SINGLE_SELECT,
        table_id: table.id,
        settings: {},
      })
      // Available columns
      allColumns = {
        [stringColumn.id]: stringColumn,
        [singleSelectColumn.id]: singleSelectColumn,
        [singleSelectColumnWithoutSettings.id]: singleSelectColumnWithoutSettings,
      }
    })

    afterAll(async () => {
      await app.service('column').remove(singleSelectColumn.id)
      await app.service('column').remove(singleSelectColumnWithoutSettings.id)
      await app.service('column').remove(stringColumn.id)
      await app.service('table').remove(table.id)
      await app.service('database').remove(database.id)
      await app.service('workspace').remove(workspace.id)
    })

    it('throw an error is the specified column is unknown', () => {
      expect(() => {
        parse('COLUMN.unknown-column', { columnsTypes: COLUMN_TYPE, columns: allColumns })
      }).toThrow('One column is invalid.')
    })
    it('return the correct value and type for a string column', () => {
      const parsedFormula = parse(`COLUMN.${stringColumn.id}`, { columnsTypes: COLUMN_TYPE, columns: allColumns })
      expect(parsedFormula.value).toBe(`:${stringColumn.id.replace(/-/g, '_')}:`)
      expect(parsedFormula.type).toBe(COLUMN_TYPE.STRING)
    })
    it('return the correct value and type for a single select column', () => {
      const parsedFormula = parse(`COLUMN.${singleSelectColumn.id}`, { columnsTypes: COLUMN_TYPE, columns: allColumns })
      expect(parsedFormula.value).toBe(
        `('{"idA":"mylabelA","idB":"mylabelB"}'::json->>:${singleSelectColumn.id.replace(/-/g, '_')}:)`,
      )
      expect(parsedFormula.type).toBe(COLUMN_TYPE.SINGLE_SELECT)
    })
    it('return the correct value and type for a single select column without settings', () => {
      const parsedFormula = parse(`COLUMN.${singleSelectColumnWithoutSettings.id}`, { columnsTypes: COLUMN_TYPE, columns: allColumns })
      expect(parsedFormula.value).toBe(
        `('{}'::json->>:${singleSelectColumnWithoutSettings.id.replace(/-/g, '_')}:)`,
      )
      expect(parsedFormula.type).toBe(COLUMN_TYPE.SINGLE_SELECT)
    })
  })
  describe('function values', () => {
    const functions = {
      NUMERIC: {
        PI: {
          pgsql: () => '3.14',
          returnType: COLUMN_TYPE.FLOAT,
        },
        ABS: {
          pgsql: (n: string) => `abs(${n})`,
          params: [
            {
              name: 'number',
              type: COLUMN_TYPE.FLOAT,
            },
          ],
          returnType: COLUMN_TYPE.FLOAT,
        },
        SUM: {
          pgsql: (n1: string, n2: string) => `${n1}${n2 ? '+' + n2 : ''}`,
          params: [
            {
              name: 'number1',
              type: COLUMN_TYPE.FLOAT,
            },
            {
              name: 'number2',
              type: COLUMN_TYPE.FLOAT,
              required: false,
            },
          ],
          returnType: COLUMN_TYPE.FLOAT,
        },
        PRODUCT: {
          pgsql: (...args: string[]) => args.join('*'),
          params: [
            {
              name: 'number1',
              type: COLUMN_TYPE.FLOAT,
            },
            {
              name: 'numbers',
              type: COLUMN_TYPE.FLOAT,
              multiple: true,
              required: false,
            },
          ],
          returnType: COLUMN_TYPE.FLOAT,
        },
        FUNCTIONWITHMULTIPLEREQUIRED: {
          pgsql: (...args: string[]) => args.join('*'),
          params: [
            {
              name: 'numbers',
              type: COLUMN_TYPE.NUMBER,
              multiple: true,
            },
          ],
          returnType: COLUMN_TYPE.NUMBER,
        },
        FUNCTIONWITHMULTIPLEREQUIREDANDMORESIMILAR: {
          pgsql: (...args: string[]) => args.join('*'),
          params: [
            {
              name: 'numbers',
              type: COLUMN_TYPE.NUMBER,
              multiple: true,
            },
            {
              name: 'otherArg',
              type: COLUMN_TYPE.NUMBER,
              required: true,
            },
          ],
          returnType: COLUMN_TYPE.NUMBER,
        },
        FUNCTIONWITHMULTIPLEREQUIREDANDMOREDIFF: {
          pgsql: (...args: string[]) => args.join('*'),
          params: [
            {
              name: 'numbers',
              type: COLUMN_TYPE.NUMBER,
              multiple: true,
            },
            {
              name: 'otherArg',
              type: COLUMN_TYPE.STRING,
            },
          ],
          returnType: COLUMN_TYPE.NUMBER,
        },
        FUNCTIONWITHDEFAULT: {
          pgsql: (...args: string[]) => args.join('|'),
          params: [
            {
              name: 'number1',
              type: COLUMN_TYPE.NUMBER,
            },
            {
              name: 'numbers',
              type: COLUMN_TYPE.NUMBER,
              multiple: true,
              required: false,
            },
            {
              name: 'default',
              type: COLUMN_TYPE.STRING,
            },
          ],
          returnType: COLUMN_TYPE.STRING,
        },
        FUNCTIONWITHOPT: {
          pgsql: (arg: string) => arg ?? 0,
          params: [
            {
              name: 'optional',
              type: COLUMN_TYPE.NUMBER,
              required: false,
            },
          ],
          returnType: COLUMN_TYPE.NUMBER,
        },
        FUNCTIONWITHRELATEDPARAMS: {
          pgsql: () => 'value',
          params: [
            [
              {
                name: 'condition',
                type: COLUMN_TYPE.NUMBER,
              },
              {
                name: 'result',
                type: COLUMN_TYPE.STRING,
              },
            ],
          ],
          returnType: COLUMN_TYPE.STRING,
        },
        FUNCTIONWITHRELATEDPARAMSANDMORESIMILAR: {
          pgsql: () => 'value',
          params: [
            [
              {
                name: 'condition',
                type: COLUMN_TYPE.NUMBER,
              },
              {
                name: 'result',
                type: COLUMN_TYPE.STRING,
              },
            ],
            {
              name: 'otherArg',
              type: COLUMN_TYPE.NUMBER,
              required: true,
            },
            {
              name: 'lastArg',
              type: COLUMN_TYPE.STRING,
              required: true,
            },
          ],
          returnType: COLUMN_TYPE.STRING,
        },
        FUNCTIONWITHRELATEDPARAMSANDMOREDIFF: {
          pgsql: () => 'value',
          params: [
            [
              {
                name: 'condition',
                type: COLUMN_TYPE.NUMBER,
              },
              {
                name: 'result',
                type: COLUMN_TYPE.STRING,
              },
            ],
            {
              name: 'otherArg',
              type: COLUMN_TYPE.NUMBER,
              required: true,
            },
            {
              name: 'lastArg',
              type: COLUMN_TYPE.FLOAT,
              required: true,
            },
          ],
          returnType: COLUMN_TYPE.STRING,
        },
        FUNCTIONWITHOUTSQL: {
          returnType: COLUMN_TYPE.NUMBER,
        },
        FUNCTIONWITHOUTRETURNTYPE: {
          pgsql: () => 'myfunction',
        },
      },
    }
    describe('unknown function ', () => {
      it('throw an error if the category is unknown', () => {
        expect(() => {
          parse('CATEGORY.PI()', { columnsTypes: COLUMN_TYPE, functions })
        }).toThrow("the 'CATEGORY.PI' function doesn't exist.")
      })
      it('throw an error if the function is unknown', () => {
        expect(() => {
          parse('NUMERIC.PI2()', { columnsTypes: COLUMN_TYPE, functions })
        }).toThrow("the 'NUMERIC.PI2' function doesn't exist.")
      })
    })
    describe('not well configured function', () => {
      it('throw an error if the related sql code is not specified', () => {
        expect(() => {
          parse('NUMERIC.FUNCTIONWITHOUTSQL()', { columnsTypes: COLUMN_TYPE, functions })
        }).toThrow("the 'NUMERIC.FUNCTIONWITHOUTSQL' function isn't well configured.")
      })
      it('throw an error if the return type is not specified', () => {
        expect(() => {
          parse('NUMERIC.FUNCTIONWITHOUTRETURNTYPE()', { columnsTypes: COLUMN_TYPE, functions })
        }).toThrow("the 'NUMERIC.FUNCTIONWITHOUTRETURNTYPE' function isn't well configured.")
      })
    })
    describe('correct type and value', () => {
      it('for a function without documentation parameter', () => {
        const parsedFormula = parse('NUMERIC.PI()', { columnsTypes: COLUMN_TYPE, functions })
        expect(parsedFormula.value).toBe('(3.14)')
        expect(parsedFormula.type).toBe(COLUMN_TYPE.FLOAT)
      })
      it('for a function with one required parameter', () => {
        const parsedFormula = parse('NUMERIC.ABS(-10.2)', { columnsTypes: COLUMN_TYPE, functions })
        expect(parsedFormula.value).toBe('(abs(-10.2))')
        expect(parsedFormula.type).toBe(COLUMN_TYPE.FLOAT)
      })
      it('for a function with two parameters, one required and one facultative (specified)', () => {
        const parsedFormula = parse('NUMERIC.SUM(10.0,0.0)', { columnsTypes: COLUMN_TYPE, functions })
        expect(parsedFormula.value).toBe('(10.0+0.0)')
        expect(parsedFormula.type).toBe(COLUMN_TYPE.FLOAT)
      })
      it('for a function with two parameters, one required and one facultative (not specified)', () => {
        const parsedFormula = parse('NUMERIC.SUM(10.0)', { columnsTypes: COLUMN_TYPE, functions })
        expect(parsedFormula.value).toBe('(10.0)')
        expect(parsedFormula.type).toBe(COLUMN_TYPE.FLOAT)
      })
      it('for a function with two parameters, one required and one multiple (not required and not specified)', () => {
        const parsedFormula = parse('NUMERIC.PRODUCT(10.0)', { columnsTypes: COLUMN_TYPE, functions })
        expect(parsedFormula.value).toBe('(10.0)')
        expect(parsedFormula.type).toBe(COLUMN_TYPE.FLOAT)
      })
      it('for a function with two parameters, one required and one multiple (specified but not required)', () => {
        const parsedFormula = parse('NUMERIC.PRODUCT(10.0,20.0,30.0,40.0)', { columnsTypes: COLUMN_TYPE, functions })
        expect(parsedFormula.value).toBe('(10.0*20.0*30.0*40.0)')
        expect(parsedFormula.type).toBe(COLUMN_TYPE.FLOAT)
      })
      it('for a function with three parameters, one required, one multiple (specified but not required) and one required', () => {
        const parsedFormula = parse('NUMERIC.FUNCTIONWITHDEFAULT(10,20,30,40,"string")', { columnsTypes: COLUMN_TYPE, functions })
        expect(parsedFormula.value).toBe("(10|20|30|40|'string')")
        expect(parsedFormula.type).toBe(COLUMN_TYPE.STRING)
      })
      it('for a function with three parameters, one required, one multiple (not required and not specified) and one required', () => {
        const parsedFormula = parse('NUMERIC.FUNCTIONWITHDEFAULT(10,"string")', { columnsTypes: COLUMN_TYPE, functions })
        expect(parsedFormula.value).toBe("(10|'string')")
        expect(parsedFormula.type).toBe(COLUMN_TYPE.STRING)
      })
      it('for a function with a multiple and required parameter, specified one time', () => {
        const parsedFormula = parse('NUMERIC.FUNCTIONWITHMULTIPLEREQUIRED(10)', { columnsTypes: COLUMN_TYPE, functions })
        expect(parsedFormula.value).toBe('(10)')
        expect(parsedFormula.type).toBe(COLUMN_TYPE.NUMBER)
      })
      it('for a function with a multiple and required parameter, specified several times', () => {
        const parsedFormula = parse('NUMERIC.FUNCTIONWITHMULTIPLEREQUIRED(10,10)', { columnsTypes: COLUMN_TYPE, functions })
        expect(parsedFormula.value).toBe('(10*10)')
        expect(parsedFormula.type).toBe(COLUMN_TYPE.NUMBER)
      })
      it('for a function with two parameters, one multiple and required parameter and one another required one, with a different type', () => {
        const parsedFormula = parse('NUMERIC.FUNCTIONWITHMULTIPLEREQUIREDANDMOREDIFF(10,10,"string")', { columnsTypes: COLUMN_TYPE, functions })
        expect(parsedFormula.value).toBe("(10*10*'string')")
        expect(parsedFormula.type).toBe(COLUMN_TYPE.NUMBER)
      })
      it('for a function with an optional parameter (specified)', () => {
        const parsedFormula = parse('NUMERIC.FUNCTIONWITHOPT(10)', { columnsTypes: COLUMN_TYPE, functions })
        expect(parsedFormula.value).toBe('(10)')
        expect(parsedFormula.type).toBe(COLUMN_TYPE.NUMBER)
      })
      it('for a function with an optional parameter (not specified)', () => {
        const parsedFormula = parse('NUMERIC.FUNCTIONWITHOPT()', { columnsTypes: COLUMN_TYPE, functions })
        expect(parsedFormula.value).toBe('(0)')
        expect(parsedFormula.type).toBe(COLUMN_TYPE.NUMBER)
      })
      it('for a function with related parameters that are specified once', () => {
        const parsedFormula = parse('NUMERIC.FUNCTIONWITHRELATEDPARAMS(10, "string")', { columnsTypes: COLUMN_TYPE, functions })
        expect(parsedFormula.value).toBe('(value)')
        expect(parsedFormula.type).toBe(COLUMN_TYPE.STRING)
      })
      it('for a function with related parameters that are specified several times', () => {
        const parsedFormula = parse('NUMERIC.FUNCTIONWITHRELATEDPARAMS(10, "string1", 20, "string2")', { columnsTypes: COLUMN_TYPE, functions })
        expect(parsedFormula.value).toBe('(value)')
        expect(parsedFormula.type).toBe(COLUMN_TYPE.STRING)
      })
      it('for a function with related parameters that are specified several times', () => {
        const parsedFormula = parse('NUMERIC.FUNCTIONWITHRELATEDPARAMS(10, "string1", 20, "string2")', { columnsTypes: COLUMN_TYPE, functions })
        expect(parsedFormula.value).toBe('(value)')
        expect(parsedFormula.type).toBe(COLUMN_TYPE.STRING)
      })
      it('for a function with related parameters that are specified one time and others ones different after', () => {
        const parsedFormula = parse('NUMERIC.FUNCTIONWITHRELATEDPARAMSANDMOREDIFF(10, "string1", 20, 10.0)', { columnsTypes: COLUMN_TYPE, functions })
        expect(parsedFormula.value).toBe('(value)')
        expect(parsedFormula.type).toBe(COLUMN_TYPE.STRING)
      })
    })
    describe('throw an error', () => {
      it('if too much parameters are passed', () => {
        expect(() => {
          parse('NUMERIC.ABS(10.0, 20.0)', { columnsTypes: COLUMN_TYPE, functions })
        }).toThrow('the arguments of the \'NUMERIC.ABS\' function are invalid.')
      })
      it('if too few parameters are passed', () => {
        expect(() => {
          parse('NUMERIC.ABS()', { columnsTypes: COLUMN_TYPE, functions })
        }).toThrow('the \'number\' argument of the \'NUMERIC.ABS\' function is missing.')
      })
      it('if one parameter is pass to a function which has not got any one', () => {
        expect(() => {
          parse('NUMERIC.PI(1)', { columnsTypes: COLUMN_TYPE, functions })
        }).toThrow('the arguments of the \'NUMERIC.PI\' function are invalid.')
      })
      it('if a required parameter has not the correct type', () => {
        expect(() => {
          parse('NUMERIC.ABS("string")', { columnsTypes: COLUMN_TYPE, functions })
        }).toThrow('the \'number\' argument of the \'NUMERIC.ABS\' function is invalid.')
      })
      it('if a multiple parameter has not the correct type', () => {
        expect(() => {
          parse('NUMERIC.PRODUCT(10.0,20.0,"string")', { columnsTypes: COLUMN_TYPE, functions })
        }).toThrow('the \'numbers\' argument of the \'NUMERIC.PRODUCT\' function is invalid.')
      })
      it('if a required parameter after a multiple one has not the correct type', () => {
        expect(() => {
          parse('NUMERIC.FUNCTIONWITHDEFAULT(10,20,10.0)', { columnsTypes: COLUMN_TYPE, functions })
        }).toThrow('the \'default\' argument of the \'NUMERIC.FUNCTIONWITHDEFAULT\' function is invalid.')
      })
      it('if an optional parameter has not the correct type', () => {
        expect(() => {
          parse('NUMERIC.FUNCTIONWITHOPT(10.0)', { columnsTypes: COLUMN_TYPE, functions })
        }).toThrow('the \'optional\' argument of the \'NUMERIC.FUNCTIONWITHOPT\' function is invalid.')
      })
      it('if one related parameter is missing', () => {
        expect(() => {
          parse('NUMERIC.FUNCTIONWITHRELATEDPARAMS(10, "string2", 20)', { columnsTypes: COLUMN_TYPE, functions })
        }).toThrow('the arguments of the \'NUMERIC.FUNCTIONWITHRELATEDPARAMS\' function are invalid.')
      })
      it('if one of the first related parameters is incorrect', () => {
        expect(() => {
          parse('NUMERIC.FUNCTIONWITHRELATEDPARAMS(10, 10.0)', { columnsTypes: COLUMN_TYPE, functions })
        }).toThrow('the \'result\' argument of the \'NUMERIC.FUNCTIONWITHRELATEDPARAMS\' function is invalid.')
      })
      it('if one of the related parameters is incorrect whereas the first ones are correct', () => {
        expect(() => {
          parse('NUMERIC.FUNCTIONWITHRELATEDPARAMS(10, "string", 20, 20.0)', { columnsTypes: COLUMN_TYPE, functions })
        }).toThrow('the arguments of the \'NUMERIC.FUNCTIONWITHRELATEDPARAMS\' function are invalid.')
      })
      it('if the related parameters that are specified are followed by a required one that have the same type', () => {
        expect(() => {
          parse('NUMERIC.FUNCTIONWITHRELATEDPARAMSANDMORESIMILAR(10, "string1", 20, "string2")', { columnsTypes: COLUMN_TYPE, functions })
        }).toThrow('the \'otherArg\' argument of the \'NUMERIC.FUNCTIONWITHRELATEDPARAMSANDMORESIMILAR\' function is missing.')
      })
      it('if a multiple parameter which is specified and followed by a required one that have the same type', () => {
        expect(() => {
          parse('NUMERIC.FUNCTIONWITHMULTIPLEREQUIREDANDMORESIMILAR(10, 20, 30)', { columnsTypes: COLUMN_TYPE, functions })
        }).toThrow('the \'otherArg\' argument of the \'NUMERIC.FUNCTIONWITHMULTIPLEREQUIREDANDMORESIMILAR\' function is missing.')
      })
    })
  })
  describe('unknown values', () => {
    it('throw an error if the formula contains an unknown value', () => {
      expect(() => {
        parse('test')
      }).toThrow()
    })
  })
})
