<template>
  <div>
    <h1 class="lck-color-page-title">{{ $t('components.datatable.column.edit') }}</h1>
    <div class="column-form-container lck-color-content">
      <h2 class="lck-color-title">{{ $t('components.datatable.column.globalConfiguration') }}</h2>
      <lck-form
        :submitting="submitting"
        @submit="submitColumnData"
        :displayCancelButton="false"
        class="column-form"
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
            @select-type-values-change="selectTypeValuesChange"
            @default-select-type-value-id-change="defaultSelectTypeValueIdChange"
            :columnToHandle="columnCopy"
            :scrollable="false"
          />
        </div>
      </lck-form>
    </div>
    <div class="column-form-container lck-color-content">
      <h2 class="lck-color-title">{{ $t('components.datatable.column.visualizationConfiguration') }}</h2>
      <lck-form
        :submitting="submitting"
        @submit="submitTableViewColumnData"
        :displayCancelButton="false"
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
      </lck-form>
    </div>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import { COLUMN_TYPE } from '@locokit/lck-glossary'
import cloneDeep from 'lodash.clonedeep'
import InputText from 'primevue/inputtext'
import InputSwitch from 'primevue/inputswitch'

import {
  LckTableViewColumn,
  SelectValue
} from '@/services/lck-api/definitions'
import LckForm from '@/components/ui/Form/Form.vue'
import SelectTypeColumn from '@/components/admin/database/SelectTypeColumn/SelectTypeColumn.vue'

export default {
  name: 'ColumnForm',
  components: {
    'lck-form': LckForm,
    'lck-select-type-column': SelectTypeColumn,
    'p-input-text': Vue.extend(InputText),
    // 'p-input-number': Vue.extend(InputNumber),
    'p-input-switch': Vue.extend(InputSwitch)
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    column: {
      type: Object,
      default: () => ({})
    },
    submitting: {
      type: Boolean,
      default: false
    }
  },
  data (): {
    columnCopy: LckTableViewColumn;
    } {
    return {
      columnCopy: new LckTableViewColumn()
    }
  },
  computed: {
    isSelectColumnType (): boolean {
      return (
        this.columnCopy.column_type_id === COLUMN_TYPE.SINGLE_SELECT ||
        this.columnCopy.column_type_id === COLUMN_TYPE.MULTI_SELECT
      )
    }
  },
  watch: {
    column: {
      handler (newColumnValue: LckTableViewColumn) {
        this.columnCopy = cloneDeep(newColumnValue)
        if (!this.columnCopy.settings) this.columnCopy.settings = {}
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    selectTypeValuesChange (
      data: {
        id: string;
        label: string;
        color: string;
        backgroundColor: string;
      }[]
    ) {
      const selectTypeValues: Record<string, SelectValue> = {}
      data.forEach(
        ({
          id,
          label,
          color,
          backgroundColor
        }: {
          id: string;
          label: string;
          color: string;
          backgroundColor: string;
        }) => {
          selectTypeValues[id] = { label, color, backgroundColor }
        }
      )
      this.columnCopy.settings.values = selectTypeValues
    },
    defaultSelectTypeValueIdChange (defaultValue: string) {
      this.columnCopy.settings.default = defaultValue
    },
    submitColumnData () {
      const editedColumn: { text: string; settings?: object} = {
        text: this.columnCopy.text
      }
      if (this.isSelectColumnType) {
        editedColumn.settings = this.columnCopy.settings
      }
      this.$emit('column-edit', {
        originalColumn: this.column,
        editedColumn
      })
    },
    submitTableViewColumnData () {
      this.$emit('table-view-column-edit', {
        originalColumn: this.column,
        editedColumn: {
          displayed: this.columnCopy.displayed,
          position: this.columnCopy.position,
          editable: this.columnCopy.editable
        }
      })
    }
  }
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
