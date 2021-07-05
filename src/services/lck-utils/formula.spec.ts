/* eslint-disable @typescript-eslint/camelcase */

import { COLUMN_TYPE } from '@locokit/lck-glossary'
import { languages } from 'monaco-editor-core/esm/vs/editor/editor.api'
import { LckTableColumn } from '../lck-api/definitions'
import {
  getDefaultRange,
  formulaColumnsIdsToNames,
  formulaColumnsNamesToIds,
  getMonacoSuggestions,
  FUNCTION_CATEGORY,
  IFormula,
} from './formula'

// Mock the monaco editor
jest.mock('monaco-editor-core/esm/vs/editor/editor.api', () => ({
  languages: {
    CompletionItemKind: {
      Class: 15,
      Function: 1,
    },
    CompletionItemInsertTextRule: {
      InsertAsSnippet: 1,
    },
  },
}))

// Mock i18n
jest.mock('@/plugins/i18n', () => ({
  t: (key: string) => key,
}))

// Mock the glossary
jest.mock('@locokit/lck-glossary', () => ({
  COLUMN_TYPE: {
    BOOLEAN: 1,
    STRING: 2,
    FLOAT: 4,
  },
}))

describe('formulas', () => {
  const formulaFunctions: Record<FUNCTION_CATEGORY, Record<string, IFormula>> = {
    DATE: {},
    LOGIC: {},
    NUMERIC: {},
    TEXT: {},
  }
  const defaultRange = {
    startColumn: 1,
    endColumn: 1,
    startLineNumber: 1,
    endLineNumber: 1,
  }
  const knownTables: LckTableColumn[] = [
    {
      text: 'NAME_C1',
      id: 'id-c1',
      table_id: 'id-t1',
      column_type_id: COLUMN_TYPE.STRING,
      settings: {},
    },
    {
      text: 'NAME_C2',
      id: 'id-c2',
      table_id: 'id-t1',
      column_type_id: COLUMN_TYPE.BOOLEAN,
      settings: {},
    },
  ]

  describe('getDefaultRange', () => {
    it('Return a default position for the monaco suggestions', () => {
      const defaultRange = getDefaultRange()
      expect(defaultRange).toEqual(defaultRange)
    })
  })
  describe('formulaColumnsNamesToIds', () => {
    it('Return the input formula in which the known columns names are replaced by their ids', () => {
      const inputFormula = 'TEXT.CONCAT(COLUMN.{NAME_C1}, COLUMN.{NAME_C2})'
      expect(
        formulaColumnsNamesToIds(inputFormula, knownTables),
      ).toBe(
        'TEXT.CONCAT(COLUMN.{id-c1}, COLUMN.{id-c2})',
      )
    })
    it('Return the input formula in which the known columns names are replaced by their ids with unknown columns', () => {
      const inputFormula = 'TEXT.CONCAT(COLUMN.{NAME_C1}, COLUMN.{NAME_C3})'
      expect(
        formulaColumnsNamesToIds(inputFormula, knownTables),
      ).toBe(
        'TEXT.CONCAT(COLUMN.{id-c1}, COLUMN.{NAME_C3})',
      )
    })
    it('Return the input formula in which the known columns names are replaced by their ids with empty columns', () => {
      const inputFormula = 'TEXT.CONCAT(COLUMN.{})'
      expect(
        formulaColumnsNamesToIds(inputFormula, knownTables),
      ).toBe(
        'TEXT.CONCAT(COLUMN.{})',
      )
    })
  })
  describe('formulaColumnsIdsToNames', () => {
    it('Return the input formula in which the known columns ids are replaced by their names', () => {
      const inputFormula = 'TEXT.CONCAT(COLUMN.{id-c1}, COLUMN.{id-c2})'
      expect(
        formulaColumnsIdsToNames(inputFormula, knownTables),
      ).toBe(
        'TEXT.CONCAT(COLUMN.{NAME_C1}, COLUMN.{NAME_C2})',
      )
    })
    it('Return the input formula in which the known columns ids are replaced by their names with unknown columns', () => {
      const inputFormula = 'TEXT.CONCAT(COLUMN.{id-c1}, COLUMN.{id-c3})'
      expect(
        formulaColumnsIdsToNames(inputFormula, knownTables),
      ).toBe(
        'TEXT.CONCAT(COLUMN.{NAME_C1}, COLUMN.{id-c3})',
      )
    })
    it('Return the input formula in which the known columns names are replaced by their names with empty columns', () => {
      const inputFormula = 'TEXT.CONCAT(COLUMN.{})'
      expect(
        formulaColumnsIdsToNames(inputFormula, knownTables),
      ).toBe(
        'TEXT.CONCAT(COLUMN.{})',
      )
    })
  })
  describe('getMonacoSuggestions', () => {
    let monacoSuggestions: {
      allSuggestions: languages.CompletionItem[];
      functionSuggestions: Record<FUNCTION_CATEGORY, languages.CompletionItem[]>;
      functionSignatures: Record<FUNCTION_CATEGORY, Record<string, string>>;
    }
    it('Return the correct suggestions for the column prefix and the categories', () => {
      monacoSuggestions = getMonacoSuggestions(formulaFunctions)
      expect(monacoSuggestions.allSuggestions).toHaveLength(5)
      expect(monacoSuggestions.allSuggestions[0]).toEqual({
        label: 'COLUMN',
        documentation: 'components.formulas.column',
        insertText: 'COLUMN',
        range: defaultRange,
        kind: 15,
      })

      expect(monacoSuggestions.allSuggestions[1]).toEqual({
        label: 'DATE',
        documentation: 'components.formulas.categories.DATE',
        insertText: 'DATE',
        range: defaultRange,
        kind: 15,
      })
    })
    describe('Return the correct values for a function without any parameter', () => {
      beforeAll(() => {
        formulaFunctions.NUMERIC = {
          PI: { returnType: COLUMN_TYPE.FLOAT },
        }
        monacoSuggestions = getMonacoSuggestions(formulaFunctions)
      })
      afterAll(() => {
        formulaFunctions.NUMERIC = {}
      })
      it('Return the correct suggestion', () => {
        expect(monacoSuggestions.functionSuggestions.NUMERIC[0]).toEqual({
          label: 'NUMERIC.PI',
          documentation: 'components.formulas.functions.NUMERIC.PI',
          insertText: 'NUMERIC.PI()',
          insertTextRules: 1,
          range: defaultRange,
          kind: 1,
          detail: 'NUMERIC.PI()',
        })
      })
      it('Return the correct signature', () => {
        expect(monacoSuggestions.functionSignatures.NUMERIC.PI).toBe('NUMERIC.PI()')
      })
    })
    describe('Return the correct values for a function with a required single parameter', () => {
      beforeAll(() => {
        formulaFunctions.NUMERIC = {
          ABS: {
            params: [
              {
                name: 'number',
                type: COLUMN_TYPE.FLOAT,
              },
            ],
            returnType: COLUMN_TYPE.FLOAT,
          },
        }
        monacoSuggestions = getMonacoSuggestions(formulaFunctions)
      })
      afterAll(() => {
        formulaFunctions.NUMERIC = {}
      })
      it('Return the correct suggestion', () => {
        expect(monacoSuggestions.functionSuggestions.NUMERIC[0]).toEqual({
          label: 'NUMERIC.ABS',
          documentation: 'components.formulas.functions.NUMERIC.ABS',
          // eslint-disable-next-line no-template-curly-in-string
          insertText: 'NUMERIC.ABS(${1:number})',
          insertTextRules: 1,
          range: defaultRange,
          kind: 1,
          detail: 'NUMERIC.ABS(number)',
        })
      })
      it('Return the correct signature', () => {
        expect(monacoSuggestions.functionSignatures.NUMERIC.ABS).toBe('NUMERIC.ABS(number)')
      })
    })
    describe('Return the correct values for a function with a facultative single parameter', () => {
      beforeAll(() => {
        formulaFunctions.NUMERIC = {
          ABS: {
            params: [
              {
                name: 'number',
                type: COLUMN_TYPE.FLOAT,
                required: false,
              },
            ],
            returnType: COLUMN_TYPE.FLOAT,
          },
        }
        monacoSuggestions = getMonacoSuggestions(formulaFunctions)
      })
      afterAll(() => {
        formulaFunctions.NUMERIC = {}
      })
      it('Return the correct suggestion', () => {
        expect(monacoSuggestions.functionSuggestions.NUMERIC[0]).toEqual({
          label: 'NUMERIC.ABS',
          documentation: 'components.formulas.functions.NUMERIC.ABS',
          // eslint-disable-next-line no-template-curly-in-string
          insertText: 'NUMERIC.ABS(${1:number})',
          insertTextRules: 1,
          range: defaultRange,
          kind: 1,
          detail: 'NUMERIC.ABS([number])',
        })
      })
      it('Return the correct signature', () => {
        expect(monacoSuggestions.functionSignatures.NUMERIC.ABS).toBe('NUMERIC.ABS([number])')
      })
    })
    describe('Return the correct values for a function with a required multiple parameter', () => {
      beforeAll(() => {
        formulaFunctions.NUMERIC = {
          PRODUCT: {
            params: [
              {
                name: 'number',
                type: COLUMN_TYPE.FLOAT,
                multiple: true,
              },
            ],
            returnType: COLUMN_TYPE.FLOAT,
          },
        }
        monacoSuggestions = getMonacoSuggestions(formulaFunctions)
      })
      afterAll(() => {
        formulaFunctions.NUMERIC = {}
      })
      it('Return the correct suggestion', () => {
        expect(monacoSuggestions.functionSuggestions.NUMERIC[0]).toEqual({
          label: 'NUMERIC.PRODUCT',
          documentation: 'components.formulas.functions.NUMERIC.PRODUCT',
          // eslint-disable-next-line no-template-curly-in-string
          insertText: 'NUMERIC.PRODUCT(${1:number})',
          insertTextRules: 1,
          range: defaultRange,
          kind: 1,
          detail: 'NUMERIC.PRODUCT(number1, [number2, ...])',
        })
      })
      it('Return the correct signature', () => {
        expect(monacoSuggestions.functionSignatures.NUMERIC.PRODUCT).toBe('NUMERIC.PRODUCT(number1, [number2, ...])')
      })
    })
    describe('Return the correct values for a function with a facultative multiple parameter', () => {
      beforeAll(() => {
        formulaFunctions.NUMERIC = {
          PRODUCT: {
            params: [
              {
                name: 'number',
                type: COLUMN_TYPE.FLOAT,
                multiple: true,
                required: false,
              },
            ],
            returnType: COLUMN_TYPE.FLOAT,
          },
        }
        monacoSuggestions = getMonacoSuggestions(formulaFunctions)
      })
      afterAll(() => {
        formulaFunctions.NUMERIC = {}
      })
      it('Return the correct suggestion', () => {
        expect(monacoSuggestions.functionSuggestions.NUMERIC[0]).toEqual({
          label: 'NUMERIC.PRODUCT',
          documentation: 'components.formulas.functions.NUMERIC.PRODUCT',
          // eslint-disable-next-line no-template-curly-in-string
          insertText: 'NUMERIC.PRODUCT(${1:number})',
          insertTextRules: 1,
          range: defaultRange,
          kind: 1,
          detail: 'NUMERIC.PRODUCT([number1, ...])',
        })
      })
      it('Return the correct signature', () => {
        expect(monacoSuggestions.functionSignatures.NUMERIC.PRODUCT).toBe('NUMERIC.PRODUCT([number1, ...])')
      })
    })
    describe('Return the correct values for a function with related parameters', () => {
      beforeAll(() => {
        formulaFunctions.LOGIC = {
          IFS: {
            params: [
              [
                {
                  name: 'condition',
                  type: COLUMN_TYPE.BOOLEAN,
                },
                {
                  name: 'result',
                  type: COLUMN_TYPE.STRING,
                },
              ],
            ],
            returnType: COLUMN_TYPE.FLOAT,
          },
        }
        monacoSuggestions = getMonacoSuggestions(formulaFunctions)
      })
      afterAll(() => {
        formulaFunctions.NUMERIC = {}
      })
      it('Return the correct suggestion', () => {
        expect(monacoSuggestions.functionSuggestions.LOGIC[0]).toEqual({
          label: 'LOGIC.IFS',
          documentation: 'components.formulas.functions.LOGIC.IFS',
          // eslint-disable-next-line no-template-curly-in-string
          insertText: 'LOGIC.IFS(${1:condition}, ${2:result})',
          insertTextRules: 1,
          range: defaultRange,
          kind: 1,
          detail: 'LOGIC.IFS(condition1, result1, [condition2, result2, ...])',
        })
      })
      it('Return the correct signature', () => {
        expect(monacoSuggestions.functionSignatures.LOGIC.IFS).toBe('LOGIC.IFS(condition1, result1, [condition2, result2, ...])')
      })
    })
    describe('Return the correct values for a function with two single parameters', () => {
      beforeAll(() => {
        formulaFunctions.NUMERIC = {
          PRODUCT: {
            params: [
              {
                name: 'number1',
                type: COLUMN_TYPE.FLOAT,
              },
              {
                name: 'number2',
                type: COLUMN_TYPE.FLOAT,
              },
            ],
            returnType: COLUMN_TYPE.FLOAT,
          },
        }
        monacoSuggestions = getMonacoSuggestions(formulaFunctions)
      })
      afterAll(() => {
        formulaFunctions.NUMERIC = {}
      })
      it('Return the correct suggestion', () => {
        expect(monacoSuggestions.functionSuggestions.NUMERIC[0]).toEqual({
          label: 'NUMERIC.PRODUCT',
          documentation: 'components.formulas.functions.NUMERIC.PRODUCT',
          // eslint-disable-next-line no-template-curly-in-string
          insertText: 'NUMERIC.PRODUCT(${1:number1}, ${2:number2})',
          insertTextRules: 1,
          range: defaultRange,
          kind: 1,
          detail: 'NUMERIC.PRODUCT(number1, number2)',
        })
      })
      it('Return the correct signature', () => {
        expect(monacoSuggestions.functionSignatures.NUMERIC.PRODUCT).toBe('NUMERIC.PRODUCT(number1, number2)')
      })
    })
    describe('Return the correct values for two functions', () => {
      beforeAll(() => {
        formulaFunctions.NUMERIC = {
          ABS: {
            params: [
              {
                name: 'number',
                type: COLUMN_TYPE.FLOAT,
              },
            ],
            returnType: COLUMN_TYPE.FLOAT,
          },
          INT: {
            params: [
              {
                name: 'number',
                type: COLUMN_TYPE.FLOAT,
              },
            ],
            returnType: COLUMN_TYPE.FLOAT,
          },
        }
        monacoSuggestions = getMonacoSuggestions(formulaFunctions)
      })
      afterAll(() => {
        formulaFunctions.NUMERIC = {}
      })
      it('Return the correct suggestion', () => {
        expect(monacoSuggestions.functionSuggestions.NUMERIC).toHaveLength(2)
      })
      it('Return the correct signature', () => {
        expect(monacoSuggestions.functionSignatures.NUMERIC.ABS).toBeDefined()
        expect(monacoSuggestions.functionSignatures.NUMERIC.INT).toBeDefined()
      })
    })
  })
})
