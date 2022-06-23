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
      <label
        for="column-name"
        class="label-field-required"
      >
        {{ $t('pages.databaseSchema.handleColumnModal.columnName') }}
      </label>
      <p-input-text
        v-model="columnName"
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
    <validation-provider
      vid="column-slug"
      tag="div"
      class="p-field p-d-flex p-flex-column"
      rules="required|snakeCase"
      :name="$t('pages.databaseSchema.handleColumnModal.columnSlug')"
      v-slot="{
        errors,
        classes
      }"
    >
      <label for="column-slug" :class="{'label-field-required': columnToHandle && columnToHandle.slug }">
        {{ $t('pages.databaseSchema.handleColumnModal.columnSlug') }}
      </label>
      <p-input-text
        v-if="columnToHandle && columnToHandle.slug"
        v-model="columnSlug"
        id="column-slug"
        type="text"
      />
      <p-input-text
        v-else
        id="column-slug"
        type="text"
        :value="autogenerateSlug"
        disabled
      />
      <small>{{ $t('pages.databaseSchema.handleColumnModal.columnSlugInfo') }}</small>
      <span :class="classes">{{ errors[0] }}</span>
    </validation-provider>
    <div class="flex p-ai-center p-field">
      <label class="p-mr-2">
        {{ $t('pages.databaseSchema.handleColumnModal.reference') }}
      </label>
      <div class="p-d-flex">
        <validation-provider
          vid="referenceToHandle-isActive"
          tag="div"
          class="p-mr-2 p-d-flex p-as-center"
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
      <label
        for="column-type"
        class="label-field-required"
      >
        {{ $t('pages.databaseSchema.handleColumnModal.columnType') }}
      </label>
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
      <span
        v-if="selectedColumnTypeIdToHandle"
        class="p-field"
      >

        {{ getSelectedColumnTypeDisplayDescription (selectedColumnTypeIdToHandle)}}

      </span>

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
      <label
        for="column-formula-content"
        class="label-field-required"
      >{{ $t('components.formulas.formula') }}</label>
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

<script lang="ts">
import Vue, { PropOptions } from 'vue'

import { ValidationProvider } from 'vee-validate'
import { COLUMN_TYPE } from '@locokit/lck-glossary'
import { TranslateResult } from 'vue-i18n'

import { lckServices } from '@/services/lck-api'
import { formulaColumnsNamesToIds, formulaColumnsIdsToNames } from '@/services/lck-utils/formula'
import { transformColumnsType } from '@/services/lck-utils/temporary'
import { createSlug } from '@/services/lck-utils/transformText'

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
import { LckTableColumn, SelectValue, SelectValueWithId } from '@/services/lck-api/definitions'

export default Vue.extend({
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
    tableId: {
      type: String,
      required: true,
    },
    columnToHandle: {
      type: Object,
      required: false,
    } as PropOptions<LckTableColumn>,
    tableColumns: {
      type: Array,
      required: false,
      default: () => [],
    } as PropOptions<LckTableColumn[]>,
  },
  data () {
    return {
      COLUMN_TYPE,
      columnName: null as string|null,
      columnDocumentation: null as string|null|undefined,
      columnSlug: null as string|null,
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      columnValidation: {} as Record<string, any>,
      referenceToHandle: { isActive: false, position: 0 },
      selectedColumnTypeIdToHandle: null as COLUMN_TYPE|null,
      errorHandleColumn: null as string|null,
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      settings: {} as Record<string, any>,
    }
  },
  computed: {
    autogenerateSlug (): null|string {
      if (this.columnName) return createSlug(this.columnName)
      return null
    },
    isSelectColumnType (): boolean {
      return this.selectedColumnTypeIdToHandle === COLUMN_TYPE.SINGLE_SELECT || this.selectedColumnTypeIdToHandle === COLUMN_TYPE.MULTI_SELECT
    },
    columnTypes (): {id: number; description: string|TranslateResult; name: string|TranslateResult}[] {
      return Object.keys(transformColumnsType()).map((key: string) => {
        return ({
          id: COLUMN_TYPE[key as keyof typeof COLUMN_TYPE],
          description: this.$t(`pages.databaseSchema.columnType.${key}.description`),
          name: this.$t(`pages.databaseSchema.columnType.${key}.name`),
        })
      })
    },
    isRelationBetweenTablesType (): boolean {
      return this.selectedColumnTypeIdToHandle === COLUMN_TYPE.RELATION_BETWEEN_TABLES
    },
    isLookedUpType (): boolean {
      return this.selectedColumnTypeIdToHandle === COLUMN_TYPE.LOOKED_UP_COLUMN ||
        this.selectedColumnTypeIdToHandle === COLUMN_TYPE.VIRTUAL_LOOKED_UP_COLUMN
    },
    isFormulaType (): boolean {
      return this.selectedColumnTypeIdToHandle === COLUMN_TYPE.FORMULA
    },
    isBooleanType (): boolean {
      return this.selectedColumnTypeIdToHandle === COLUMN_TYPE.BOOLEAN
    },
  },
  methods: {
    closeHandleColumnModal (reloadParent = false): void {
      this.columnName = null
      this.columnDocumentation = null
      this.columnSlug = null
      this.selectedColumnTypeIdToHandle = null
      this.columnValidation = {}
      this.referenceToHandle = { isActive: false, position: 0 }
      this.settings = {}
      this.$emit('close', reloadParent)
    },
    async confirmHandleColumnModal () {
      try {
        if (this.columnName && this.selectedColumnTypeIdToHandle) {
          if (this.columnToHandle) {
            await lckServices.tableColumn.patch(this.columnToHandle.id, {
              // eslint-disable-next-line @typescript-eslint/camelcase
              table_id: this.tableId,
              text: this.columnName,
              documentation: this.columnDocumentation,
              slug: this.columnSlug,
              reference: this.referenceToHandle.isActive,
              // eslint-disable-next-line @typescript-eslint/camelcase
              reference_position: Number(this.referenceToHandle.position),
              settings: this.getSettings(),
              validation: this.columnValidation,
            } as LckTableColumn)
          } else {
            await lckServices.tableColumn.create({
              // eslint-disable-next-line @typescript-eslint/camelcase
              table_id: this.tableId,
              text: this.columnName,
              documentation: this.columnDocumentation,
              slug: this.autogenerateSlug,
              reference: this.referenceToHandle.isActive,
              // eslint-disable-next-line @typescript-eslint/camelcase
              reference_position: Number(this.referenceToHandle.position),
              // eslint-disable-next-line @typescript-eslint/camelcase
              column_type_id: this.selectedColumnTypeIdToHandle,
              settings: this.getSettings(),
              validation: this.columnValidation,
            } as LckTableColumn)
          }
          this.closeHandleColumnModal(true)
        }
      } catch (errorHandleColumn) {
        if (errorHandleColumn instanceof Error) this.errorHandleColumn = errorHandleColumn.message
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

    getSelectedColumnTypeDisplayDescription (selectedColumnTypeIdToHandle: number) {
      return this.columnTypes.find((columnType) => columnType.id === selectedColumnTypeIdToHandle)?.description
    },

    selectTypeValuesChange (data: SelectValueWithId[]) {
      let settings = {}
      data.forEach((selectTypeValue) => {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const newSelectTypeValue: Record<string, any> = {}
        newSelectTypeValue[selectTypeValue.id] = { ...selectTypeValue } as SelectValue
        delete newSelectTypeValue[selectTypeValue.id].id
        settings = { ...settings, ...newSelectTypeValue }
      })
      this.settings = { values: settings, default: this.settings.default }
    },
    defaultSelectTypeValueIdChange (uuid: string) {
      this.settings.default = uuid
    },
    tableIdChange (uuid: string) {
      this.settings.tableId = uuid
    },
    localFieldIdChange (uuid: string) {
      this.settings.localField = uuid
    },
    foreignFieldIdChange (uuid: string) {
      this.settings.foreignField = uuid
    },
    formulaChange (data: string, validate: Function) {
      validate(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any,no-unused-expressions
      (this.$refs['vp-column-formula-content'] as any)?.setFlags({
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
        this.columnName = this.columnToHandle.text
        this.columnDocumentation = this.columnToHandle.documentation
        this.columnSlug = this.columnToHandle.slug
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
})
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
