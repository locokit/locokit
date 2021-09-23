<template>
  <div>
    <div
      class="p-field"
      v-if="attachmentsToDisplay.length > 0"
    >
      <label class="lck-color-primary" v-if="displayLabels">
        {{ $t('components.fileInput.listing') }}
      </label>
      <div class="galeria">
        <template v-for="(attachment, attachmentIndex) in attachmentsToDisplay">
          <div
            :key="attachment.id"
            class="galeria-attachment"
            :title="'(' + (attachmentIndex + 1) + '/' + attachmentsToDisplay.length + ') ' + attachment.filename"
            @click.stop="$emit('download', {
              url: attachment.url,
              filename: attachment.filename,
              mime: attachment.mime
            })"
          >
            <p class="filename">
              {{ attachment.filename }}
            </p>
            <lck-async-image
              v-if="attachment.element === 'img'"
              :src="attachment.thumbnailURL"
            />
            <div
              v-else
              :class="attachment.class"
              style="margin: auto; font-size: 5rem;"
            />
            <p-button
              v-if="!disabled"
              @click.stop.prevent="$emit('remove-attachment', attachment.id)"
              icon="bi bi-trash"
              class="p-button-danger bottom-right"
            />

          </div>
        </template>
      </div>
    </div>
    <div v-else>
      {{ $t('components.fileInput.noattachment') }}
    </div>

    <div class="p-field p-mt-4" v-if="!disabled">
      <label class="lck-color-primary" v-if="displayLabels">
        {{ $t('components.fileInput.upload') }}<br/>
      </label>
      <input
        type="file"
        ref="input-file"
        :multiple="true"
        style="display: block"
      />
    </div>

    <p-button
      v-if="!disabled"
      @click="$emit('input', $refs['input-file'].files)"
      icon="bi bi-cloud-upload"
      :label="$t('components.fileInput.upload')"
    />
  </div>
</template>

<script lang="ts">
import LckAsyncImage from '@/components/ui/AsyncImage/AsyncImage.vue'
import { LckAttachment } from '@/services/lck-api/definitions'
import Button from 'primevue/button'
import Vue, { PropType } from 'vue'
import { getAttachmentsToDisplay } from './helpers'

export default {
  name: 'LckFileInput',
  components: {
    'lck-async-image': LckAsyncImage,
    'p-button': Vue.extend(Button),
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
    displayLabels: {
      type: Boolean,
      default: true,
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
  methods: {
    onDialogInput () {
      this.$emit('input', (this.$refs['input-file'] as HTMLInputElement).files)
    },
  },
  watch: {
    attachments: {
      immediate: true,
      handler (newAttachments: LckAttachment) {
        this.$emit('updated-attachments', newAttachments)
      },
    },
  },
}
</script>

<style scoped>
.p.field > label {
  display: block;
}
.galeria {
  height: 250px;
  max-height: 250px;
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
  flex-direction: row;
  padding: 0.25rem 0;
}
.galeria-attachment {
  padding-top: 0.25rem;
  margin-right: 0.5rem;
  height: 100%;
  min-width: 200px;
  position: relative;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid rgba(128, 128, 128, 0.30);
  overflow: hidden;
}
.galeria-attachment:hover {
  cursor: pointer;
  border: 1px solid gray;
}
.galeria-attachment .filename {
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  padding: 3px;
  margin: 0;
}
.bottom-right {
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 0.5rem;
}
</style>
