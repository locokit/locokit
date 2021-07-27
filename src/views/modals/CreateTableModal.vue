<template>
  <lck-dialog-form
    :visible.sync="visible"
    :header="$t('pages.databaseSchema.createTableModal.createTable')"
    @input="confirmCreateTableModal"
    @close="closeCreateTableModal"
  >
    <validation-provider
      vid="table-name"
      tag="div"
      class="p-field p-mt-4"
      :name="$t('pages.databaseSchema.createTableModal.tableName')"
      rules="required"
      v-slot="{
        errors,
        classes
      }"
    >
      <label for="table-name">
        {{ $t('pages.databaseSchema.createTableModal.tableName') }}
      </label>
      <span class="field-required">*</span>
      <p-input-text
        id="table-name"
        :class="{ 'p-invalid': errorTableNameToCreate }"
        type="text"
        v-model="tableNameToCreate" autofocus
      />
      <span :class="classes">{{ errors[0] }}</span>
    </validation-provider>
    <validation-provider
      vid="table-documentation"
      tag="div"
      class="p-field p-mt-4"
    >
      <label for="table-documentation">
        {{ $t('pages.databaseSchema.createTableModal.tableDoc') }}
      </label>
      <p-input-text
        id="table-documentation"
        type="text"
        v-model="tableDocumentation"
      />
    </validation-provider>
    <div v-if="errorTableNameToCreate" class="p-invalid">
      <small id="table-name-invalid" class="p-invalid">
        {{ errorTableNameToCreate }}
      </small>
    </div>
  </lck-dialog-form>
</template>

<script>
import Vue from 'vue'

import { ValidationProvider } from 'vee-validate'

import { lckServices } from '@/services/lck-api'

import InputText from 'primevue/inputtext'

import DialogForm from '@/components/ui/DialogForm/DialogForm.vue'

export default {
  name: 'CreateTableModal',
  components: {
    'lck-dialog-form': DialogForm,
    'p-input-text': Vue.extend(InputText),
    'validation-provider': Vue.extend(ValidationProvider),
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
      this.errorTableNameToCreate = null
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
