<template>
  <p-dialog
    :visible="visible"
    :style="{ width: '600px' }"
    :modal="true"
    :contentStyle="{ 'max-height': '70vh' }"
    :closeOnEscape="true"
    @update:visible="$emit('close')"
    :header="chapter.id ? $t('pages.workspace.editChapter') : $t('pages.workspace.createChapter')"
  >
    <lck-form
      :submitting="submitting"
      @submit="$emit('input', chapterCopy)"
      @cancel="$emit('close')"
    >
      <div class="p-field">
        <label for="chapterTextField">{{ $t('pages.workspace.chapterName') }}</label>
        <p-input-text
          id="chapterTextField"
          v-model="chapterCopy.text"
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
    chapter: {
      type: Object,
      default: () => ({})
    },
    submitting: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      chapterCopy: {}
    }
  },
  watch: {
    chapter: {
      handler (newValue) {
        this.chapterCopy = {
          ...newValue
        }
      },
      immediate: true
    }
  }
}
</script>
