<template>
  <lck-dialog
    :visible.sync="visible"
    :header="$t('pages.databaseSchema.createColumnModal.createColumn')"
    @input="confirmCreateColumnModal"
    @close="closeCreateColumnModal"
  >
    <div class="p-field p-mt-4">
      <label for="column-name">{{ $t('pages.databaseSchema.createColumnModal.columnName') }}</label>
      <p-input-text v-model="columnNameToCreate" id="column-name" v-bind:class="{ 'p-invalid': errorColumnNameToCreate }" type="text" autofocus />
    </div>
    <div>
      <p-dropdown v-model="selectedColumnTypeToCreate" :options="columnTypes" optionLabel="name" :placeholder="$t('pages.databaseSchema.createColumnModal.selectColumnType')" />
    </div>
    <div v-if="errorColumnNameToCreate" class="p-invalid">
      <small id="column-name-invalid" class="p-invalid">{{ errorColumnNameToCreate }}</small>
    </div>
  </lck-dialog>
</template>
<script>
import Vue from 'vue'
import { COLUMN_TYPE } from '@locokit/lck-glossary'
import { lckClient } from '@/services/lck-api'
import Dialog from '@/components/ui/Dialog/Dialog.vue'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'

export default {
  name: 'CreateColumnModal',
  components: {
    'lck-dialog': Vue.extend(Dialog),
    'p-input-text': Vue.extend(InputText),
    'p-dropdown': Vue.extend(Dropdown)
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    tableId: String
  },
  data () {
    return {
      columnTypes: Object.keys(COLUMN_TYPE).map((key) => ({ id: COLUMN_TYPE[key], name: key })),
      columnNameToCreate: null,
      selectedColumnTypeToCreate: null,
      errorColumnNameToCreate: null
    }
  },
  methods: {
    closeCreateColumnModal () {
      this.columnNameToCreate = null
      this.selectedColumnTypeToCreate = null
      this.$emit('close', false)
    },
    async confirmCreateColumnModal () {
      try {
        if (this.columnNameToCreate && this.selectedColumnTypeToCreate) {
          await lckClient.service('column').create({
            // eslint-disable-next-line @typescript-eslint/camelcase
            table_id: this.tableId,
            text: this.columnNameToCreate,
            // eslint-disable-next-line @typescript-eslint/camelcase
            column_type_id: this.selectedColumnTypeToCreate.id
          })
          this.$emit('close', true)
        } else {
          throw new Error(this.$t('pages.databaseSchema.createColumnModal.errorNoData'))
        }
      } catch (errorCreateColumn) {
        console.log(errorCreateColumn.message)
      }
    }
  }
}
</script>
<style scoped>
/deep/ .p-dialog-content {
  overflow-y: visible;
}
</style>
