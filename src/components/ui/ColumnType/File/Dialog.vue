<template>
  <lck-dialog
    :visible.sync="visible"
    :header="title"
    @input="$emit('close')"
    @close="$emit('close')"
  >
    <lck-cell-file-input
      :attachments="attachments"
      :workspaceId="workspaceId"
      :disabled="disabled"
      @input="$emit('input', $event)"
      @download="$emit('download', $event)"
      @remove-attachment="$emit('remove-attachment', $event)"
    />
  </lck-dialog>
</template>

<script lang="ts">
import LckDialog from '@/components/ui/Dialog/Dialog.vue'
import LckCellFileInput from '@/components/ui/ColumnType/File/Input.vue'
import { LckAttachment } from '@/services/lck-api/definitions'
import { PropType } from 'vue'

export default {
  name: 'LckDialogFile',
  components: {
    LckDialog,
    LckCellFileInput
  },
  props: {
    attachments: {
      type: Array as PropType<LckAttachment[]>,
      default: () => []
    },
    visible: {
      type: Boolean,
      default: true
    },
    workspaceId: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>
