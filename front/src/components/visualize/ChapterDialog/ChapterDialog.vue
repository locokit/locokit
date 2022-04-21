<template>
  <lck-dialog-form
    :header="chapter.id ? $t('pages.workspace.editChapter') : $t('pages.workspace.createChapter')"
    :submitting="submitting"
    :visible="visible"
    @close="$emit('close')"
    @input="$emit('input', chapterTextCopy)"
  >
    <validation-provider
      vid="chapterTextField"
      tag="div"
      :name="$t('pages.workspace.chapterName')"
      class="p-field"
      rules="required"
      v-slot="{
        errors,
        classes
      }"
    >
      <label for="chapterTextField" class="label-field-required">{{ $t('pages.workspace.chapterName') }}</label>
      <p-input-text
        id="chapterTextField"
        v-model="chapterTextCopy"
        required
        autofocus
      />
      <span :class="classes">{{ errors[0] }}</span>
    </validation-provider>
  </lck-dialog-form>
</template>

<script lang="ts">
import Vue from 'vue'

import { ValidationProvider } from 'vee-validate'

import InputText from 'primevue/inputtext'

import LckDialogForm from '@/components/ui/DialogForm/DialogForm.vue'

export default Vue.extend({
  name: 'ChapterDialog',
  components: {
    'lck-dialog-form': LckDialogForm,
    'p-input-text': Vue.extend(InputText),
    'validation-provider': Vue.extend(ValidationProvider),
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    chapter: {
      type: Object,
      default: () => ({}),
    },
    submitting: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      chapterTextCopy: '',
    }
  },
  watch: {
    chapter: {
      handler ({ text }: { text: string }) {
        this.chapterTextCopy = text
      },
      immediate: true,
    },
  },
})
</script>
