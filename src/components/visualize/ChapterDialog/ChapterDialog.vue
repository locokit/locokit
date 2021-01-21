<template>
  <lck-dialog
    :visible="visible"
    :header="chapter.id ? $t('pages.workspace.editChapter') : $t('pages.workspace.createChapter')"
    @close="$emit('close')"
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
  </lck-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import LckForm from '@/components/ui/Form/Form.vue'
import LckDialog from '@/components/ui/Dialog/Dialog.vue'
import InputText from 'primevue/inputtext'

export default {
  name: 'ChapterDialog',
  components: {
    'lck-form': LckForm,
    'lck-dialog': LckDialog,
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
