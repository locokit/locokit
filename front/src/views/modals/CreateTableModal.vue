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
      <label for="table-name" class="label-field-required">
        {{ $t('pages.databaseSchema.createTableModal.tableName') }}
      </label>
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
      <p-textarea
        id="table-documentation"
        v-model="tableDocumentation"
        :autoResize="true"
      />
    </validation-provider>
    <validation-provider
      vid="table-slug"
      tag="div"
      class="p-field p-mt-4"
      rules="required|snakeCase"
      v-slot="{
        errors,
        classes
      }"
    >
      <label for="table-slug">
        {{ $t('pages.databaseSchema.createTableModal.tableSlug') }}
      </label>
      <p-input-text
        id="table-slug"
        type="text"
        v-model="tableSlug"
      />
      <small>{{ $t('pages.databaseSchema.createTableModal.tableSlugInfo') }}</small>
      <span :class="classes">{{ errors[0] }}</span>
    </validation-provider>
    <div v-if="errorTableNameToCreate" class="p-invalid">
      <small id="table-name-invalid" class="p-invalid">
        {{ errorTableNameToCreate }}
      </small>
    </div>
  </lck-dialog-form>
</template>

<script lang="ts">

import Vue, { PropOptions } from 'vue'
import { ValidationProvider } from 'vee-validate'
import { lckServices } from '@/services/lck-api'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import DialogForm from '@/components/ui/DialogForm/DialogForm.vue'

export default Vue.extend({
  name: 'CreateTableModal',
  components: {
    'lck-dialog-form': DialogForm,
    'p-input-text': Vue.extend(InputText),
    'p-textarea': Vue.extend(Textarea),
    'validation-provider': Vue.extend(ValidationProvider),
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    } as PropOptions<boolean>,
    databaseId: String as PropOptions<string>,
  },
  data () {
    return {
      tableNameToCreate: null as string | null,
      tableDocumentation: null as string | null,
      tableSlug: null as string | null,
      errorTableNameToCreate: null as boolean | null,
    }
  },
  methods: {
    closeCreateTableModal () {
      this.tableNameToCreate = null
      this.tableDocumentation = null
      this.tableSlug = null
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
          slug: this.tableSlug,
        })
        if (createTableResponse) {
          this.tableNameToCreate = null
          this.tableDocumentation = null
          this.tableSlug = null
          this.errorTableNameToCreate = false
          this.$emit('close', true)
        }
      } catch (errorCreateTable: any) {
        this.errorTableNameToCreate = errorCreateTable.message
      }
    },
  },
})
</script>
