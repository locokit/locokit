<template>
  <lck-dialog-form
    :visible.sync="visible"
    :header="
      columnToHandle
      ? $t('pages.databaseSchema.handleColumnModal.updateColumn')
      : $t('pages.databaseSchema.handleColumnModal.createColumn')
    "
    @input="confirmHandleColumnModal"
    @close="closeHandleColumnModal"
    :class="{ 'no-overflow-formula': selectedColumnTypeIdToHandle === COLUMN_TYPE.FORMULA }"
  >
    <div
      v-if="columnToHandle"
      class="p-mb-3"
    >
      <label>
        <span>{{ $t('pages.databaseSchema.displayUuid.uuid') }} </span>
        <span>{{ columnToHandle.id }}</span>
      </label>
    </div>
    <validation-provider
      vid="column-name"
      tag="div"
      class="p-field"
      :name="$t('pages.databaseSchema.handleColumnModal.columnName')"
      rules="required"
      v-slot="{
        errors,
        classes
      }"
    >
      <label for="column-name">
        {{ $t('pages.databaseSchema.handleColumnModal.columnName') }}
      </label>
      <span class="field-required">*</span>
      <p-input-text
        v-model="columnNameToHandle"
        id="column-name"
        type="text"
        autofocus
      />
      <span :class="classes">{{ errors[0] }}</span>
    </validation-provider>
    <validation-provider
      vid="column-doc"
      tag="div"
      class="p-field"
    >
      <label for="column-doc">
        {{ $t('pages.databaseSchema.handleColumnModal.columnDoc') }}
      </label>
      <p-textarea
        v-model="columnDocumentation"
        id="column-doc"
        :autoResize="true"
      />
    </validation-provider>
    <div class="p-d-flex p-ai-center p-field">
      <label class="p-mr-2">
        {{ $t('pages.databaseSchema.handleColumnModal.reference') }}
      </label>
      <validation-provider
        vid="referenceToHandle-isActive"
        tag="div"
        class="p-mr-2"
      >
        <p-input-switch
          id="referenceToHandle-isActive"
          v-model="referenceToHandle.isActive"
        />
      </validation-provider>
      <validation-provider
        vid="referenceToHandle-position"
        tag="div"
        class="input-number-reference"
      >
        <p-input-number
          id="referenceToHandle-position"
          v-model="referenceToHandle.position"
          :showButtons="true"
          :min="0"
          :maxFractionDigits="0"
          :disabled="!referenceToHandle.isActive"
        />
      </validation-provider>
    </div>
    <div>
      {{ $t('pages.databaseSchema.handleColumnModal.validation') }}
      <lck-column-validation
        :columnType="selectedColumnTypeIdToHandle"
        :columnValidation="columnValidation"
        class="p-my-2"
      />
    </div>
    <validation-provider
      vid="column-type"
      tag="div"
      class="p-field"
      :name="$t('pages.databaseSchema.handleColumnModal.columnType')"
      rules="required"
      v-slot="{
        errors,
        classes
      }"
    >
      <label for="column-type">
        {{ $t('pages.databaseSchema.handleColumnModal.columnType') }}
      </label>
      <span class="field-required">*</span>
      <p-dropdown
        @change="onSelectedColumnTypeTohandleChange"
        id="column-type"
        appendTo="body"
        v-model="selectedColumnTypeIdToHandle"
        :options="columnTypes"
        dataKey="id"
        optionValue="id"
        optionLabel="name"
        :placeholder="$t('pages.databaseSchema.handleColumnModal.selectColumnType')"
        :disabled="columnToHandle != null && columnToHandle.id != null"
      />
      <span :class="classes">{{ errors[0] }}</span>
    </validation-provider>
    <lck-select-type-column
      v-if="selectedColumnTypeIdToHandle && isSelectColumnType"
      @select-type-values-change="selectTypeValuesChange"
      @default-select-type-value-id-change="defaultSelectTypeValueIdChange"
      :columnToHandle="columnToHandle"
      class="p-mt-4"
    />
    <div
      class="p-field"
      v-if="selectedColumnTypeIdToHandle && isBooleanType"
    >
      <label>
        {{ $t('pages.databaseSchema.selectType.defaultValue') }}
      </label>
      <p-checkbox
        v-if="columnToHandle && columnToHandle.settings"
        class="p-field-checkbox"
        v-model="columnToHandle.settings.default"
        :binary="true"
      />
      <p-checkbox
        v-else
        class="p-field-checkbox"
        v-model="settings.default"
        :binary="true"
      />
    </div>
    <lck-relation-between-tables-type-column
      v-if="selectedColumnTypeIdToHandle && isRelationBetweenTablesType"
      @relation-table-id-change="tableIdChange"
      :columnToHandle="columnToHandle"
    />
    <lck-looked-up-type-column
      v-if="selectedColumnTypeIdToHandle && isLookedUpType"
      :key="selectedColumnTypeIdToHandle"
      @local-field-id-change="localFieldIdChange"
      @foreign-field-id-change="foreignFieldIdChange"
      @relation-table-id-change="tableIdChange"
      :columnToHandle="columnToHandle"
      :columnType="selectedColumnTypeIdToHandle"
      :tableId="tableId"
    />
    <validation-provider
      v-if="selectedColumnTypeIdToHandle && isFormulaType"
      vid="column-formula-content"
      ref="vp-column-formula-content"
      tag="div"
      class="p-field"
      :name="$t('components.formulas.formula')"
      rules="required"
      v-slot="{
        errors,
        classes,
        validate,
      }"
    >
      <label for="column-formula-content">{{ $t('components.formulas.formula') }}</label>
      <span class="field-required">*</span>
      <lck-monaco-editor
        id="column-formula-content"
        :handledError="errorHandleColumn"
        language="locokitLanguage"
        :tableColumns="tableColumns"
        theme="locokitTheme"
        :value="settings && settings.formula"
        @change="formulaChange($event, validate)"
      />
      <span :class="classes">{{ errors[0] }}</span>
    </validation-provider>
    <div
      v-if="errorHandleColumn"
      class="p-invalid"
    >
      <small
        id="error-column-to-handle"
        class="p-invalid"
      >
        {{ errorHandleColumn }}
      </small>
    </div>
  </lck-dialog-form>

</template>

<script>
import Vue from 'vue'

import { ValidationProvider } from 'vee-validate'
import { COLUMN_TYPE } from '@locokit/lck-glossary'

import { lckServices } from '@/services/lck-api'
import { formulaColumnsNamesToIds, formulaColumnsIdsToNames } from '@/services/lck-utils/formula'

import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import InputSwitch from 'primevue/inputswitch'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import Checkbox from 'primevue/checkbox'

import DialogForm from '@/components/ui/DialogForm/DialogForm.vue'
import SelectTypeColumn from '@/components/admin/database/SelectTypeColumn/SelectTypeColumn.vue'
import ColumnValidation from '@/components/admin/database/ColumnValidation/ColumnValidation.vue'
import RelationBetweenTablesTypeColumn from '@/views/modals/RelationBetweenTablesTypeColumn.vue'
import LookedUpTypeColumn from '@/views/modals/LookedUpTypeColumn.vue'

export default {
  name: 'HandleColumnModal',
  components: {
    'lck-dialog-form': DialogForm,
    'lck-select-type-column': SelectTypeColumn,
    'lck-monaco-editor': () => import(/* webpackChunkName: "lck-monaco-editor" */'@/components/store/MonacoEditor/MonacoEditor.vue'),
    'lck-relation-between-tables-type-column': RelationBetweenTablesTypeColumn,
    'lck-looked-up-type-column': LookedUpTypeColumn,
    'lck-column-validation': ColumnValidation,
    'p-input-text': Vue.extend(InputText),
    'p-textarea': Vue.extend(Textarea),
    'p-dropdown': Vue.extend(Dropdown),
    'p-checkbox': Vue.extend(Checkbox),
    'p-input-switch': Vue.extend(InputSwitch),
    'p-input-number': Vue.extend(InputNumber),
    'validation-provider': Vue.extend(ValidationProvider),
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    databaseId: String,
    tableId: String,
    columnToHandle: {
      type: Object,
      required: false,
    },
    tableColumns: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  data () {
    return {
      COLUMN_TYPE,
      columnTypes: Object.keys(COLUMN_TYPE).filter((key) => isNaN(key)).map((key) => ({
        id: COLUMN_TYPE[key],
        name: key,
      })),
      columnNameToHandle: null,
      columnDocumentation: null,
      columnValidation: {},
      referenceToHandle: { isActive: false, position: 0 },
      selectedColumnTypeIdToHandle: null,
      errorHandleColumn: null,
      settings: {},
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
      return this.selectedColumnTypeIdToHandle === COLUMN_TYPE.LOOKED_UP_COLUMN ||
        this.selectedColumnTypeIdToHandle === COLUMN_TYPE.VIRTUAL_LOOKED_UP_COLUMN
    },
    isFormulaType () {
      return this.selectedColumnTypeIdToHandle === COLUMN_TYPE.FORMULA
    },
    isBooleanType () {
      return this.selectedColumnTypeIdToHandle === COLUMN_TYPE.BOOLEAN
    },
    cannotBeUsedAsReference () {
      switch (this.selectedColumnTypeIdToHandle) {
        case COLUMN_TYPE.FORMULA:
        case COLUMN_TYPE.VIRTUAL_LOOKED_UP_COLUMN:
          return true
      }
      return false
    },
  },
  methods: {
    closeHandleColumnModal () {
      this.columnNameToHandle = null
      this.columnDocumentation = null
      this.selectedColumnTypeIdToHandle = null
      this.columnValidation = {}
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
              documentation: this.columnDocumentation,
              reference: this.referenceToHandle.isActive,
              // eslint-disable-next-line @typescript-eslint/camelcase
              reference_position: Number(this.referenceToHandle.position),
              // eslint-disable-next-line @typescript-eslint/camelcase
              // column_type_id: this.selectedColumnTypeIdToHandle,
              settings: this.getSettings(),
              validation: this.columnValidation,
            })
          } else {
            await lckServices.tableColumn.create({
              // eslint-disable-next-line @typescript-eslint/camelcase
              table_id: this.tableId,
              text: this.columnNameToHandle,
              documentation: this.columnDocumentation,
              reference: this.referenceToHandle.isActive,
              // eslint-disable-next-line @typescript-eslint/camelcase
              reference_position: Number(this.referenceToHandle.position),
              // eslint-disable-next-line @typescript-eslint/camelcase
              column_type_id: this.selectedColumnTypeIdToHandle,
              settings: this.getSettings(),
              validation: this.columnValidation,
            })
          }
          this.columnNameToHandle = null
          this.columnDocumentation = null
          this.selectedColumnTypeIdToHandle = null
          this.columnValidation = {}
          this.$emit('close', true)
        } else {
          throw new Error(this.$t('pages.databaseSchema.handleColumnModal.errorNoData'))
        }
      } catch (errorHandleColumn) {
        this.errorHandleColumn = errorHandleColumn
      }
    },
    getSettings () {
      if (this.isSelectColumnType || this.isRelationBetweenTablesType || this.isLookedUpType || this.isBooleanType) {
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
    formulaChange (data, validate) {
      validate(data)
      this.$refs['vp-column-formula-content'].setFlags({
        pristine: false,
        dirty: true,
        touched: true,
        untouched: false,
      })
      this.settings.formula = data
    },
    formulaSettings () {
      return {
        formula: formulaColumnsNamesToIds(this.settings.formula || '', this.tableColumns),
      }
    },
  },
  watch: {
    columnToHandle: function () {
      if (this.columnToHandle) {
        this.columnNameToHandle = this.columnToHandle.text
        this.columnDocumentation = this.columnToHandle.documentation
        if (Object.prototype.hasOwnProperty.call(this.columnToHandle, 'reference')) {
          this.referenceToHandle.isActive = this.columnToHandle.reference
        }
        if (Object.prototype.hasOwnProperty.call(this.columnToHandle, 'reference_position')) {
          this.referenceToHandle.position = this.columnToHandle.reference_position
        }
        this.selectedColumnTypeIdToHandle = this.columnToHandle.column_type_id
        this.columnValidation = this.columnToHandle.validation || {}
        // Set formula column
        if (this.isFormulaType) {
          this.settings.formula = formulaColumnsIdsToNames(
            this.columnToHandle.settings?.formula || '',
            this.tableColumns,
          )
        } else {
          this.settings = this.columnToHandle.settings
        }
      }
      this.errorHandleColumn = null
    },
  },
}
</script>

<style scoped>
.input-number-reference {
  width: 100px;
}

/** Need these two rules to display the monaco editor definition/documentation on screen next to the input area*/
::v-deep .monaco-editor .overflow-guard {
  position: static;
}

::v-deep .monaco-editor .suggest-details-container {
  position: absolute !important;
  left: -1px !important;
  top: -1px !important;
  transform: translateX(-100%);
  width: 4rem;
}

/** Need this rule to display the monaco editor suggestion + definition/documentation on tootlip */
.no-overflow-formula ::v-deep .p-dialog-content {
  overflow: unset;
}
</style>
