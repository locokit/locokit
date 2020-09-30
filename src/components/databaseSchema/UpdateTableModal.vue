<template>
    <p-dialog :contentStyle="{overflow: 'scroll'}" header="Modifier une table" :visible="true" :modal="true" :closable="false">
      <div v-if="currentTableToUpdate">
        <div class="p-d-flex">
          <div>
              <label for="table-name">Nom de la table</label>
              <p-input-text id="table-name" v-bind:class="{ 'p-invalid': errorTableNameToUpdate }" type="text" v-model="tableNameToUpdate" />
          </div>
          <div class="p-d-flex p-ai-end">
            <div v-if="errorTableNameToUpdate" class="p-invalid">
              <small id="table-name-invalid" class="p-invalid">{{ errorTableNameToUpdate }}</small>
            </div>
            <p-button @click="updateTableName" label="Modifier" icon="pi pi-check" class="p-button-text" />
          </div>
        </div>
        <div v-for="column in currentTableToUpdate.columns" :key="column.id" class="p-d-flex p-mt-4">
          <div>
              <label :for="'column-name' + column.id">Nom de la colonne</label>
              <p-input-text :id="'column-name' + column.id" type="text" v-model="column.text" />
          </div>
          <div class="p-d-flex p-ai-end p-mx-2">
            <p-dropdown style="width: 300px" v-model="column.column_type_id" :options="columnTypes" optionLabel="name" optionValue="id" placeholder="Sélectionner un type de colonne" />
          </div>
          <div class="p-d-flex p-ai-end">
            <p-button @click="updateColumn(column)" label="Modifier" icon="pi pi-check" class="p-button-text" />
          </div>
        </div>
        <div class="p-d-flex p-mt-4">
          <div>
              <label for="column-name">Nom de la colonne</label>
              <p-input-text id="column-name" v-bind:class="{ 'p-invalid': errorTableNameToUpdate }" type="text" v-model="columnNameToCreate" />
          </div>
          <div class="p-d-flex p-ai-end p-mx-2">
            <p-dropdown style="width: 300px" v-model="selectedColumnTypeToCreate" :options="columnTypes" optionLabel="name" placeholder="Sélectionner un type de colonne" />
          </div>
          <div class="p-d-flex p-ai-end">
            <div v-if="errorCreateColumn" class="p-invalid">
              <small id="create-column-invalid" class="p-invalid">{{ errorCreateColumn }}</small>
            </div>
            <p-button @click="createColumn" label="Ajouter" icon="pi pi-check" class="p-button-text" />
          </div>
        </div>
      </div>
      <template #footer>
        <p-button @click="closeUpdateTableDialog" label="Fermer" icon="pi pi-times" class="p-button-text"/>
      </template>
    </p-dialog>
</template>
<script>
import Vue from 'vue'
import lckClient from '@/services/lck-api'
import { COLUMN_TYPE } from '@locokit/lck-glossary'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'

export default {
  name: 'UpdateTableModal',
  components: {
    'p-button': Vue.extend(Button),
    'p-dialog': Vue.extend(Dialog),
    'p-input-text': Vue.extend(InputText),
    'p-dropdown': Vue.extend(Dropdown)
  },
  props: {
    currentTable: Object
  },
  data () {
    return {
      columnTypes: [],
      tableNameToUpdate: null,
      errorTableNameToUpdate: null,
      columnNameToCreate: null,
      selectedColumnTypeToCreate: null,
      errorCreateColumn: null,
      currentTableToUpdate: null,
      shouldReloadTables: false
    }
  },
  methods: {
    closeUpdateTableDialog () {
      this.$emit('on-close', this.shouldReloadTables)
    },
    async updateTableName () {
      try {
        await lckClient.service('table').patch(this.currentTable.id, {
          text: this.tableNameToUpdate
        })
        this.shouldReloadTables = true
      } catch (errorUpdateTable) {
        this.errorTableNameToUpdate = errorUpdateTable.message
      }
    },
    async createColumn () {
      try {
        if (this.selectedColumnTypeToCreate && this.columnNameToCreate) {
          await lckClient.service('column').create({
            // eslint-disable-next-line @typescript-eslint/camelcase
            table_id: this.currentTable.id,
            text: this.columnNameToCreate,
            // eslint-disable-next-line @typescript-eslint/camelcase
            column_type_id: this.selectedColumnTypeToCreate.id
          })
          this.shouldReloadTables = true
        } else {
          throw new Error('Veuillez renseigner les champs')
        }
      } catch (errorCreateColumn) {
        this.errorCreateColumn = errorCreateColumn.message
      }
    },
    async updateColumn (column) {
      try {
        if (column.id && column.text && column.column_type_id) {
          await lckClient.service('column').patch(column.id, {
            text: column.text,
            // eslint-disable-next-line @typescript-eslint/camelcase
            column_type_id: column.column_type_id
          })
          this.shouldReloadTables = true
        } else {
          throw new Error('Veuillez renseigner les champs')
        }
      } catch (errorUpdateColumn) {
        console.warn(errorUpdateColumn)
      }
    }
  },
  mounted () {
    Object.keys(COLUMN_TYPE).forEach((key) => {
      this.columnTypes.push({ id: COLUMN_TYPE[key], name: key })
    })
    if (this.currentTable) {
      this.tableNameToUpdate = this.currentTable.text
      this.currentTableToUpdate = JSON.parse(JSON.stringify(this.currentTable))
    }
  }
}
</script>
