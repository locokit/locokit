<template>
  <p-sidebar
    class="p-sidebar-update-table p-fluid"
    :position="'right'"
    :visible="showUpdateTableSidebar"
    :modal="false"
    :dismissable="false"
    @update:visible="$emit('close', $event)"
  >
    <div v-if="currentTableToUpdate">
      <h2 class="lck-color-page-title">{{ $t('pages.databaseSchema.updateTableSidebar.updateTable') }}</h2>
      <div class="p-fluid">
        <div class="p-field">
          <label for="table-name">{{ $t('pages.databaseSchema.updateTableSidebar.tableName') }}</label>
          <p-input-text id="table-name" type="text" v-model="currentTableToUpdate.text" />
        </div>
        <div class="p-field">
          <label for="table-name">{{ $t('pages.databaseSchema.updateTableSidebar.tableDoc') }}</label>
          <p-textarea id="table-name" type="text" v-model="currentTableToUpdate.documentation" />
        </div>
        <p-button
          @click="updateTableName"
          :label="$t('pages.databaseSchema.updateTableSidebar.updateColumn')"
          icon="pi pi-check"
        />
      </div>

      <div class="p-d-flex p-my-4">
        <div class="p-ai-start">
          <p-button @click="createColumn" :label="$t('pages.databaseSchema.updateTableSidebar.createColumn')" icon="pi pi-plus" class="p-button-text" />
        </div>
      </div>
      <p-datatable :value="currentTableToUpdate.columns">
        <p-column field="text" :header="$t('pages.databaseSchema.updateTableSidebar.columnName')"></p-column>
        <p-column :header="$t('pages.databaseSchema.updateTableSidebar.columnType')">
          <template #body="props">
            {{ getColumnType(props.data.column_type_id) }}
          </template>
        </p-column>
        <p-column>
          <template #body="props">
            <p-button icon="pi pi-pencil" class="p-button-rounded lck-color-content p-column-button-color p-mr-2" @click="updateColumn(props.data)" />
            <p-button icon="pi pi-trash" class="p-button-rounded lck-color-content p-column-button-color" @click="deleteColumn(props.data)" />
          </template>
        </p-column>
      </p-datatable>
      <handle-column-modal
        :visible="showHandleColumnModal"
        :databaseId="databaseId"
        :tableId="currentTable.id"
        :tableColumns="currentTable.columns"
        :columnToHandle="columnToHandle"
        @close="onCloseHandleColumnModal"
      />
      <delete-column-modal
        :visible="showDeleteColumnModal"
        :tableId="currentTable.id"
        :columnToHandle="columnToHandle"
        @close="onCloseDeleteColumnModal"
      />
    </div>
  </p-sidebar>
</template>
<script>
import Vue from 'vue'
import { lckServices } from '@/services/lck-api'
import { COLUMN_TYPE } from '@locokit/lck-glossary'
import Button from 'primevue/button'
import Sidebar from 'primevue/sidebar'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

import DeleteColumnModal from '@/views/modals/DeleteColumnModal'

export default {
  name: 'UpdateTableSidebar',
  components: {
    'p-button': Vue.extend(Button),
    'p-sidebar': Vue.extend(Sidebar),
    'p-input-text': Vue.extend(InputText),
    'p-textarea': Vue.extend(Textarea),
    'p-datatable': Vue.extend(DataTable),
    'p-column': Vue.extend(Column),
    'handle-column-modal': () => import(/* webpackChunkName: "lck-sidebar-schema-monaco-editor" */'@/views/modals/HandleColumnModal'),
    'delete-column-modal': DeleteColumnModal
  },
  props: {
    databaseId: String,
    currentTable: {
      type: Object,
      default: () => ({})
    },
    showUpdateTableSidebar: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    currentTableToUpdate: function () { return JSON.parse(JSON.stringify(this.currentTable)) }
  },
  data () {
    return {
      columnTypes: Object.keys(COLUMN_TYPE).map((key) => ({ id: COLUMN_TYPE[key], name: key })),
      showHandleColumnModal: false,
      showDeleteColumnModal: false,
      columnToHandle: null
    }
  },
  methods: {
    async updateTableName () {
      try {
        await lckServices.table.patch(this.currentTable.id, {
          text: this.currentTableToUpdate.text,
          documentation: this.currentTableToUpdate.documentation
        })
        this.$emit('reload-tables')
      } catch (errorUpdateTable) {
        console.error(errorUpdateTable.message)
      }
    },
    createColumn () {
      this.showHandleColumnModal = true
    },
    updateColumn (column) {
      this.columnToHandle = column
      this.showHandleColumnModal = true
    },
    onCloseHandleColumnModal (shouldReloadTable) {
      if (shouldReloadTable) {
        this.$emit('reload-tables')
      }
      this.columnToHandle = null
      this.showHandleColumnModal = false
    },
    async deleteColumn (column) {
      this.columnToHandle = column
      this.showDeleteColumnModal = true
    },
    onCloseDeleteColumnModal (shouldReloadTable) {
      if (shouldReloadTable) {
        this.$emit('reload-tables')
      }
      this.columnToHandle = null
      this.showDeleteColumnModal = false
    },
    getColumnType (columnTypeId) {
      return this.columnTypes.find((columnType) => columnType.id === columnTypeId).name
    }
  }
}
</script>
<style scoped>
.p-sidebar {
  top: 60px;
  height: calc(100% - 60px);
  width: 50vw;
  overflow-y: scroll;
}
.p-column-button-color {
  color: white !important;
}
</style>
