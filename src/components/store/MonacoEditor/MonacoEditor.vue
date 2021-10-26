<template>
  <div
    ref="monacoEditor"
    class="monacoEditor"
  >
  </div>
</template>

<script lang="ts">
import { PropOptions } from 'vue'

import { FeathersError } from '@feathersjs/errors'
// Needed monaco features
import 'monaco-editor-core/esm/vs/editor/contrib/bracketMatching/bracketMatching.js'
import 'monaco-editor-core/esm/vs/editor/standalone/browser/colorizer'
import 'monaco-editor-core/esm/vs/editor/contrib/hover/hover.js'
import 'monaco-editor-core/esm/vs/editor/contrib/suggest/suggestController.js'
import 'monaco-editor-core/esm/vs/editor/contrib/wordOperations/wordOperations.js'
// Monaco core
import {
  languages,
  editor,
  IDisposable,
  MarkerSeverity,
  Range,
} from 'monaco-editor-core/esm/vs/editor/editor.api.js'

import {
  formulaFunctions,
  getDefaultRange,
  predefinedMonacoSuggestions,
  FUNCTION_CATEGORY,
  COLUMN_PREFIX,
} from '@/services/lck-utils/formula'
import { LckTableColumn } from '@/services/lck-api/definitions'

// Configuration of the monaco-editor worker
self.MonacoEnvironment = {
  getWorkerUrl: function () {
    return process.env.BASE_URL + 'editor.worker.bundle.js'
  },
}

export default {
  name: 'LckMonacoEditor',
  data () {
    return {
      editor: {} as editor.IStandaloneCodeEditor,
      currentCompletionItemProvider: {} as IDisposable,
    }
  },
  props: {
    handledError: {
      type: Object,
    },
    language: {
      type: String,
      default: '',
    },
    options: {
      type: Object,
      default: () => ({
        minimap: { enabled: false },
        wordWrap: 'on',
        lineNumbers: 'off',
        folding: false,
        lineNumbersMinChars: 0,
        suggest: {
          snippetsPreventQuickSuggestions: false,
        },
        overviewRulerBorder: false,
        scrollBeyondLastColumn: 0,
        renderLineHighlight: 'none',
        lineDecorationsWidth: 0,
      }),
    } as PropOptions<editor.IEditorOptions & editor.IGlobalEditorOptions>,
    tableColumns: {
      type: Array,
      default: () => ([]),
    } as PropOptions<LckTableColumn[]>,
    theme: {
      type: String,
      default: 'vs',
    },
    value: {
      type: String,
      default: '',
    },
  },
  beforeMount () {
    const locokitLanguage = 'locokitLanguage'

    if (!languages.getEncodedLanguageId(locokitLanguage)) {
      // Register the locokit language if it is not done yet
      languages.register({ id: locokitLanguage })

      // Register a tokens provider for the language
      languages.setMonarchTokensProvider(locokitLanguage, {
        brackets: [{ open: '(', close: ')', token: 'delimiter.parenthesis' }],

        tokenizer: {
          root: [
            { include: '@whitespace' },
            [/"/, 'string', '@doublestring'],
            { include: '@categories' },
            { include: '@columns' },
            { include: '@numbers' },
            [/[()]/, '@brackets'],
          ],

          // whitespace
          whitespace: [
            [/\s+/, 'white'],
            [/"[^"]*$/, 'string', '@endMultipleLineString'],
          ],

          // strings
          doublestring: [
            [/[^\\"]+/, 'string'],
            [/\./, 'string.escape'],
            [/\\./, 'string.escape'],
            [/"/, 'string', '@pop'],
          ],
          // multiple line string
          endMultipleLineString: [
            [/\\"/, 'string'],
            [/.*"/, 'string', '@popall'],
            [/.*$/, 'string'],
          ],

          // categories
          categories: [[new RegExp(`(${Object.keys(formulaFunctions).join('|')})\\.[^(]+`), 'category']],

          // columns
          columns: [[new RegExp(`${COLUMN_PREFIX}\\.{[^}]+}`), 'column']],

          // numbers
          numbers: [[/-?(\d)+(\.\d+)?/, 'number']],
        },
      })

      // Register an hover item provider for the language
      languages.registerHoverProvider(locokitLanguage, {
        provideHover: (model, position) => {
          // Hover on functions names
          let providerResult: languages.Hover = {
            contents: [],
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
                column: indexInf + 1,
              }).word as FUNCTION_CATEGORY
              const functionName = currentValue.slice(indexInf + 1, indexSup)
              const functionSignature = predefinedMonacoSuggestions.functionSignatures[categoryName]?.[functionName]
              if (functionSignature) {
                providerResult = {
                  range: new Range(
                    position.lineNumber,
                    indexInf + 2,
                    position.lineNumber,
                    indexSup + 1,
                  ),
                  contents: [
                    // function signature
                    { value: functionSignature },
                    // function documentation
                    { value: this.$t(`components.formulas.functions.${categoryName}.${functionName}`).toString() },
                  ],
                }
              }
            }
          }
          return providerResult
        },
      })

      // Define a new theme
      editor.defineTheme('locokitTheme', {
        base: 'vs',
        inherit: true,
        rules: [
          { token: 'category', foreground: '005666' },
          { token: 'column', foreground: '664805' },
        ],
        colors: {
          'editorSuggestWidget.background': '#FFFFFF',
          'editorSuggestWidget.foreground': '#444444',
          'editorHoverWidget.background': '#FFFFFF',
          'editorHoverWidget.foreground': '#444444',
        },
      })

      // Language configuration
      languages.setLanguageConfiguration(locokitLanguage, {
        brackets: [['(', ')']],
        autoClosingPairs: [
          { open: '(', close: ')' },
          { open: '"', close: '"' },
        ],
      })
    }

    // Register a completion item provider for the language
    // Do it each time the component is mounted to update the column suggestions
    this.currentCompletionItemProvider = languages.registerCompletionItemProvider(locokitLanguage, {
      triggerCharacters: ['.'],
      provideCompletionItems: (model, position, context) => {
        // Get the current typed word
        const currentWord = context.triggerCharacter
          ? model.getWordUntilPosition({
            lineNumber: position.lineNumber,
            column: position.column - 1,
          })
          : model.getWordUntilPosition(position)
        // Get the right suggestions to return
        let suggestions: languages.CompletionItem[] = []
        if (currentWord.word === COLUMN_PREFIX) {
          // The current word is the prefix column so we only suggest the available columns
          suggestions = this.columnSuggestions
        } else if (predefinedMonacoSuggestions.functionSuggestions[currentWord.word as FUNCTION_CATEGORY]) {
          // The current word is a category prefix so we suggest the functions associated to this category
          suggestions = predefinedMonacoSuggestions.functionSuggestions[currentWord.word as FUNCTION_CATEGORY]
        } else {
          // The current word is unknown so we suggest all the items
          suggestions = predefinedMonacoSuggestions.allSuggestions.concat(this.columnSuggestions)
        }
        // Need to specify where the completion will be made
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: currentWord.startColumn,
          endColumn: currentWord.endColumn,
        }
        suggestions.forEach(suggestion => {
          suggestion.range = range
        })
        return {
          suggestions,
        }
      },
    })
  },
  mounted () {
    this.$nextTick(() => {
      const fullOptions: editor.IStandaloneEditorConstructionOptions = this.options
      fullOptions.language = this.language
      fullOptions.theme = this.theme
      fullOptions.value = this.value

      // Create the editor
      this.editor = editor.create(
        this.$refs.monacoEditor as HTMLElement,
        fullOptions,
        {
          storageService: {
            get () { return '' },
            getBoolean (key: string) {
              // Allow to expand the suggestions by default
              return key === 'expandSuggestionDocs'
            },
            getNumber () { return 0 },
            remove () {
              //
            },
            store () {
              //
            },
            onWillSaveState () {
              //
            },
            onDidChangeStorage () {
              //
            },
          },
        },
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
        if (editor.getModelMarkers({}).length > 0) {
          const currentEditorModel = this.editor.getModel()
          if (currentEditorModel) editor.setModelMarkers(currentEditorModel, this.language, [])
        }
      })

      // Display the errors
      if (this.handledError) this.handleNewError(this.handledError)
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
    columnSuggestions (): languages.CompletionItem[] {
      const defaultRange = getDefaultRange()
      return this.tableColumns.map(column => ({
        label: `${COLUMN_PREFIX}.{${column.text}}`,
        kind: languages.CompletionItemKind.Variable,
        insertText: `${COLUMN_PREFIX}.{${column.text}}`,
        range: defaultRange,
      }))
    },
  },
  methods: {
    handleNewError (newError: FeathersError) {
      if (this.editor) {
        const currentEditorModel = this.editor.getModel()
        const { data: { location }, message = '' } = newError
        if (currentEditorModel && location && message) {
          editor.setModelMarkers(currentEditorModel, this.language, [
            {
              startLineNumber: location.start.line,
              startColumn: location.start.column,
              endLineNumber: location.end.line,
              endColumn: location.end.column,
              message: message,
              severity: MarkerSeverity.Error,
            },
          ])
        }
      }
    },
  },
  watch: {
    options: {
      handler (options: editor.IEditorOptions & editor.IGlobalEditorOptions) {
        if (this.editor) {
          this.editor.updateOptions(options)
        }
      },
      deep: true,
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
        if (currentEditorModel) editor.setModelLanguage(currentEditorModel, newLanguage)
      }
    },
    theme (newTheme: string) {
      if (this.editor) {
        editor.setTheme(newTheme)
      }
    },
    handledError (newError: FeathersError) {
      this.handleNewError(newError)
    },
  },
}
</script>

<style scoped>
.monacoEditor {
  position: relative;
  height: 10em;
  max-width: 100%;
  width: 550px;
  box-sizing: content-box;
  border: 1px solid #ced4da;
}

.monacoEditor:focus-within {
  border-color: var(--primary-color);
}

</style>
