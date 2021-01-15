<template>
  <lck-dialog
    :visible.sync="visible"
    :header="
      columnToHandle
      ? $t('pages.databaseSchema.handleColumnModal.updateColumn')
      : $t('pages.databaseSchema.handleColumnModal.createColumn')
    "
    @input="confirmHandleColumnModal"
    @close="closeHandleColumnModal"
    :isActionForm="true"
  >
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
    <div v-if="columnToHandle" class="p-mb-3">
      UUID : {{ columnToHandle.id }}
    </div>
    <div>
      <p-dropdown
        @change="onSelectedColumnTypeTohandleChange"
        appendTo="body"
        v-model="selectedColumnTypeIdToHandle"
        :options="columnTypes"
        dataKey="id"
        optionValue="id"
        optionLabel="name"
        :placeholder="$t('pages.databaseSchema.handleColumnModal.selectColumnType')"
      />
    </div>
    <lck-select-type-column
      v-if="selectedColumnTypeIdToHandle && isSelectColumnType"
      @select-type-values-change="selectTypeValuesChange"
      @default-select-type-value-id-change="defaultSelectTypeValueIdChange"
      :columnToHandle="columnToHandle"
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
    <div v-if="errorHandleColumn" class="p-invalid">
      <small id="error-column-to-handle" class="p-invalid">
        {{ errorHandleColumn }}
      </small>
    </div>
  </lck-dialog>
</template>

<script>
import Vue from 'vue'
import { COLUMN_TYPE } from '@locokit/lck-glossary'
import { lckServices } from '@/services/lck-api'
import Dialog from '@/components/ui/Dialog/Dialog.vue'
import SelectTypeColumn from '@/components/admin/database/SelectTypeColumn/SelectTypeColumn'
import RelationBetweenTablesTypeColumn from './RelationBetweenTablesTypeColumn.vue'
import LookedUpTypeColumn from './LookedUpTypeColumn'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'

export default {
  name: 'HandleColumnModal',
  components: {
    'lck-dialog': Vue.extend(Dialog),
    'lck-select-type-column': Vue.extend(SelectTypeColumn),
    'lck-relation-between-tables-type-column': Vue.extend(RelationBetweenTablesTypeColumn),
    'lck-looked-up-type-column': Vue.extend(LookedUpTypeColumn),
    'p-input-text': Vue.extend(InputText),
    'p-dropdown': Vue.extend(Dropdown)
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
    }
  },
  data () {
    return {
      columnTypes: Object.keys(COLUMN_TYPE).filter((key) => isNaN(key)).map((key) => ({ id: COLUMN_TYPE[key], name: key })),
      columnNameToHandle: null,
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
              // eslint-disable-next-line @typescript-eslint/camelcase
              // column_type_id: this.selectedColumnTypeIdToHandle,
              settings: this.isSelectColumnType || this.isRelationBetweenTablesType || this.isLookedUpType ? this.settings : {}
            })
          } else {
            await lckServices.tableColumn.create({
              // eslint-disable-next-line @typescript-eslint/camelcase
              table_id: this.tableId,
              text: this.columnNameToHandle,
              // eslint-disable-next-line @typescript-eslint/camelcase
              column_type_id: this.selectedColumnTypeIdToHandle,
              settings: this.isSelectColumnType || this.isRelationBetweenTablesType || this.isLookedUpType ? this.settings : {}
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
