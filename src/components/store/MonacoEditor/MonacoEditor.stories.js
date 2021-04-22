import LckMonacoEditor from './MonacoEditor.vue'

export default {
  title: 'components/store/LckMonacoEditor',
  component: LckMonacoEditor
}

export const defaultEditorWithValue = () => (
  {
    components: { LckMonacoEditor },
    data () {
      return {
        value: '10.0 "A text" COLUMN.{A column} NUMERIC.MYFUNCTION()'
      }
    },
    template: '<LckMonacoEditor :value="value"/>'
  }
)

defaultEditorWithValue.storyName = 'Default'

export const editorWithLckLanguageAndTheme = () => (
  {
    components: { LckMonacoEditor },
    data () {
      return {
        value: '10.0 "A text" COLUMN.{A column} NUMERIC.MYFUNCTION()'
      }
    },
    template: '<LckMonacoEditor language="locokitLanguage" theme="locokitTheme" :value="value" />'
  }
)

editorWithLckLanguageAndTheme.storyName = 'With lck language and theme'

export const editorWithErrors = () => (
  {
    components: { LckMonacoEditor },
    data () {
      return {
        handledError: {
          message: 'The value is incorrect',
          data: { location: { start: { line: 1, column: 1 }, end: { line: 1, column: 5 } } }
        }
      }
    },
    template: '<LckMonacoEditor value="10.0" :handledError="handledError" />'
  }
)

editorWithErrors.storyName = 'With errors'
