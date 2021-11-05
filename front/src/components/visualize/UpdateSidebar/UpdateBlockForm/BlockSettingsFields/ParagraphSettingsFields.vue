<template>
  <validation-provider
    vid="blockSettingsContent"
    tag="div"
    :name="$t('components.process.form.trigger')"
    class="p-field"
    rules="required"
    v-slot="{
        errors,
        classes
      }"
  >
    <label for="blockSettingsContent" class="label-field-required">{{ $t('pages.workspace.block.content') }}</label>
    <p-textarea
      id="blockSettingsContent"
      :value="content"
      :autoResize="true"
      @input="$emit('update:content', $event)"
    />
    <span :class="classes">{{ errors[0] }}</span>
  </validation-provider></template>

<script lang="ts">
import Vue from 'vue'

import { ValidationProvider } from 'vee-validate'

import Textarea from 'primevue/textarea'

export default {
  name: 'ParagraphSettingsFields',
  components: {
    'p-textarea': Vue.extend(Textarea),
    'validation-provider': Vue.extend(ValidationProvider),
  },
  props: {
    content: {
      type: String,
    },
  },
}
</script>

<style scoped>
.p-field textarea {
  resize: vertical;
}
</style>
