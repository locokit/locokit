<template>
  <p-dialog
    :contentStyle="{overflow: 'scroll'}"
    :header="$t('pages.databaseSchema.updateTableModal.updateTable')"
    :visible="true"
    :modal="true"
    :closable="true"
    :closeOnEscape="true"
    @update:visible="$emit('close', $event)"
  >
    <div v-if="currentTableToUpdate">
      <div class="p-d-flex">
        <div>
            <label for="table-name">{{ $t('pages.databaseSchema.updateTableModal.tableName') }}</label>
            <p-input-text id="table-name" type="text" v-model="currentTableToUpdate.text" />
        </div>
        <div class="p-d-flex p-ai-end">
          <p-button @click="updateTableName" label="Modifier" icon="pi pi-check" class="p-button-text" />
        </div>
      </div>
      <div class="p-d-flex p-mt-4">
        <div>
            <label for="column-name">{{ $t('pages.databaseSchema.updateTableModal.columnName') }}</label>
            <p-input-text id="column-name" type="text" v-model="columnNameToCreate" />
        </div>
        <div class="p-d-flex p-ai-end p-mx-2">
          <p-dropdown style="width: 300px" v-model="selectedColumnTypeToCreate" :options="columnTypes" optionLabel="name" :placeholder="$t('pages.databaseSchema.updateTableModal.selectColumnType')" />
        </div>
        <div class="p-d-flex p-ai-end">
          <p-button @click="createColumn" :label="$t('pages.databaseSchema.updateTableModal.createColumn')" icon="pi pi-check" class="p-button-text" />
        </div>
      </div>
      <div v-for="column in currentTableToUpdate.columns" :key="column.id" class="p-d-flex p-mt-4">
        <div>
            <label :for="'column-name' + column.id">{{ $t('pages.databaseSchema.updateTableModal.columnName') }}</label>
            <p-input-text :id="'column-name' + column.id" type="text" v-model="column.text" />
        </div>
        <div class="p-d-flex p-ai-end p-mx-2">
          <p-dropdown style="width: 300px" v-model="column.column_type_id" :options="columnTypes" optionLabel="name" optionValue="id" :placeholder="$t('pages.databaseSchema.updateTableModal.selectColumnType')" />
        </div>
        <div class="p-d-flex p-ai-end">
          <p-button @click="updateColumn(column)" :label="$t('pages.databaseSchema.updateTableModal.updateColumn')" icon="pi pi-check" class="p-button-text" />
        </div>
        <!-- <div class="p-d-flex p-ai-end">
          <p-button @click="deleteColumn(column)" label="Supprimer" icon="pi pi-check" class="p-button-text p-button-danger" />
        </div> -->
      </div>
    </div>
    <template #footer>
      <p-button @click="closeUpdateTableDialog" :label="$t('pages.databaseSchema.updateTableModal.close')" icon="pi pi-times" class="p-button-text"/>
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
      columnTypes: Object.keys(COLUMN_TYPE).map((key) => ({ id: COLUMN_TYPE[key], name: key })),
      columnNameToCreate: null,
      selectedColumnTypeToCreate: null,
      currentTableToUpdate: JSON.parse(JSON.stringify(this.currentTable))
    }
  },
  methods: {
    closeUpdateTableDialog () {
      this.$toast.removeAllGroups()
      this.$emit('close')
    },
    async updateTableName () {
      try {
        await lckClient.service('table').patch(this.currentTable.id, {
          text: this.currentTableToUpdate.text
        })
        this.$toast.add({ severity: 'success', summary: 'Succès', detail: 'Modification du nom de la table' })
        this.$emit('reload-tables')
      } catch (errorUpdateTable) {
        this.$toast.add({ severity: 'error', summary: 'Erreur', detail: errorUpdateTable.message })
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
          this.columnNameToCreate = null
          this.selectedColumnTypeToCreate = null
          this.$toast.add({ severity: 'success', summary: 'Succès', detail: 'Création de la colonne' })
          this.$emit('reload-tables')
        } else {
          throw new Error(this.$t('pages.databaseSchema.updateTableModal.errorNoData'))
        }
      } catch (errorCreateColumn) {
        this.$toast.add({ severity: 'error', summary: 'Erreur', detail: errorCreateColumn.message })
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
          this.$toast.add({ severity: 'success', summary: 'Succès', detail: 'Modification de la colonne' })
          this.$emit('reload-tables')
        } else {
          throw new Error(this.$t('pages.databaseSchema.updateTableModal.errorNoData'))
        }
      } catch (errorUpdateColumn) {
        this.$toast.add({ severity: 'error', summary: 'Erreur', detail: errorUpdateColumn.message })
      }
    }
    // async deleteColumn (column) {
    //   try {
    //     if (column.id) {
    //       await lckClient.service('column').remove(column.id)
    //       this.shouldReloadTables = true
    //     }
    //     this.$toast.add({ severity: 'success', summary: 'Succès', detail: 'Suppression de la colonne' })
    //     this.$emit('reload-tables')
    //   } catch (errorDeleteColumn) {
    //     this.$toast.add({ severity: 'error', summary: 'Erreur', detail: errorDeleteColumn.message })
    //   }
    // }
  },
  watch: {
    currentTable () {
      if (this.currentTable) {
        this.currentTableToUpdate = JSON.parse(JSON.stringify(this.currentTable))
      }
    }
  }
}
</script>
