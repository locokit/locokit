<template>
  <div class="p-field">
    <label for="editor">{{ $t('components.formulas.formula') }}</label>
    <monaco-editor
      class="editor"
      :defaultOptions="monacoOptions"
      :errorHandleColumn="errorHandleColumn"
      :language="language"
      :tableColumns="tableColumns"
      :theme="theme"
      :value="formula"
      @change="onChange"
    />
  </div>
</template>

<script lang="ts">
import { FeathersError } from '@feathersjs/errors'
import LckMonacoEditor from './MonacoEditor.vue'

import {
  formulaColumnsIdsToNames
} from '@/services/lck-utils/formula'
import { PropOptions } from 'vue'
import { LckTableColumn } from '@/services/lck-api/definitions'

export default {
  name: 'FormulaTypeColumn',
  components: {
    'monaco-editor': LckMonacoEditor
  },
  props: {
    columnToHandle: {
      type: Object,
      required: false
    } as PropOptions<LckTableColumn>,
    tableColumns: {
      type: Array,
      default: () => []
    } as PropOptions<LckTableColumn[]>,
    errorHandleColumn: {
      type: Object,
      required: false
    } as PropOptions<FeathersError>
  },
  data () {
    return {
      formula: '',
      language: 'locokitLanguage',
      theme: 'locokitTheme',
      monacoOptions: {
        minimap: { enabled: false },
        wordWrap: 'on',
        lineNumbers: 'off',
        folding: false,
        lineNumbersMinChars: 0,
        suggest: {
          snippetsPreventQuickSuggestions: false
        },
        overviewRulerBorder: false,
        scrollBeyondLastColumn: 0,
        renderLineHighlight: 'none'
      }
    }
  },
  methods: {
    onChange (updatedFormula: string) {
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
    }
  }
}
</script>
