<template>
  <p-dialog
    :visible="visible"
    :style="{ width: '600px' }"
    :modal="true"
    :contentStyle="{ 'max-height': '70vh' }"
    :closeOnEscape="true"
    class="p-fluid"
    @update:visible="$emit('close')"
    :header="value.id ? $t('pages.workspace.editChapter') : $t('pages.workspace.createChapter')"
  >
    <lck-form
      @submit="$emit('input', currentData)"
      @cancel="$emit('close')"
    >
      <div class="p-field">
        <label for="chapterTextField">{{ $t('pages.workspace.chapterName') }}</label>
        <p-input-text
          id="chapterTextField"
          v-model="currentData.text"
          required
          autofocus
        />
      </div>
    </lck-form>
  </p-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import LckForm from '@/components/ui/Form/Form.vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'

export default {
  name: 'ChapterDialog',
  components: {
    'lck-form': LckForm,
    'p-dialog': Vue.extend(Dialog),
    'p-input-text': Vue.extend(InputText)
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      currentData: {}
    }
  },
  watch: {
    value: {
      handler (newValue: {}) {
        this.currentData = {
          ...newValue
        }
      },
      immediate: true
    }
  }
}
</script>
