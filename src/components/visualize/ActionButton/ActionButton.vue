<template>
  <p-button
    class="p-button-sm p-button-text action-button"
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
      type: Object as PropType<LckTableRow>
    },
    settings: {
      type: Object as PropType<ActionButtonSettings>,
      required: true
    }
  },
  computed: {
    isHidden () {
      if (this.settings.options && this.settings.options.displayFieldId && !!this.settings.options.displayFieldConditionQuery && this.content[this.settings.options.displayFieldId] !== this.settings.options.displayFieldConditionQuery) return true
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
.action-button.primary {
  color: var(--primary-color) ;
}
.action-button.secondary {
  color: var(--secondary-color) ;
}
.action-button.danger {
  color: var(--color-error) ;
}
.action-button.warning {
  color: var(--color-warning) ;
}
.action-button.sucsess {
  color: var(--color-success) ;
}
</style>
