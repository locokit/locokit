<template>
  <lck-dialog-form
    :visible.sync="visible"
    :header="$t('pages.databaseSchema.deleteColumnModal.deleteColumn')"
    :confirmationDialog="true"
    @confirm="onConfirmationDeleteColumnModal"
    @close="closeDeleteColumnModal"
  >
    <div v-if="columnToHandle">
      {{ $t('pages.databaseSchema.deleteColumnModal.deleteConfirmation', { columnName: columnToHandle.text }) }}
    </div>
    <div
      v-if="errorColumnToDelete"
      class="p-invalid"
    >
      <small
        id="delete-column-error"
        class="p-invalid"
      >
        {{ errorColumnToDelete }}
      </small>
    </div>
  </lck-dialog-form>
  <confirm-dialog />
</template>

<script>
import { lckServices } from '@/services/lck-api'
import ConfirmDialog from 'primevue/confirmdialog'
import DialogForm from '@/components/ui/DialogForm/DialogForm.vue'

export default {
  name: 'DeleteColumnModal',
  components: {
    'lck-dialog-form': DialogForm,
    'confirm-dialog': ConfirmDialog,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    tableId: String,
    columnToHandle: {
      type: Object,
      required: false,
    },
  },
  data () {
    return {
      errorColumnToDelete: null,
    }
  },
  methods: {
    closeDeleteColumnModal () {
      this.errorColumnToDelete = null
      this.$emit('close')
    },
    // async onConfirmationDeleteColumnModal () {
    //   try {
    //     if (this.columnToHandle) {
    //       await lckServices.tableColumn.remove(this.columnToHandle.id)
    //       this.errorColumnToDelete = null
    //       this.$emit('close', true)
    //     }
    //   } catch (errorDeleteColumn) {
    //     this.errorColumnToDelete = errorDeleteColumn.message
    //   }
    // },

    async onConfirmationDeleteColumnModal () {
      this.$confirm.require({
        message: this.$t('form.specificDeleteConfirmation'),
        header: this.$t('form.confirmation'),
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
          try {
            if (this.columnToHandle) {
              await lckServices.tableColumn.remove(this.columnToHandle.id)
              this.errorColumnToDelete = null
              this.$emit('close', true)
            }
            this.$toast.add({
              severity: 'success',
              summary: this.$t('components.processPanel.SUCCESS'),
              detail: this.$t('components.processPanel.successNewRun'),
              life: 5000,
            })
          } catch (error) {
            this.$toast.add({
              severity: 'error',
              summary: this.$t('components.processPanel.ERROR'),
              detail: this.$t('components.processPanel.failedNewRun'),
              life: 5000,
            })
          }
        },
      })
    },

  },
}
</script>
