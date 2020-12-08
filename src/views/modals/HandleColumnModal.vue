<template>
  <lck-dialog
    :visible.sync="visible"
    :header="columnToHandle ? $t('pages.databaseSchema.handleColumnModal.updateColumn') : $t('pages.databaseSchema.handleColumnModal.createColumn')"
    @input="confirmHandleColumnModal"
    @close="closeHandleColumnModal"
  >
    <div class="p-field">
      <label for="column-name">{{ $t('pages.databaseSchema.handleColumnModal.columnName') }}</label>
      <p-input-text v-model="columnNameToHandle" id="column-name" type="text" autofocus />
    </div>
    <div v-if="columnToHandle" class="p-mb-3">
      UUID : {{ columnToHandle.id }}
    </div>
    <div>
      <p-dropdown @change="onSelectedColumnTypeTohandleChange" appendTo="body" v-model="selectedColumnTypeIdToHandle" :options="columnTypes" dataKey="id" optionValue="id" optionLabel="name" :placeholder="$t('pages.databaseSchema.handleColumnModal.selectColumnType')" />
    </div>
    <lck-select-type-column
      v-if="selectedColumnTypeIdToHandle && selectedColumnTypeIdToHandle === accessibleColumnTypes.SINGLE_SELECT"
      @select-type-values-change="selectTypeValuesChange"
      @default-select-type-value-id-change="defaultSelectTypeValueIdChange"
      :columnToHandle="columnToHandle"
    />
    <div v-if="errorHandleColumn" class="p-invalid">
      <small id="error-column-to-handle" class="p-invalid">{{ errorHandleColumn }}</small>
    </div>
  </lck-dialog>
</template>
<script>
import Vue from 'vue'
import { COLUMN_TYPE } from '@locokit/lck-glossary'
import { lckClient } from '@/services/lck-api'
import Dialog from '@/components/ui/Dialog/Dialog.vue'
import SelectTypeColumn from '@/components/admin/database/SelectTypeColumn/SelectTypeColumn'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'

export default {
  name: 'HandleColumnModal',
  components: {
    'lck-dialog': Vue.extend(Dialog),
    'lck-select-type-column': Vue.extend(SelectTypeColumn),
    'p-input-text': Vue.extend(InputText),
    'p-dropdown': Vue.extend(Dropdown)
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    tableId: String,
    columnToHandle: {
      type: Object,
      required: false
    }
  },
  data () {
    return {
      accessibleColumnTypes: COLUMN_TYPE,
      columnTypes: Object.keys(COLUMN_TYPE).filter((key) => isNaN(key)).map((key) => ({ id: COLUMN_TYPE[key], name: key })),
      columnNameToHandle: null,
      selectedColumnTypeIdToHandle: null,
      errorHandleColumn: null,
      settings: { default: null }
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
            await lckClient.service('column').patch(this.columnToHandle.id, {
              // eslint-disable-next-line @typescript-eslint/camelcase
              table_id: this.tableId,
              text: this.columnNameToHandle,
              settings: this.selectedColumnTypeIdToHandle === COLUMN_TYPE.SINGLE_SELECT ? this.settings : {}
            })
          } else {
            await lckClient.service('column').create({
              // eslint-disable-next-line @typescript-eslint/camelcase
              table_id: this.tableId,
              text: this.columnNameToHandle,
              // eslint-disable-next-line @typescript-eslint/camelcase
              column_type_id: this.selectedColumnTypeIdToHandle,
              settings: this.selectedColumnTypeIdToHandle === COLUMN_TYPE.SINGLE_SELECT ? this.settings : {}
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
    onSelectedColumnTypeTohandleChange () {
      this.settings = { default: null }
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
    }
  },
  watch: {
    columnToHandle: function () {
      if (this.columnToHandle) {
        this.columnNameToHandle = this.columnToHandle.text
        this.selectedColumnTypeIdToHandle = this.columnToHandle.column_type_id
      }
    }
  }
}
</script>
<style scoped>
/deep/ .p-dialog-content {
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
}
</style>
