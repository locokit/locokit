<template>
  <div>
    <p-toolbar class="p-mb-4">
      <template slot="left">
        <p-button
          :label="$t('form.add')"
          icon="pi pi-plus"
          class="p-button-success p-mr-2"
          @click="openNew"
        />
        <p-button
          :label="$t('form.delete')"
          icon="pi pi-trash"
          class="p-button-danger"
          @click="confirmDeleteSelected"
          :disabled="!selectedRows || !selectedRows.length"
        />
      </template>

      <template slot="right">
        <p-file-upload
          mode="basic"
          label="Import"
          chooseLabel="Import"
          class="p-mr-2"
          disabled
        />
        <p-button
          label="Export"
          icon="pi pi-upload"
          class="p-button-help"
          @click="exportCSV($event)"
          disabled
        />
      </template>
    </p-toolbar>

    <div v-if="block.definition">
      <p-datatable
        :value="dataToDisplay"
        removableSort
        :paginator="true"
        :lazy="true"
        :loading="block.loading"
        :rows="dataTable.limit"
        :totalRecords="dataTable.total"
        class="p-datatable-sm"
        @page="onPage($event)"
        :selection.sync="selectedRows"
        editMode="cell"
        @cell-edit-complete="onCellEditComplete"
        :resizableColumns="true"
        columnResizeMode="fit"
      >
        <p-column selectionMode="multiple" headerStyle="width: 3rem"></p-column>
        <p-column
          v-for="(column, index) in block.definition.columns"
          :key="column.id"
          :field="column.id"
          :header="column.text"
          sortable
          :frozen="index === 0"
        >
          <template #editor="slotProps">
            <p-dropdown
              v-if="column.column_type_id === 9"
              :options="statuses"
              optionLabel="label"
              optionValue="value"
              :filter="true"
              :showClear="true"
              placeholder="Select an option"
              @change="onDropdownEdit"
            >
              <template #value="slotProps">
                <div class="country-item country-item-value" v-if="slotProps.value">
                  {{slotProps.value.label}}
                </div>
                <span v-else>
                  {{slotProps.placeholder}}
                </span>
              </template>
              <template #option="slotProps">
                <span
                >
                  {{ slotProps.option.label }}
                </span>
              </template>
            </p-dropdown>
            <p-input-text
              v-else
              v-model="slotProps.data[column.id]"
              :value="slotProps.data[column.id]"
              @input="onCellEdit($event, slotProps)"
            />
          </template>
          <template
            v-if="column.column_type_id === 9"
            #body="slotProps"
          >
            {{ slotProps.data[column.id] }}
          </template>
        </p-column>
      </p-datatable>
    </div>

    <p-dialog
      :visible.sync="addRowDialog"
      :style="{width: '450px'}"
      :header="$t('database.addNewRow')"
      :modal="true"
      class="p-fluid"
    >
      <div v-if="block.definition">
        <div
          class="p-field"
          v-for="column in block.definition.columns"
          :key="column.id"
        >
          <label :for="column.id">{{ column.text }}</label>
          <p-input-text
            :id="column.id"
            v-model="newRow[column.id]"
          />
        </div>
      </div>

      <template #footer>
        <p-button
          :label="$t('form.cancel')"
          icon="pi pi-times"
          class="p-button-text"
          @click="hideDialog"
        />
        <p-button
          :label="$t('form.submit')"
          icon="pi pi-check"
          class="p-button-text"
          @click="saveRow"
        />
      </template>
    </p-dialog>

    <p-dialog
      :visible.sync="deleteRowsDialog"
      :style="{width: '450px'}"
      header="Confirm"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
        <span v-if="selectedRows">Are you sure you want to delete the selected products?</span>
      </div>
      <template #footer>
        <p-button
          label="No"
          icon="pi pi-times"
          class="p-button-text"
          @click="deleteRowsDialog = false"
        />
        <p-button
          label="Yes"
          icon="pi pi-check"
          class="p-button-text"
          @click="deleteSelectedRows"
        />
      </template>
    </p-dialog>

  </div>
</template>

<script>
import Vue from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputNumber from 'primevue/inputnumber'
import RadioButton from 'primevue/radiobutton'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Toolbar from 'primevue/toolbar'
import FileUpload from 'primevue/fileupload'
import { COLUMN_TYPE } from '@locokit/lck-glossary'

import { saveTableData, deleteTableData, patchTableData } from '@/store/database'

export default {
  name: 'CrudTable',
  components: {
    'p-button': Vue.extend(Button),
    'p-dialog': Vue.extend(Dialog),
    'p-dropdown': Vue.extend(Dropdown),
    // 'p-input-number': Vue.extend(InputNumber),
    'p-input-text': Vue.extend(InputText),
    // 'p-radio-button': Vue.extend(RadioButton),
    // 'p-textarea': Vue.extend(Textarea),
    'p-datatable': Vue.extend(DataTable),
    'p-column': Vue.extend(Column),
    'p-toolbar': Vue.extend(Toolbar),
    'p-file-upload': Vue.extend(FileUpload)
  },
  props: {
    block: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      statuses: [
        { label: 'In Stock', value: 3 },
        { label: 'Low Stock', value: 2 },
        { label: 'Out of Stock', value: 1 }
      ],
      selectedRows: null,
      addRowDialog: false,
      editingCellRows: [],
      deleteRowsDialog: false,
      submitted: false,
      newRow: {}
    }
  },
  computed: {
    dataTable () {
      if (!this.block.content) return {}
      return { ...this.block.content }
    },
    /**
     * the data to display help DataTable prime component to display the value
     * and sort them by alphabetic order
     * BUT that's not working for Date or other stuff that are not "alphabetical"
     * TODO: make this computed property and the DataTable component able to sort Dates
     * cf https://gitlab.makina-corpus.net/lck/lck-front/-/merge_requests/24#note_214704
     * and https://github.com/primefaces/primevue/issues/412
     */
    dataToDisplay () {
      if (!this.block.content) return []
      return this.block.content.data.map(d => {
        const currentData = {}
        this.block.definition.columns.forEach(currentColumn => {
          let currentValueForDisplay = d.data[currentColumn.id] || ''
          if (currentValueForDisplay === '') return
          switch (currentColumn.column_type_id) {
            case COLUMN_TYPE.USER:
            case COLUMN_TYPE.GROUP:
            case COLUMN_TYPE.RELATION_BETWEEN_TABLES:
            case COLUMN_TYPE.LOOKED_UP_COLUMN:
            case COLUMN_TYPE.FORMULA:
              currentValueForDisplay = d.data[currentColumn.id]?.value
              break
            case COLUMN_TYPE.SINGLE_SELECT:
              currentValueForDisplay = currentColumn.settings.values[d.data[currentColumn.id]]?.label
          }
          currentData[currentColumn.id] = currentValueForDisplay
        })
        return currentData
      })
    }
  },
  methods: {
    getValue (column, data) {
      switch (column.column_type_id) {
        case COLUMN_TYPE.USER:
        case COLUMN_TYPE.GROUP:
        case COLUMN_TYPE.RELATION_BETWEEN_TABLES:
        case COLUMN_TYPE.LOOKED_UP_COLUMN:
        case COLUMN_TYPE.FORMULA:
          return data.value
        case COLUMN_TYPE.SINGLE_SELECT:
          return column.settings.values[data].label
        default:
          return data
      }
    },
    getClassComponent (column) {
      switch (column.column_type_id) {
        case COLUMN_TYPE.USER:
        case COLUMN_TYPE.GROUP:
        case COLUMN_TYPE.RELATION_BETWEEN_TABLES:
        case COLUMN_TYPE.LOOKED_UP_COLUMN:
        case COLUMN_TYPE.FORMULA:
        case COLUMN_TYPE.SINGLE_SELECT:
          return 'p-tag p-p-2'
        default:
          return 'text'
      }
    },
    onPage (event) {
      this.$emit('updateContentBlockTableView', {
        blockId: this.block.id,
        blockType: this.block.type,
        blockDefinitionId: this.block.definition.id,
        pageIndexToGo: event.page
      })
    },
    openNew () {
      console.log('openNew')
      this.addRowDialog = true
    },
    hideDialog () {
      console.log('hideDialog')
      this.addRowDialog = false
    },
    async saveRow () {
      console.log('saveRow')
      this.submitted = true
      const res = await saveTableData({
        text: 'Nouvelle demande',
        data: this.newRow, // eslint-disable-next-line @typescript-eslint/camelcase
        table_id: this.block.definition.columns[0].table_id
      })
      this.sendNotification(res)
      this.addRowDialog = false
    },
    async deleteSelectedRows () {
      console.log('deleteProduct', this.selectedRows)
      // Todo: Need access to id  + Manage multi delete
      // const res = await deleteTableData(this.selectedRows)
      const res = { code: 400, name: 'My bad' }
      this.sendNotification(res)
    },
    confirmDeleteSelected () {
      console.log('confirmDeleteSelected')
      this.deleteRowsDialog = true
    },
    async onCellEditComplete (event) {
      if (!this.editingCellRows[event.index]) {
        return
      }
      const res = await patchTableData(this.block.content.data[event.index].id, {
        data: { [event.field]: this.editingCellRows[event.index][event.field] }
      })
      this.sendNotification(res)
    },
    onCellEdit (newValue, props) {
      if (!this.editingCellRows[props.index]) {
        this.editingCellRows[props.index] = {}
        // this.editingCellRows[props.index] = { ...props.data } Todo:  === Update ?
      }
      this.editingCellRows[props.index][props.column.field] = newValue
    },
    async onDropdownEdit (event) {
      console.log('onDropdownEdit', event, event.originalEvent.target)
      // Todo get idRow and IdColumn

      // const res = await patchTableData(this.block.content.data[event.index].id, {
      //   data: { [IdColumn]: event.value }
      // })
      // this.sendNotification(res)
    },
    exportCSV () {
      console.log('exportCSV')
    },
    sendNotification (response) {
      if (response && response.code) {
        this.$toast.add({
          severity: 'error',
          summary: 'Failure',
          detail: 'Demande en echec',
          life: 3000
        })
      } else {
        this.$toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Demande créee',
          life: 3000
        })
      }
    }
  }
}
</script>

<style scoped>
/deep/ .p-datatable table {
  width: unset;
  min-width: 100%;
  max-width: unset;
}

/deep/ .p-datatable.p-datatable-sm .p-datatable-thead > tr > th {
  white-space: nowrap;
}
/deep/ .p-datatable-wrapper {
  overflow: auto;
}
</style>
