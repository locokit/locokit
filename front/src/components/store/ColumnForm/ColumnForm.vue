<template>
  <div>
    <h1 class="lck-color-primary">
      {{ $t('components.datatable.column.edit') }}
    </h1>
    <lck-form
      :displayCancelButton="false"
      :submitting="submitting"
      @submit="submitColumnData"
    >
      <validation-provider
        vid="columnTextField"
        tag="div"
        class="p-field"
        :name="$t('components.datatable.column.title')"
        rules="required"
        v-slot="{
          errors,
          classes
        }"
      >
        <label for="columnTextField" class="label-field-required">{{ $t('components.datatable.column.title') }}</label>
        <p-input-text
          id="columnTextField"
          v-model="columnCopy.text"
        />
        <span :class="classes">{{ errors[0] }}</span>
      </validation-provider>
      <validation-provider
        vid="columnDocField"
        tag="div"
        class="p-field"
        :name="$t('components.datatable.column.doc')"
        v-slot="{
          errors,
          classes
        }"
      >
        <label for="columnDocField">{{ $t('components.datatable.column.doc') }}</label>
        <p-textarea
          id="columnDocField"
          v-model="columnCopy.documentation"
        />
        <span :class="classes">{{ errors[0] }}</span>
      </validation-provider>
      <label for="columnUUID">
        {{ $t('components.datatable.column.id') }}
      </label>
      <p>{{ columnCopy.id }}</p>
      <div>
        {{ $t('pages.databaseSchema.handleColumnModal.validation') }}
        <lck-column-validation
          :columnType="columnCopy.column_type_id"
          :columnValidation="columnCopy.validation"
          class="p-my-2"
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
    <div class="column-form-container lck-color-content">
      <h2 class="lck-color-title">{{ $t('components.datatable.column.visualizationConfiguration') }}</h2>
      <lck-form
        :displayCancelButton="false"
        :submitting="submitting"
        @submit="submitTableViewColumnData"
      >
        <validation-provider
          vid="columnTransmittedField"
          tag="div"
          class="p-field p-mb-2 p-d-flex"
          :name="$t('components.datatable.column.transmitted')"
          rules=""
          v-slot="{
            errors,
            classes
          }"
        >
          <p-checkbox
            :binary="true"
            class="p-mr-2"
            id="columnTransmittedField"
            v-model="columnCopy.transmitted"
          />
          <label for="columnTransmittedField">{{ $t('components.datatable.column.transmitted') }}</label>
          <span :class="classes">{{ errors[0] }}</span>
        </validation-provider>
        <validation-provider
          vid="columnDisplayedField"
          tag="div"
          class="p-field p-mb-2 p-d-flex"
          :name="$t('components.datatable.column.displayed')"
          rules=""
          v-slot="{
            errors,
            classes
          }"
        >
          <p-checkbox
            :binary="true"
            class="p-mr-2"
            id="columnDisplayedField"
            v-model="columnCopy.displayed"
          />
          <label for="columnDisplayedField">{{ $t('components.datatable.column.displayed') }}</label>
          <span :class="classes">{{ errors[0] }}</span>
        </validation-provider>
        <validation-provider
          vid="columnEditableField"
          tag="div"
          class="p-field p-mb-2 p-d-flex"
          :name="$t('components.datatable.column.editable')"
          rules=""
          v-slot="{
            errors,
            classes
          }"
        >
          <p-checkbox
            :binary="true"
            class="p-mr-2"
            id="columnEditableField"
            v-model="columnCopy.editable"
          />
          <label for="columnEditableField">{{ $t('components.datatable.column.editable') }}</label>
          <span :class="classes">{{ errors[0] }}</span>
        </validation-provider>

      </lck-form>
    </div>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'

import { ValidationProvider } from 'vee-validate'
import cloneDeep from 'lodash/cloneDeep'
import { COLUMN_TYPE } from '@locokit/lck-glossary'

import {
  LckTableViewColumn,
  SelectValue,
  SelectValueWithId,
} from '@/services/lck-api/definitions'

import Checkbox from 'primevue/checkbox'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'

import LckForm from '@/components/ui/Form/Form.vue'
import ColumnValidation from '@/components/admin/database/ColumnValidation/ColumnValidation.vue'
import SelectTypeColumn from '@/components/admin/database/SelectTypeColumn/SelectTypeColumn.vue'

export default {
  name: 'ColumnForm',
  components: {
    'lck-form': LckForm,
    'lck-select-type-column': SelectTypeColumn,
    'p-input-text': Vue.extend(InputText),
    'p-checkbox': Vue.extend(Checkbox),
    'p-textarea': Vue.extend(Textarea),
    'lck-column-validation': ColumnValidation,
    'validation-provider': Vue.extend(ValidationProvider),
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
        if (!this.columnCopy.validation) {
          this.$set(this.columnCopy, 'validation', {})
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
      const editedColumn: { text: string; settings?: object; validation?: object; documentation: string | undefined} = {
        text: this.columnCopy.text,
        validation: this.columnCopy.validation,
        documentation: this.columnCopy.documentation,
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
        transmitted: this.columnCopy.transmitted,
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
