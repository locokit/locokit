<template>
    <p-dialog :header="$t('pages.databaseSchema.createTableModal.createTable')" :visible="true" :modal="true" :closable="false">
      <div class="p-field p-mt-4 p-float-label">
          <p-input-text id="table-name" v-bind:class="{ 'p-invalid': errorTableNameToCreate }" type="text" v-model="tableNameToCreate" autofocus />
          <label for="table-name">{{ $t('pages.databaseSchema.createTableModal.tableName') }}</label>
      </div>
      <div v-if="errorTableNameToCreate" class="p-invalid">
        <small id="table-name-invalid" class="p-invalid">{{ errorTableNameToCreate }}</small>
      </div>
      <template #footer>
        <p-button @click="closeCreateTableDialog" :label="$t('pages.databaseSchema.createTableModal.cancel')" icon="pi pi-times" class="p-button-text"/>
        <p-button @click="confirmCreateTableDialog" :label="$t('pages.databaseSchema.createTableModal.cancel')" icon="pi pi-check" class="p-button-text"/>
      </template>
    </p-dialog>
</template>
<script>
import Vue from 'vue'
import lckClient from '@/services/lck-api'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'

export default {
  name: 'CreateTableModal',
  components: {
    'p-button': Vue.extend(Button),
    'p-dialog': Vue.extend(Dialog),
    'p-input-text': Vue.extend(InputText)
  },
  props: {
    databaseId: String
  },
  data () {
    return {
      tableNameToCreate: null,
      errorTableNameToCreate: null
    }
  },
  methods: {
    closeCreateTableDialog () {
      this.$emit('close', false)
    },
    async confirmCreateTableDialog () {
      try {
        const createTableResponse = await lckClient.service('table').create({
          // eslint-disable-next-line @typescript-eslint/camelcase
          database_id: this.databaseId,
          text: this.tableNameToCreate
        })
        if (createTableResponse) {
          this.errorTableNameToCreate = false
          this.$emit('on-close', true)
        }
      } catch (errorCreateTable) {
        this.errorTableNameToCreate = errorCreateTable.message
      }
    }
  }
}
</script>
