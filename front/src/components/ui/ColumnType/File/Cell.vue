<template>
  <div
    class="LckCellFile"
    @click.self.stop.prevent="dialogFileVisible = true"
    @contextmenu.stop.prevent
  >
    <template v-for="(attachment, attachmentIndex) in attachmentsToDisplay">
      <lck-async-image
        v-if="attachment.element === 'img'"
        :key="attachment.id"
        class="cell-file"
        :title="'(' + (attachmentIndex + 1) + '/' + attachmentsToDisplay.length + ') ' + attachment.filename"
        :src="attachment.thumbnailURL"
        @click="$emit('download', {
          url: attachment.url,
          filename: attachment.filename,
          mime: attachment.mime
        })"
      />
      <span
        v-else
        :key="attachment.id"
        class="cell-file"
        :class="attachment.class"
        :title="'(' + (attachmentIndex + 1) + '/' + attachmentsToDisplay.length + ') ' + attachment.filename"
        @click.stop="$emit('download', {
          url: attachment.url,
          filename: attachment.filename,
          mime: attachment.mime
        })"
      />
    </template>
    <lck-cell-file-dialog
      :attachments="attachments"
      :workspaceId="workspaceId"
      :title="title"
      :visible="dialogFileVisible"
      :disabled="disabled"
      @input="$emit('input', $event)"
      @close="dialogFileVisible = false"
      @download="$emit('download', $event)"
      @remove-attachment="$emit('remove-attachment', $event)"
      class="field-editable"
    />
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue'
import LckAsyncImage from '@/components/ui/AsyncImage/AsyncImage.vue'
import { LckAttachment } from '@/services/lck-api/definitions'
import LckCellFileDialog from '@/components/ui/ColumnType/File/Dialog.vue'
import { getAttachmentsToDisplay } from './helpers'

export default {
  name: 'LckFileCell',
  components: {
    LckAsyncImage,
    LckCellFileDialog,
  },
  props: {
    attachments: {
      type: Array as PropType<LckAttachment[]>,
      default: () => [],
    },
    workspaceId: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    attachmentsToDisplay () {
      return getAttachmentsToDisplay(this.attachments, this.workspaceId)
    },
  },
  data () {
    return {
      dialogFileVisible: false,
    }
  },
}
</script>

<style scoped>
.cell-file:hover {
  cursor: pointer;
  border-color: gray;
}
.cell-file {
  margin-right: 0.25rem;
  border: 1px solid transparent;
}

.LckCellFile {
  height: 100%;
  max-height: 100%;
  max-width: 100%;
  overflow-y: hidden;
  overflow-x: auto;
  display: flex;
  align-items: center;
}
</style>
