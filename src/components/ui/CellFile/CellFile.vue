<template>
  <div class="LckCellFile">
    <template v-for="attachment in attachmentToDisplay">
      <lck-async-image
        v-if="attachment.element === 'img'"
        :key="attachment.id"
        class="cell-file"
        :class="attachment.class"
        :title="attachment.filename"
        :src="attachment.thumbnail"
      />
      <span
        v-else
        :key="attachment.id"
        class="cell-file"
        :class="attachment.class"
        :title="attachment.filename"
        @click.prevent.stop="openFile(attachment)"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue'
import LckAsyncImage from '../AsyncImage/AsyncImage'

interface LckAttachment {
  id: string;
  filename: string;
  filepath: string;
  mime: string;
}

export default {
  name: 'LckCellFile',
  components: {
    'lck-async-image': LckAsyncImage
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
          class: 'pi pi-file',
          element: 'span',
          url: `http://localhost:8000/fs-storage/${this.workspaceId}/${a.filename}`,
          thumbnail: `http://localhost:8000/fs-storage/${this.workspaceId}/thumbnail_${a.filename}`
        }
        switch (a.mime) {
          case 'image/png':
          case 'image/jpeg':
            displayData.element = 'img'
            break
          case 'application/pdf':
            displayData.class = 'pi pi-file-pdf'
            break
        }
        return displayData
      })
    }
  },
  methods: {
    openFile (attachment: {url: string}) {
      window.open(attachment.url)
    }
  }
}
</script>

<style scoped>
.cell-file:hover {
  cursor: pointer;
  border: 2px solid gray;
  border-radius: 2px;
}
.cell-file {
  height: 2rem;
  margin-right: 0.25rem;
  padding: 1px;
}
</style>
