<template>
  <lck-dialog-form
    :visible.sync="visible"
    :header="
      columnToHandle
      ? $t('pages.databaseSchema.handleColumnModal.updateColumn')
      : $t('pages.databaseSchema.handleColumnModal.createColumn')
    "
    :contentStyle="{'overflow-y': 'visible'}"
    @input="confirmHandleColumnModal"
    @close="closeHandleColumnModal"
  >
    <div v-if="columnToHandle" class="p-mb-3">
      UUID : {{ columnToHandle.id }}
    </div>
    <div class="p-field">
      <label for="column-name">
        {{ $t('pages.databaseSchema.handleColumnModal.columnName') }}
      </label>
      <p-input-text
        v-model="columnNameToHandle"
        id="column-name"
        type="text"
        autofocus
      />
    </div>
    <div class="p-d-flex p-ai-center p-field">
      <label class="p-mr-2">
        {{ $t('pages.databaseSchema.handleColumnModal.reference') }}
      </label>
      <p-input-switch class="p-mr-2" v-model="referenceToHandle.isActive" :disabled="isFormulaType" />
      <p-input-number class="input-number-reference" v-model="referenceToHandle.position" :showButtons="true" :min="0" :maxFractionDigits="0" :disabled="!referenceToHandle.isActive" />
    </div>
    <div class="p-field">
      <label for="column-name">
        {{ $t('pages.databaseSchema.handleColumnModal.columnType') }}
      </label>
      <p-dropdown
        @change="onSelectedColumnTypeTohandleChange"
        appendTo="body"
        v-model="selectedColumnTypeIdToHandle"
        :options="columnTypes"
        dataKey="id"
        optionValue="id"
        optionLabel="name"
        :placeholder="$t('pages.databaseSchema.handleColumnModal.selectColumnType')"
        :disabled="columnToHandle != null && columnToHandle.id != null"
      />
    </div>
    <lck-select-type-column
      v-if="selectedColumnTypeIdToHandle && isSelectColumnType"
      @select-type-values-change="selectTypeValuesChange"
      @default-select-type-value-id-change="defaultSelectTypeValueIdChange"
      :columnToHandle="columnToHandle"
      class="p-mt-4"
    />
    <lck-relation-between-tables-type-column
      v-if="selectedColumnTypeIdToHandle && isRelationBetweenTablesType"
      @relation-table-id-change="tableIdChange"
      :columnToHandle="columnToHandle"
    />
    <lck-looked-up-type-column
      v-if="selectedColumnTypeIdToHandle && isLookedUpType"
      @local-field-id-change="localFieldIdChange"
      @foreign-field-id-change="foreignFieldIdChange"
      @relation-table-id-change="tableIdChange"
      :columnToHandle="columnToHandle"
      :tableId="tableId"
    />
    <div
      class="p-field"
      v-if="selectedColumnTypeIdToHandle && isFormulaType"
    >
      <label>{{ $t('components.formulas.formula') }}</label>
      <lck-monaco-editor
        :handledError="errorHandleColumn"
        language="locokitLanguage"
        :tableColumns="tableColumns"
        theme="locokitTheme"
        :value="settings && settings.formula"
        @change="formulaChange"
      />
    </div>
    <div v-if="errorHandleColumn" class="p-invalid">
      <small id="error-column-to-handle" class="p-invalid">
        {{ errorHandleColumn }}
      </small>
    </div>
  </lck-dialog-form>
</template>

<script>
import Vue from 'vue'

import { COLUMN_TYPE } from '@locokit/lck-glossary'
import { lckServices } from '@/services/lck-api'
import { formulaColumnsNamesToIds, formulaColumnsIdsToNames } from '@/services/lck-utils/formula/'

import LookedUpTypeColumn from './LookedUpTypeColumn'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import InputSwitch from 'primevue/inputswitch'
import InputNumber from 'primevue/inputnumber'

import DialogForm from '@/components/ui/DialogForm/DialogForm.vue'
import SelectTypeColumn from '@/components/admin/database/SelectTypeColumn/SelectTypeColumn.vue'
import LckMonacoEditor from '@/components/store/MonacoEditor/MonacoEditor.vue'
import RelationBetweenTablesTypeColumn from './RelationBetweenTablesTypeColumn.vue'

export default {
  name: 'HandleColumnModal',
  components: {
    'lck-dialog-form': DialogForm,
    'lck-select-type-column': SelectTypeColumn,
    'lck-monaco-editor': LckMonacoEditor,
    'lck-relation-between-tables-type-column': RelationBetweenTablesTypeColumn,
    'lck-looked-up-type-column': LookedUpTypeColumn,
    'p-input-text': Vue.extend(InputText),
    'p-dropdown': Vue.extend(Dropdown),
    'p-input-switch': Vue.extend(InputSwitch),
    'p-input-number': Vue.extend(InputNumber)
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    databaseId: String,
    tableId: String,
    columnToHandle: {
      type: Object,
      required: false
    },
    tableColumns: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  data () {
    return {
      columnTypes: Object.keys(COLUMN_TYPE).filter((key) => isNaN(key)).map((key) => ({ id: COLUMN_TYPE[key], name: key })),
      columnNameToHandle: null,
      referenceToHandle: { isActive: false, position: 0 },
      selectedColumnTypeIdToHandle: null,
      errorHandleColumn: null,
      settings: {}
    }
  },
  computed: {
    isSelectColumnType () {
      return this.selectedColumnTypeIdToHandle === COLUMN_TYPE.SINGLE_SELECT || this.selectedColumnTypeIdToHandle === COLUMN_TYPE.MULTI_SELECT
    },
    isRelationBetweenTablesType () {
      return this.selectedColumnTypeIdToHandle === COLUMN_TYPE.RELATION_BETWEEN_TABLES
    },
    isLookedUpType () {
      return this.selectedColumnTypeIdToHandle === COLUMN_TYPE.LOOKED_UP_COLUMN
    },
    isFormulaType () {
      return this.selectedColumnTypeIdToHandle === COLUMN_TYPE.FORMULA
    }
  },
  methods: {
    closeHandleColumnModal () {
      this.columnNameToHandle = null
      this.selectedColumnTypeIdToHandle = null
      this.$emit('close', false)
    },
    async confirmHandleColumnModal () {
      try {
        if (this.columnNameToHandle && this.selectedColumnTypeIdToHandle) {
          if (this.columnToHandle) {
            await lckServices.tableColumn.patch(this.columnToHandle.id, {
              // eslint-disable-next-line @typescript-eslint/camelcase
              table_id: this.tableId,
              text: this.columnNameToHandle,
              reference: this.referenceToHandle.isActive,
              // eslint-disable-next-line @typescript-eslint/camelcase
              reference_position: Number(this.referenceToHandle.position),
              // eslint-disable-next-line @typescript-eslint/camelcase
              // column_type_id: this.selectedColumnTypeIdToHandle,
              settings: this.getSettings()
            })
          } else {
            await lckServices.tableColumn.create({
              // eslint-disable-next-line @typescript-eslint/camelcase
              table_id: this.tableId,
              text: this.columnNameToHandle,
              reference: this.referenceToHandle.isActive,
              // eslint-disable-next-line @typescript-eslint/camelcase
              reference_position: Number(this.referenceToHandle.position),
              // eslint-disable-next-line @typescript-eslint/camelcase
              column_type_id: this.selectedColumnTypeIdToHandle,
              settings: this.getSettings()
            })
          }
          this.columnNameToHandle = null
          this.selectedColumnTypeIdToHandle = null
          this.$emit('close', true)
        } else {
          throw new Error(this.$t('pages.databaseSchema.handleColumnModal.errorNoData'))
        }
      } catch (errorHandleColumn) {
        this.errorHandleColumn = errorHandleColumn
      }
    },
    getSettings () {
      if (this.isSelectColumnType || this.isRelationBetweenTablesType || this.isLookedUpType) {
        return this.settings
      }
      if (this.isFormulaType) {
        return this.formulaSettings()
      }
      return {}
    },
    onSelectedColumnTypeTohandleChange () {
      this.settings = {}
    },
    selectTypeValuesChange (data) {
      let settings = {}
      data.forEach((selectTypeValue) => {
        const newSelectTypeValue = {}
        newSelectTypeValue[selectTypeValue.id] = { ...selectTypeValue }
        delete newSelectTypeValue[selectTypeValue.id].id
        settings = { ...settings, ...newSelectTypeValue }
      })
      this.settings = { values: settings, default: this.settings.default }
    },
    defaultSelectTypeValueIdChange (data) {
      this.settings.default = data
    },
    tableIdChange (data) {
      this.settings.tableId = data
    },
    localFieldIdChange (data) {
      this.settings.localField = data
    },
    foreignFieldIdChange (data) {
      this.settings.foreignField = data
    },
    formulaChange (data) {
      this.settings.formula = data
    },
    formulaSettings () {
      return {
        formula: formulaColumnsNamesToIds(this.settings.formula || '', this.tableColumns)
      }
    }
  },
  watch: {
    columnToHandle: function () {
      if (this.columnToHandle) {
        this.columnNameToHandle = this.columnToHandle.text
        if (Object.prototype.hasOwnProperty.call(this.columnToHandle, 'reference')) {
          this.referenceToHandle.isActive = this.columnToHandle.reference
        }
        if (Object.prototype.hasOwnProperty.call(this.columnToHandle, 'reference_position')) {
          this.referenceToHandle.position = this.columnToHandle.reference_position
        }
        this.selectedColumnTypeIdToHandle = this.columnToHandle.column_type_id
        // Set formula column
        if (this.isFormulaType) {
          this.settings.formula = formulaColumnsIdsToNames(this.columnToHandle.settings?.formula || '', this.tableColumns)
        }
      }
      this.errorHandleColumn = null
    }
  }
}
</script>

<style scoped>
.input-number-reference {
  width: 100px;
}

/** Need these two rules to display the monaco editor suggestion details on screen next to the input (pop-up problem) */
/deep/ .monaco-editor .overflow-guard {
  position: static;
}

/deep/ .monaco-editor .suggest-details-container {
  position: absolute !important;
  left: -1px !important;
  top: -1px !important;
  transform: translateX(-100%);
}
</style>
