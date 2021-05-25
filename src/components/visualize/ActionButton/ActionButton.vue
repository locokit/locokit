<template>
  <p-button
    class="p-button-sm p-button-text"
    v-if="settings && !isHidden"
    :label="settings.label"
    :class="settings.classButton"
    :icon="settings.icon"
    @click="onClick(settings)"
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import { LckTableRow } from '@/services/lck-api/definitions'
import {
  ACTION_BUTTON_TYPE,
  ActionButtonSettings
} from '@locokit/lck-glossary'

import Button from 'primevue/button'

export default Vue.extend({
  name: 'ActionButton',
  components: {
    'p-button': Vue.extend(Button)
  },
  props: {
    content: {
      type: Array as PropType<LckTableRow[]>
    },
    settings: {
      type: Object as PropType<ActionButtonSettings>,
      required: true
    }
  },
  computed: {
    isHidden () {
      if (this.settings.options && this.settings.options.displayFieldID && !!this.settings.options.displayFieldValue && this.content[this.settings.options.displayFieldID] !== this.settings.options.displayFieldValue) return true
      return false
    }
  },
  methods: {
    onClick (settings: ActionButtonSettings) {
      switch (settings.action) {
        case ACTION_BUTTON_TYPE.PAGE_DETAIL_TO:
          this.$emit('go-to-page-detail', { pageDetailId: settings.pageDetailId })
          break
        case ACTION_BUTTON_TYPE.PROCESS_TRIGGER:
          this.$emit('create-process-run', { processId: settings.processId })
          break
      }
    }
  }
})
</script>

<style scoped>

</style>
