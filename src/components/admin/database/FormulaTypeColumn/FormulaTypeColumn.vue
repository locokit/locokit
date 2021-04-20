<template>
  <div class="p-field">
    <label for="editor">{{ $t('components.formulas.formula') }}</label>
    <monaco-editor
      class="editor"
      ref="editor"
      :language="language"
      :theme="theme"
      :options="options"
      :value="formula"
      @change="onChange"
      @editorDidMount="editorDidMount"
    />
  </div>
</template>

<script>
import LckMonacoEditor from 'vue-monaco'
import i18n from '@/plugins/i18n'

import {
  formulaColumnsIdsToNames,
  functions,
  getDefaultRange,
  getMonacoSuggestions
} from '@/services/lck-utils/formula'

export default {
  name: 'FormulaTypeColumn',
  components: {
    'monaco-editor': LckMonacoEditor
  },
  props: {
    columnToHandle: {
      type: Object,
      required: false
    },
    tableColumns: {
      type: Array,
      default: () => []
    },
    errorHandleColumn: {
      type: Object,
      required: false
    }
  },
  data () {
    return {
      language: '',
      theme: '',
      formula: '',
      options: {
        fixedOverflowWidget: false,
        automaticLayout: false,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        lineNumbers: 'off',
        lineNumbersMinChars: 0,
        overviewRulerLanes: 0,
        overviewRulerBorder: false,
        lineDecorationsWidth: 0,
        folding: false,
        scrollBeyondLastColumn: 0,
        scrollbar: {
          horizontal: 'hidden'
        },
        suggest: {
          snippetsPreventQuickSuggestions: false
        },
        find: {
          addExtraSpaceOnTop: false,
          autoFindInSelection: 'never',
          seedSearchStringFromSelection: false
        },
        renderLineHighlight: 'none',
        contextmenu: false
      }
    }
  },
  methods: {
    editorDidMount () {
      const monaco = this.$refs.editor.monaco

      // Register the locokit language if it is not done yet
      if (!monaco.languages.getEncodedLanguageId('locokitLanguage')) {
        monaco.languages.register({ id: 'locokitLanguage' })

        // Register a tokens provider for the language
        monaco.languages.setMonarchTokensProvider('locokitLanguage', {
          operators: [],
          brackets: [{ open: '(', close: ')', token: 'delimiter.parenthesis' }],

          tokenizer: {
            root: [
              { include: '@whitespace' },
              { include: '@numbers' },
              { include: '@categories' },
              { include: '@columns' },
              [/"([^"\\]|\\.)*$/, 'string.invalid'],
              [/"/, 'string', '@doublestring'],
              [/[()]/, '@brackets']
            ],

            // whitespace
            whitespace: [[/\s+/, '']],

            // categories
            // eslint-disable-next-line no-useless-escape
            categories: [[new RegExp(`(${Object.keys(functions).join('|')})\.([^\s|(])+`), 'category']],

            // columns
            columns: [[/COLUMN\.({.+}|[^\s]+)/, 'column']],

            // numbers
            numbers: [[/-?(\d)+(\.\d+)?/, 'number']],

            // strings
            doublestring: [
              [/[^\\"]+/, 'string'],
              [/\./, 'string.escape'],
              [/\\./, 'string.escape.invalid'],
              [/"/, 'string', '@pop']
            ]
          }
        })

        const availableSuggestions = getMonacoSuggestions()

        // Register a completion item provider for the language
        monaco.languages.registerCompletionItemProvider('locokitLanguage', {
          triggerCharacters: ['.'],
          provideCompletionItems: (model, position, context) => {
            // Get the current typed word
            const currentWord = context.triggerCharacter
              ? model.getWordUntilPosition({
                lineNumber: position.lineNumber,
                column: position.column - 1
              })
              : model.getWordUntilPosition(position)
            // Get the right suggestions to return
            let suggestions = []
            if (currentWord.word === 'COLUMN') {
              // The current word is the prefix column so we only suggest the available columns
              suggestions = this.columnSuggestions
            } else if (
              availableSuggestions.functionSuggestions[currentWord.word]
            ) {
              // The current word is a category prefix so we suggest the functions associated to this category
              suggestions = availableSuggestions.functionSuggestions[currentWord.word]
            } else {
              // The current word is unknown so we suggest all the items
              suggestions = availableSuggestions.allSuggestions.concat(this.columnSuggestions)
            }
            // Need to specify where the completion will be made
            const range = {
              startLineNumber: position.lineNumber,
              endLineNumber: position.lineNumber,
              startColumn: currentWord.startColumn,
              endColumn: currentWord.endColumn
            }
            suggestions.forEach((suggestion) => {
              suggestion.range = range
            })
            return {
              suggestions
            }
          }
        })

        // Register an hover item provider for the language
        monaco.languages.registerHoverProvider('locokitLanguage', {
          provideHover: function (model, position) {
            // Hover on functions names
            let providerResult = {
              contents: []
            }
            // Get the current formula
            const currentValue = model.getValue()

            // Search the index of the '.' before the hovered word
            const indexInf = currentValue.lastIndexOf('.', position.column - 1)

            if (indexInf > 0) {
              // Search the index of the '(' after the hovered word
              const indexSup = currentValue.indexOf('(', position.column - 1)

              if (indexSup > 0) {
                // If the hovered word is between '.' and '(', maybe it's a function so we check if it exists
                const categoryName = model.getWordUntilPosition({
                  lineNumber: position.lineNumber,
                  column: indexInf + 1
                }).word
                const functionName = currentValue.slice(indexInf + 1, indexSup)
                const functionSignature = availableSuggestions.functionSignatures[categoryName]?.[functionName]

                // Return a result if the formula exists
                if (functionSignature) {
                  providerResult = {
                    range: new monaco.Range(
                      position.lineNumber,
                      indexInf + 2,
                      position.lineNumber,
                      indexSup + 1
                    ),
                    contents: [
                      // function signature
                      { value: functionSignature },
                      // function documentation
                      { value: i18n.t(`components.formulas.functions.${categoryName}.${functionName}`).toString() }
                    ]
                  }
                }
              }
            }
            return providerResult
          }
        })

        // Define a new theme
        monaco.editor.defineTheme('locokitTheme', {
          base: 'vs',
          inherit: true,
          rules: [
            // { token: 'string', foreground: 'B32C12' },
            { token: 'category', foreground: '005666' },
            { token: 'column', foreground: '664805' }
            // { token: 'number', foreground: 'B38112' }
          ],
          colors: {}
        })

        // Language configuration
        monaco.languages.setLanguageConfiguration('locokitLanguage', {
          brackets: [['(', ')']],
          autoClosingPairs: [
            { open: '(', close: ')' },
            { open: '"', close: '"' }
          ]
        })
      }
      // Select the custom language and theme
      this.language = 'locokitLanguage'
      this.theme = 'locokitTheme'
    },
    onChange (updatedFormula) {
      const monaco = this.$refs.editor.monaco
      // Hide the previous errors
      if (monaco.editor.getModelMarkers({}).length > 0) {
        const currentEditorModel = monaco.editor.getModels()?.[0]
        if (currentEditorModel) monaco.editor.setModelMarkers(currentEditorModel, this.language, [])
      }
      // Update the value
      this.formula = updatedFormula
      this.$emit('formula-change', updatedFormula)
    }
  },
  watch: {
    'columnToHandle.settings.formula': {
      handler (newFormula = '') {
        this.formula = formulaColumnsIdsToNames(newFormula, this.tableColumns)
      },
      immediate: true
    },
    errorHandleColumn (newError) {
      const monaco = this.$refs.editor.monaco
      const currentEditorModel = monaco.editor.getModels()?.[0]
      const { data: { location } = {}, message = '' } = newError
      if (currentEditorModel && location && message) {
        monaco.editor.setModelMarkers(currentEditorModel, 'locokitLanguage', [
          {
            startLineNumber: location.start.line,
            startColumn: location.start.column,
            endLineNumber: location.end.line,
            endColumn: location.end.column,
            message: message,
            severity: monaco.MarkerSeverity.Error
          }
        ])
      }
    }

  },
  computed: {
    columnSuggestions () {
      if (this.$refs.editor) {
        const monaco = this.$refs.editor.monaco
        const defaultRange = getDefaultRange()
        return this.tableColumns.map((column) => ({
          label: `COLUMN.{${column.text}}`,
          kind: monaco.languages.CompletionItemKind.Variable,
          insertText: `COLUMN.{${column.text}}`,
          documentation: `COLUMN.{${column.text}}`,
          range: defaultRange
        }))
      } else {
        return []
      }
    }
  }
}
</script>

<style scoped>
.editor {
  position: relative;
  height: 5em;
  width: 550px;
  box-sizing: content-box;
  border: 1px solid #ced4da;
}

.editor:focus-within {
  border-color: var(--primary-color);
}

/deep/ .editor-widget {
  border: none;
}
</style>
