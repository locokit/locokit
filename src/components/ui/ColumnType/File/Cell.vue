<template>
  <div class="LckCellFile" @click.self.stop.prevent="dialogFileVisible = true">
    <template v-for="attachment in attachmentToDisplay">
      <lck-async-image
        v-if="attachment.element === 'img'"
        :key="attachment.id"
        class="cell-file"
        :title="attachment.filename"
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
        :title="attachment.filename"
        @click.stop="$emit('download', {
          url: attachment.url,
          filename: attachment.filename,
          mime: attachment.mime
        })"
      />
    </template>
    <lck-dialog-input-file
      :attachmentToDisplay="attachmentToDisplay"
      :visible="dialogFileVisible"
      @input="$emit('input', $event); dialogFileVisible = false"
      @close="dialogFileVisible = false"
      @download="$emit('download', $event)"
      @remove-attachment="$emit('remove-attachment', $event)"
      class="field-editable"
    />
  </div>
</template>

<script lang="ts">
/* eslint-disable no-undef */
import { PropType } from 'vue'
import LckAsyncImage from '@/components/ui/AsyncImage/AsyncImage.vue'
import { LckAttachment } from '@/services/lck-api/definitions'
import LckDialogInputFile from '@/components/ui/ColumnType/File/CellInput.vue'

export default {
  name: 'LckCellFile',
  components: {
    'lck-async-image': LckAsyncImage,
    'lck-dialog-input-file': LckDialogInputFile
  },
  props: {
    attachments: {
      type: Array as PropType<LckAttachment[]>,
      default: () => []
    },
    workspaceId: {
      type: String,
      default: ''
    }
  },
  computed: {
    attachmentToDisplay () {
      return this.attachments?.map(a => {
        const displayData = {
          ...a,
          class: 'bi bi-file-earmark',
          element: 'span',
          url: `${LCK_SETTINGS.STORAGE_URL}/${this.workspaceId}/${a.filename}`,
          thumbnailURL: `${LCK_SETTINGS.STORAGE_URL}/${this.workspaceId}/thumbnail_${a.filename}`
        }
        switch (a.mime) {
          case 'image/png':
          case 'image/jpeg':
            if (a.thumbnail) {
              displayData.element = 'img'
              displayData.class = ''
            } else {
              displayData.class = 'bi bi-file-image'
            }
            break
          case 'application/pdf':
            displayData.class = 'pi pi-file-pdf'
            break
          case 'application/vnd.oasis.opendocument.text':
            displayData.class = 'bi bi-file-earmark-text'
            break
          case 'application/vnd.oasis.opendocument.spreadsheet':
            displayData.class = 'bi bi-file-earmark-spreadsheet'
            break
        }
        return displayData
      })
    }
  },
  data () {
    return {
      dialogFileVisible: false
    }
  }
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
  display: flex;
  align-items: center;
}
</style>
