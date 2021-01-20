<template>
  <div class="p-field">
    <label for="blockSettingsContent">{{ $t('pages.workspace.block.content') }}</label>
    <p-textarea
      v-model="blockSettings.content"
      id="blockSettingsContent"
      :autoResize="true"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { MarkdownSettings } from '@locokit/lck-glossary'
import Textarea from 'primevue/textarea'

export default {
  name: 'UpdateMarkdownFields',
  components: {
    'p-textarea': Vue.extend(Textarea)
  },
  props: {
    blockSettings: {
      type: Object as Vue.PropType<MarkdownSettings>,
      default: () => ({})
    }
  }
}
</script>

<style scoped>
.p-field textarea {
  resize: vertical;
}
</style>
