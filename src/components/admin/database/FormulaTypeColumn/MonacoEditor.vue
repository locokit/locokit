<template>
  <div
    ref="monacoEditor"
    class="monacoEditor"
  >
  </div>
</template>

<script lang="ts">

// // Needed monaco features
import 'monaco-editor/esm/vs/editor/contrib/bracketMatching/bracketMatching.js'
import 'monaco-editor/esm/vs/editor/standalone/browser/colorizer'
import 'monaco-editor/esm/vs/editor/contrib/hover/hover.js'
import 'monaco-editor/esm/vs/editor/contrib/suggest/suggestController.js'
import 'monaco-editor/esm/vs/editor/contrib/wordOperations/wordOperations.js'

// Monaco core
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js'

import { FeathersError } from '@feathersjs/errors'
import { PropOptions } from 'vue'
import { functions, getDefaultRange, predefinedMonacoSuggestions, FUNCTION_CATEGORY } from '@/services/lck-utils/formula'
import i18n from '@/plugins/i18n'
import { LckTableColumn } from '@/services/lck-api/definitions'

declare global {
    interface Window {
        MonacoEnvironment: monaco.Environment;
    }
}

// Configuration of the monaco-editor worker
self.MonacoEnvironment = {
  getWorkerUrl: function () {
    return process.env.BASE_URL + 'editor.worker.bundle.js'
  }
}

export default {
  name: 'Lckeditor',
  data () {
    return {
      editor: {} as monaco.editor.IStandaloneCodeEditor,
      currentCompletionItemProvider: {} as monaco.IDisposable
    }
  },
  props: {
    errorHandleColumn: {
      type: Object,
      default: () => ({})
    },
    language: {
      type: String,
      default: ''
    },
    defaultOptions: {
      type: Object,
      default: () => ({})
    } as PropOptions<monaco.editor.IStandaloneEditorConstructionOptions>,
    options: {
      type: Object,
      default: () => ({})
    } as PropOptions<monaco.editor.IEditorOptions & monaco.editor.IGlobalEditorOptions>,
    tableColumns: {
      type: Array,
      default: () => ([])
    } as PropOptions<LckTableColumn[]>,
    theme: {
      type: String,
      default: 'vs'
    },
    value: {
      type: String,
      default: ''
    }
  },
  beforeMount () {
    const locokitLanguage = 'locokitLanguage'

    if (!monaco.languages.getEncodedLanguageId(locokitLanguage)) {
      // Register the locokit language if it is not done yet
      monaco.languages.register({ id: locokitLanguage })

      // Register a tokens provider for the language
      monaco.languages.setMonarchTokensProvider(locokitLanguage, {
        brackets: [{ open: '(', close: ')', token: 'delimiter.parenthesis' }],

        tokenizer: {
          root: [
            { include: '@whitespace' },
            [/"/, 'string', '@doublestring'],
            { include: '@categories' },
            { include: '@columns' },
            { include: '@numbers' },
            [/[()]/, '@brackets']
          ],

          // whitespace
          whitespace: [
            [/\s+/, 'white'],
            [/"[^"]*$/, 'string', '@endMultipleLineString']
          ],

          // strings
          doublestring: [
            [/[^\\"]+/, 'string'],
            [/\./, 'string.escape'],
            [/\\./, 'string.escape'],
            [/"/, 'string', '@pop']
          ],
          // multiple line string
          endMultipleLineString: [
            [/\\"/, 'string'],
            [/.*"/, 'string', '@popall'],
            [/.*$/, 'string']
          ],

          // categories
          // eslint-disable-next-line no-useless-escape
          categories: [[new RegExp(`(${Object.keys(functions).join('|')})\.([^\s|(])+`), 'category']],

          // columns
          columns: [[/COLUMN\.({.+}|[^\s]+)/, 'column']],

          // numbers
          numbers: [[/-?(\d)+(\.\d+)?/, 'number']]
        }
      })

      // Register an hover item provider for the language
      monaco.languages.registerHoverProvider(locokitLanguage, {
        provideHover: function (model, position) {
          // Hover on functions names
          let providerResult: monaco.languages.Hover = {
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
              }).word as FUNCTION_CATEGORY
              const functionName = currentValue.slice(indexInf + 1, indexSup)
              const functionSignature = predefinedMonacoSuggestions.functionSignatures[categoryName]?.[functionName]
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
          { token: 'category', foreground: '005666' },
          { token: 'column', foreground: '664805' }
        ],
        colors: {
        }
      })

      // Language configuration
      monaco.languages.setLanguageConfiguration(locokitLanguage, {
        brackets: [['(', ')']],
        autoClosingPairs: [
          { open: '(', close: ')' },
          { open: '"', close: '"' }
        ]
      })
    }

    // Register a completion item provider for the language
    // Do it each time the component is mounted to update the column suggestions
    this.currentCompletionItemProvider = monaco.languages.registerCompletionItemProvider(locokitLanguage, {
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
        let suggestions: monaco.languages.CompletionItem[] = []
        if (currentWord.word === 'COLUMN') {
          // The current word is the prefix column so we only suggest the available columns
          suggestions = this.columnSuggestions
        } else if (predefinedMonacoSuggestions.functionSuggestions[currentWord.word]) {
          // The current word is a category prefix so we suggest the functions associated to this category
          suggestions = predefinedMonacoSuggestions.functionSuggestions[currentWord.word]
        } else {
          // The current word is unknown so we suggest all the items
          suggestions = predefinedMonacoSuggestions.allSuggestions.concat(this.columnSuggestions)
        }
        // Need to specify where the completion will be made
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: currentWord.startColumn,
          endColumn: currentWord.endColumn
        }
        suggestions.forEach(suggestion => {
          suggestion.range = range
        })
        return {
          suggestions
        }
      }
    })
  },
  mounted () {
    this.$nextTick(() => {
      const fullOptions = this.defaultOptions
      fullOptions.language = this.language
      fullOptions.theme = this.theme
      fullOptions.value = this.value

      // Create the editor
      this.editor = monaco.editor.create(
        this.$refs.monacoEditor as HTMLElement,
        fullOptions
      )

      // Add events
      // On change
      this.editor.onDidChangeModelContent(() => {
        // Emit an event if the value is updated
        const newValue = this.editor.getValue()
        if (this.value !== newValue) {
          this.$emit('change', newValue)
        }
        // Hide the previous errors
        if (monaco.editor.getModelMarkers({}).length > 0) {
          const currentEditorModel = this.editor.getModel()
          if (currentEditorModel) monaco.editor.setModelMarkers(currentEditorModel, this.language, [])
        }
      })
    })

    // After mounting
    this.$emit('editorDidMount', this.editor)
  },
  beforeDestroy () {
    if (this.editor) {
      // Dispose the editor
      this.editor.dispose()
      // Dispose the providers that are reset at component creation
      this.currentCompletionItemProvider.dispose()
    }
  },
  computed: {
    columnSuggestions (): monaco.languages.CompletionItem[] {
      const defaultRange = getDefaultRange()
      return this.tableColumns.map(column => ({
        label: `COLUMN.{${column.text}}`,
        kind: monaco.languages.CompletionItemKind.Variable,
        insertText: `COLUMN.{${column.text}}`,
        range: defaultRange
      }))
    }
  },
  watch: {
    options: {
      handler (options: monaco.editor.IEditorOptions & monaco.editor.IGlobalEditorOptions) {
        if (this.editor) {
          this.editor.updateOptions(options)
        }
      },
      deep: true
    },
    value (newValue: string) {
      if (this.editor) {
        if (newValue !== this.editor.getValue()) {
          this.editor.setValue(newValue)
        }
      }
    },
    language (newLanguage: string) {
      if (this.editor) {
        const currentEditorModel = this.editor.getModel()
        if (currentEditorModel) monaco.editor.setModelLanguage(currentEditorModel, newLanguage)
      }
    },
    theme (newTheme: string) {
      if (this.editor) {
        monaco.editor.setTheme(newTheme)
      }
    },
    errorHandleColumn (newError: FeathersError) {
      const currentEditorModel = this.editor.getModel()
      const { data: { location }, message = '' } = newError
      if (currentEditorModel && location && message) {
        monaco.editor.setModelMarkers(currentEditorModel, this.language, [
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
  }
}
</script>

<style scoped>
.monacoEditor {
  position: relative;
  height: 5em;
  max-width: 100%;
  width: 550px;
  box-sizing: content-box;
  border: 1px solid #ced4da;
}

.monacoEditor:focus-within {
  border-color: var(--primary-color);
}

</style>
