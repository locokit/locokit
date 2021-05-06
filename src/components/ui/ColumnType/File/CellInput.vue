<template>
  <lck-dialog-form
    :visible.sync="visible"
    :header="$t('components.inputFile.dialogHeader')"
    @input="onDialogInput"
    @close="$emit('close')"
  >
    <div
      class="p-field p-mt-4"
      v-if="attachmentToDisplay.length > 0"
      @contextmenu.stop.prevent
    >
      <label>
        {{ $t('components.inputFile.listing') }}
      </label>
      <div class="galeria">
        <template v-for="attachment in attachmentToDisplay">
          <div
            :key="attachment.id"
            class="galeria-attachment"
            :title="attachment.filename"
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
              @click.stop.prevent="$emit('remove-attachment', attachment.id)"
              icon="bi bi-trash"
              class="p-button-danger bottom-right"
            />

          </div>
        </template>
      </div>
    </div>
    <div v-else>
      {{ $t('components.inputFile.noattachment') }}
    </div>

    <div class="p-field p-mt-4">
      <label>
        {{ $t('components.inputFile.upload') }}<br/>
      </label>
      <input
        type="file"
        ref="input-file"
        :multiple="true"
        style="display: block"
      />
    </div>
  </lck-dialog-form>

</template>

<script lang="ts">
/* eslint-disable no-undef */

import DialogForm from '@/components/ui/DialogForm/DialogForm.vue'
import LckAsyncImage from '@/components/ui/AsyncImage/AsyncImage.vue'
import { LckAttachment } from '@/services/lck-api/definitions'
import Button from 'primevue/button'
import Vue, { PropType } from 'vue'

export default {
  name: 'LckInputFile',
  components: {
    'lck-async-image': LckAsyncImage,
    'lck-dialog-form': DialogForm,
    'p-button': Vue.extend(Button)

  },
  props: {
    attachmentToDisplay: {
      required: true,
      type: Array as PropType<LckAttachment[]>,
      default: () => []
    },
    workspaceId: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    onDialogInput () {
      this.$emit('input', (this.$refs['input-file'] as HTMLInputElement).files)
    }
  }
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
  margin-right: 4px;
  height: 100%;
  min-width: 150px;
  position: relative;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid transparent;
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
