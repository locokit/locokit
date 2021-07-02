<template>
  <div>
    <h1 class="lck-color-primary">{{ $t('components.datatable.column.edit') }}</h1>
    <div class="column-form-container lck-color-content">
      <h2 class="lck-color-title">{{ $t('components.datatable.column.globalConfiguration') }}</h2>
      <lck-form
        :displayCancelButton="false"
        :submitting="submitting"
        @submit="submitColumnData"
      >
        <div class="p-field">
          <label for="columnTextField">{{ $t('components.datatable.column.title') }}</label>
          <p-input-text
            id="columnTextField"
            v-model="columnCopy.text"
            required
          />
        </div>
        <div class="p-mb-3" v-if="isSelectColumnType">
          <p>{{ $t('components.datatable.column.values') }}</p>
          <lck-select-type-column
            :columnToHandle="columnCopy"
            @select-type-values-change="selectTypeValuesChange"
            @default-select-type-value-id-change="defaultSelectTypeValueIdChange"
          />
        </div>
      </lck-form>
    </div>
    <div class="column-form-container lck-color-content">
      <h2 class="lck-color-title">{{ $t('components.datatable.column.visualizationConfiguration') }}</h2>
      <lck-form
        :displayCancelButton="false"
        :submitting="submitting"
        @submit="submitTableViewColumnData"
      >
        <div class="p-field">
          <label for="columnDisplayedField">{{ $t('components.datatable.column.displayed') }}</label>
          <p-input-switch
            id="columnDisplayedField"
            v-model="columnCopy.displayed"
            required
          />
        </div>
        <div class="p-field p-mb-2">
          <label for="columnEditableField">{{ $t('components.datatable.column.editable') }}</label>
          <p-input-switch
            id="columnEditableField"
            v-model="columnCopy.editable"
            required
          />
        </div>
        <div class="p-field p-mb-2">
          <label for="columnRequiredField">{{ $t('components.datatable.column.required') }}</label>
          <p-input-switch
            id="columnRequiredField"
            v-model="columnCopy.required"
            required
          />
        </div>
      </lck-form>
    </div>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import { COLUMN_TYPE } from '@locokit/lck-glossary'
import cloneDeep from 'lodash/cloneDeep'
import InputText from 'primevue/inputtext'
import InputSwitch from 'primevue/inputswitch'

import {
  LckTableViewColumn,
  SelectValue,
  SelectValueWithId,
} from '@/services/lck-api/definitions'
import LckForm from '@/components/ui/Form/Form.vue'
import SelectTypeColumn from '@/components/admin/database/SelectTypeColumn/SelectTypeColumn.vue'

export default {
  name: 'ColumnForm',
  components: {
    'lck-form': LckForm,
    'lck-select-type-column': SelectTypeColumn,
    'p-input-text': Vue.extend(InputText),
    'p-input-switch': Vue.extend(InputSwitch),
  },
  props: {
    column: {
      type: Object,
      default: () => ({}),
    },
    submitting: {
      type: Boolean,
      default: false,
    },
  },
  data (): {
    columnCopy: LckTableViewColumn;
    } {
    return {
      columnCopy: new LckTableViewColumn(),
    }
  },
  computed: {
    isSelectColumnType (): boolean {
      return (
        this.columnCopy.column_type_id === COLUMN_TYPE.SINGLE_SELECT ||
        this.columnCopy.column_type_id === COLUMN_TYPE.MULTI_SELECT
      )
    },
  },
  watch: {
    column: {
      handler (newColumnValue: LckTableViewColumn) {
        this.columnCopy = cloneDeep(newColumnValue)
        if (!this.columnCopy.settings) {
          this.$set(this.columnCopy, 'settings', {})
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    selectTypeValuesChange (data: SelectValueWithId[]) {
      const selectTypeValues: Record<string, SelectValue> = {}
      data.forEach(({ id, label, color, backgroundColor }: SelectValueWithId) => {
        selectTypeValues[id] = { label, color, backgroundColor }
      })
      this.columnCopy.settings.values = selectTypeValues
    },
    defaultSelectTypeValueIdChange (defaultValue: string) {
      this.columnCopy.settings.default = defaultValue
    },
    submitColumnData () {
      const editedColumn: { text: string; settings?: object} = {
        text: this.columnCopy.text,
      }
      if (this.isSelectColumnType) {
        editedColumn.settings = this.columnCopy.settings
      }
      this.$emit('column-edit', editedColumn)
    },
    submitTableViewColumnData () {
      this.$emit('table-view-column-edit', {
        displayed: this.columnCopy.displayed,
        editable: this.columnCopy.editable,
        required: this.columnCopy.required,
      })
    },
  },
}
</script>

<style scoped>
.p-inputswitch {
  display: block;
}

.column-form-container {
  box-shadow: 1px 1px 5px 1px rgb(230, 230, 230);
  padding: 0.5rem 1rem;
  margin: 1rem 0;
}
</style>
