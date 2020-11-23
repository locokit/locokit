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
      <div class="p-d-flex">
        <div>
            <label for="table-name">{{ $t('pages.databaseSchema.updateTableSidebar.tableName') }}</label>
            <p-input-text id="table-name" type="text" v-model="currentTableToUpdate.text" />
        </div>
        <div class="p-d-flex p-ai-end">
          <p-button @click="updateTableName" label="Modifier" icon="pi pi-check" class="p-button-text" />
        </div>
      </div>
      <div class="p-d-flex p-my-4">
        <div class="p-ai-start">
          <p-button @click="showCreateColumn" :label="$t('pages.databaseSchema.updateTableSidebar.createColumn')" icon="pi pi-plus" class="p-button-text" />
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
                <p-button icon="pi pi-pencil" class="p-button-rounded lck-color-content p-column-button-color p-mr-2" @click="updateColumn(props.data)" disabled="disabled" />
                <p-button icon="pi pi-trash" class="p-button-rounded lck-color-content p-column-button-color" @click="deleteColumn(props.data)" disabled="disabled" />
            </template>
          </p-column>
      </p-datatable>
      <create-column-modal
        :visible="showCreateColumnModal"
        :tableId="currentTable.id"
        @close="onCloseCreateColumnModal"
      />
    </div>
  </p-sidebar>
</template>
<script>
import Vue from 'vue'
import { lckClient } from '@/services/lck-api'
import { COLUMN_TYPE } from '@locokit/lck-glossary'
import Button from 'primevue/button'
import Sidebar from 'primevue/sidebar'
import InputText from 'primevue/inputtext'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import CreateColumnModal from '@/views/modals/CreateColumnModal'

export default {
  name: 'UpdateTableSidebar',
  components: {
    'p-button': Vue.extend(Button),
    'p-sidebar': Vue.extend(Sidebar),
    'p-input-text': Vue.extend(InputText),
    'p-datatable': Vue.extend(DataTable),
    'p-column': Vue.extend(Column),
    'create-column-modal': Vue.extend(CreateColumnModal)
  },
  props: {
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
      columnNameToCreate: null,
      selectedColumnTypeToCreate: null,
      showCreateColumnModal: false
    }
  },
  methods: {
    async updateTableName () {
      try {
        await lckClient.service('table').patch(this.currentTable.id, {
          text: this.currentTableToUpdate.text
        })
        this.$emit('reload-tables')
      } catch (errorUpdateTable) {
        console.log(errorUpdateTable.message)
      }
    },
    showCreateColumn () {
      this.showCreateColumnModal = true
    },
    onCloseCreateColumnModal (shouldReloadTable) {
      if (shouldReloadTable) {
        this.$emit('reload-tables')
      }
      this.showCreateColumnModal = false
    },
    updateColumn (column) {
      console.log('updateColumn', column)
    },
    deleteColumn (column) {
      console.log('deleteColumn', column)
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
