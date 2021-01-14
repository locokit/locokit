<template>
  <lck-dialog
    :visible.sync="visible"
    :header="$t('pages.databaseSchema.createTableModal.createTable')"
    @input="confirmCreateTableModal"
    @close="closeCreateTableModal"
    :isActionForm="true"
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
    <div v-if="errorTableNameToCreate" class="p-invalid">
      <small id="table-name-invalid" class="p-invalid">
        {{ errorTableNameToCreate }}
      </small>
    </div>
  </lck-dialog>
</template>
<script>
import Vue from 'vue'
import { lckServices } from '@/services/lck-api'
import Dialog from '@/components/ui/Dialog/Dialog.vue'
import InputText from 'primevue/inputtext'

export default {
  name: 'CreateTableModal',
  components: {
    'lck-dialog': Vue.extend(Dialog),
    'p-input-text': Vue.extend(InputText)
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    databaseId: String
  },
  data () {
    return {
      tableNameToCreate: null,
      errorTableNameToCreate: null
    }
  },
  methods: {
    closeCreateTableModal () {
      this.tableNameToCreate = null
      this.$emit('close', false)
    },
    async confirmCreateTableModal () {
      try {
        const createTableResponse = await lckServices.table.create({
          // eslint-disable-next-line @typescript-eslint/camelcase
          database_id: this.databaseId,
          text: this.tableNameToCreate
        })
        if (createTableResponse) {
          this.tableNameToCreate = null
          this.errorTableNameToCreate = false
          this.$emit('close', true)
        }
      } catch (errorCreateTable) {
        this.errorTableNameToCreate = errorCreateTable.message
      }
    }
  }
}
</script>
