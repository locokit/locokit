<template>
  <div class="p-field">
    <label for="blockSettingsContent">{{ $t('pages.workspace.block.content') }}</label>
    <p-textarea
      id="blockSettingsContent"
      :value="content"
      :autoResize="true"
      @input="$emit('update:content', $event)"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Textarea from 'primevue/textarea'

export default {
  name: 'ParagraphSettingsFields',
  components: {
    'p-textarea': Vue.extend(Textarea)
  },
  props: {
    content: {
      type: String
    }
  }
}
</script>

<style scoped>
.p-field textarea {
  resize: vertical;
}
</style>
