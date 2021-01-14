<template>
  <lck-dialog
    :visible.sync="visible"
    :header="$t('pages.databaseSchema.deleteColumnModal.deleteColumn')"
    @input="confirmDeleteColumnModal"
    @close="closeDeleteColumnModal"
    :isActionForm="true"
  >
    <div v-if="columnToHandle">
      {{ $t('pages.databaseSchema.deleteColumnModal.deleteConfirmation', { columnName: columnToHandle.text }) }}
    </div>
    <div v-if="errorColumnToDelete" class="p-invalid">
      <small id="delete-column-error" class="p-invalid">
        {{ errorColumnToDelete }}
      </small>
    </div>
  </lck-dialog>
</template>
<script>
import Vue from 'vue'
import { lckServices } from '@/services/lck-api'
import Dialog from '@/components/ui/Dialog/Dialog.vue'

export default {
  name: 'DeleteColumnModal',
  components: {
    'lck-dialog': Vue.extend(Dialog)
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    tableId: String,
    columnToHandle: {
      type: Object,
      required: false
    }
  },
  data () {
    return {
      errorColumnToDelete: null
    }
  },
  methods: {
    closeDeleteColumnModal () {
      this.errorColumnToDelete = null
      this.$emit('close')
    },
    async confirmDeleteColumnModal () {
      try {
        if (this.columnToHandle) {
          await lckServices.tableColumn.remove(this.columnToHandle)
          this.errorColumnToDelete = null
          this.$emit('close', true)
        }
      } catch (errorDeleteColumn) {
        this.errorColumnToDelete = errorDeleteColumn.message
      }
    }
  }
}
</script>
