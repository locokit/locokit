<template>
  <lck-dialog-form
    :visible.sync="visible"
    :header="$t('pages.databaseSchema.createTableModal.createTable')"
    @input="confirmCreateTableModal"
    @close="closeCreateTableModal"
  >
    <div class="p-field p-mt-4">
      <label for="table-name">
        {{ $t('pages.databaseSchema.createTableModal.tableName') }}
      </label>
      <p-input-text
        id="table-name"
        :class="{ 'p-invalid': errorTableNameToCreate }"
        type="text"
        v-model="tableNameToCreate" autofocus
      />
    </div>
    <div class="p-field p-mt-4">
      <label for="table-documentation">
        {{ $t('pages.databaseSchema.createTableModal.documentation') }}
      </label>
      <p-input-text
        id="table-documentation"
        type="text"
        v-model="tableDocumentation"
      />
    </div>
    <div v-if="errorTableNameToCreate" class="p-invalid">
      <small id="table-name-invalid" class="p-invalid">
        {{ errorTableNameToCreate }}
      </small>
    </div>
  </lck-dialog-form>
</template>

<script>
import Vue from 'vue'

import { lckServices } from '@/services/lck-api'

import InputText from 'primevue/inputtext'

import DialogForm from '@/components/ui/DialogForm/DialogForm.vue'

export default {
  name: 'CreateTableModal',
  components: {
    'lck-dialog-form': DialogForm,
    'p-input-text': Vue.extend(InputText),
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    databaseId: String,
  },
  data () {
    return {
      tableNameToCreate: null,
      tableDocumentation: null,
      errorTableNameToCreate: null,
    }
  },
  methods: {
    closeCreateTableModal () {
      this.tableNameToCreate = null
      this.tableDocumentation = null
      this.$emit('close', false)
    },
    async confirmCreateTableModal () {
      try {
        const createTableResponse = await lckServices.table.create({
          // eslint-disable-next-line @typescript-eslint/camelcase
          database_id: this.databaseId,
          text: this.tableNameToCreate,
          documentation: this.tableDocumentation,
        })
        if (createTableResponse) {
          this.tableNameToCreate = null
          this.tableDocumentation = null
          this.errorTableNameToCreate = false
          this.$emit('close', true)
        }
      } catch (errorCreateTable) {
        this.errorTableNameToCreate = errorCreateTable.message
      }
    },
  },
}
</script>
