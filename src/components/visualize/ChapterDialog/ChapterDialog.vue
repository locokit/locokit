<template>
  <lck-dialog-form
    :header="chapter.id ? $t('pages.workspace.editChapter') : $t('pages.workspace.createChapter')"
    :submitting="submitting"
    :visible="visible"
    @close="$emit('close')"
    @input="$emit('input', chapterTextCopy)"
  >
    <div class="p-field">
      <label for="chapterTextField">{{ $t('pages.workspace.chapterName') }}</label>
      <p-input-text
        id="chapterTextField"
        v-model="chapterTextCopy"
        required
        autofocus
      />
    </div>
  </lck-dialog-form>
</template>

<script lang="ts">
import Vue from 'vue'
import LckDialogForm from '@/components/ui/DialogForm/DialogForm.vue'
import InputText from 'primevue/inputtext'

export default {
  name: 'ChapterDialog',
  components: {
    'lck-dialog-form': LckDialogForm,
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
      chapterTextCopy: ''
    }
  },
  watch: {
    chapter: {
      handler ({ text }) {
        this.chapterTextCopy = text
      },
      immediate: true
    }
  }
}
</script>
